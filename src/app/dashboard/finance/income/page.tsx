import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import IncomeListingPage from '@/features/finance/income/components/income-listing';
import { searchParamsCache } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Finance: Income'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer
      pageTitle='Income'
      pageDescription='Track gross income. Open an entry to see its split.'
      pageHeaderAction={
        <Link
          href='/dashboard/finance/income/new'
          className={cn(buttonVariants(), 'text-xs md:text-sm')}
        >
          <Icons.add className='mr-2 h-4 w-4' /> Add Income
        </Link>
      }
    >
      <IncomeListingPage />
    </PageContainer>
  );
}
