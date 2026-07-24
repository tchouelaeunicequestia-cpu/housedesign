'use client';

import { useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import Link from 'next/link';
import { Search, PlayCircle } from 'lucide-react';

export default function PortfolioPage() {
  const { data: projects, isLoading, isError } = useProjects();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const categories = ['All', 'Structural', 'Commercial', 'Residential', 'Industrial', 'Infrastructure'];

  const filteredProjects = projects?.filter((project: any) => {
    const matchesSearch =
      project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase());
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

  const getMediaUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000').replace(/\/api$/, '');
    return `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans">
      <div>
        {/* Navigation Header */}
        <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-md">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
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
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <Link href="/portfolio" className="text-white font-semibold transition-colors">Portfolio</Link>
              <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
              <Link href="/marketplace" className="hover:text-white transition-colors">Marketplace</Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs font-medium text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                Engineer Login
              </Link>
            </div>
          </div>
        </header>

        {/* Portfolio Hero Header */}
        <section className="bg-gradient-to-b from-slate-900 to-slate-950 text-white py-16 px-6 text-center border-b border-slate-800">
          <div className="max-w-3xl mx-auto">
            <span className="text-cyan-400 text-xs uppercase tracking-widest font-bold bg-cyan-950/60 border border-cyan-800/50 px-3.5 py-1.5 rounded-full inline-block mb-4">
              Executed Projects Portfolio
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-white">
              Engineering Marvels & Architectural Blueprints
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Explore our verified portfolio featuring 25+ years of experience across 15+ premier structural executions with a 98% completion standard.
            </p>
          </div>
        </section>

        {/* Search & Filter Controls */}
        <section className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search projects by title or keyword..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`text-xs px-4 py-2 rounded-lg font-medium transition-colors border ${
                    filterCategory === cat
                      ? 'bg-cyan-600 text-white border-cyan-500 shadow-sm'
                      : 'bg-slate-950 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Project Grid */}
        <main className="max-w-7xl mx-auto px-6 py-6">
          {isLoading && (
            <div className="text-center py-20 text-slate-400 text-sm">
              Loading projects and architectural records...
            </div>
          )}

          {isError && (
            <div className="text-center py-20 text-red-400 text-sm bg-red-950/20 border border-red-900/50 rounded-xl">
              Failed to load project records from backend server. Please verify connection.
            </div>
          )}

          {!isLoading && !isError && filteredProjects?.length === 0 && (
            <div className="text-center py-20 text-slate-400 text-sm bg-slate-900 border border-slate-800 rounded-xl">
              No projects found matching your search or category filter.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects?.map((project: any) => (
              <div
                key={project.id}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                {/* 1. Project Name & Description First */}
                <div className="p-6 flex flex-col flex-grow">
                  <h4 className="text-xl font-bold text-white mb-2">{project.title}</h4>

                  <div className="flex gap-2 mb-4">
                    <span className="bg-slate-950 text-cyan-400 border border-cyan-900/50 text-xs px-2.5 py-0.5 rounded-full font-medium">
                      {project.category || 'Structural'}
                    </span>
                    <span
                      className={`border text-xs px-2.5 py-0.5 rounded-full font-medium ${getStatusBadgeColor(
                        project.status
                      )}`}
                    >
                      {project.status || 'Planning'}
                    </span>
                  </div>

                  <p className="text-slate-400 text-sm leading-relaxed">{project.description}</p>
                </div>

                <div>
                  {/* 2. Image */}
                  {project.imageUrl && (
                    <div className="relative h-48 w-full bg-slate-950 overflow-hidden border-t border-slate-800">
                      <img
                        src={getMediaUrl(project.imageUrl)}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* 3. Video */}
                  {project.videoUrl && (
                    <div className="p-4 bg-slate-950/90 border-t border-slate-800">
                      <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                        <PlayCircle className="w-4 h-4" /> Project Video Walkthrough
                      </div>
                      <video
                        controls
                        className="w-full h-40 rounded-lg bg-black object-cover border border-slate-800"
                        src={getMediaUrl(project.videoUrl)}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </div>

                <div className="px-6 py-3 border-t border-slate-800/50 flex justify-between items-center text-xs text-slate-500 bg-slate-900">
                  <span>ID: #{project.id}</span>
                  <span className="text-cyan-400 font-medium">Verified Execution</span>
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