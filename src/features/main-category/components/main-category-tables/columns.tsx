'use client';
import { Product } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { CellAction } from './cell-action';
import { MainCategory } from '@/constants/main-category';

export const columns: ColumnDef<MainCategory>[] = [
  {
    id: 'no',
    header: 'No',
    cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination.pageIndex; // Halaman saat ini (dimulai dari 0)
      const pageSize = table.getState().pagination.pageSize; // Jumlah item per halaman
      return pageIndex * pageSize + row.index + 1; // Hitung nomor urut global
    }
  },
  {
    accessorKey: 'title',
    header: 'Nama Kategori'
  },
  {
    accessorKey: 'createdAt',
    header: 'Tanggal Buat'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
