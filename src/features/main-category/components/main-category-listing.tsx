'use client';

import { useSearchParams } from 'next/navigation';
import { Product } from '@/constants/data';
import { DataTable as ProductTable } from '@/components/ui/table/data-table';
import { columns } from './main-category-tables/columns';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { useGetMainCategory } from '@/api/main-category';
import { Separator } from '@/components/ui/separator';
import MainCategoryTableAction from './main-category-tables/main-category-table-action';
import { Heading } from '@/components/ui/heading';
import { MainCategoryAddModal } from './main-category-tables/main-category-add-modal';
import { MainCategory } from '@/constants/main-category';
import { useMemo, useState } from 'react';

export default function MainCategoryListingPage() {
  const [editOpen, setEditOpen] = useState(false);
  const searchParams = useSearchParams(); // Gunakan useSearchParams
  const page = searchParams.get('page');
  const search = searchParams.get('q');
  const pageLimit = searchParams.get('limit');

  const filters = useMemo(
    () => ({
      page: Number(page),
      limit: Number(pageLimit),
      ...(search && { search })
    }),
    [page, pageLimit, search]
  );
  const { maincategorys, meta, maincategorysLoading } =
    useGetMainCategory(filters);

  const totalProducts = meta?.total || 0;
  const products: MainCategory[] = maincategorys || [];

  return (
    <>
      <div className='flex items-start justify-between'>
        <Heading
          title='Main Category'
          description='Manage main categorys (Server side table functionalities.)'
        />
        <MainCategoryAddModal
          open={editOpen}
          setOpen={setEditOpen}
          title='Tambah Main Category'
          editId='new'
        />
      </div>
      <Separator />
      <MainCategoryTableAction />
      {maincategorysLoading && (
        <DataTableSkeleton columnCount={5} rowCount={10} />
      )}
      {!maincategorysLoading && (
        <ProductTable
          columns={columns}
          data={products}
          totalItems={totalProducts}
        />
      )}
    </>
  );
}
