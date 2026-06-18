'use client';

import { useAppForm, useFormFields } from '@/components/ui/tanstack-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createMemberMutation, updateMemberMutation } from '../api/mutations';
import type { Member } from '../api/types';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import * as z from 'zod';
import { memberSchema, type MemberFormValues } from '../schemas/member';

export default function MemberForm({
  initialData,
  pageTitle
}: {
  initialData: Member | null;
  pageTitle: string;
}) {
  const router = useRouter();
  const isEdit = !!initialData;

  const createMutation = useMutation({
    ...createMemberMutation,
    onSuccess: () => {
      toast.success('Member created successfully');
      router.push('/dashboard/finance/members');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create member');
    }
  });

  const updateMutation = useMutation({
    ...updateMemberMutation,
    onSuccess: () => {
      toast.success('Member updated successfully');
      router.push('/dashboard/finance/members');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update member');
    }
  });

  const form = useAppForm({
    defaultValues: {
      name: initialData?.name ?? '',
      email: initialData?.email ?? '',
      split_percentage: initialData?.split_percentage,
      active: initialData?.active ?? true
    } as MemberFormValues,
    validators: {
      onSubmit: memberSchema
    },
    onSubmit: ({ value }) => {
      const payload = {
        name: value.name,
        email: value.email ? value.email : null,
        split_percentage: value.split_percentage!,
        active: value.active
      };

      if (isEdit) {
        updateMutation.mutate({ id: initialData.id, values: payload });
      } else {
        createMutation.mutate(payload);
      }
    }
  });

  const { FormTextField, FormSwitchField } = useFormFields<MemberFormValues>();

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
                name='name'
                label='Name'
                required
                placeholder='Enter member name'
                validators={{
                  onBlur: z.string().min(2, 'Name must be at least 2 characters.')
                }}
              />

              <FormTextField
                name='email'
                label='Email'
                type='email'
                placeholder='name@company.com'
              />

              <FormTextField
                name='split_percentage'
                label='Split %'
                required
                type='number'
                min={0}
                max={100}
                step={1}
                placeholder='e.g. 35'
                description='Share of the 75% member pool'
                validators={{
                  onBlur: z.number({ message: 'Split % is required' }).min(0).max(100)
                }}
              />
            </div>

            <FormSwitchField
              name='active'
              label='Active'
              description='Inactive members are excluded from new payout calculations'
            />

            <div className='flex justify-end gap-2'>
              <Button type='button' variant='outline' onClick={() => router.back()}>
                Back
              </Button>
              <form.SubmitButton>{isEdit ? 'Update Member' : 'Add Member'}</form.SubmitButton>
            </div>
          </form.Form>
        </form.AppForm>
      </CardContent>
    </Card>
  );
}
