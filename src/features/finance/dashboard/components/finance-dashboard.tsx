'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { financeSummaryOptions } from '../api/queries';
import { StatCards } from './stat-cards';
import { IncomeExpenseChart } from './income-expense-chart';
import { DistributionPie } from './distribution-pie';

export function FinanceDashboard() {
  const { data: summary } = useSuspenseQuery(financeSummaryOptions());

  return (
    <div className='flex flex-col gap-4'>
      <StatCards summary={summary} />
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
        <div className='lg:col-span-4'>
          <IncomeExpenseChart data={summary.monthly} />
        </div>
        <div className='lg:col-span-3'>
          <DistributionPie summary={summary} />
        </div>
      </div>
    </div>
  );
}
