import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { expenseByIdOptions } from '@/features/finance/expenses/api/queries';
import PageContainer from '@/components/layout/page-container';
import ExpenseViewPage from '@/features/finance/expenses/components/expense-view-page';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Finance: Expense'
};

type PageProps = { params: Promise<{ expenseId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  const queryClient = getQueryClient();

  if (params.expenseId !== 'new') {
    void queryClient.prefetchQuery(expenseByIdOptions(params.expenseId));
  }

  return (
    <PageContainer>
      <div className='flex-1 space-y-4'>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ExpenseViewPage expenseId={params.expenseId} />
        </HydrationBoundary>
      </div>
    </PageContainer>
  );
}
