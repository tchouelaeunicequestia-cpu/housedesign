// src/hooks/useProjects.ts
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api'; // Points to your src/lib/api.ts file

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      // Remember your backend endpoint path is singular: '/project'
      const response = await api.get('/project');
      return response.data;
    },
  });
};