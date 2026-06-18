import { mutationOptions } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { createMember, updateMember, deleteMember } from './service';
import { memberKeys } from './queries';
import type { MemberMutationPayload } from './types';

export const createMemberMutation = mutationOptions({
  mutationFn: (data: MemberMutationPayload) => createMember(data),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: memberKeys.all });
  }
});

export const updateMemberMutation = mutationOptions({
  mutationFn: ({ id, values }: { id: string; values: MemberMutationPayload }) =>
    updateMember(id, values),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: memberKeys.all });
  }
});

export const deleteMemberMutation = mutationOptions({
  mutationFn: (id: string) => deleteMember(id),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: memberKeys.all });
  }
});
