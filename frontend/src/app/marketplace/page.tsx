'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAssets } from '@/hooks/useAssets';
import { useTranslations } from 'next-intl';
import { Building, Wrench, MapPin, FileText, Send, Eye, ChevronLeft, ChevronRight, Map, Home, Package, Loader2 } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function MarketplacePage() {
  const t = useTranslations('MarketplacePage');
  const { data: assets, isLoading, isError } = useAssets();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Modals state
  const [selectedAssetForDocs, setSelectedAssetForDocs] = useState<any>(null);
  const [selectedAssetForOffer, setSelectedAssetForOffer] = useState<any>(null);
  
  // Offer Form State
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [offerAmount, setOfferAmount] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false);

  // Carousel image index tracker per asset id
  const [activeImageIndices, setActiveImageIndices] = useState<{ [key: string]: number }>({});

  const handleImageNav = (assetId: string, direction: 'next' | 'prev', totalImages: number) => {
    setActiveImageIndices((prev) => {
      const currentIndex = prev[assetId] || 0;
      let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
      if (newIndex >= totalImages) newIndex = 0;
      if (newIndex < 0) newIndex = totalImages - 1;
      return { ...prev, [assetId]: newIndex };
    });
  };

  const filteredAssets = assets?.filter((asset: any) => {
    const matchesSearch =
      asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || asset.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetForOffer) return;
    setIsSubmittingOffer(true);

    try {
      await api.post(`/asset/${selectedAssetForOffer.id}/offer`, {
        senderName,
        senderEmail,
        senderPhone,
        offerAmount: Number(offerAmount),
        message: offerMessage,
      });

      toast.success(t('offerSuccess'));
      setSelectedAssetForOffer(null);
      setSenderName('');
      setSenderEmail('');
      setSenderPhone('');
      setOfferAmount('');
      setOfferMessage('');
    } catch (error) {
      console.error('Failed to submit offer:', error);
      toast.error(t('offerError'));
    } finally {
      setIsSubmittingOffer(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'land':
        return <MapPin className="w-4 h-4 text-emerald-700" />;
      case 'tool':
        return <Wrench className="w-4 h-4 text-purple-700" />;
      case 'material':
        return <Package className="w-4 h-4 text-amber-700" />;
      case 'design':
        return <Home className="w-4 h-4 text-blue-700" />;
      default:
        return <Building className="w-4 h-4 text-blue-700" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sold':
        return 'bg-red-50 text-red-600 border-red-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  const getMediaUrl = (url?: string) => {
    if (!url) return '/placeholder.jpg';
    if (url.startsWith('http')) return url;
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000').replace(/\/api$/, '');
    return `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between font-sans">
      <div>
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-md">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="House Design Logo" className="h-10 w-auto object-contain" />
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">House Design</h1>
                <p className="text-[10px] text-blue-700 font-semibold tracking-widest uppercase">— la maison c'est nous —</p>
              </div>
            </Link>

            <nav className="flex items-center gap-6 text-sm font-medium text-slate-700">
              <Link href="/" className="hover:text-slate-900 transition-colors">{t('nav.home')}</Link>
              <Link href="/portfolio" className="hover:text-slate-900 transition-colors">{t('nav.portfolio')}</Link>
              <Link href="/about" className="hover:text-slate-900 transition-colors">{t('nav.about')}</Link>
              <Link href="/marketplace" className="text-blue-700 font-bold">{t('nav.marketplace')}</Link>
            </nav>

            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <Link
                href="/login"
                className="text-xs font-medium text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                {t('nav.engineerLogin')}
              </Link>
            </div>
          </div>
        </header>

        <section className="bg-slate-50 text-slate-900 py-16 px-6 text-center border-b border-slate-200">
          <div className="max-w-3xl mx-auto">
            <span className="text-blue-700 text-xs uppercase tracking-widest font-bold bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-full inline-block mb-3">
              {t('hero.eyebrow')}
            </span>
            <h2 className="text-4xl font-extrabold mb-3 text-slate-900">{t('hero.title')}</h2>
            <p className="text-slate-600 text-base">
              {t('hero.description')}
            </p>
          </div>
        </section>

        <main className="max-w-6xl mx-auto px-6 py-12">
          {/* Controls: Search, Filters & View Mode Toggle */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-bold text-slate-900">{t('availableAssets')}</h3>
              <div className="flex bg-slate-50 border border-slate-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-white'}`}
                >
                  {t('gridView')}
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1 cursor-pointer ${viewMode === 'map' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-white'}`}
                >
                  <Map className="w-3.5 h-3.5" /> {t('mapView')}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 flex-grow md:w-64"
              />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="All">{t('categories.all')}</option>
                <option value="design">{t('categories.design')}</option>
                <option value="land">{t('categories.land')}</option>
                <option value="material">{t('categories.material')}</option>
                <option value="tool">{t('categories.tool')}</option>
                <option value="object">{t('categories.object')}</option>
              </select>
            </div>
          </div>

          {isLoading && (
            <div className="text-blue-700 font-medium py-12 text-center">{t('loading')}</div>
          )}

          {isError && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
              {t('loadError')}
            </div>
          )}

          {filteredAssets && filteredAssets.length === 0 && (
            <div className="text-center py-16 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-slate-600 text-lg">{t('noResults')}</p>
            </div>
          )}

          {/* View Mode Switcher */}
          {viewMode === 'map' ? (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 h-[500px] flex flex-col items-center justify-center relative overflow-hidden shadow-xl">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <MapPin className="w-12 h-12 text-blue-700 animate-bounce mb-3" />
              <h4 className="text-lg font-bold text-slate-900">{t('map.title')}</h4>
              <p className="text-sm text-slate-600 text-center max-w-md mt-1">
                {t('map.description', { count: filteredAssets?.length || 0 })}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAssets?.map((asset: any) => {
                const images = asset.mediaUrls?.length > 0 ? asset.mediaUrls : ['/placeholder.jpg'];
                const currentImgIdx = activeImageIndices[asset.id] || 0;

                return (
                  <div
                    key={asset.id}
                    className="bg-slate-50 rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-all"
                  >
                    <div>
                      {/* Interactive Image Carousel */}
                      <div className="relative h-48 bg-white overflow-hidden group">
                        <img
                          src={getMediaUrl(images[currentImgIdx])}
                          alt={asset.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {images.length > 1 && (
                          <>
                            <button
                              onClick={() => handleImageNav(asset.id, 'prev', images.length)}
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white p-1 rounded-full transition-colors cursor-pointer"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleImageNav(asset.id, 'next', images.length)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white p-1 rounded-full transition-colors cursor-pointer"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-2 right-2 bg-black/70 text-[10px] text-slate-900 px-2 py-0.5 rounded-full">
                              {currentImgIdx + 1} / {images.length}
                            </div>
                          </>
                        )}
                      </div>

                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3 gap-2">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(asset.category)}
                            <span className="text-xs uppercase font-bold tracking-wider text-slate-700">
                              {asset.category}
                            </span>
                          </div>
                          <span className={`border text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${getStatusBadge(asset.status)}`}>
                            {asset.status}
                          </span>
                        </div>

                        <h4 className="text-xl font-bold text-slate-900 mb-2">{asset.title}</h4>
                        <p className="text-slate-600 text-sm leading-relaxed mb-4">{asset.description}</p>
                      </div>
                    </div>

                    <div className="p-6 bg-white border-t border-slate-200/80 flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">{t('askingPrice')}</span>
                          <span className="text-lg font-bold text-blue-700">
                            ${Number(asset.price).toLocaleString()}
                          </span>
                        </div>

                        {/* Secure Document Preview Button */}
                        <button
                          onClick={() => setSelectedAssetForDocs(asset)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs px-3 py-2 rounded-lg font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-700" />
                          <span>{t('viewDocs')}</span>
                        </button>
                      </div>

                      {/* In-App Negotiation Workflow Trigger */}
                      <button
                        onClick={() => setSelectedAssetForOffer(asset)}
                        className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 text-xs py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{t('makeOffer')}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Secure Online Document Preview Modal */}
      {selectedAssetForDocs && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-700" />
                <h3 className="text-lg font-bold text-slate-900">{t('docsModal.title')}</h3>
              </div>
              <button
                onClick={() => setSelectedAssetForDocs(null)}
                className="text-slate-600 hover:text-slate-900 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                {t('docsModal.description', { title: selectedAssetForDocs.title })}
              </p>
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 max-h-60 overflow-y-auto">
                {selectedAssetForDocs.documentUrls?.length > 0 ? (
                  selectedAssetForDocs.documentUrls.map((doc: string, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-xs text-slate-700 py-2 border-b border-slate-200 last:border-none">
                      <span className="truncate max-w-[280px]">{doc.split('/').pop()}</span>
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">{t('docsModal.verifiedSecure')}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 py-2 text-center">{t('docsModal.noDocuments')}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => setSelectedAssetForDocs(null)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              {t('docsModal.closeButton')}
            </button>
          </div>
        </div>
      )}

      {/* In-App Negotiation & Offer Modal with Contact Info */}
      {selectedAssetForOffer && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">{t('offerModal.title', { title: selectedAssetForOffer.title })}</h3>
              <button
                onClick={() => setSelectedAssetForOffer(null)}
                className="text-slate-600 hover:text-slate-900 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleOfferSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">{t('offerModal.nameLabel')} *</label>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder={t('offerModal.namePlaceholder')}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">{t('offerModal.emailLabel')} *</label>
                  <input
                    type="email"
                    required
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder={t('offerModal.emailPlaceholder')}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">{t('offerModal.phoneLabel')}</label>
                  <input
                    type="tel"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    placeholder={t('offerModal.phonePlaceholder')}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">{t('offerModal.priceLabel')} *</label>
                <input
                  type="number"
                  required
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  placeholder={t('offerModal.pricePlaceholder', { price: selectedAssetForOffer.price })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">{t('offerModal.messageLabel')}</label>
                <textarea
                  rows={3}
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  placeholder={t('offerModal.messagePlaceholder')}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingOffer}
                className="w-full py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmittingOffer ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t('offerModal.submitting')}</span>
                  </>
                ) : (
                  <span>{t('offerModal.submitButton')}</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      <footer className="bg-slate-50 border-t border-slate-200 mt-20 py-8 text-center text-xs text-slate-500">
        <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
      </footer>
    </div>
  );
}