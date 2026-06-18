'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import PayoutForm from './payout-form';
import { payoutByIdOptions } from '../api/queries';

export default function PayoutViewPage({ payoutId }: { payoutId: string }) {
  if (payoutId === 'new') {
    return <PayoutForm initialData={null} pageTitle='Record Payout' />;
  }

  return <EditPayoutView payoutId={payoutId} />;
}

function EditPayoutView({ payoutId }: { payoutId: string }) {
  const { data } = useSuspenseQuery(payoutByIdOptions(payoutId));

  if (!data) {
    notFound();
  }

  return <PayoutForm initialData={data} pageTitle='Edit Payout' />;
}
