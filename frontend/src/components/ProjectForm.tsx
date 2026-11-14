'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Upload, Video, PlusCircle, Edit3, Loader2 } from 'lucide-react';
import { getTranslator } from '@/lib/translations';
import api from '@/lib/api';

interface ProjectFormProps {
  editingProject?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ProjectForm({ editingProject, onSuccess, onCancel }: ProjectFormProps) {
  const t = getTranslator('ProjectForm');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Residential',
    status: 'Planning',
    imageUrl: '',
    videoUrl: '',
  });

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingProject) {
      setFormData({
        title: editingProject.title || '',
        description: editingProject.description || '',
        category: editingProject.category || 'Residential',
        status: editingProject.status || 'Planning',
        imageUrl: editingProject.imageUrl || '',
        videoUrl: editingProject.videoUrl || '',
      });
    }
  }, [editingProject]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);

    const setter = type === 'image' ? setIsUploadingImage : setIsUploadingVideo;
    setter(true);

    try {
      const response = await api.post('/media/upload-single', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const fileUrl = response.data.url || response.data.filePath || response.data.path;

      setFormData((prev) => ({
        ...prev,
        [type === 'image' ? 'imageUrl' : 'videoUrl']: fileUrl,
      }));

      toast.success(`${type === 'image' ? 'Image' : 'Video'} uploaded successfully!`);
    } catch (error) {
      toast.error(`Failed to upload ${type}. Please verify access.`);
    } finally {
      setter(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingProject?.id) {
        await api.put(`/project/${editingProject.id}`, formData);
        toast.success('Project updated successfully!');
      } else {
        await api.post('/project', formData);
        toast.success(t('success'));
        setFormData({
          title: '',
          description: '',
          category: 'Residential',
          status: 'Planning',
          imageUrl: '',
          videoUrl: '',
        });
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error(t('error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {editingProject ? (
            <Edit3 className="w-5 h-5 text-cyan-400" />
          ) : (
            <PlusCircle className="w-5 h-5 text-cyan-400" />
          )}
          <h3 className="text-xl font-bold text-white">
            {editingProject ? 'Edit Project Record' : t('heading')}
          </h3>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded-lg cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">{t('titleLabel')} *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder={t('titlePlaceholder')}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">{t('categoryLabel')}</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>
              <option value="Infrastructure">Infrastructure</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">{t('statusLabel')}</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="Planning">Planning</option>
              <option value="In-Progress">In-Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">{t('imageLabel')}</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="/uploads/image.jpg"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1 text-cyan-400 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploadingImage ? '...' : 'File'}</span>
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">{t('videoLabel')}</label>
          <div className="flex gap-2">
            <input
              type="text"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              placeholder="/uploads/walkthrough.mp4 or external link"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1 text-cyan-400 transition-colors">
              <Video className="w-3.5 h-3.5" />
              <span>{isUploadingVideo ? '...' : 'Video'}</span>
              <input type="file" accept="video/*" onChange={(e) => handleFileUpload(e, 'video')} className="hidden" />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">{t('descriptionLabel')} *</label>
          <textarea
            name="description"
            required
            rows={3}
            value={formData.description}
            onChange={handleChange}
            placeholder={t('descriptionPlaceholder')}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-600 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t('submitting')}</span>
            </>
          ) : (
            <span>{editingProject ? 'Update Project Record' : t('submitBtn')}</span>
          )}
        </button>
      </form>
    </div>
  );
}