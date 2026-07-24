'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAssets } from '@/hooks/useAssets';
import { Plus, Trash2, Upload, Building, Wrench, MapPin, FileText, CheckCircle2, ArrowLeft, Image as ImageIcon, Home, Package } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminMarketplacePage() {
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

      toast.success('Marketplace asset published successfully!');
      
      setTitle('');
      setDescription('');
      setPrice('');
      setCategory('design');
      setStatus('available');
      setImageFiles(null);
      setDocFiles(null);

      mutate();
    } catch (error: any) {
      toast.error(error.message || 'Error creating asset listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAsset = async (id: string, assetTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${assetTitle}"?`)) return;

    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch(`http://localhost:3000/api/asset/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) throw new Error('Failed to delete asset');

      toast.success('Asset listing removed');
      mutate();
    } catch (error) {
      toast.error('Error removing asset listing');
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
              <h1 className="text-2xl font-bold text-white">Marketplace Asset Management</h1>
              <p className="text-xs text-slate-400 mt-0.5">Manage house designs, blueprints, land plots, materials, and machinery.</p>
            </div>
          </div>
          <Link
            href="/marketplace"
            target="_blank"
            className="text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3.5 py-2 rounded-lg text-cyan-400 transition-colors"
          >
            Live Marketplace View ↗
          </Link>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form Column */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-fit space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Plus className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">Create New Listing</h2>
            </div>

            <form onSubmit={handleCreateAsset} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Asset Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Modern 4-Bedroom Duplex Blueprint"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Architectural specs, floor plans, dimensions, materials..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Price ($)</label>
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
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="design">House Design / Plan</option>
                    <option value="land">Land Plot</option>
                    <option value="material">Building Materials</option>
                    <option value="tool">Tool / Machinery</option>
                    <option value="object">3D Object / Component</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Listing Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="available">Available</option>
                  <option value="pending">Pending</option>
                  <option value="sold">Sold</option>
                </select>
              </div>

              {/* Media File Upload */}
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-cyan-400" /> Listing Images / Renders (Batch)
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
                    <FileText className="w-3.5 h-3.5 text-emerald-400" /> Blueprints / Specs (PDF/DOC)
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
                <span>{isSubmitting ? 'Uploading & Creating...' : 'Publish Asset'}</span>
              </button>
            </form>
          </div>

          {/* Active Inventory Column */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Active Database Listings ({assets?.length || 0})
            </h2>

            {isLoading && (
              <p className="text-cyan-400 text-sm py-8 text-center">Loading marketplace items...</p>
            )}

            {isError && (
              <p className="text-red-400 text-sm p-4 bg-red-950/50 rounded-lg border border-red-800/50">
                Failed to load database records.
              </p>
            )}

            {assets && assets.length === 0 && (
              <div className="p-8 text-center bg-slate-900 rounded-xl border border-slate-800 text-slate-400">
                No marketplace assets found. Create one using the form on the left!
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
                      <span>🖼️ {asset.mediaUrls?.length || 0} Renders</span>
                      <span>📄 {asset.documentUrls?.length || 0} Specs</span>
                    </div>

                    <button
                      onClick={() => handleDeleteAsset(asset.id, asset.title)}
                      className="p-2 bg-red-950/60 hover:bg-red-900/80 text-red-400 border border-red-800/50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Asset"
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