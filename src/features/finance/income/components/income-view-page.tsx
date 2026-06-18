'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import IncomeForm from './income-form';
import { incomeByIdOptions } from '../api/queries';

export default function IncomeViewPage({ incomeId }: { incomeId: string }) {
  if (incomeId === 'new') {
    return <IncomeForm initialData={null} pageTitle='Add Income' />;
  }

  return <EditIncomeView incomeId={incomeId} />;
}

function EditIncomeView({ incomeId }: { incomeId: string }) {
  const { data } = useSuspenseQuery(incomeByIdOptions(incomeId));

  if (!data) {
    notFound();
  }

  return <IncomeForm initialData={data} pageTitle='Edit Income' />;
}
