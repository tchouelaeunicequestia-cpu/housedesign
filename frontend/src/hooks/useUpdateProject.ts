import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, formData }: { id: string | number; formData: FormData }) => {
      const response = await api.put(`/project/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      // Automatically refresh the project list after a successful update
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};