import { queryOptions } from '@tanstack/react-query';
import { getPayouts, getPayoutById, getPayoutSummary } from './service';
import type { Payout, PayoutFilters } from './types';

export type { Payout };

export const payoutKeys = {
  all: ['payouts'] as const,
  list: (filters: PayoutFilters) => [...payoutKeys.all, 'list', filters] as const,
  detail: (id: string) => [...payoutKeys.all, 'detail', id] as const,
  summary: () => [...payoutKeys.all, 'summary'] as const
};

export const payoutsQueryOptions = (filters: PayoutFilters) =>
  queryOptions({
    queryKey: payoutKeys.list(filters),
    queryFn: () => getPayouts(filters)
  });

export const payoutByIdOptions = (id: string) =>
  queryOptions({
    queryKey: payoutKeys.detail(id),
    queryFn: () => getPayoutById(id)
  });

export const payoutSummaryOptions = () =>
  queryOptions({
    queryKey: payoutKeys.summary(),
    queryFn: () => getPayoutSummary()
  });
