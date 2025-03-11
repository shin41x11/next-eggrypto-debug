'use client';

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
  SortingState,
} from '@tanstack/react-table';
import { useState } from 'react';

interface CreateMonsterEvent {
  id: number;
  blockNumber: string;
  timestamp: string;
  transactionHash: string;
  tokenId: string;
  monsterId: string;
  supplyNumber: string;
  supplyLimit: string;
  userMonsterId: string;
  createdAt: string;
}

const columns: ColumnDef<CreateMonsterEvent>[] = [
  {
    accessorKey: 'blockNumber',
    header: 'Block Number',
  },
  {
    accessorKey: 'timestamp',
    header: 'Timestamp',
    cell: ({ row }) => new Date(row.getValue('timestamp') as string).toLocaleString(),
  },
  {
    accessorKey: 'monsterId',
    header: 'Monster ID',
  },
  {
    accessorKey: 'supplyNumber',
    header: 'Supply Number',
  },
  {
    accessorKey: 'supplyLimit',
    header: 'Supply Limit',
  },
  {
    accessorKey: 'transactionHash',
    header: 'Transaction Hash',
    cell: ({ row }) => (
      <a
        href={`https://polygonscan.com/tx/${row.getValue('transactionHash') as string}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#0070f3', textDecoration: 'none' }}
      >
        {(row.getValue('transactionHash') as string).slice(0, 10)}...
      </a>
    ),
  },
];

export function CreateMonsterEventTable({ data }: { data: CreateMonsterEvent[] }) {
  console.log('Table received data:', data);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
  });

  console.log('Table rows:', table.getRowModel().rows);

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <input
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search all columns..."
          style={{
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ddd',
            width: '100%',
            maxWidth: '300px',
          }}
        />
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      backgroundColor: '#f8f9fa',
                      borderBottom: '2px solid #dee2e6',
                      cursor: header.column.getCanSort() ? 'pointer' : 'default',
                    }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{
                      padding: '12px',
                      borderBottom: '1px solid #dee2e6',
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            border: '1px solid #ddd',
            backgroundColor: '#fff',
            cursor: table.getCanPreviousPage() ? 'pointer' : 'not-allowed',
          }}
        >
          {'<<'}
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            border: '1px solid #ddd',
            backgroundColor: '#fff',
            cursor: table.getCanPreviousPage() ? 'pointer' : 'not-allowed',
          }}
        >
          {'<'}
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            border: '1px solid #ddd',
            backgroundColor: '#fff',
            cursor: table.getCanNextPage() ? 'pointer' : 'not-allowed',
          }}
        >
          {'>'}
        </button>
        <button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            border: '1px solid #ddd',
            backgroundColor: '#fff',
            cursor: table.getCanNextPage() ? 'pointer' : 'not-allowed',
          }}
        >
          {'>>'}
        </button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </span>
      </div>
    </div>
  );
} 