'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAssets } from '@/hooks/useAssets';
import { getTranslator } from '@/lib/translations';
import { Plus, Trash2, Upload, Building, Wrench, MapPin, CheckCircle2, ArrowLeft, Image as ImageIcon, Home, Package, Edit, Inbox, Check, X, Mail, Phone, Clock, DollarSign, Loader2 } from 'lucide-react';
import GoogleTranslate from '@/components/GoogleTranslate';
import api from '@/lib/api';
import { toast } from 'sonner';

interface Offer {
  id: string;
  offerAmount: number;
  message?: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  asset?: {
    id: string;
    title: string;
    price: number;
  };
}

export default function AdminMarketplacePage() {
  const t = getTranslator('AdminMarketplacePage');
  const { data: assets, isLoading, isError, mutate } = useAssets();

  const [activeTab, setActiveTab] = useState<'listings' | 'offers'>('listings');
  
  // Offers State
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoadingOffers, setIsLoadingOffers] = useState(false);

  // Form State
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('design');
  const [status, setStatus] = useState('available');

  // File Upload State
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [docFiles, setDocFiles] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchOffers = async () => {
    setIsLoadingOffers(true);
    try {
      const res = await api.get('/asset/offers/all');
      setOffers(res.data);
    } catch (error) {
      console.error('Failed to fetch offers:', error);
    } finally {
      setIsLoadingOffers(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleUploadFiles = async (files: FileList): Promise<string[]> => {
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('files', file));

    const response = await api.post('/media/upload-multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data.map((item: { url: string }) => item.url);
  };

  const handleStartEdit = (asset: any) => {
    setEditingAssetId(asset.id);
    setTitle(asset.title || '');
    setDescription(asset.description || '');
    setPrice(asset.price?.toString() || '');
    setCategory(asset.category || 'design');
    setStatus(asset.status || 'available');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingAssetId(null);
    setTitle('');
    setDescription('');
    setPrice('');
    setCategory('design');
    setStatus('available');
    setImageFiles(null);
    setDocFiles(null);
  };

  const handleSaveAsset = async (e: React.FormEvent) => {
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

      const payload: any = {
        title,
        description,
        price: Number(price),
        category,
        status,
      };

      if (mediaUrls.length > 0) payload.mediaUrls = mediaUrls;
      if (documentUrls.length > 0) payload.documentUrls = documentUrls;

      if (editingAssetId) {
        await api.put(`/asset/${editingAssetId}`, payload);
        toast.success(t('editModal.success'));
        handleCancelEdit();
      } else {
        await api.post('/asset', payload);
        toast.success(t('createSuccess'));
        handleCancelEdit();
      }

      mutate();
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('createError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAsset = async (id: string, assetTitle: string) => {
    if (!confirm(t('confirmDelete', { title: assetTitle }))) return;

    try {
      await api.delete(`/asset/${id}`);
      toast.success(t('deleteSuccess'));
      mutate();
    } catch (error) {
      toast.error(t('deleteError'));
    }
  };

  const handleOfferStatusChange = async (offerId: string, newStatus: 'accepted' | 'rejected') => {
    try {
      await api.patch(`/asset/offer/${offerId}/status`, { status: newStatus });
      toast.success(t('offers.statusSuccess'));
      fetchOffers();
    } catch (error) {
      toast.error('Failed to update offer status');
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
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Navigation Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-5 gap-4">
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
          <div className="flex items-center gap-3">
            <GoogleTranslate />
            <Link
              href="/marketplace"
              target="_blank"
              className="text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3.5 py-2 rounded-lg text-cyan-400 transition-colors"
            >
              {t('liveMarketplaceLink')}
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1.5 w-fit gap-2">
          <button
            onClick={() => setActiveTab('listings')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
              activeTab === 'listings'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>{t('tabs.listings')}</span>
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
              activeTab === 'offers'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>{t('tabs.offers', { count: offers.length })}</span>
          </button>
        </div>

        {activeTab === 'offers' ? (
          /* Offers Management Tab */
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
              <h2 className="text-lg font-bold text-white mb-1">{t('offers.title')}</h2>
              <p className="text-xs text-slate-400">Review, negotiate, accept, or reject client purchase and site visit proposals.</p>
            </div>

            {isLoadingOffers ? (
              <div className="text-center py-20 text-slate-400 text-sm bg-slate-900 border border-slate-800 rounded-2xl">
                Loading offers...
              </div>
            ) : offers.length === 0 ? (
              <div className="text-center py-20 text-slate-400 text-sm bg-slate-900 border border-slate-800 rounded-2xl">
                {t('offers.empty')}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">{t('offers.buyer')}</span>
                          <h3 className="text-base font-bold text-white">{offer.senderName}</h3>
                        </div>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full border font-bold uppercase ${
                          offer.status === 'accepted' ? 'bg-emerald-950 text-emerald-400 border-emerald-800/50' :
                          offer.status === 'rejected' ? 'bg-red-950 text-red-400 border-red-800/50' :
                          'bg-amber-950 text-amber-400 border-amber-800/50'
                        }`}>
                          {t(`offers.statusValues.${offer.status}` as any) || offer.status}
                        </span>
                      </div>

                      <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-2 text-xs">
                        <div className="flex justify-between items-center text-slate-300">
                          <span className="text-slate-500">{t('offers.asset')}:</span>
                          <span className="font-semibold text-white truncate max-w-[200px]">{offer.asset?.title || 'Unknown Listing'}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-300">
                          <span className="text-slate-500">{t('offers.offered')}:</span>
                          <span className="font-bold text-cyan-400 text-sm">${Number(offer.offerAmount).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 pt-1 border-t border-slate-900">
                          <Mail className="w-3.5 h-3.5" />
                          <a href={`mailto:${offer.senderEmail}`} className="hover:text-cyan-400 truncate">{offer.senderEmail}</a>
                        </div>
                        {offer.senderPhone && (
                          <div className="flex items-center gap-2 text-slate-400">
                            <Phone className="w-3.5 h-3.5" />
                            <a href={`tel:${offer.senderPhone}`} className="hover:text-cyan-400">{offer.senderPhone}</a>
                          </div>
                        )}
                        {offer.message && (
                          <div className="pt-2 border-t border-slate-900 text-slate-300 italic">
                            "{offer.message}"
                          </div>
                        )}
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 pt-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(offer.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Offer Actions */}
                    {offer.status === 'pending' && (
                      <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                        <button
                          onClick={() => handleOfferStatusChange(offer.id, 'accepted')}
                          className="flex-1 py-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800 text-xs rounded-lg font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{t('offers.actions.accept')}</span>
                        </button>
                        <button
                          onClick={() => handleOfferStatusChange(offer.id, 'rejected')}
                          className="flex-1 py-2 bg-red-950 hover:bg-red-900 text-red-400 border border-red-800 text-xs rounded-lg font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>{t('offers.actions.reject')}</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Main Listings Grid Layout */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Form Column */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-fit space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  {editingAssetId ? <Edit className="w-5 h-5 text-cyan-400" /> : <Plus className="w-5 h-5 text-cyan-400" />}
                  <h2 className="text-lg font-bold text-white">
                    {editingAssetId ? t('editModal.title') : t('form.heading')}
                  </h2>
                </div>
                {editingAssetId && (
                  <button
                    onClick={handleCancelEdit}
                    className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveAsset} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">{t('form.assetTitle')} *</label>
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
                  <label className="block text-xs font-medium text-slate-300 mb-1">{t('form.description')} *</label>
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
                    <label className="block text-xs font-medium text-slate-300 mb-1">{t('form.price')} *</label>
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
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> {t('form.documents')}
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
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{editingAssetId ? t('editModal.saving') : t('form.submitting')}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>{editingAssetId ? t('editModal.saveBtn') : t('form.submitButton')}</span>
                    </>
                  )}
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

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStartEdit(asset)}
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 rounded-lg transition-colors cursor-pointer"
                          title={t('inventory.editTitle')}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAsset(asset.id, asset.title)}
                          className="p-2 bg-red-950/60 hover:bg-red-900/80 text-red-400 border border-red-800/50 rounded-lg transition-colors cursor-pointer"
                          title={t('inventory.deleteTitle')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}