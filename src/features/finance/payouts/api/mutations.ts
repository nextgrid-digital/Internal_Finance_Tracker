import { mutationOptions } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { createPayout, updatePayout, deletePayout } from './service';
import { payoutKeys } from './queries';
import type { PayoutMutationPayload } from './types';

export const createPayoutMutation = mutationOptions({
  mutationFn: (data: PayoutMutationPayload) => createPayout(data),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: payoutKeys.all });
  }
});

export const updatePayoutMutation = mutationOptions({
  mutationFn: ({ id, values }: { id: string; values: PayoutMutationPayload }) =>
    updatePayout(id, values),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: payoutKeys.all });
  }
});

export const deletePayoutMutation = mutationOptions({
  mutationFn: (id: string) => deletePayout(id),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: payoutKeys.all });
  }
});
