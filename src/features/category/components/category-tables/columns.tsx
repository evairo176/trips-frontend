'use client';
import { Product } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { CellAction } from './cell-action';
import { Category } from '@/constants/category';

export const columns: ColumnDef<Category>[] = [
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
    accessorKey: 'mainCategory.title',
    header: 'Main Category'
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
