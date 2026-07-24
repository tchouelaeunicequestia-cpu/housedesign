'use client';

import { FolderKanban, Clock, CheckCircle2, Layers } from 'lucide-react';

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

interface StatsBannerProps {
  projects: Project[];
}

export default function StatsBanner({ projects }: StatsBannerProps) {
  const total = projects.length;
  const planning = projects.filter((p) => p.status === 'Planning').length;
  const inProgress = projects.filter((p) => p.status === 'In-Progress').length;
  const completed = projects.filter((p) => p.status === 'Completed').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg flex items-center gap-4">
        <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-lg">
          <FolderKanban className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">Total Projects</p>
          <h4 className="text-2xl font-bold text-white">{total}</h4>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg flex items-center gap-4">
        <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">Planning</p>
          <h4 className="text-2xl font-bold text-white">{planning}</h4>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg flex items-center gap-4">
        <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
          <Layers className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">In-Progress</p>
          <h4 className="text-2xl font-bold text-white">{inProgress}</h4>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg flex items-center gap-4">
        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">Completed</p>
          <h4 className="text-2xl font-bold text-white">{completed}</h4>
        </div>
      </div>
    </div>
  );
}