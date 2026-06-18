import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import PayoutListingPage from '@/features/finance/payouts/components/payout-listing';
import { searchParamsCache } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Finance: Payouts'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer
      pageTitle='Payouts'
      pageDescription='Track what each member is owed and record payouts.'
      pageHeaderAction={
        <Link
          href='/dashboard/finance/payouts/new'
          className={cn(buttonVariants(), 'text-xs md:text-sm')}
        >
          <Icons.add className='mr-2 h-4 w-4' /> Record Payout
        </Link>
      }
    >
      <PayoutListingPage />
    </PageContainer>
  );
}
