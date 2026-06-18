'use client';

import { useAppForm, useFormFields } from '@/components/ui/tanstack-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createIncomeMutation, updateIncomeMutation } from '../api/mutations';
import type { Income } from '../api/types';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import * as z from 'zod';
import { incomeSchema, type IncomeFormValues } from '../schemas/income';
import { todayISO } from '@/features/finance/lib/format';

export default function IncomeForm({
  initialData,
  pageTitle
}: {
  initialData: Income | null;
  pageTitle: string;
}) {
  const router = useRouter();
  const isEdit = !!initialData;

  const createMutation = useMutation({
    ...createIncomeMutation,
    onSuccess: () => {
      toast.success('Income entry created');
      router.push('/dashboard/finance/income');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create income entry');
    }
  });

  const updateMutation = useMutation({
    ...updateIncomeMutation,
    onSuccess: () => {
      toast.success('Income entry updated');
      router.push('/dashboard/finance/income');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update income entry');
    }
  });

  const form = useAppForm({
    defaultValues: {
      title: initialData?.title ?? '',
      client: initialData?.client ?? '',
      amount: initialData?.amount,
      received_on: initialData?.received_on ?? todayISO(),
      notes: initialData?.notes ?? ''
    } as IncomeFormValues,
    validators: {
      onSubmit: incomeSchema
    },
    onSubmit: ({ value }) => {
      const payload = {
        title: value.title,
        client: value.client ? value.client : null,
        amount: value.amount!,
        received_on: value.received_on,
        notes: value.notes ? value.notes : null
      };

      if (isEdit) {
        updateMutation.mutate({ id: initialData.id, values: payload });
      } else {
        createMutation.mutate(payload);
      }
    }
  });

  const { FormTextField, FormTextareaField } = useFormFields<IncomeFormValues>();

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
                label='Title / Project'
                required
                placeholder='e.g. Acme website build'
                validators={{
                  onBlur: z.string().min(2, 'Title must be at least 2 characters.')
                }}
              />

              <FormTextField name='client' label='Client' placeholder='e.g. Acme Inc.' />

              <FormTextField
                name='amount'
                label='Gross Amount'
                required
                type='number'
                min={0}
                step={0.01}
                placeholder='Enter gross income'
                validators={{
                  onBlur: z.number({ message: 'Amount is required' }).min(0)
                }}
              />

              <FormTextField
                name='received_on'
                label='Received On'
                required
                placeholder='YYYY-MM-DD'
                description='Format: YYYY-MM-DD'
                validators={{
                  onBlur: z.string().min(1, 'Date is required')
                }}
              />
            </div>

            <FormTextareaField
              name='notes'
              label='Notes'
              placeholder='Optional notes'
              rows={3}
            />

            <div className='flex justify-end gap-2'>
              <Button type='button' variant='outline' onClick={() => router.back()}>
                Back
              </Button>
              <form.SubmitButton>{isEdit ? 'Update Income' : 'Add Income'}</form.SubmitButton>
            </div>
          </form.Form>
        </form.AppForm>
      </CardContent>
    </Card>
  );
}
