'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import type { Member } from '../../api/types';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Icons } from '@/components/icons';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Member>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<Member, unknown> }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ cell }) => <div className='font-medium'>{cell.getValue<Member['name']>()}</div>,
    meta: {
      label: 'Name',
      placeholder: 'Search members...',
      variant: 'text',
      icon: Icons.text
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'email',
    header: 'EMAIL',
    cell: ({ cell }) => (
      <span className='text-muted-foreground'>{cell.getValue<Member['email']>() || '-'}</span>
    )
  },
  {
    accessorKey: 'split_percentage',
    header: 'SPLIT %',
    cell: ({ cell }) => <div>{cell.getValue<Member['split_percentage']>()}%</div>
  },
  {
    accessorKey: 'active',
    header: 'STATUS',
    cell: ({ cell }) => {
      const active = cell.getValue<Member['active']>();
      const Icon = active ? Icons.circleCheck : Icons.xCircle;
      return (
        <Badge variant='outline' className='capitalize'>
          <Icon />
          {active ? 'active' : 'inactive'}
        </Badge>
      );
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
