'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import MemberForm from './member-form';
import { memberByIdOptions } from '../api/queries';

export default function MemberViewPage({ memberId }: { memberId: string }) {
  if (memberId === 'new') {
    return <MemberForm initialData={null} pageTitle='Add Member' />;
  }

  return <EditMemberView memberId={memberId} />;
}

function EditMemberView({ memberId }: { memberId: string }) {
  const { data } = useSuspenseQuery(memberByIdOptions(memberId));

  if (!data) {
    notFound();
  }

  return <MemberForm initialData={data} pageTitle='Edit Member' />;
}
