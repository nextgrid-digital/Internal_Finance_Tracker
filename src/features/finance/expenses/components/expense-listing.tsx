import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { searchParamsCache } from '@/lib/searchparams';
import { expensesQueryOptions } from '../api/queries';
import { ExpenseTable } from './expense-tables';

export default function ExpenseListingPage() {
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search })
  };

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(expensesQueryOptions(filters));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ExpenseTable />
    </HydrationBoundary>
  );
}
