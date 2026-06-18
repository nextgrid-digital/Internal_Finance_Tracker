import { Suspense } from 'react';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { financeSummaryOptions } from '@/features/finance/dashboard/api/queries';
import { FinanceDashboard } from '@/features/finance/dashboard/components/finance-dashboard';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Finance: Dashboard'
};

export default function Page() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(financeSummaryOptions());

  return (
    <PageContainer
      pageTitle='Finance'
      pageDescription='Income, expenses, splits, and pending payouts at a glance.'
      pageHeaderAction={
        <Link
          href='/dashboard/finance/income/new'
          className={cn(buttonVariants(), 'text-xs md:text-sm')}
        >
          <Icons.add className='mr-2 h-4 w-4' /> Add Income
        </Link>
      }
    >
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<DataTableSkeleton columnCount={5} rowCount={5} />}>
          <FinanceDashboard />
        </Suspense>
      </HydrationBoundary>
    </PageContainer>
  );
}
