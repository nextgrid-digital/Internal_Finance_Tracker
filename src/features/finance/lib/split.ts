import { COMPANY_SHARE_PCT, MEMBER_POOL_PCT } from '@/features/finance/constants/split';

export type SplitMember = {
  id: string;
  name: string;
  split_percentage: number;
};

export type MemberShare = SplitMember & {
  /** member's share of the member pool, in currency */
  amount: number;
  /** normalized share of the member pool (0-1) */
  ratio: number;
};

export type SplitResult = {
  gross: number;
  expenses: number;
  net: number;
  companyShare: number;
  memberPool: number;
  shares: MemberShare[];
};

/**
 * Core split calculation, used by both the project/payment detail page and the
 * dashboard aggregates so the numbers never drift.
 *
 * 1. net = gross income - linked expenses
 * 2. company keeps COMPANY_SHARE_PCT of net
 * 3. the rest (member pool) is split by each member's percentage, normalized by
 *    the sum of percentages so the math stays correct even if percentages do
 *    not add up to exactly 100.
 */
export function computeSplit(input: {
  gross: number;
  expenses: number;
  members: SplitMember[];
}): SplitResult {
  const gross = input.gross || 0;
  const expenses = input.expenses || 0;
  const net = gross - expenses;

  const companyShare = net * COMPANY_SHARE_PCT;
  const memberPool = net * MEMBER_POOL_PCT;

  const totalPct = input.members.reduce((sum, m) => sum + (m.split_percentage || 0), 0);

  const shares: MemberShare[] = input.members.map((m) => {
    const ratio = totalPct > 0 ? (m.split_percentage || 0) / totalPct : 0;
    return {
      ...m,
      ratio,
      amount: memberPool * ratio
    };
  });

  return { gross, expenses, net, companyShare, memberPool, shares };
}
