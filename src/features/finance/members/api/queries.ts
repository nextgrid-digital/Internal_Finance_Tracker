import { queryOptions } from '@tanstack/react-query';
import { getMembers, getMemberById, getAllMembers } from './service';
import type { Member, MemberFilters } from './types';

export type { Member };

export const memberKeys = {
  all: ['members'] as const,
  list: (filters: MemberFilters) => [...memberKeys.all, 'list', filters] as const,
  detail: (id: string) => [...memberKeys.all, 'detail', id] as const,
  options: () => [...memberKeys.all, 'options'] as const
};

export const membersQueryOptions = (filters: MemberFilters) =>
  queryOptions({
    queryKey: memberKeys.list(filters),
    queryFn: () => getMembers(filters)
  });

export const memberByIdOptions = (id: string) =>
  queryOptions({
    queryKey: memberKeys.detail(id),
    queryFn: () => getMemberById(id)
  });

export const allMembersOptions = () =>
  queryOptions({
    queryKey: memberKeys.options(),
    queryFn: () => getAllMembers()
  });
