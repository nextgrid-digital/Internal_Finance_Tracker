import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import ExpenseListingPage from '@/features/finance/expenses/components/expense-listing';
import { searchParamsCache } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Finance: Expenses'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer
      pageTitle='Expenses'
      pageDescription='Track expenses. Link them to income to reduce its net distributable amount.'
      pageHeaderAction={
        <Link
          href='/dashboard/finance/expenses/new'
          className={cn(buttonVariants(), 'text-xs md:text-sm')}
        >
          <Icons.add className='mr-2 h-4 w-4' /> Add Expense
        </Link>
      }
    >
      <ExpenseListingPage />
    </PageContainer>
  );
}
