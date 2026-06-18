import 'server-only';

import { getSupabaseAdmin } from '@/lib/supabase/server';
import { computeSplit } from './split';
import type { Income } from '@/features/finance/income/api/types';
import type { Expense } from '@/features/finance/expenses/api/types';
import type { Member } from '@/features/finance/members/api/types';
import type { Payout } from '@/features/finance/payouts/api/types';

type RawData = {
  income: Income[];
  expenses: Expense[];
  members: Member[];
  payouts: Payout[];
};

async function fetchAll(): Promise<RawData> {
  const supabase = getSupabaseAdmin();
  const [incomeRes, expensesRes, membersRes, payoutsRes] = await Promise.all([
    supabase.from('income').select('*'),
    supabase.from('expenses').select('*'),
    supabase.from('members').select('*'),
    supabase.from('payouts').select('*')
  ]);

  const firstError =
    incomeRes.error || expensesRes.error || membersRes.error || payoutsRes.error;
  if (firstError) throw new Error(firstError.message);

  return {
    income: (incomeRes.data ?? []) as Income[],
    expenses: (expensesRes.data ?? []) as Expense[],
    members: (membersRes.data ?? []) as Member[],
    payouts: (payoutsRes.data ?? []) as Payout[]
  };
}

/**
 * Total member-pool amount owed to each member, summed across every income
 * entry (net of its linked expenses), using the shared split logic.
 */
function computeOwedByMember(data: RawData): Record<string, number> {
  const activeMembers = data.members.filter((m) => m.active);
  const splitMembers = activeMembers.map((m) => ({
    id: m.id,
    name: m.name,
    split_percentage: m.split_percentage
  }));

  const owed: Record<string, number> = {};

  for (const inc of data.income) {
    const linkedExpenses = data.expenses
      .filter((e) => e.income_id === inc.id)
      .reduce((sum, e) => sum + Number(e.amount), 0);

    const split = computeSplit({
      gross: Number(inc.amount),
      expenses: linkedExpenses,
      members: splitMembers
    });

    for (const share of split.shares) {
      owed[share.id] = (owed[share.id] ?? 0) + share.amount;
    }
  }

  return owed;
}

function computePaidByMember(data: RawData): Record<string, number> {
  const paid: Record<string, number> = {};
  for (const p of data.payouts) {
    if (p.status === 'paid') {
      paid[p.member_id] = (paid[p.member_id] ?? 0) + Number(p.amount);
    }
  }
  return paid;
}

export type PayoutSummaryRow = {
  memberId: string;
  name: string;
  active: boolean;
  owed: number;
  paid: number;
  pending: number;
};

export type PayoutSummary = {
  rows: PayoutSummaryRow[];
  totals: { owed: number; paid: number; pending: number };
};

export async function computePayoutSummary(): Promise<PayoutSummary> {
  const data = await fetchAll();
  const owedByMember = computeOwedByMember(data);
  const paidByMember = computePaidByMember(data);

  const rows: PayoutSummaryRow[] = data.members.map((m) => {
    const owed = owedByMember[m.id] ?? 0;
    const paid = paidByMember[m.id] ?? 0;
    return {
      memberId: m.id,
      name: m.name,
      active: m.active,
      owed,
      paid,
      pending: owed - paid
    };
  });

  const totals = rows.reduce(
    (acc, r) => ({
      owed: acc.owed + r.owed,
      paid: acc.paid + r.paid,
      pending: acc.pending + r.pending
    }),
    { owed: 0, paid: 0, pending: 0 }
  );

  return { rows, totals };
}

export type MonthlyPoint = { month: string; income: number; expenses: number };
export type MemberSplitPoint = { name: string; amount: number };

export type FinanceSummary = {
  totalIncome: number;
  totalExpenses: number;
  netDistributable: number;
  companyShare: number;
  memberPool: number;
  totalPaid: number;
  pendingPayouts: number;
  incomeCount: number;
  expenseCount: number;
  monthly: MonthlyPoint[];
  memberSplit: MemberSplitPoint[];
  payoutStatus: { paid: number; pending: number };
};

function monthKey(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return 'Unknown';
  return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

function buildMonthlySeries(data: RawData): MonthlyPoint[] {
  const now = new Date();
  const buckets: { key: string; income: number; expenses: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      key: d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      income: 0,
      expenses: 0
    });
  }

  const indexByKey = new Map(buckets.map((b, i) => [b.key, i]));

  for (const inc of data.income) {
    const idx = indexByKey.get(monthKey(inc.received_on));
    if (idx !== undefined) buckets[idx].income += Number(inc.amount);
  }
  for (const exp of data.expenses) {
    const idx = indexByKey.get(monthKey(exp.spent_on));
    if (idx !== undefined) buckets[idx].expenses += Number(exp.amount);
  }

  return buckets.map((b) => ({ month: b.key, income: b.income, expenses: b.expenses }));
}

export async function computeFinanceSummary(): Promise<FinanceSummary> {
  const data = await fetchAll();

  const totalIncome = data.income.reduce((sum, i) => sum + Number(i.amount), 0);
  const totalExpenses = data.expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  // Net distributable is computed per-income (gross - its linked expenses) and
  // summed, matching the per-project detail page. Expenses not linked to any
  // income still count toward total expenses but do not reduce any split.
  const owedByMember = computeOwedByMember(data);
  const paidByMember = computePaidByMember(data);

  let companyShare = 0;
  let memberPool = 0;
  for (const inc of data.income) {
    const linkedExpenses = data.expenses
      .filter((e) => e.income_id === inc.id)
      .reduce((sum, e) => sum + Number(e.amount), 0);
    const split = computeSplit({ gross: Number(inc.amount), expenses: linkedExpenses, members: [] });
    companyShare += split.companyShare;
    memberPool += split.memberPool;
  }
  const netDistributable = companyShare + memberPool;

  const totalOwed = Object.values(owedByMember).reduce((s, v) => s + v, 0);
  const totalPaid = Object.values(paidByMember).reduce((s, v) => s + v, 0);
  const pendingPayouts = totalOwed - totalPaid;

  const activeMembers = data.members.filter((m) => m.active);
  const memberSplit: MemberSplitPoint[] = activeMembers.map((m) => ({
    name: m.name,
    amount: owedByMember[m.id] ?? 0
  }));

  return {
    totalIncome,
    totalExpenses,
    netDistributable,
    companyShare,
    memberPool,
    totalPaid,
    pendingPayouts,
    incomeCount: data.income.length,
    expenseCount: data.expenses.length,
    monthly: buildMonthlySeries(data),
    memberSplit,
    payoutStatus: { paid: totalPaid, pending: Math.max(0, pendingPayouts) }
  };
}
