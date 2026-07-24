import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Asset {
  id: string;
  title: string;
  description: string;
  price: number;
  category: 'land' | 'object' | 'tool';
  status: 'available' | 'pending' | 'sold';
  mediaUrls?: string[];
  documentUrls?: string[];
  createdAt: string;
}

export const useAssets = () => {
  const { data, isLoading, error, refetch } = useQuery<Asset[]>({
    queryKey: ['assets'],
    queryFn: async () => {
      const response = await api.get('/asset');
      return response.data;
    },
  });

  return {
    data,
    isLoading,
    isError: error,
    mutate: refetch, // Aliased to match the admin dashboard's mutate() call
  };
};