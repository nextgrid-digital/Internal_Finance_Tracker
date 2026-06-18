import * as z from 'zod';

export const incomeSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  client: z.string(),
  amount: z.number({ message: 'Amount is required' }).min(0, 'Amount must be 0 or more'),
  received_on: z.string().min(1, 'Date is required'),
  notes: z.string()
});

export type IncomeFormValues = {
  title: string;
  client: string;
  amount: number | undefined;
  received_on: string;
  notes: string;
};
