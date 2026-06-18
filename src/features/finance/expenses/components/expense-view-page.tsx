'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import ExpenseForm from './expense-form';
import { expenseByIdOptions } from '../api/queries';

export default function ExpenseViewPage({ expenseId }: { expenseId: string }) {
  if (expenseId === 'new') {
    return <ExpenseForm initialData={null} pageTitle='Add Expense' />;
  }

  return <EditExpenseView expenseId={expenseId} />;
}

function EditExpenseView({ expenseId }: { expenseId: string }) {
  const { data } = useSuspenseQuery(expenseByIdOptions(expenseId));

  if (!data) {
    notFound();
  }

  return <ExpenseForm initialData={data} pageTitle='Edit Expense' />;
}
