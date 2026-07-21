'use client';

import { useProjects } from '@/hooks/useProjects';

export default function Home() {
  const { data: projects, isLoading, isError, error } = useProjects();

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">House Design Platform</h1>
      <p className="text-gray-600 mb-8">Architectural Projects Showcase</p>

      {isLoading && (
        <div className="text-blue-600 font-medium">Loading blueprints and renders...</div>
      )}

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
            <h2 className="text-xl font-semibold mb-2">{project.title || project.name}</h2>
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
    </main>
  );
}