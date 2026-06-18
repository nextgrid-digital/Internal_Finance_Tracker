import { queryOptions } from '@tanstack/react-query';
import { getExpenses, getExpenseById, getAllExpenses, getExpensesByIncome } from './service';
import type { Expense, ExpenseFilters } from './types';

export type { Expense };

export const expenseKeys = {
  all: ['expenses'] as const,
  list: (filters: ExpenseFilters) => [...expenseKeys.all, 'list', filters] as const,
  detail: (id: string) => [...expenseKeys.all, 'detail', id] as const,
  byIncome: (incomeId: string) => [...expenseKeys.all, 'by-income', incomeId] as const,
  options: () => [...expenseKeys.all, 'options'] as const
};

export const expensesQueryOptions = (filters: ExpenseFilters) =>
  queryOptions({
    queryKey: expenseKeys.list(filters),
    queryFn: () => getExpenses(filters)
  });

export const expenseByIdOptions = (id: string) =>
  queryOptions({
    queryKey: expenseKeys.detail(id),
    queryFn: () => getExpenseById(id)
  });

export const expensesByIncomeOptions = (incomeId: string) =>
  queryOptions({
    queryKey: expenseKeys.byIncome(incomeId),
    queryFn: () => getExpensesByIncome(incomeId)
  });

export const allExpensesOptions = () =>
  queryOptions({
    queryKey: expenseKeys.options(),
    queryFn: () => getAllExpenses()
  });
