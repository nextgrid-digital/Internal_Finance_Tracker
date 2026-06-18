import { mutationOptions } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { createIncome, updateIncome, deleteIncome } from './service';
import { incomeKeys } from './queries';
import type { IncomeMutationPayload } from './types';

export const createIncomeMutation = mutationOptions({
  mutationFn: (data: IncomeMutationPayload) => createIncome(data),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: incomeKeys.all });
  }
});

export const updateIncomeMutation = mutationOptions({
  mutationFn: ({ id, values }: { id: string; values: IncomeMutationPayload }) =>
    updateIncome(id, values),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: incomeKeys.all });
  }
});

export const deleteIncomeMutation = mutationOptions({
  mutationFn: (id: string) => deleteIncome(id),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: incomeKeys.all });
  }
});
