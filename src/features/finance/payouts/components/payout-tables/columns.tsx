'use client';

import { Badge } from '@/components/ui/badge';
import type { Payout } from '../../api/types';
import { ColumnDef } from '@tanstack/react-table';
import { Icons } from '@/components/icons';
import { CellAction } from './cell-action';
import { formatCurrency, formatDate } from '@/features/finance/lib/format';

export const columns: ColumnDef<Payout>[] = [
  {
    id: 'member',
    header: 'MEMBER',
    cell: ({ row }) => (
      <div className='font-medium'>{row.original.member?.name ?? 'Unknown'}</div>
    )
  },
  {
    accessorKey: 'amount',
    header: 'AMOUNT',
    cell: ({ cell }) => (
      <span className='font-medium tabular-nums'>
        {formatCurrency(cell.getValue<Payout['amount']>())}
      </span>
    )
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell: ({ cell }) => {
      const status = cell.getValue<Payout['status']>();
      const isPaid = status === 'paid';
      const Icon = isPaid ? Icons.circleCheck : Icons.clock;
      return (
        <Badge variant='outline' className='capitalize'>
          <Icon />
          {status}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'period',
    header: 'PERIOD',
    cell: ({ cell }) => (
      <span className='text-muted-foreground'>{cell.getValue<Payout['period']>() || '-'}</span>
    )
  },
  {
    accessorKey: 'paid_at',
    header: 'PAID ON',
    cell: ({ cell }) => formatDate(cell.getValue<Payout['paid_at']>())
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
