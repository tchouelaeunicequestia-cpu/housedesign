'use client';

import { useState } from 'react';
import { useCreateProject } from '@/hooks/useCreateProject';
import { toast } from 'sonner';

export default function ProjectForm() {
  const createProjectMutation = useCreateProject();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Residential');
  const [status, setStatus] = useState('Planning');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('status', status);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    createProjectMutation.mutate(formData, {
      onSuccess: () => {
        setTitle('');
        setDescription('');
        setCategory('Residential');
        setStatus('Planning');
        setImageFile(null);
        toast.success('Project created successfully!');
      },
      onError: (err: any) => {
        toast.error(`Failed to create project: ${err.message}`);
      },
    });
  };

  return (
    <section className="bg-slate-900 p-6 md:p-8 rounded-2xl shadow-xl border border-slate-800">
      <h3 className="text-2xl font-bold text-white mb-6">Add New Project Blueprint</h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">Project Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-inner"
            placeholder="e.g. Modern Villa Phase II..."
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-base text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-inner"
            >
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-base text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-inner"
            >
              <option value="Planning">Planning</option>
              <option value="In-Progress">In-Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">Project Image File</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-950 file:text-cyan-300 hover:file:bg-cyan-900 shadow-inner"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">Detailed Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-inner"
            placeholder="Enter structural specs, floor counts, and client requirements..."
            rows={4}
          />
        </div>
        <button
          type="submit"
          disabled={createProjectMutation.isPending}
          className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-xl text-base font-bold transition-colors shadow-lg shadow-red-950/50 disabled:opacity-50"
        >
          {createProjectMutation.isPending ? 'Uploading & Creating...' : 'Create Project'}
        </button>
      </form>
    </section>
  );
}