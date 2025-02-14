'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useEffect, useMemo } from 'react';

export function useCategoryTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    searchParams.q
      .withOptions({ shallow: true }) // shallow: true untuk menghindari re-render tidak perlu
      .withDefault('')
  );

  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1).withOptions({ shallow: true }) // shallow: true untuk menghindari re-render tidak perlu
  );

  const [mainCategoryFilter, setMainCategoryFilter] = useQueryState(
    'main-category',
    searchParams.mainCategory.withOptions({ shallow: false }).withDefault('')
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setMainCategoryFilter(null);
    setPage(1);
  }, [setSearchQuery, setPage, setMainCategoryFilter]);

  const isAnyFilterActive = useMemo(
    () => !!searchQuery || !!mainCategoryFilter,
    [searchQuery, mainCategoryFilter]
  );

  return {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    mainCategoryFilter,
    setMainCategoryFilter
  };
}
