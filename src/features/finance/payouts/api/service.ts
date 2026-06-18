'use server';

import { getSupabaseAdmin } from '@/lib/supabase/server';
import { computePayoutSummary, type PayoutSummary } from '@/features/finance/lib/analytics';
import type {
  Payout,
  PayoutFilters,
  PayoutsResponse,
  PayoutMutationPayload
} from './types';

const SELECT_WITH_MEMBER = '*, member:member_id (name)';

export async function getPayouts(filters: PayoutFilters): Promise<PayoutsResponse> {
  const supabase = getSupabaseAdmin();
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('payouts')
    .select(SELECT_WITH_MEMBER, { count: 'exact' })
    .order('created_at', { ascending: false });

  if (filters.status) query = query.eq('status', filters.status);

  const { data, count, error } = await query.range(from, to);
  if (error) throw new Error(error.message);

  return { payouts: (data ?? []) as unknown as Payout[], total: count ?? 0 };
}

export async function getPayoutById(id: string): Promise<Payout | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('payouts').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Payout) ?? null;
}

export async function createPayout(payload: PayoutMutationPayload): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('payouts').insert(payload);
  if (error) throw new Error(error.message);
}

export async function updatePayout(id: string, payload: PayoutMutationPayload): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('payouts').update(payload).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deletePayout(id: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('payouts').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function getPayoutSummary(): Promise<PayoutSummary> {
  return computePayoutSummary();
}
