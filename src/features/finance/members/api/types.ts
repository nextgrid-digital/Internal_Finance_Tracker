export type Member = {
  id: string;
  name: string;
  email: string | null;
  split_percentage: number;
  active: boolean;
  created_at: string;
};

export type MemberFilters = {
  page?: number;
  limit?: number;
  search?: string;
};

export type MembersResponse = {
  members: Member[];
  total: number;
};

export type MemberMutationPayload = {
  name: string;
  email: string | null;
  split_percentage: number;
  active: boolean;
};
