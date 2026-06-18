export type PayoutStatus = 'pending' | 'paid';

export type Payout = {
  id: string;
  member_id: string;
  amount: number;
  status: PayoutStatus;
  period: string | null;
  paid_at: string | null;
  notes: string | null;
  created_at: string;
  // populated via join when listing
  member?: { name: string } | null;
};

export type PayoutFilters = {
  page?: number;
  limit?: number;
  status?: string;
};

export type PayoutsResponse = {
  payouts: Payout[];
  total: number;
};

export type PayoutMutationPayload = {
  member_id: string;
  amount: number;
  status: PayoutStatus;
  period: string | null;
  paid_at: string | null;
  notes: string | null;
};
