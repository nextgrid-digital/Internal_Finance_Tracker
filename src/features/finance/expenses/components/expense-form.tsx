'use client';

import { useAppForm, useFormFields } from '@/components/ui/tanstack-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import * as z from 'zod';
import { createExpenseMutation, updateExpenseMutation } from '../api/mutations';
import type { Expense } from '../api/types';
import { expenseSchema, type ExpenseFormValues } from '../schemas/expense';
import { expenseCategoryOptions, NO_INCOME_LINK } from '../constants/expense-options';
import { allIncomeOptions } from '@/features/finance/income/api/queries';
import { todayISO } from '@/features/finance/lib/format';

export default function ExpenseForm({
  initialData,
  pageTitle
}: {
  initialData: Expense | null;
  pageTitle: string;
}) {
  const router = useRouter();
  const isEdit = !!initialData;

  const { data: incomeList } = useQuery(allIncomeOptions());

  const incomeOptions = [
    { value: NO_INCOME_LINK, label: 'No linked income' },
    ...(incomeList ?? []).map((income) => ({ value: income.id, label: income.title }))
  ];

  const createMutation = useMutation({
    ...createExpenseMutation,
    onSuccess: () => {
      toast.success('Expense created');
      router.push('/dashboard/finance/expenses');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create expense');
    }
  });

  const updateMutation = useMutation({
    ...updateExpenseMutation,
    onSuccess: () => {
      toast.success('Expense updated');
      router.push('/dashboard/finance/expenses');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update expense');
    }
  });

  const form = useAppForm({
    defaultValues: {
      title: initialData?.title ?? '',
      amount: initialData?.amount,
      category: initialData?.category ?? 'general',
      income_id: initialData?.income_id ?? NO_INCOME_LINK,
      spent_on: initialData?.spent_on ?? todayISO(),
      notes: initialData?.notes ?? ''
    } as ExpenseFormValues,
    validators: {
      onSubmit: expenseSchema
    },
    onSubmit: ({ value }) => {
      const payload = {
        title: value.title,
        amount: value.amount!,
        category: value.category,
        income_id: value.income_id === NO_INCOME_LINK ? null : value.income_id,
        spent_on: value.spent_on,
        notes: value.notes ? value.notes : null
      };

      if (isEdit) {
        updateMutation.mutate({ id: initialData.id, values: payload });
      } else {
        createMutation.mutate(payload);
      }
    }
  });

  const { FormTextField, FormSelectField, FormTextareaField } =
    useFormFields<ExpenseFormValues>();

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>{pageTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <form.AppForm>
          <form.Form className='space-y-8'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormTextField
                name='title'
                label='Title'
                required
                placeholder='e.g. Figma subscription'
                validators={{
                  onBlur: z.string().min(2, 'Title must be at least 2 characters.')
                }}
              />

              <FormTextField
                name='amount'
                label='Amount'
                required
                type='number'
                min={0}
                step={0.01}
                placeholder='Enter amount'
                validators={{
                  onBlur: z.number({ message: 'Amount is required' }).min(0)
                }}
              />

              <FormSelectField
                name='category'
                label='Category'
                required
                options={expenseCategoryOptions}
                placeholder='Select category'
                validators={{
                  onBlur: z.string().min(1, 'Please select a category')
                }}
              />

              <FormSelectField
                name='income_id'
                label='Linked Income'
                options={incomeOptions}
                placeholder='Link to an income entry'
                description='Expenses linked to income are deducted before its split'
              />

              <FormTextField
                name='spent_on'
                label='Spent On'
                required
                placeholder='YYYY-MM-DD'
                description='Format: YYYY-MM-DD'
                validators={{
                  onBlur: z.string().min(1, 'Date is required')
                }}
              />
            </div>

            <FormTextareaField name='notes' label='Notes' placeholder='Optional notes' rows={3} />

            <div className='flex justify-end gap-2'>
              <Button type='button' variant='outline' onClick={() => router.back()}>
                Back
              </Button>
              <form.SubmitButton>{isEdit ? 'Update Expense' : 'Add Expense'}</form.SubmitButton>
            </div>
          </form.Form>
        </form.AppForm>
      </CardContent>
    </Card>
  );
}
