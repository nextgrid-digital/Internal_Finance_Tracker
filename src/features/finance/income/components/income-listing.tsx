import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { searchParamsCache } from '@/lib/searchparams';
import { incomeQueryOptions } from '../api/queries';
import { IncomeTable } from './income-tables';

export default function IncomeListingPage() {
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search })
  };

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(incomeQueryOptions(filters));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <IncomeTable />
    </HydrationBoundary>
  );
}
