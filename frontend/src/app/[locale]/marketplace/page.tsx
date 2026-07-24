'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAssets } from '@/hooks/useAssets';
import { Building, Wrench, MapPin, FileText, Send, Eye, ChevronLeft, ChevronRight, Map } from 'lucide-react';
import { toast } from 'sonner';

export default function MarketplacePage() {
  const { data: assets, isLoading, isError } = useAssets();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Modals state
  const [selectedAssetForDocs, setSelectedAssetForDocs] = useState<any>(null);
  const [selectedAssetForOffer, setSelectedAssetForOffer] = useState<any>(null);
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

    const token = localStorage.getItem('access_token');

    try {
      const response = await fetch(`http://localhost:3000/api/asset/${selectedAssetForOffer.id}/offer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          offerAmount: Number(offerAmount),
          message: offerMessage,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit offer');

      toast.success('Offer submitted successfully! Our engineering team will review it.');
      setSelectedAssetForOffer(null);
      setOfferAmount('');
      setOfferMessage('');
    } catch (error) {
      toast.error('Failed to submit offer. Please try again.');
    } finally {
      setIsSubmittingOffer(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'land':
        return <MapPin className="w-4 h-4 text-emerald-400" />;
      case 'tool':
        return <Wrench className="w-4 h-4 text-cyan-400" />;
      default:
        return <Building className="w-4 h-4 text-amber-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sold':
        return 'bg-red-950 text-red-400 border-red-800/50';
      case 'pending':
        return 'bg-amber-950 text-amber-400 border-amber-800/50';
      default:
        return 'bg-emerald-950 text-emerald-400 border-emerald-800/50';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <div>
        <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10 shadow-md">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="House Design Logo" className="h-10 w-auto object-contain" />
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white">House Design</h1>
                <p className="text-[10px] text-cyan-400 font-semibold tracking-widest uppercase">— la maison c'est nous —</p>
              </div>
            </Link>

            <nav className="flex items-center gap-6 text-sm font-medium text-slate-300">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <Link href="/portfolio" className="hover:text-white transition-colors">Portfolio</Link>
              <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
              <Link href="/marketplace" className="text-cyan-400 font-bold">Marketplace</Link>
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

        <section className="bg-slate-900 text-white py-16 px-6 text-center border-b border-slate-800">
          <div className="max-w-3xl mx-auto">
            <span className="text-cyan-400 text-xs uppercase tracking-widest font-bold bg-cyan-950/60 border border-cyan-800/50 px-3.5 py-1.5 rounded-full inline-block mb-3">
              Engineering Marketplace
            </span>
            <h2 className="text-4xl font-extrabold mb-3 text-white">Structural Assets & Land Listings</h2>
            <p className="text-slate-400 text-base">
              Browse approved development plots, specialized construction machinery, and architectural objects.
            </p>
          </div>
        </section>

        <main className="max-w-6xl mx-auto px-6 py-12">
          {/* Controls: Search, Filters & View Mode Toggle */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-bold text-white">Available Assets</h3>
              <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${viewMode === 'grid' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  Grid View
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${viewMode === 'map' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  <Map className="w-3.5 h-3.5" /> Map View
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search marketplace..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 flex-grow md:w-64"
              />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="All">All Asset Types</option>
                <option value="land">Land Plots</option>
                <option value="tool">Tools & Machinery</option>
                <option value="object">Architectural Objects</option>
              </select>
            </div>
          </div>

          {isLoading && (
            <div className="text-cyan-400 font-medium py-12 text-center">Loading marketplace items...</div>
          )}

          {isError && (
            <div className="p-4 bg-red-950/60 text-red-300 rounded-lg border border-red-800/50">
              Unable to load marketplace assets from backend server.
            </div>
          )}

          {filteredAssets && filteredAssets.length === 0 && (
            <div className="text-center py-16 bg-slate-900 rounded-xl border border-slate-800 shadow-sm">
              <p className="text-slate-400 text-lg">No assets found in the marketplace database.</p>
            </div>
          )}

          {/* View Mode Switcher */}
          {viewMode === 'map' ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-[500px] flex flex-col items-center justify-center relative overflow-hidden shadow-xl">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <MapPin className="w-12 h-12 text-cyan-400 animate-bounce mb-3" />
              <h4 className="text-lg font-bold text-white">Interactive Regional Spatial Map</h4>
              <p className="text-sm text-slate-400 text-center max-w-md mt-1">
                Displaying geographic coordinates and survey sectors for {filteredAssets?.length || 0} active land plots and structural sites.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAssets?.map((asset: any) => {
                // Mapped to backend property 'mediaUrls'[cite: 7]
                const images = asset.mediaUrls?.length > 0 ? asset.mediaUrls : ['/placeholder.jpg'];
                const currentImgIdx = activeImageIndices[asset.id] || 0;

                return (
                  <div
                    key={asset.id}
                    className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all"
                  >
                    <div>
                      {/* Interactive Image Carousel */}
                      <div className="relative h-48 bg-slate-950 overflow-hidden group">
                        <img
                          src={images[currentImgIdx].startsWith('http') ? images[currentImgIdx] : `http://localhost:3000${images[currentImgIdx]}`}
                          alt={asset.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {images.length > 1 && (
                          <>
                            <button
                              onClick={() => handleImageNav(asset.id, 'prev', images.length)}
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white p-1 rounded-full transition-colors"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleImageNav(asset.id, 'next', images.length)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white p-1 rounded-full transition-colors"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-2 right-2 bg-black/70 text-[10px] text-white px-2 py-0.5 rounded-full">
                              {currentImgIdx + 1} / {images.length}
                            </div>
                          </>
                        )}
                      </div>

                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3 gap-2">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(asset.category)}
                            <span className="text-xs uppercase font-bold tracking-wider text-slate-300">
                              {asset.category}
                            </span>
                          </div>
                          <span className={`border text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${getStatusBadge(asset.status)}`}>
                            {asset.status}
                          </span>
                        </div>

                        <h4 className="text-xl font-bold text-white mb-2">{asset.title}</h4>
                        <p className="text-slate-400 text-sm leading-relaxed mb-4">{asset.description}</p>
                      </div>
                    </div>

                    <div className="p-6 bg-slate-950 border-t border-slate-800/80 flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Asking Price</span>
                          <span className="text-lg font-bold text-cyan-400">
                            ${Number(asset.price).toLocaleString()}
                          </span>
                        </div>

                        {/* Secure Document Preview Button */}
                        <button
                          onClick={() => setSelectedAssetForDocs(asset)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs px-3 py-2 rounded-lg font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-cyan-400" />
                          <span>View Docs</span>
                        </button>
                      </div>

                      {/* In-App Negotiation Workflow Trigger */}
                      <button
                        onClick={() => setSelectedAssetForOffer(asset)}
                        className="w-full bg-cyan-950 text-cyan-300 hover:bg-cyan-900 border border-cyan-800 text-xs py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Make an Offer / Schedule Visit</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Secure Online Document Preview Modal (No Downloads) */}
      {selectedAssetForDocs && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">Verified Documentation Vault</h3>
              </div>
              <button
                onClick={() => setSelectedAssetForDocs(null)}
                className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Secure online viewer for <strong className="text-white">{selectedAssetForDocs.title}</strong>. For security compliance, direct file downloads are disabled; review document references below.
              </p>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                {selectedAssetForDocs.documentUrls?.length > 0 ? (
                  selectedAssetForDocs.documentUrls.map((doc: string, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-xs text-slate-300 py-2 border-b border-slate-900 last:border-none">
                      <span className="truncate max-w-[280px]">{doc.split('/').pop()}</span>
                      <span className="text-emerald-400 font-semibold bg-emerald-950 px-2 py-0.5 rounded">Verified Secure</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 py-2 text-center">No secondary documents attached to this listing record.</p>
                )}
              </div>
            </div>
            <button
              onClick={() => setSelectedAssetForDocs(null)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              Close Viewer
            </button>
          </div>
        </div>
      )}

      {/* In-App Negotiation & Offer Modal */}
      {selectedAssetForOffer && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Make an Offer: {selectedAssetForOffer.title}</h3>
              <button
                onClick={() => setSelectedAssetForOffer(null)}
                className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleOfferSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Your Proposed Price ($)</label>
                <input
                  type="number"
                  required
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  placeholder={`Asking: $${selectedAssetForOffer.price}`}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Message / Site Visit Request Details</label>
                <textarea
                  rows={3}
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  placeholder="Specify inspection schedule preferences or offer terms..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmittingOffer}
                className="w-full py-2.5 text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 rounded-lg transition-colors shadow-sm cursor-pointer"
              >
                {isSubmittingOffer ? 'Submitting Proposal...' : 'Send Offer to Admin'}
              </button>
            </form>
          </div>
        </div>
      )}

      <footer className="bg-slate-900 border-t border-slate-800 mt-20 py-8 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} House Design. — la maison c'est nous —. All rights reserved.</p>
      </footer>
    </div>
  );
}