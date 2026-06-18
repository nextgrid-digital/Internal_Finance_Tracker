'use server';

import { getSupabaseAdmin } from '@/lib/supabase/server';
import type {
  Income,
  IncomeFilters,
  IncomeResponse,
  IncomeMutationPayload
} from './types';

export async function getIncome(filters: IncomeFilters): Promise<IncomeResponse> {
  const supabase = getSupabaseAdmin();
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('income')
    .select('*', { count: 'exact' })
    .order('received_on', { ascending: false });

  if (filters.search) {
    query = query.ilike('title', `%${filters.search}%`);
  }

  const { data, count, error } = await query.range(from, to);
  if (error) throw new Error(error.message);

  return { income: (data ?? []) as Income[], total: count ?? 0 };
}

export async function getAllIncome(): Promise<Income[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('income')
    .select('*')
    .order('received_on', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Income[];
}

export async function getIncomeById(id: string): Promise<Income | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('income').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Income) ?? null;
}

export async function createIncome(payload: IncomeMutationPayload): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('income').insert(payload);
  if (error) throw new Error(error.message);
}

export async function updateIncome(id: string, payload: IncomeMutationPayload): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('income').update(payload).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteIncome(id: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('income').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
