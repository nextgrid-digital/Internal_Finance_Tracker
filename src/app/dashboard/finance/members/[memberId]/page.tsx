import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { memberByIdOptions } from '@/features/finance/members/api/queries';
import PageContainer from '@/components/layout/page-container';
import MemberViewPage from '@/features/finance/members/components/member-view-page';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Finance: Member'
};

type PageProps = { params: Promise<{ memberId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  const queryClient = getQueryClient();

  if (params.memberId !== 'new') {
    void queryClient.prefetchQuery(memberByIdOptions(params.memberId));
  }

  return (
    <PageContainer>
      <div className='flex-1 space-y-4'>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <MemberViewPage memberId={params.memberId} />
        </HydrationBoundary>
      </div>
    </PageContainer>
  );
}
