import useSWR from 'swr';
import { useMemo } from 'react';
import { fetcher } from '@/lib/axios';

export function useGetTripsNoFilter() {
  const key = `/trips`; // Key untuk SWR

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
      trips: data?.data,
      meta: data?.meta,
      tripsLoading: isLoading,
      tripsError: error,
      tripsValidating: isValidating,
      tripsEmpty: !isLoading && (!data?.data || data?.data.length === 0)
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetTrips(filters: {
  min_time?: string;
  max_time?: string;
  min_fare?: string;
  max_fare?: string;
  payment_type?: string;
}) {
  const queryParams = new URLSearchParams({
    ...(filters.min_time && { min_time: filters.min_time }),
    ...(filters.max_time && { max_time: filters.max_time }),
    ...(filters.min_fare && { min_fare: filters.min_fare }),
    ...(filters.max_fare && { max_fare: filters.max_fare }),
    ...(filters.payment_type && { payment_type: filters.payment_type })
  }).toString();
  const key = `/trips${queryParams ? '?' + queryParams : ''}`; // Key untuk SWR

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
      trips: data?.data,
      meta: data?.meta,
      tripsLoading: isLoading,
      tripsError: error,
      tripsValidating: isValidating,
      tripsEmpty: !isLoading && (!data?.data || data?.data.length === 0)
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
