import PageContainer from '@/components/layout/page-container';
import IncomeViewPage from '@/features/finance/income/components/income-view-page';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Finance: Add Income'
};

export default function Page() {
  return (
    <PageContainer>
      <div className='flex-1 space-y-4'>
        <IncomeViewPage incomeId='new' />
      </div>
    </PageContainer>
  );
}
