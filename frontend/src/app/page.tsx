'use client';

import { useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { useCreateProject } from '@/hooks/useCreateProject';
import { useDeleteProject } from '@/hooks/useDeleteProject';
import { useUpdateProject } from '@/hooks/useUpdateProject';
import { toast } from 'sonner';

export default function Home() {
  const { data: projects, isLoading, isError, error } = useProjects();
  const createProjectMutation = useCreateProject();
  const deleteProjectMutation = useDeleteProject();
  const updateProjectMutation = useUpdateProject();

  // Create form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Residential');
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Edit form state
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState('Residential');
  const [editImageFile, setEditImageFile] = useState<File | null>(null);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    createProjectMutation.mutate(formData, {
      onSuccess: () => {
        setTitle('');
        setDescription('');
        setCategory('Residential');
        setImageFile(null);
        toast.success('Project created successfully!');
      },
      onError: (err: any) => {
        toast.error(`Failed to create project: ${err.message}`);
      },
    });
  };

  const startEditing = (project: any) => {
    setEditingId(project.id);
    setEditTitle(project.title);
    setEditDescription(project.description);
    setEditCategory(project.category || 'Residential');
    setEditImageFile(null);
  };

  const handleUpdateSubmit = (e: React.FormEvent, id: string | number) => {
    e.preventDefault();
    if (!editTitle || !editDescription) return;

    const formData = new FormData();
    formData.append('title', editTitle);
    formData.append('description', editDescription);
    formData.append('category', editCategory);
    if (editImageFile) {
      formData.append('image', editImageFile);
    }

    updateProjectMutation.mutate(
      { id, formData },
      {
        onSuccess: () => {
          setEditingId(null);
          setEditTitle('');
          setEditDescription('');
          setEditCategory('Residential');
          setEditImageFile(null);
          toast.success('Project updated successfully!');
        },
        onError: (err: any) => {
          toast.error(`Failed to update project: ${err.message}`);
        },
      }
    );
  };

  const handleDelete = (id: string | number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    deleteProjectMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Project deleted successfully.');
      },
      onError: (err: any) => {
        toast.error(`Failed to delete project: ${err.message}`);
      },
    });
  };

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">House Design Platform</h1>
      <p className="text-gray-600 mb-8">Architectural Projects Showcase & Management</p>

      {/* Create Project Form */}
      <section className="mb-12 bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Add New Project</h2>
        <form onSubmit={handleCreateSubmit} className="space-y-4">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Industrial">Industrial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none bg-gray-50 text-gray-700"
              />
            </div>
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
          <button
            type="submit"
            disabled={createProjectMutation.isPending}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {createProjectMutation.isPending ? 'Uploading & Creating...' : 'Create Project'}
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
          {projects?.map((project: any) => {
            const isEditing = editingId === project.id;

            return (
              <div key={project.id} className="border p-5 rounded-lg shadow-sm bg-white flex flex-col justify-between">
                {isEditing ? (
                  /* Edit Form */
                  <form onSubmit={(e) => handleUpdateSubmit(e, project.id)} className="space-y-3 mb-4">
                    <h3 className="text-lg font-semibold text-blue-600">Edit Project</h3>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        required
                        className="w-full border rounded-md px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="w-full border rounded-md px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Industrial">Industrial</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        required
                        rows={2}
                        className="w-full border rounded-md px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">New Image (Optional)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setEditImageFile(e.target.files?.[0] || null)}
                        className="w-full border rounded-md px-2.5 py-1.5 text-xs bg-gray-50 text-gray-700"
                      />
                    </div>
                    <div className="flex space-x-2 pt-1">
                      <button
                        type="submit"
                        disabled={updateProjectMutation.isPending}
                        className="bg-green-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-green-700 disabled:opacity-50"
                      >
                        {updateProjectMutation.isPending ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Normal View */
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold">{project.title}</h3>
                      <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2.5 py-0.5 rounded-full font-medium">
                        {project.category || 'Residential'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                    {project.imageUrl && (
                      <img
                        src={
                          project.imageUrl.startsWith('http')
                            ? project.imageUrl
                            : `${process.env.NEXT_PUBLIC_API_URL}${project.imageUrl}`
                        }
                        alt={project.title}
                        className="w-full h-48 object-cover rounded-md mb-4"
                      />
                    )}
                  </div>
                )}

                {!isEditing && (
                  <div className="flex justify-end space-x-2 mt-auto pt-2 border-t">
                    <button
                      onClick={() => startEditing(project)}
                      className="bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-blue-100 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      disabled={deleteProjectMutation.isPending}
                      className="bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      {deleteProjectMutation.isPending ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}