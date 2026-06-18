'use server';

import { computeFinanceSummary, type FinanceSummary } from '@/features/finance/lib/analytics';

export async function getFinanceSummary(): Promise<FinanceSummary> {
  return computeFinanceSummary();
}
