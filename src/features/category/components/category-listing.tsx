'use client';

import { useSearchParams } from 'next/navigation';
import { Product } from '@/constants/data';
import { DataTable as ProductTable } from '@/components/ui/table/data-table';
import { columns } from './category-tables/columns';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

import { Separator } from '@/components/ui/separator';
import CategoryTableAction from './category-tables/category-table-action';
import { Heading } from '@/components/ui/heading';
import { CategoryAddModal } from './category-tables/category-add-modal';

import { useMemo, useState } from 'react';
import { useGetCategory } from '@/api/category';
import { Category } from '@/constants/category';
import { useGetMainCategoryNoFilter } from '@/api/main-category';
import { MainCategory } from '@/constants/main-category';

export default function CategoryListingPage() {
  const [editOpen, setEditOpen] = useState(false);
  const searchParams = useSearchParams(); // Gunakan useSearchParams
  const page = searchParams.get('page');
  const search = searchParams.get('q');
  const pageLimit = searchParams.get('limit');
  const mainCategoryQuery = searchParams.get('main-category');
  console.log({ mainCategoryQuery });
  const filters = useMemo(
    () => ({
      page: Number(page),
      limit: Number(pageLimit),
      ...(search && { search }),
      ...(mainCategoryQuery && { mainCategory: mainCategoryQuery })
    }),
    [page, pageLimit, search, mainCategoryQuery]
  );

  const { categorys, meta, categorysLoading } = useGetCategory(filters);
  const { maincategorys } = useGetMainCategoryNoFilter();

  const totalProducts = meta?.total || 0;
  const products: Category[] = categorys || [];
  const mainCategory: MainCategory[] = maincategorys || [];

  return (
    <>
      <div className='flex items-start justify-between'>
        <Heading
          title='Category'
          description='Manage main categorys (Server side table functionalities.)'
        />
        <CategoryAddModal
          open={editOpen}
          setOpen={setEditOpen}
          title='Tambah Category'
          editId='new'
        />
      </div>
      <Separator />
      <CategoryTableAction
        mainCategory={{
          optionData: mainCategory?.map((row) => {
            return {
              label: row.title,
              value: row.id
            };
          })
        }}
      />
      {categorysLoading && <DataTableSkeleton columnCount={5} rowCount={10} />}
      {!categorysLoading && (
        <ProductTable
          columns={columns}
          data={products}
          totalItems={totalProducts}
        />
      )}
    </>
  );
}
