'use client';

import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import type { Income } from '../../api/types';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { CellAction } from './cell-action';
import { formatCurrency, formatDate } from '@/features/finance/lib/format';

export const columns: ColumnDef<Income>[] = [
  {
    id: 'name',
    accessorKey: 'title',
    header: ({ column }: { column: Column<Income, unknown> }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    cell: ({ row }) => (
      <Link
        href={`/dashboard/finance/income/${row.original.id}`}
        className='font-medium hover:underline'
      >
        {row.original.title}
      </Link>
    ),
    meta: {
      label: 'Title',
      placeholder: 'Search income...',
      variant: 'text',
      icon: Icons.text
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'client',
    header: 'CLIENT',
    cell: ({ cell }) => (
      <span className='text-muted-foreground'>{cell.getValue<Income['client']>() || '-'}</span>
    )
  },
  {
    accessorKey: 'amount',
    header: 'GROSS',
    cell: ({ cell }) => (
      <span className='font-medium tabular-nums'>
        {formatCurrency(cell.getValue<Income['amount']>())}
      </span>
    )
  },
  {
    accessorKey: 'received_on',
    header: 'RECEIVED',
    cell: ({ cell }) => formatDate(cell.getValue<Income['received_on']>())
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
