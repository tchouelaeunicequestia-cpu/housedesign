import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string | number) => {
      const response = await api.delete(`/project/${id}`);
      return response.data;
    },
    onSuccess: () => {
      // Refresh the project list immediately after deletion
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};