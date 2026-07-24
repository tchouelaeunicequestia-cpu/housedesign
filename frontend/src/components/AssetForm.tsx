'use client';

import { useState } from 'react';
import { useCreateAsset } from '@/hooks/useCreateAsset';
import { toast } from 'sonner';

export default function AssetForm() {
  const createAssetMutation = useCreateAsset();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<'land' | 'object' | 'tool'>('land');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !price) return;

    createAssetMutation.mutate(
      {
        title,
        description,
        price: parseFloat(price),
        category,
        status: 'available',
      },
      {
        onSuccess: () => {
          setTitle('');
          setDescription('');
          setPrice('');
          setCategory('land');
          toast.success('Marketplace asset listed successfully!');
        },
        onError: (err: any) => {
          toast.error(`Failed to list asset: ${err.message}`);
        },
      }
    );
  };

  return (
    <section className="bg-slate-900 p-6 md:p-8 rounded-2xl shadow-xl border border-slate-800">
      <h3 className="text-2xl font-bold text-white mb-6">List Marketplace Asset (Land / Tool / Object)</h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">Asset Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-inner"
            placeholder="e.g. 500sqm Land Plot in Bastos..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">Asset Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-base text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-inner"
            >
              <option value="land">Land Plot</option>
              <option value="tool">Tools & Machinery</option>
              <option value="object">Architectural Object</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">Price ($ USD)</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              placeholder="e.g. 25000"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-inner"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">Asset Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            placeholder="Enter plot dimensions, tool specifications, or architectural details..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-inner"
          />
        </div>

        <button
          type="submit"
          disabled={createAssetMutation.isPending}
          className="w-full md:w-auto bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3.5 rounded-xl text-base font-bold transition-colors shadow-lg shadow-cyan-950/50 disabled:opacity-50 cursor-pointer"
        >
          {createAssetMutation.isPending ? 'Publishing Asset...' : 'Publish Marketplace Listing'}
        </button>
      </form>
    </section>
  );
}
