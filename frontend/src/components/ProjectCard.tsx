'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Trash2, Edit, Video, Image as ImageIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import api from '@/lib/api';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'Planning' | 'In-Progress' | 'Completed';
  imageUrl?: string;
  videoUrl?: string;
  createdAt: string;
}

interface ProjectCardProps {
  project: Project;
  onUpdate?: () => void;
  onEdit?: (project: Project) => void;
}

export default function ProjectCard({ project, onUpdate, onEdit }: ProjectCardProps) {
  const t = useTranslations('ProjectCard');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(t('confirmDelete', { title: project.title }))) return;

    setIsDeleting(true);

    try {
      await api.delete(`/project/${project.id}`);
      toast.success(t('deleteSuccess'));
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error(t('deleteError'));
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
      case 'In-Progress':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      default:
        return 'bg-amber-500/10 text-amber-700 border-amber-500/20';
    }
  };

  const getMediaUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000').replace(/\/api$/, '');
    return `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-lg flex flex-col justify-between gap-4">
      <div className="space-y-3">
        <div className="flex justify-between items-start gap-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200/40 px-2 py-0.5 rounded">
              {project.category}
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1.5">{project.title}</h3>
          </div>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${getStatusBadge(project.status)}`}>
            {project.status}
          </span>
        </div>

        <p className="text-sm text-slate-700 line-clamp-2">{project.description}</p>
      </div>

      <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {project.imageUrl && (
            <a
              href={getMediaUrl(project.imageUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs flex items-center gap-1 transition-colors"
              title={t('viewImage')}
            >
              <ImageIcon className="w-3.5 h-3.5 text-blue-700" />
              <span>{t('viewImage')}</span>
            </a>
          )}
          {project.videoUrl && (
            <a
              href={getMediaUrl(project.videoUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs flex items-center gap-1 transition-colors"
              title={t('viewVideo')}
            >
              <Video className="w-3.5 h-3.5 text-red-600" />
              <span>{t('viewVideo')}</span>
            </a>
          )}
        </div>

        <div className="flex items-center gap-1">
          {onEdit && (
            <button
              onClick={() => onEdit(project)}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-blue-700 border border-slate-300 rounded-lg transition-colors cursor-pointer"
              title={t('editProject')}
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 bg-red-600/10 hover:bg-red-600/20 text-red-600 border border-red-600/20 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            title={t('deleteProject')}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}