'use client';

import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { notFound, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { AlertModal } from '@/components/modal/alert-modal';
import { Icons } from '@/components/icons';
import { incomeByIdOptions } from '../api/queries';
import { deleteIncomeMutation } from '../api/mutations';
import { expensesByIncomeOptions } from '@/features/finance/expenses/api/queries';
import { allMembersOptions } from '@/features/finance/members/api/queries';
import { computeSplit } from '@/features/finance/lib/split';
import { COMPANY_SHARE_PCT } from '@/features/finance/constants/split';
import { formatCurrency, formatDate } from '@/features/finance/lib/format';

export default function IncomeDetail({ incomeId }: { incomeId: string }) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data: income } = useSuspenseQuery(incomeByIdOptions(incomeId));
  const { data: expenses } = useSuspenseQuery(expensesByIncomeOptions(incomeId));
  const { data: members } = useSuspenseQuery(allMembersOptions());

  const deleteMutation = useMutation({
    ...deleteIncomeMutation,
    onSuccess: () => {
      toast.success('Income entry deleted');
      router.push('/dashboard/finance/income');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete income entry');
    }
  });

  if (!income) {
    notFound();
  }

  const activeMembers = members.filter((m) => m.active);
  const expensesTotal = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const split = computeSplit({
    gross: Number(income.amount),
    expenses: expensesTotal,
    members: activeMembers.map((m) => ({
      id: m.id,
      name: m.name,
      split_percentage: m.split_percentage
    }))
  });

  const companyPctLabel = `${Math.round(COMPANY_SHARE_PCT * 100)}%`;
  const memberPoolPctLabel = `${Math.round((1 - COMPANY_SHARE_PCT) * 100)}%`;

  return (
    <>
      <AlertModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => deleteMutation.mutate(income.id)}
        loading={deleteMutation.isPending}
      />

      <div className='flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>{income.title}</h2>
          <p className='text-muted-foreground text-sm'>
            {income.client ? `${income.client} · ` : ''}Received {formatDate(income.received_on)}
          </p>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline' onClick={() => router.push('/dashboard/finance/income')}>
            <Icons.chevronLeft className='mr-1 h-4 w-4' /> Back
          </Button>
          <Button
            variant='outline'
            onClick={() => router.push(`/dashboard/finance/income/${income.id}/edit`)}
          >
            <Icons.edit className='mr-1 h-4 w-4' /> Edit
          </Button>
          <Button variant='destructive' onClick={() => setConfirmOpen(true)}>
            <Icons.trash className='mr-1 h-4 w-4' /> Delete
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5'>
        <SummaryCard label='Gross Income' value={formatCurrency(split.gross)} />
        <SummaryCard
          label='Expenses'
          value={`- ${formatCurrency(split.expenses)}`}
          hint={`${expenses.length} linked`}
        />
        <SummaryCard label='Net Distributable' value={formatCurrency(split.net)} accent />
        <SummaryCard
          label={`Company (${companyPctLabel})`}
          value={formatCurrency(split.companyShare)}
        />
        <SummaryCard
          label={`Member Pool (${memberPoolPctLabel})`}
          value={formatCurrency(split.memberPool)}
        />
      </div>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Member Split</CardTitle>
            <CardDescription>
              {memberPoolPctLabel} of net, split by each member&apos;s percentage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead className='text-right'>Split %</TableHead>
                  <TableHead className='text-right'>Payout</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {split.shares.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className='text-muted-foreground text-center'>
                      No active members. Add members to compute the split.
                    </TableCell>
                  </TableRow>
                ) : (
                  split.shares.map((share) => (
                    <TableRow key={share.id}>
                      <TableCell className='font-medium'>{share.name}</TableCell>
                      <TableCell className='text-right'>{share.split_percentage}%</TableCell>
                      <TableCell className='text-right font-medium tabular-nums'>
                        {formatCurrency(share.amount)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
                <TableRow>
                  <TableCell className='font-semibold'>Company</TableCell>
                  <TableCell className='text-right'>{companyPctLabel}</TableCell>
                  <TableCell className='text-right font-semibold tabular-nums'>
                    {formatCurrency(split.companyShare)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Linked Expenses</CardTitle>
            <CardDescription>Deducted before the split is calculated</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Expense</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className='text-right'>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className='text-muted-foreground text-center'>
                      No expenses linked to this income.
                    </TableCell>
                  </TableRow>
                ) : (
                  expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className='font-medium'>{expense.title}</TableCell>
                      <TableCell>
                        <Badge variant='outline' className='capitalize'>
                          {expense.category}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-right tabular-nums'>
                        {formatCurrency(Number(expense.amount))}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {income.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground text-sm whitespace-pre-wrap'>{income.notes}</p>
          </CardContent>
        </Card>
      )}
    </>
  );
}

function SummaryCard({
  label,
  value,
  hint,
  accent
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <Card className={accent ? 'border-primary/40' : undefined}>
      <CardHeader className='pb-2'>
        <CardDescription className='truncate'>{label}</CardDescription>
        <CardTitle className='min-w-0 text-xl tabular-nums [overflow-wrap:anywhere]'>
          {value}
        </CardTitle>
      </CardHeader>
      {hint && (
        <CardContent className='pt-0'>
          <span className='text-muted-foreground text-xs'>{hint}</span>
        </CardContent>
      )}
    </Card>
  );
}
