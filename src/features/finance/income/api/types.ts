export type Income = {
  id: string;
  title: string;
  client: string | null;
  amount: number;
  received_on: string;
  notes: string | null;
  created_at: string;
};

export type IncomeFilters = {
  page?: number;
  limit?: number;
  search?: string;
};

export type IncomeResponse = {
  income: Income[];
  total: number;
};

export type IncomeMutationPayload = {
  title: string;
  client: string | null;
  amount: number;
  received_on: string;
  notes: string | null;
};
