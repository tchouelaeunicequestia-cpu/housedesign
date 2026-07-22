'use client';

import { useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import StatsBanner from '@/components/StatsBanner';
import ProjectForm from '@/components/ProjectForm';
import ProjectCard from '@/components/ProjectCard';
import Link from 'next/link';

export default function AdminPage() {
  const { data: projects, isLoading, isError, error } = useProjects();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const filteredProjects = projects?.filter((project: any) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || project.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalCount = projects?.length || 0;
  const planningCount = projects?.filter((p: any) => (p.status || 'Planning') === 'Planning').length || 0;
  const inProgressCount = projects?.filter((p: any) => p.status === 'In-Progress').length || 0;
  const completedCount = projects?.filter((p: any) => p.status === 'Completed').length || 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <div>
        <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10 shadow-md">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="House Design Logo"
                className="h-10 w-auto object-contain"
              />
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white">House Design</h1>
                <p className="text-[10px] text-cyan-400 font-semibold tracking-widest uppercase">
                  — la maison c'est nous —
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                View Public Portfolio
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-10">
          <div className="mb-8">
            <span className="text-cyan-400 text-xs uppercase tracking-widest font-bold bg-cyan-950/60 border border-cyan-800/50 px-3 py-1 rounded-full">
              Admin Control Panel
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-3">Civil Engineering Dashboard</h2>
            <p className="text-slate-400 text-sm mt-1">Manage architectural records, project statuses, and structural deployments.</p>
          </div>

          <StatsBanner
            total={totalCount}
            planning={planningCount}
            inProgress={inProgressCount}
            completed={completedCount}
          />

          <div className="my-8">
            <ProjectForm />
          </div>

          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h3 className="text-2xl font-bold text-white">Existing Projects</h3>

              <div className="flex flex-wrap gap-3 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 flex-grow md:w-64"
                />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="All">All Categories</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Industrial">Industrial</option>
                </select>
              </div>
            </div>

            {isLoading && <div className="text-cyan-400 font-medium py-8 text-center">Loading blueprints...</div>}

            {isError && (
              <div className="p-4 bg-red-950/60 text-red-300 rounded-lg border border-red-800/50">
                Error loading projects: {error?.message}
              </div>
            )}

            {filteredProjects && filteredProjects.length === 0 && (
              <p className="text-slate-400 text-center py-12">No projects found matching your criteria.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {filteredProjects?.map((project: any) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>
        </main>
      </div>

      <footer className="bg-slate-900 border-t border-slate-800 mt-20 py-8 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} House Design. — la maison c'est nous —. All rights reserved.</p>
      </footer>
    </div>
  );
}