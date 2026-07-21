import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProject: { title: string; description: string; imageUrl?: string }) => {
      const response = await api.post('/project', newProject);
      return response.data;
    },
    onSuccess: () => {
      // Automatically refetch the projects list when a new project is created successfully
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};