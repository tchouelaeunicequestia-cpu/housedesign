'use client';

import { useState } from 'react';
import { useUpdateProject } from '@/hooks/useUpdateProject';
import { useDeleteProject } from '@/hooks/useDeleteProject';
import { toast } from 'sonner';

export default function ProjectCard({ project }: { project: any }) {
  const updateProjectMutation = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(project.title);
  const [editDescription, setEditDescription] = useState(project.description);
  const [editCategory, setEditCategory] = useState(project.category || 'Residential');
  const [editStatus, setEditStatus] = useState(project.status || 'Planning');
  const [editImageFile, setEditImageFile] = useState<File | null>(null);

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle || !editDescription) return;

    const formData = new FormData();
    formData.append('title', editTitle);
    formData.append('description', editDescription);
    formData.append('category', editCategory);
    formData.append('status', editStatus);
    if (editImageFile) {
      formData.append('image', editImageFile);
    }

    updateProjectMutation.mutate(
      { id: project.id, formData },
      {
        onSuccess: () => {
          setIsEditing(false);
          setEditImageFile(null);
          toast.success('Project updated successfully!');
        },
        onError: (err: any) => {
          toast.error(`Failed to update project: ${err.message}`);
        },
      }
    );
  };

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    deleteProjectMutation.mutate(project.id, {
      onSuccess: () => {
        toast.success('Project deleted successfully.');
      },
      onError: (err: any) => {
        toast.error(`Failed to delete project: ${err.message}`);
      },
    });
  };

  const getStatusBadgeColor = (st: string) => {
    switch (st) {
      case 'Completed':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      case 'In-Progress':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      default:
        return 'bg-cyan-950 text-cyan-300 border-cyan-800';
    }
  };

  return (
    <div className="border border-slate-800 p-6 rounded-2xl shadow-xl bg-slate-900 flex flex-col justify-between">
      {isEditing ? (
        <form onSubmit={handleUpdateSubmit} className="space-y-4 mb-4">
          <h3 className="text-xl font-bold text-cyan-400">Edit Project</h3>
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Title</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-base text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Category</label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-base text-white"
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Industrial">Industrial</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Status</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-base text-white"
              >
                <option value="Planning">Planning</option>
                <option value="In-Progress">In-Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Description</label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              required
              rows={3}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-base text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">New Image (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEditImageFile(e.target.files?.[0] || null)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-300"
            />
          </div>
          <div className="flex space-x-3 pt-2">
            <button
              type="submit"
              disabled={updateProjectMutation.isPending}
              className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-50 shadow-md"
            >
              {updateProjectMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-slate-800 text-slate-300 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-700 border border-slate-700"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className="flex justify-between items-start mb-3 gap-2">
            <h3 className="text-xl font-bold text-white leading-snug">{project.title}</h3>
            <div className="flex gap-2 shrink-0">
              <span className="bg-slate-950 text-cyan-400 border border-cyan-900 text-xs px-2.5 py-1 rounded-full font-bold">
                {project.category || 'Residential'}
              </span>
              <span className={`border text-xs px-2.5 py-1 rounded-full font-bold ${getStatusBadgeColor(project.status)}`}>
                {project.status || 'Planning'}
              </span>
            </div>
          </div>
          <p className="text-slate-300 text-base leading-relaxed mb-5">{project.description}</p>
          {project.imageUrl && (
            <img
              src={
                project.imageUrl.startsWith('http')
                  ? project.imageUrl
                  : `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000').replace(/\/api$/, '')}${project.imageUrl.startsWith('/') ? project.imageUrl : `/${project.imageUrl}`}`
              }
              alt={project.title}
              className="w-full h-52 object-cover rounded-xl mb-5 border border-slate-800"
            />
          )}
        </div>
      )}

      {!isEditing && (
        <div className="flex justify-end space-x-3 mt-auto pt-4 border-t border-slate-800">
          <button
            onClick={() => setIsEditing(true)}
            className="bg-cyan-950 text-cyan-300 border border-cyan-800 px-4 py-2 rounded-xl text-sm font-bold hover:bg-cyan-900 transition-colors shadow-sm"
          >
            Edit Project
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteProjectMutation.isPending}
            className="bg-red-950 text-red-300 border border-red-800 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-900 transition-colors shadow-sm disabled:opacity-50"
          >
            {deleteProjectMutation.isPending ? 'Deleting...' : 'Delete Project'}
          </button>
        </div>
      )}
    </div>
  );
}