import useSWR from 'swr';
import axios from '@/lib/api/axios-client';

export const useProvinces = (search: string = '') => {
  const { data, error, isLoading } = useSWR(`/api/ekuid/list/provinces${search ? `?search=${search}` : ''}`, async (url) => {
    const res = await axios.get(url);
    return res.data;
  });

  return {
    provinces: data,
    isLoading,
    error,
  };
};
