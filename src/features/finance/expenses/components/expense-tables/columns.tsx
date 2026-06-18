'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import type { Expense } from '../../api/types';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Icons } from '@/components/icons';
import { CellAction } from './cell-action';
import { formatCurrency, formatDate } from '@/features/finance/lib/format';

export const columns: ColumnDef<Expense>[] = [
  {
    id: 'name',
    accessorKey: 'title',
    header: ({ column }: { column: Column<Expense, unknown> }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    cell: ({ cell }) => <div className='font-medium'>{cell.getValue<Expense['title']>()}</div>,
    meta: {
      label: 'Title',
      placeholder: 'Search expenses...',
      variant: 'text',
      icon: Icons.text
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'category',
    header: 'CATEGORY',
    cell: ({ cell }) => (
      <Badge variant='outline' className='capitalize'>
        {cell.getValue<Expense['category']>()}
      </Badge>
    )
  },
  {
    id: 'linked',
    header: 'LINKED INCOME',
    cell: ({ row }) => (
      <span className='text-muted-foreground'>{row.original.income?.title || '-'}</span>
    )
  },
  {
    accessorKey: 'amount',
    header: 'AMOUNT',
    cell: ({ cell }) => (
      <span className='font-medium tabular-nums'>
        {formatCurrency(cell.getValue<Expense['amount']>())}
      </span>
    )
  },
  {
    accessorKey: 'spent_on',
    header: 'SPENT',
    cell: ({ cell }) => formatDate(cell.getValue<Expense['spent_on']>())
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
