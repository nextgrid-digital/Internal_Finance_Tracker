import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import MemberListingPage from '@/features/finance/members/components/member-listing';
import { searchParamsCache } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Finance: Members'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer
      pageTitle='Members'
      pageDescription='Manage members and their share of the 75% member pool.'
      pageHeaderAction={
        <Link
          href='/dashboard/finance/members/new'
          className={cn(buttonVariants(), 'text-xs md:text-sm')}
        >
          <Icons.add className='mr-2 h-4 w-4' /> Add Member
        </Link>
      }
    >
      <MemberListingPage />
    </PageContainer>
  );
}
