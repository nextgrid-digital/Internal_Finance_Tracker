import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { searchParamsCache } from '@/lib/searchparams';
import { payoutsQueryOptions, payoutSummaryOptions } from '../api/queries';
import { PayoutTable } from './payout-tables';
import { PayoutSummary } from './payout-summary';

export default function PayoutListingPage() {
  const page = searchParamsCache.get('page');
  const pageLimit = searchParamsCache.get('perPage');

  const filters = {
    page,
    limit: pageLimit
  };

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(payoutSummaryOptions());
  void queryClient.prefetchQuery(payoutsQueryOptions(filters));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className='space-y-6'>
        <PayoutSummary />
        <PayoutTable />
      </div>
    </HydrationBoundary>
  );
}
