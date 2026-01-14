import useSWR from 'swr';
import axios from '@/lib/api/axios-client';

export const useIndustryCategories = () => {
  const { data, error, isLoading } = useSWR('/api/ekuid/list/industry-categories', async (url) => {
    const res = await axios.get(url);
    return res.data;
  });

  return {
    categories: data,
    isLoading,
    error,
  };
};
