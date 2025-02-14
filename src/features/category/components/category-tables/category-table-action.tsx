'use client';

import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { useCategoryTableFilters } from './use-category-table-filters';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { CATEGORY_OPTIONS } from '@/features/products/components/product-tables/use-product-table-filters';
import { MainCategory } from '@/constants/main-category';

type CategoryTableActionProps = {
  mainCategory: {
    optionData: {
      label: string;
      value: string;
    }[];
  };
};
export default function CategoryTableAction({
  mainCategory
}: CategoryTableActionProps) {
  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
    mainCategoryFilter,
    setMainCategoryFilter
  } = useCategoryTableFilters();

  return (
    <div className='flex flex-wrap items-center gap-4'>
      <DataTableSearch
        searchKey='title'
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      />
      <DataTableFilterBox
        filterKey='mainCategory'
        title='Categories'
        options={mainCategory.optionData}
        setFilterValue={setMainCategoryFilter}
        filterValue={mainCategoryFilter}
      />
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
