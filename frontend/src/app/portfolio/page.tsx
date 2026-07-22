'use client';

import { useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import Link from 'next/link';

export default function PortfolioPage() {
  const { data: projects, isLoading, isError } = useProjects();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const filteredProjects = projects?.filter((project: any) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || project.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadgeColor = (st: string) => {
    switch (st) {
      case 'Completed':
        return 'bg-emerald-950 text-emerald-400 border-emerald-800/50';
      case 'In-Progress':
        return 'bg-amber-950 text-amber-400 border-amber-800/50';
      default:
        return 'bg-cyan-950 text-cyan-400 border-cyan-800/50';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <div>
        {/* Navigation Header */}
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
                Home
              </Link>
              <Link
                href="/login"
                className="text-xs font-medium text-white bg-red-600 hover:bg-red-700 px-3.5 py-2 rounded-lg transition-colors shadow-sm"
              >
                Engineer Login
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-slate-900 text-white py-16 px-6 text-center border-b border-slate-800">
          <div className="max-w-3xl mx-auto">
            <span className="text-cyan-400 text-xs uppercase tracking-widest font-bold bg-cyan-950/60 border border-cyan-800/50 px-3 py-1 rounded-full">
              Complete Works
            </span>
            <h2 className="text-4xl font-extrabold mt-4 mb-3 text-white">Engineering Archive</h2>
            <p className="text-slate-400 text-base">
              Explore our comprehensive gallery of architectural blueprints and structural implementations.
            </p>
          </div>
        </section>

        {/* Main Content & Filter Section */}
        <main className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h3 className="text-2xl font-bold text-white">All Projects</h3>

            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search archive..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 flex-grow md:w-64"
              />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="All">All Categories</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Industrial">Industrial</option>
              </select>
            </div>
          </div>

          {isLoading && (
            <div className="text-cyan-400 font-medium py-12 text-center">Loading portfolio archive...</div>
          )}

          {isError && (
            <div className="p-4 bg-red-950/60 text-red-300 rounded-lg border border-red-800/50">
              Unable to load portfolio items at this time.
            </div>
          )}

          {filteredProjects && filteredProjects.length === 0 && (
            <div className="text-center py-16 bg-slate-900 rounded-xl border border-slate-800 shadow-sm">
              <p className="text-slate-400 text-lg">No matching records found.</p>
            </div>
          )}

          {/* Grid Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects?.map((project: any) => (
              <div
                key={project.id}
                className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden flex flex-col hover:border-slate-700 transition-all"
              >
                {project.imageUrl && (
                  <img
                    src={
                      project.imageUrl.startsWith('http')
                        ? project.imageUrl
                        : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${project.imageUrl}`
                    }
                    alt={project.title}
                    className="w-full h-52 object-cover"
                  />
                )}
                <div className="p-5 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3 gap-2">
                      <h4 className="text-lg font-bold text-white">{project.title}</h4>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <span className="bg-slate-950 text-cyan-400 border border-cyan-900/50 text-xs px-2.5 py-0.5 rounded-full font-medium">
                        {project.category || 'Residential'}
                      </span>
                      <span
                        className={`border text-xs px-2.5 py-0.5 rounded-full font-medium ${getStatusBadgeColor(
                          project.status
                        )}`}
                      >
                        {project.status || 'Planning'}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">{project.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 mt-20 py-8 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} House Design. — la maison c'est nous —. All rights reserved.</p>
      </footer>
    </div>
  );
}