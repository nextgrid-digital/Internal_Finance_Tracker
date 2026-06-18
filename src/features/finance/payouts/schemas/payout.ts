import * as z from 'zod';

export const payoutSchema = z.object({
  member_id: z.string().min(1, 'Please select a member'),
  amount: z.number({ message: 'Amount is required' }).min(0, 'Amount must be 0 or more'),
  status: z.enum(['pending', 'paid']),
  period: z.string(),
  paid_at: z.string(),
  notes: z.string()
});

export type PayoutFormValues = {
  member_id: string;
  amount: number | undefined;
  status: 'pending' | 'paid';
  period: string;
  paid_at: string;
  notes: string;
};

export const payoutStatusOptions = [
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' }
];
