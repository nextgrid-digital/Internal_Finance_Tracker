'use client';

import { useAppForm, useFormFields } from '@/components/ui/tanstack-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import * as z from 'zod';
import { createPayoutMutation, updatePayoutMutation } from '../api/mutations';
import type { Payout } from '../api/types';
import { payoutSchema, payoutStatusOptions, type PayoutFormValues } from '../schemas/payout';
import { allMembersOptions } from '@/features/finance/members/api/queries';
import { todayISO } from '@/features/finance/lib/format';

export default function PayoutForm({
  initialData,
  pageTitle
}: {
  initialData: Payout | null;
  pageTitle: string;
}) {
  const router = useRouter();
  const isEdit = !!initialData;

  const { data: members } = useQuery(allMembersOptions());

  const memberOptions = (members ?? []).map((m) => ({ value: m.id, label: m.name }));

  const createMutation = useMutation({
    ...createPayoutMutation,
    onSuccess: () => {
      toast.success('Payout recorded');
      router.push('/dashboard/finance/payouts');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to record payout');
    }
  });

  const updateMutation = useMutation({
    ...updatePayoutMutation,
    onSuccess: () => {
      toast.success('Payout updated');
      router.push('/dashboard/finance/payouts');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update payout');
    }
  });

  const form = useAppForm({
    defaultValues: {
      member_id: initialData?.member_id ?? '',
      amount: initialData?.amount,
      status: initialData?.status ?? 'paid',
      period: initialData?.period ?? '',
      paid_at: initialData?.paid_at ?? todayISO(),
      notes: initialData?.notes ?? ''
    } as PayoutFormValues,
    validators: {
      onSubmit: payoutSchema
    },
    onSubmit: ({ value }) => {
      const payload = {
        member_id: value.member_id,
        amount: value.amount!,
        status: value.status,
        period: value.period ? value.period : null,
        paid_at: value.status === 'paid' ? value.paid_at || todayISO() : null,
        notes: value.notes ? value.notes : null
      };

      if (isEdit) {
        updateMutation.mutate({ id: initialData.id, values: payload });
      } else {
        createMutation.mutate(payload);
      }
    }
  });

  const { FormTextField, FormSelectField, FormTextareaField } = useFormFields<PayoutFormValues>();

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>{pageTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <form.AppForm>
          <form.Form className='space-y-8'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormSelectField
                name='member_id'
                label='Member'
                required
                options={memberOptions}
                placeholder='Select member'
                validators={{
                  onBlur: z.string().min(1, 'Please select a member')
                }}
              />

              <FormTextField
                name='amount'
                label='Amount'
                required
                type='number'
                min={0}
                step={0.01}
                placeholder='Enter payout amount'
                validators={{
                  onBlur: z.number({ message: 'Amount is required' }).min(0)
                }}
              />

              <FormSelectField
                name='status'
                label='Status'
                required
                options={payoutStatusOptions}
                placeholder='Select status'
              />

              <FormTextField
                name='paid_at'
                label='Paid On'
                placeholder='YYYY-MM-DD'
                description='Used when status is Paid'
              />

              <FormTextField
                name='period'
                label='Period'
                placeholder='e.g. Q1 2026 or Jan 2026'
              />
            </div>

            <FormTextareaField name='notes' label='Notes' placeholder='Optional notes' rows={3} />

            <div className='flex justify-end gap-2'>
              <Button type='button' variant='outline' onClick={() => router.back()}>
                Back
              </Button>
              <form.SubmitButton>{isEdit ? 'Update Payout' : 'Record Payout'}</form.SubmitButton>
            </div>
          </form.Form>
        </form.AppForm>
      </CardContent>
    </Card>
  );
}
