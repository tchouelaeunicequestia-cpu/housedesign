'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { User, ArrowLeft, Save, Loader2 } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import api from '@/lib/api';

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

    api.get('/engineer-profile')
      .then((res) => {
        if (res.data) {
          setName(res.data.name || '');
          setTitle(res.data.title || '');
          setBio(res.data.bio || '');
          setHistory(res.data.history || '');
          setExperienceYears(res.data.experienceYears?.toString() || '');
          setCompletedProjectsCount(res.data.completedProjectsCount?.toString() || '');
          setPhotoUrl(res.data.photoUrl || '');
        }
      })
      .catch(() => toast.error(t('errors.loadFailed')))
      .finally(() => setIsLoading(false));
  }, [router]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    formData.append('file', files[0]);

    try {
      const res = await api.post('/media/upload-single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const uploadedUrl = res.data.url || res.data.filePath || res.data.path;
      if (uploadedUrl) {
        setPhotoUrl(uploadedUrl);
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
      await api.put('/engineer-profile', {
        name,
        title,
        bio,
        history,
        experienceYears: Number(experienceYears),
        completedProjectsCount: Number(completedProjectsCount),
        photoUrl,
      });

      toast.success(t('saveSuccess'));
    } catch {
      toast.error(t('errors.saveFailed'));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center">{t('loading')}</div>;
  }

  return (
    <main className="min-h-screen bg-white text-slate-900 p-6 lg:p-10 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header navigation */}
        <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-6 rounded-2xl shadow-xl flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/10 border border-blue-200/30 rounded-xl text-blue-700">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">{t('title')}</h1>
              <p className="text-sm text-slate-600">{t('subtitle')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              href="/admin"
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('backToDashboard')}</span>
            </Link>
          </div>
        </div>

        {/* Profile Editor Form Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSave} className="space-y-6">

            {/* Photo upload section */}
            <div className="flex items-center gap-6 pb-6 border-b border-slate-200">
              <div className="w-24 h-24 rounded-2xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center shadow-inner shrink-0">
                {photoUrl ? (
                  <img src={photoUrl.startsWith('http') ? photoUrl : `http://localhost:3000${photoUrl}`} alt="Engineer" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-slate-600" />
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">{t('fields.profilePhoto')}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-slate-100 file:text-slate-800 hover:file:bg-slate-200 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500">{t('fields.photoHint')}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">{t('fields.fullName')}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder={t('fields.fullNamePlaceholder')}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">{t('fields.professionalTitle')}</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder={t('fields.professionalTitlePlaceholder')}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">{t('fields.shortBio')}</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">{t('fields.history')}</label>
              <textarea
                rows={5}
                value={history}
                onChange={(e) => setHistory(e.target.value)}
                required
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">{t('fields.experienceYears')}</label>
                <input
                  type="number"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">{t('fields.completedProjectsCount')}</label>
                <input
                  type="number"
                  value={completedProjectsCount}
                  onChange={(e) => setCompletedProjectsCount(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('saving')}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{t('saveButton')}</span>
                </>
              )}
            </button>

          </form>
        </div>

      </div>
    </main>
  );
}