import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { payoutByIdOptions } from '@/features/finance/payouts/api/queries';
import PageContainer from '@/components/layout/page-container';
import PayoutViewPage from '@/features/finance/payouts/components/payout-view-page';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Finance: Payout'
};

type PageProps = { params: Promise<{ payoutId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  const queryClient = getQueryClient();

  if (params.payoutId !== 'new') {
    void queryClient.prefetchQuery(payoutByIdOptions(params.payoutId));
  }

  return (
    <PageContainer>
      <div className='flex-1 space-y-4'>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <PayoutViewPage payoutId={params.payoutId} />
        </HydrationBoundary>
      </div>
    </PageContainer>
  );
}
