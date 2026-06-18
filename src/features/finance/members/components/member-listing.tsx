import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { searchParamsCache } from '@/lib/searchparams';
import { membersQueryOptions } from '../api/queries';
import { MemberTable } from './member-tables';

export default function MemberListingPage() {
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search })
  };

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(membersQueryOptions(filters));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MemberTable />
    </HydrationBoundary>
  );
}
