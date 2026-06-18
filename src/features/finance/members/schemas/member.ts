import * as z from 'zod';

export const memberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.union([z.string().email('Enter a valid email.'), z.literal('')]),
  split_percentage: z
    .number({ message: 'Split % is required' })
    .min(0, 'Must be 0 or more')
    .max(100, 'Must be 100 or less'),
  active: z.boolean()
});

export type MemberFormValues = {
  name: string;
  email: string;
  split_percentage: number | undefined;
  active: boolean;
};
