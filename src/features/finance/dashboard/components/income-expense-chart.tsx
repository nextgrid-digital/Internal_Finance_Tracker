'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import type { MonthlyPoint } from '@/features/finance/lib/analytics';

const chartConfig = {
  income: {
    label: 'Income',
    color: 'var(--chart-1)'
  },
  expenses: {
    label: 'Expenses',
    color: 'var(--chart-2)'
  }
} satisfies ChartConfig;

export function IncomeExpenseChart({ data }: { data: MonthlyPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs Expenses</CardTitle>
        <CardDescription>Last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} strokeDasharray='3 3' />
            <XAxis dataKey='month' tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey='income' fill='var(--color-income)' radius={4} />
            <Bar dataKey='expenses' fill='var(--color-expenses)' radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
