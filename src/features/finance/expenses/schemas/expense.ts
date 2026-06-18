import * as z from 'zod';

export const expenseSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  amount: z.number({ message: 'Amount is required' }).min(0, 'Amount must be 0 or more'),
  category: z.string().min(1, 'Please select a category'),
  income_id: z.string(),
  spent_on: z.string().min(1, 'Date is required'),
  notes: z.string()
});

export type ExpenseFormValues = {
  title: string;
  amount: number | undefined;
  category: string;
  income_id: string;
  spent_on: string;
  notes: string;
};
