export type Expense = {
  id: string;
  title: string;
  amount: number;
  category: string;
  income_id: string | null;
  spent_on: string;
  notes: string | null;
  created_at: string;
  // populated via join when listing
  income?: { title: string } | null;
};

export type ExpenseFilters = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  incomeId?: string;
};

export type ExpensesResponse = {
  expenses: Expense[];
  total: number;
};

export type ExpenseMutationPayload = {
  title: string;
  amount: number;
  category: string;
  income_id: string | null;
  spent_on: string;
  notes: string | null;
};
