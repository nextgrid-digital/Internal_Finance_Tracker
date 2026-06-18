import { queryOptions } from '@tanstack/react-query';
import { getIncome, getIncomeById, getAllIncome } from './service';
import type { Income, IncomeFilters } from './types';

export type { Income };

export const incomeKeys = {
  all: ['income'] as const,
  list: (filters: IncomeFilters) => [...incomeKeys.all, 'list', filters] as const,
  detail: (id: string) => [...incomeKeys.all, 'detail', id] as const,
  options: () => [...incomeKeys.all, 'options'] as const
};

export const incomeQueryOptions = (filters: IncomeFilters) =>
  queryOptions({
    queryKey: incomeKeys.list(filters),
    queryFn: () => getIncome(filters)
  });

export const incomeByIdOptions = (id: string) =>
  queryOptions({
    queryKey: incomeKeys.detail(id),
    queryFn: () => getIncomeById(id)
  });

export const allIncomeOptions = () =>
  queryOptions({
    queryKey: incomeKeys.options(),
    queryFn: () => getAllIncome()
  });
