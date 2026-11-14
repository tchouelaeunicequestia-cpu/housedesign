'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { getTranslator } from '@/lib/translations';
import { LogOut, LayoutDashboard, Search, Filter, ShoppingBag, User, Calendar, FolderKanban } from 'lucide-react';
import GoogleTranslate from '@/components/GoogleTranslate';
import ProjectForm from '@/components/ProjectForm';
import ProjectCard from '@/components/ProjectCard';
import StatsBanner from '@/components/StatsBanner';
import AppointmentsList from '@/components/AppointmentsList';
import api from '@/lib/api';

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

export default function AdminDashboard() {
  const t = getTranslator('AdminPage');
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'projects' | 'appointments'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Project Edit Modal State
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchProjects();
  }, [router]);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/project');
      setProjects(response.data);
    } catch (error) {
      toast.error(t('errors.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_info');
    toast.success(t('logoutSuccess'));
    router.push('/login');
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Bar */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-600/10 border border-red-600/20 rounded-xl text-red-500">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">{t('title')}</h1>
              <p className="text-sm text-slate-400">{t('subtitle')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end flex-wrap">
            <GoogleTranslate />
            <Link
              href="/admin/profile"
              className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 rounded-xl text-sm font-medium text-white transition-colors shadow-sm"
            >
              <User className="w-4 h-4 text-white" />
              <span>{t('actions.manageProfile')}</span>
            </Link>
            <Link
              href="/admin/marketplace"
              className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 rounded-xl text-sm font-medium text-white transition-colors shadow-sm"
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              <span>{t('actions.manageMarketplace')}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-sm font-medium text-slate-200 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span>{t('actions.signOut')}</span>
            </button>
          </div>
        </header>

        {/* Statistics Banner */}
        <StatsBanner projects={projects} />

        {/* Dashboard Navigation Tabs */}
        <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1.5 w-fit gap-2">
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>{t('tabs.projects')}</span>
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
              activeTab === 'appointments'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{t('tabs.appointments')}</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'appointments' ? (
          <AppointmentsList />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Project Creation / Edit Form */}
            <div className="lg:col-span-1">
              <ProjectForm
                editingProject={editingProject}
                onSuccess={() => {
                  setEditingProject(null);
                  fetchProjects();
                }}
                onCancel={() => setEditingProject(null)}
              />
            </div>

            {/* Right Column: Project Records List & Filters */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 shadow-lg flex flex-col sm:flex-row gap-4 justify-between items-center">
                {/* Search input */}
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full sm:w-auto bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    <option value="All">{t('categories.all')}</option>
                    <option value="Residential">{t('categories.residential')}</option>
                    <option value="Commercial">{t('categories.commercial')}</option>
                    <option value="Industrial">{t('categories.industrial')}</option>
                    <option value="Infrastructure">{t('categories.infrastructure')}</option>
                  </select>
                </div>
              </div>

              {/* Grid of Projects */}
              {isLoading ? (
                <div className="text-center py-20 text-slate-500">{t('loading')}</div>
              ) : filteredProjects.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
                  {t('noResults')}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onUpdate={fetchProjects}
                      onEdit={(proj) => {
                        setEditingProject(proj);
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}