import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      let imageUrl = '';
      const imageFile = formData.get('image') as File | null;

      if (imageFile && imageFile instanceof File && imageFile.size > 0) {
        const uploadData = new FormData();
        uploadData.append('file', imageFile);

        const uploadRes = await api.post('/media/upload-single', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        imageUrl = uploadRes.data?.url || uploadRes.data?.fileUrl || uploadRes.data?.path || '';
      }

      let videoUrl = '';
      const videoFile = formData.get('video') as File | null;

      if (videoFile && videoFile instanceof File && videoFile.size > 0) {
        const uploadData = new FormData();
        uploadData.append('file', videoFile);

        const uploadRes = await api.post('/media/upload-single', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        videoUrl = uploadRes.data?.url || uploadRes.data?.fileUrl || uploadRes.data?.path || '';
      }

      const payload = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as string,
        status: formData.get('status') as string,
        ...(imageUrl ? { imageUrl } : {}),
        ...(videoUrl ? { videoUrl } : {}),
      };

      const response = await api.post('/project', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};