import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { incomeByIdOptions } from '@/features/finance/income/api/queries';
import PageContainer from '@/components/layout/page-container';
import IncomeViewPage from '@/features/finance/income/components/income-view-page';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Finance: Edit Income'
};

type PageProps = { params: Promise<{ incomeId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(incomeByIdOptions(params.incomeId));

  return (
    <PageContainer>
      <div className='flex-1 space-y-4'>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <IncomeViewPage incomeId={params.incomeId} />
        </HydrationBoundary>
      </div>
    </PageContainer>
  );
}
