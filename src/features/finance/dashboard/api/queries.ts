import { queryOptions } from '@tanstack/react-query';
import { getFinanceSummary } from './service';

export const financeKeys = {
  all: ['finance-summary'] as const
};

export const financeSummaryOptions = () =>
  queryOptions({
    queryKey: financeKeys.all,
    queryFn: () => getFinanceSummary()
  });
