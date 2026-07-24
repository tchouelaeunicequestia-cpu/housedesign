import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface CreateAssetInput {
  title: string;
  description: string;
  price: number;
  category: 'land' | 'object' | 'tool';
  status?: 'available' | 'pending' | 'sold';
  mediaUrls?: string[];
}

export const useCreateAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateAssetInput) => {
      const response = await api.post('/asset', input);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });
};

export const useDeleteAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/asset/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });
};
