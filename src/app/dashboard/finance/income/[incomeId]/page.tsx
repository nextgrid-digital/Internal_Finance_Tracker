import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { incomeByIdOptions } from '@/features/finance/income/api/queries';
import { expensesByIncomeOptions } from '@/features/finance/expenses/api/queries';
import { allMembersOptions } from '@/features/finance/members/api/queries';
import PageContainer from '@/components/layout/page-container';
import IncomeDetail from '@/features/finance/income/components/income-detail';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Finance: Income Split'
};

type PageProps = { params: Promise<{ incomeId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(incomeByIdOptions(params.incomeId));
  void queryClient.prefetchQuery(expensesByIncomeOptions(params.incomeId));
  void queryClient.prefetchQuery(allMembersOptions());

  return (
    <PageContainer>
      <div className='flex-1 space-y-4'>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <IncomeDetail incomeId={params.incomeId} />
        </HydrationBoundary>
      </div>
    </PageContainer>
  );
}
