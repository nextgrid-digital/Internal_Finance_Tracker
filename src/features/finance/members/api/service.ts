'use server';

import { getSupabaseAdmin } from '@/lib/supabase/server';
import type {
  Member,
  MemberFilters,
  MembersResponse,
  MemberMutationPayload
} from './types';

export async function getMembers(filters: MemberFilters): Promise<MembersResponse> {
  const supabase = getSupabaseAdmin();
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('members')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: true });

  if (filters.search) {
    query = query.ilike('name', `%${filters.search}%`);
  }

  const { data, count, error } = await query.range(from, to);
  if (error) throw new Error(error.message);

  return { members: (data ?? []) as Member[], total: count ?? 0 };
}

export async function getAllMembers(): Promise<Member[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Member[];
}

export async function getMemberById(id: string): Promise<Member | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('members').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Member) ?? null;
}

export async function createMember(payload: MemberMutationPayload): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('members').insert(payload);
  if (error) throw new Error(error.message);
}

export async function updateMember(id: string, payload: MemberMutationPayload): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('members').update(payload).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteMember(id: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('members').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
