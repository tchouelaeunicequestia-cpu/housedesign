'use client';

import { useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { useCreateProject } from '@/hooks/useCreateProject';

export default function Home() {
  const { data: projects, isLoading, isError, error } = useProjects();
  const createProjectMutation = useCreateProject();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    createProjectMutation.mutate(
      { title, description, imageUrl },
      {
        onSuccess: () => {
          setTitle('');
          setDescription('');
          setImageUrl('');
        },
      }
    );
  };

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">House Design Platform</h1>
      <p className="text-gray-600 mb-8">Architectural Projects Showcase & Management</p>

      {/* Create Project Form */}
      <section className="mb-12 bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Add New Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Project title..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Project details..."
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <button
            type="submit"
            disabled={createProjectMutation.isPending}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {createProjectMutation.isPending ? 'Creating...' : 'Create Project'}
          </button>
        </form>
      </section>

      {/* Project List */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Existing Projects</h2>

        {isLoading && <div className="text-blue-600 font-medium">Loading blueprints...</div>}

        {isError && (
          <div className="p-4 bg-red-50 text-red-700 rounded-md">
            Error loading projects: {error.message}
          </div>
        )}

        {projects && projects.length === 0 && (
          <p className="text-gray-500">No projects found in the database yet.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects?.map((project: any) => (
            <div key={project.id} className="border p-5 rounded-lg shadow-sm bg-white">
              <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{project.description}</p>
              {project.imageUrl && (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-48 object-cover rounded-md mb-2"
                />
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}