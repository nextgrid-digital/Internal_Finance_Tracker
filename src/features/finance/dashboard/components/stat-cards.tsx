'use client';

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import type { FinanceSummary } from '@/features/finance/lib/analytics';
import { COMPANY_SHARE_PCT } from '@/features/finance/constants/split';
import { formatCurrency } from '@/features/finance/lib/format';

export function StatCards({ summary }: { summary: FinanceSummary }) {
  const companyPctLabel = `${Math.round(COMPANY_SHARE_PCT * 100)}%`;
  const memberPoolPctLabel = `${Math.round((1 - COMPANY_SHARE_PCT) * 100)}%`;

  const cards = [
    {
      label: 'Total Income',
      value: formatCurrency(summary.totalIncome),
      footer: `${summary.incomeCount} income entries`,
      badge: { icon: Icons.trendingUp, text: 'gross' }
    },
    {
      label: 'Total Expenses',
      value: formatCurrency(summary.totalExpenses),
      footer: `${summary.expenseCount} expenses`,
      badge: { icon: Icons.trendingDown, text: 'spent' }
    },
    {
      label: 'Net Distributable',
      value: formatCurrency(summary.netDistributable),
      footer: 'Income minus linked expenses',
      badge: { icon: Icons.wallet, text: 'net' }
    },
    {
      label: 'Company Share',
      value: formatCurrency(summary.companyShare),
      footer: `${companyPctLabel} of net distributable`,
      badge: { icon: Icons.briefcase, text: companyPctLabel }
    },
    {
      label: 'Pending Payouts',
      value: formatCurrency(summary.pendingPayouts),
      footer: `${memberPoolPctLabel} member pool, owed minus paid`,
      badge: { icon: Icons.clock, text: 'owed' }
    }
  ];

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5'>
      {cards.map((card) => {
        const BadgeIcon = card.badge.icon;
        return (
          <Card key={card.label} className='@container/card'>
            <CardHeader>
              <CardDescription className='truncate'>{card.label}</CardDescription>
              <CardTitle className='min-w-0 text-2xl font-semibold tabular-nums [overflow-wrap:anywhere]'>
                {card.value}
              </CardTitle>
              <CardAction className='self-start'>
                <Badge variant='outline'>
                  <BadgeIcon />
                  {card.badge.text}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='text-muted-foreground text-sm'>{card.footer}</CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
