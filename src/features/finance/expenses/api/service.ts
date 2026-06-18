'use server';

import { getSupabaseAdmin } from '@/lib/supabase/server';
import type {
  Expense,
  ExpenseFilters,
  ExpensesResponse,
  ExpenseMutationPayload
} from './types';

const SELECT_WITH_INCOME = '*, income:income_id (title)';

export async function getExpenses(filters: ExpenseFilters): Promise<ExpensesResponse> {
  const supabase = getSupabaseAdmin();
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('expenses')
    .select(SELECT_WITH_INCOME, { count: 'exact' })
    .order('spent_on', { ascending: false });

  if (filters.search) query = query.ilike('title', `%${filters.search}%`);
  if (filters.category) query = query.eq('category', filters.category);
  if (filters.incomeId) query = query.eq('income_id', filters.incomeId);

  const { data, count, error } = await query.range(from, to);
  if (error) throw new Error(error.message);

  return { expenses: (data ?? []) as unknown as Expense[], total: count ?? 0 };
}

export async function getAllExpenses(): Promise<Expense[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('spent_on', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Expense[];
}

export async function getExpensesByIncome(incomeId: string): Promise<Expense[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('income_id', incomeId)
    .order('spent_on', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Expense[];
}

export async function getExpenseById(id: string): Promise<Expense | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('expenses').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Expense) ?? null;
}

export async function createExpense(payload: ExpenseMutationPayload): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('expenses').insert(payload);
  if (error) throw new Error(error.message);
}

export async function updateExpense(id: string, payload: ExpenseMutationPayload): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('expenses').update(payload).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteExpense(id: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('expenses').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
