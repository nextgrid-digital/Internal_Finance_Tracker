'use client';

import { Label, Pie, PieChart } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import type { FinanceSummary } from '@/features/finance/lib/analytics';
import { COMPANY_SHARE_PCT } from '@/features/finance/constants/split';
import { formatCurrency } from '@/features/finance/lib/format';

const PALETTE = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)'
];

const chartConfig = {
  value: { label: 'Amount' }
} satisfies ChartConfig;

export function DistributionPie({ summary }: { summary: FinanceSummary }) {
  const companyPctLabel = `${Math.round(COMPANY_SHARE_PCT * 100)}%`;

  const data = [
    { name: `Company (${companyPctLabel})`, value: summary.companyShare, fill: PALETTE[0] },
    ...summary.memberSplit.map((m, i) => ({
      name: m.name,
      value: m.amount,
      fill: PALETTE[(i + 1) % PALETTE.length]
    }))
  ].filter((d) => d.value > 0);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card className='flex h-full flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Distribution</CardTitle>
        <CardDescription>Net distributable: company + members</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-1 items-center justify-center pb-0'>
        {data.length === 0 ? (
          <p className='text-muted-foreground py-12 text-sm'>No income recorded yet.</p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className='mx-auto aspect-square max-h-[300px] min-h-[250px]'
          >
            <PieChart>
              <ChartTooltip
                content={<ChartTooltipContent nameKey='name' hideLabel />}
              />
              <Pie data={data} dataKey='value' nameKey='name' innerRadius={60} strokeWidth={4}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor='middle'>
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className='fill-foreground text-lg font-semibold'
                          >
                            {formatCurrency(total)}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy ?? 0) + 18}
                            className='fill-muted-foreground text-xs'
                          >
                            Net
                          </tspan>
                        </text>
                      );
                    }
                    return null;
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
