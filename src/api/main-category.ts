import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';
import { fetcher, fetcherDelete, fetcherPost, fetcherPut } from '@/lib/axios';

export function useGetMainCategoryNoFilter() {
  const key = `/main-category`; // Key untuk SWR

  const { data, isLoading, error, isValidating } = useSWR(
    key, // Gunakan query params dalam endpoint
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  const memoizedValue = useMemo(
    () => ({
      maincategorys: data?.data,
      meta: data?.meta,
      maincategorysLoading: isLoading,
      maincategorysError: error,
      maincategorysValidating: isValidating,
      maincategorysEmpty: !isLoading && (!data?.data || data?.data.length === 0)
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetMainCategory(filters: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const queryParams = new URLSearchParams({
    ...(filters.page && { page: String(filters.page) }),
    ...(filters.limit && { limit: String(filters.limit) }),
    ...(filters.search && { search: filters.search })
  }).toString();
  const key = `/main-category${queryParams ? '?' + queryParams : ''}`; // Key untuk SWR

  const { data, isLoading, error, isValidating } = useSWR(
    key, // Gunakan query params dalam endpoint
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  const memoizedValue = useMemo(
    () => ({
      maincategorys: data?.data,
      meta: data?.meta,
      maincategorysLoading: isLoading,
      maincategorysError: error,
      maincategorysValidating: isValidating,
      maincategorysEmpty: !isLoading && (!data?.data || data?.data.length === 0)
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function insertMainCategory(newMainCategory: {
  title: string;
  description?: string;
  companyId: string;
}) {
  const response = await fetcherPost('/main-category', newMainCategory);

  mutate('/main-category');

  return response;
}

export async function updateMainCategory(
  newMainCategory: {
    title: string;
    description?: string;
  },
  id: string
) {
  const response = await fetcherPut(`/main-category/${id}`, newMainCategory);
  // 🔄 Refresh data di SWR setelah insert berhasil

  mutate('/main-category');

  return response;
}

export async function deleteMainCategory(id: string) {
  const response = await fetcherDelete(`/main-category/${id}`);
  // 🔄 Refresh data di SWR setelah insert berhasil

  mutate('/main-category');

  return response;
}
