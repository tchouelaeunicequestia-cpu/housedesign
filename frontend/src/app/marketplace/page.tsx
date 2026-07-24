'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAssets } from '@/hooks/useAssets';
import { Building, Wrench, MapPin, Tag } from 'lucide-react';

export default function MarketplacePage() {
  const { data: assets, isLoading, isError } = useAssets();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const filteredAssets = assets?.filter((asset: any) => {
    const matchesSearch =
      asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || asset.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h3 className="text-2xl font-bold text-white">Available Assets</h3>

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAssets?.map((asset: any) => (
              <div
                key={asset.id}
                className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all"
              >
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

                <div className="p-6 bg-slate-950 border-t border-slate-800/80 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Asking Price</span>
                    <span className="text-lg font-bold text-cyan-400">
                      ${Number(asset.price).toLocaleString()}
                    </span>
                  </div>

                  <a
                    href="mailto:contact@housedesign.com"
                    className="bg-cyan-950 text-cyan-300 hover:bg-cyan-900 border border-cyan-800 text-xs px-4 py-2 rounded-lg font-bold transition-colors"
                  >
                    Inquire Asset
                  </a>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <footer className="bg-slate-900 border-t border-slate-800 mt-20 py-8 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} House Design. — la maison c'est nous —. All rights reserved.</p>
      </footer>
    </div>
  );
}
