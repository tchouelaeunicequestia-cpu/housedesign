'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { User, ArrowLeft, Save } from 'lucide-react';

export default function AdminProfilePage() {
  const t = useTranslations('AdminProfilePage');
  const router = useRouter();
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [history, setHistory] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [completedProjectsCount, setCompletedProjectsCount] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch('http://localhost:3000/api/engineer-profile')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setName(data.name || '');
          setTitle(data.title || '');
          setBio(data.bio || '');
          setHistory(data.history || '');
          setExperienceYears(data.experienceYears || '');
          setCompletedProjectsCount(data.completedProjectsCount || '');
          setPhotoUrl(data.photoUrl || '');
        }
      })
      .catch(() => toast.error(t('errors.loadFailed')))
      .finally(() => setIsLoading(false));
  }, [router]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    formData.append('files', files[0]);

    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('http://localhost:3000/api/media/upload-multiple', {
        method: 'POST',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      if (data[0]?.url) {
        setPhotoUrl(data[0].url);
        toast.success(t('photoUploadSuccess'));
      }
    } catch {
      toast.error(t('errors.photoUploadFailed'));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('http://localhost:3000/api/engineer-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name,
          title,
          bio,
          history,
          experienceYears: Number(experienceYears),
          completedProjectsCount: Number(completedProjectsCount),
          photoUrl,
        }),
      });

      if (!res.ok) throw new Error('Failed to update profile');
      toast.success(t('saveSuccess'));
    } catch {
      toast.error(t('errors.saveFailed'));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">{t('loading')}</div>;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 lg:p-10">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header navigation */}
        <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-600/10 border border-cyan-800/30 rounded-xl text-cyan-400">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">{t('title')}</h1>
              <p className="text-sm text-slate-400">{t('subtitle')}</p>
            </div>
          </div>
          <Link
            href="/admin"
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-sm font-medium text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('backToDashboard')}</span>
          </Link>
        </div>

        {/* Profile Editor Form Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSave} className="space-y-6">

            {/* Photo upload section */}
            <div className="flex items-center gap-6 pb-6 border-b border-slate-800">
              <div className="w-24 h-24 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center shadow-inner shrink-0">
                {photoUrl ? (
                  <img src={photoUrl} alt="Engineer" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-slate-600" />
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">{t('fields.profilePhoto')}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500">{t('fields.photoHint')}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">{t('fields.fullName')}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder={t('fields.fullNamePlaceholder')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">{t('fields.professionalTitle')}</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder={t('fields.professionalTitlePlaceholder')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">{t('fields.shortBio')}</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">{t('fields.history')}</label>
              <textarea
                rows={5}
                value={history}
                onChange={(e) => setHistory(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">{t('fields.experienceYears')}</label>
                <input
                  type="number"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">{t('fields.completedProjectsCount')}</label>
                <input
                  type="number"
                  value={completedProjectsCount}
                  onChange={(e) => setCompletedProjectsCount(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3.5 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? t('saving') : t('saveButton')}</span>
            </button>

          </form>
        </div>

      </div>
    </main>
  );
}