'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Trash2, ExternalLink, Video, Image as ImageIcon } from 'lucide-react';

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
}

export default function ProjectCard({ project, onUpdate }: ProjectCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${project.title}"?`)) return;

    setIsDeleting(true);
    const token = localStorage.getItem('access_token');

    try {
      const response = await fetch(`http://localhost:3000/api/project/${project.id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) throw new Error('Failed to delete project');

      toast.success('Project deleted successfully');
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error('Error deleting project record.');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'In-Progress':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between gap-4">
      <div className="space-y-3">
        <div className="flex justify-between items-start gap-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded">
              {project.category}
            </span>
            <h3 className="text-lg font-bold text-white mt-1.5">{project.title}</h3>
          </div>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${getStatusBadge(project.status)}`}>
            {project.status}
          </span>
        </div>

        <p className="text-sm text-slate-300 line-clamp-2">{project.description}</p>
      </div>

      <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {project.imageUrl && (
            <a
              href={project.imageUrl.startsWith('http') ? project.imageUrl : `http://localhost:3000${project.imageUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1 transition-colors"
              title="View Image"
            >
              <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>Image</span>
            </a>
          )}
          {project.videoUrl && (
            <a
              href={project.videoUrl.startsWith('http') ? project.videoUrl : `http://localhost:3000${project.videoUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1 transition-colors"
              title="View Video Walkthrough"
            >
              <Video className="w-3.5 h-3.5 text-red-400" />
              <span>Video</span>
            </a>
          )}
        </div>

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-600/20 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          title="Delete Project"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}