'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAssets } from '@/hooks/useAssets';
import { useTranslations } from 'next-intl';
import { Plus, Trash2, Upload, Building, Wrench, MapPin, FileText, CheckCircle2, ArrowLeft, Image as ImageIcon, Home, Package } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminMarketplacePage() {
  const t = useTranslations('AdminMarketplacePage');
  const { data: assets, isLoading, isError, mutate } = useAssets();

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('design');
  const [status, setStatus] = useState('available');

  // File Upload State
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [docFiles, setDocFiles] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUploadFiles = async (files: FileList): Promise<string[]> => {
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('files', file));

    const token = localStorage.getItem('access_token');
    const response = await fetch('http://localhost:3000/api/media/upload-multiple', {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) throw new Error('Failed to upload media files');
    const data = await response.json();
    return data.map((item: { url: string }) => item.url);
  };

  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let mediaUrls: string[] = [];
      let documentUrls: string[] = [];

      if (imageFiles && imageFiles.length > 0) {
        mediaUrls = await handleUploadFiles(imageFiles);
      }

      if (docFiles && docFiles.length > 0) {
        documentUrls = await handleUploadFiles(docFiles);
      }

      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:3000/api/asset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title,
          description,
          price: Number(price),
          category,
          status,
          mediaUrls,
          documentUrls,
        }),
      });

      if (!response.ok) throw new Error('Failed to create marketplace asset');

      toast.success(t('createSuccess'));

      setTitle('');
      setDescription('');
      setPrice('');
      setCategory('design');
      setStatus('available');
      setImageFiles(null);
      setDocFiles(null);

      mutate();
    } catch (error: any) {
      toast.error(error.message || t('createError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAsset = async (id: string, assetTitle: string) => {
    if (!confirm(t('confirmDelete', { title: assetTitle }))) return;

    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch(`http://localhost:3000/api/asset/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) throw new Error('Failed to delete asset');

      toast.success(t('deleteSuccess'));
      mutate();
    } catch (error) {
      toast.error(t('deleteError'));
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'design':
        return <Home className="w-4 h-4 text-cyan-400" />;
      case 'land':
        return <MapPin className="w-4 h-4 text-emerald-400" />;
      case 'material':
        return <Package className="w-4 h-4 text-amber-400" />;
      case 'tool':
        return <Wrench className="w-4 h-4 text-purple-400" />;
      default:
        return <Building className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Navigation Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-5">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="p-2 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">{t('title')}</h1>
              <p className="text-xs text-slate-400 mt-0.5">{t('subtitle')}</p>
            </div>
          </div>
          <Link
            href="/marketplace"
            target="_blank"
            className="text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3.5 py-2 rounded-lg text-cyan-400 transition-colors"
          >
            {t('liveMarketplaceLink')}
          </Link>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Form Column */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-fit space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Plus className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">{t('form.heading')}</h2>
            </div>

            <form onSubmit={handleCreateAsset} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('form.assetTitle')}</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t('form.assetTitlePlaceholder')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('form.description')}</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('form.descriptionPlaceholder')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">{t('form.price')}</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="12000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">{t('form.category')}</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="design">{t('categories.design')}</option>
                    <option value="land">{t('categories.land')}</option>
                    <option value="material">{t('categories.material')}</option>
                    <option value="tool">{t('categories.tool')}</option>
                    <option value="object">{t('categories.object')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('form.status')}</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="available">{t('statuses.available')}</option>
                  <option value="pending">{t('statuses.pending')}</option>
                  <option value="sold">{t('statuses.sold')}</option>
                </select>
              </div>

              {/* Media File Upload */}
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-cyan-400" /> {t('form.images')}
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setImageFiles(e.target.files)}
                    className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-emerald-400" /> {t('form.documents')}
                  </label>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setDocFiles(e.target.files)}
                    className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white rounded-lg text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <Upload className="w-4 h-4" />
                <span>{isSubmitting ? t('form.submitting') : t('form.submitButton')}</span>
              </button>
            </form>
          </div>

          {/* Active Inventory Column */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              {t('inventory.heading', { count: assets?.length || 0 })}
            </h2>

            {isLoading && (
              <p className="text-cyan-400 text-sm py-8 text-center">{t('inventory.loading')}</p>
            )}

            {isError && (
              <p className="text-red-400 text-sm p-4 bg-red-950/50 rounded-lg border border-red-800/50">
                {t('inventory.loadError')}
              </p>
            )}

            {assets && assets.length === 0 && (
              <div className="p-8 text-center bg-slate-900 rounded-xl border border-slate-800 text-slate-400">
                {t('inventory.empty')}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assets?.map((asset: any) => (
                <div
                  key={asset.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(asset.category)}
                        <span className="text-xs uppercase font-bold text-slate-300">
                          {asset.category}
                        </span>
                      </div>
                      <span className="text-xs font-bold uppercase px-2 py-0.5 rounded border bg-slate-950 text-cyan-400 border-slate-800">
                        {asset.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white">{asset.title}</h3>
                      <p className="text-sm text-slate-400 line-clamp-2 mt-1">{asset.description}</p>
                    </div>

                    <div className="text-base font-extrabold text-cyan-400">
                      ${Number(asset.price).toLocaleString()}
                    </div>
                  </div>

                  {/* Attached Media Counter & Actions */}
                  <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
                    <div className="flex items-center gap-3">
                      <span>🖼️ {t('inventory.rendersCount', { count: asset.mediaUrls?.length || 0 })}</span>
                      <span>📄 {t('inventory.specsCount', { count: asset.documentUrls?.length || 0 })}</span>
                    </div>

                    <button
                      onClick={() => handleDeleteAsset(asset.id, asset.title)}
                      className="p-2 bg-red-950/60 hover:bg-red-900/80 text-red-400 border border-red-800/50 rounded-lg transition-colors cursor-pointer"
                      title={t('inventory.deleteTitle')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}