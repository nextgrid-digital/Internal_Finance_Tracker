'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { payoutSummaryOptions } from '../api/queries';
import { formatCurrency } from '@/features/finance/lib/format';

export function PayoutSummary() {
  const { data } = useSuspenseQuery(payoutSummaryOptions());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Member Balances</CardTitle>
        <CardDescription>
          Owed is each member&apos;s computed share across all income. Pending is owed minus
          what has been paid out.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead className='text-right'>Owed</TableHead>
              <TableHead className='text-right'>Paid</TableHead>
              <TableHead className='text-right'>Pending</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.rows.map((row) => (
              <TableRow key={row.memberId}>
                <TableCell className='font-medium'>
                  {row.name}
                  {!row.active && (
                    <Badge variant='outline' className='ml-2'>
                      inactive
                    </Badge>
                  )}
                </TableCell>
                <TableCell className='text-right tabular-nums'>
                  {formatCurrency(row.owed)}
                </TableCell>
                <TableCell className='text-right tabular-nums'>
                  {formatCurrency(row.paid)}
                </TableCell>
                <TableCell className='text-right font-medium tabular-nums'>
                  {formatCurrency(row.pending)}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell className='font-semibold'>Total</TableCell>
              <TableCell className='text-right font-semibold tabular-nums'>
                {formatCurrency(data.totals.owed)}
              </TableCell>
              <TableCell className='text-right font-semibold tabular-nums'>
                {formatCurrency(data.totals.paid)}
              </TableCell>
              <TableCell className='text-right font-semibold tabular-nums'>
                {formatCurrency(data.totals.pending)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
