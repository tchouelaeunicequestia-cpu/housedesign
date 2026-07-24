'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { User, Upload, Save } from 'lucide-react';

export default function AdminProfileEditor() {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [history, setHistory] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/api/engineer-profile')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setName(data.name || '');
          setTitle(data.title || '');
          setBio(data.bio || '');
          setHistory(data.history || '');
          setExperienceYears(data.experienceYears || '');
          setPhotoUrl(data.photoUrl || '');
        }
      })
      .catch(() => toast.error('Failed to load engineer profile'));
  }, []);

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
        toast.success('Photo uploaded successfully!');
      }
    } catch {
      toast.error('Error uploading engineer photo');
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
          photoUrl,
        }),
      });

      if (!res.ok) throw new Error('Failed to update profile');
      toast.success('Engineer profile updated successfully!');
    } catch {
      toast.error('Error saving profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <User className="w-5 h-5 text-cyan-400" />
        <h2 className="text-lg font-bold text-white">Manage Engineer Profile</h2>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
            {photoUrl ? (
              <img src={photoUrl} alt="Engineer" className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-slate-600" />
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Profile Photo</label>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Professional Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Principal Structural Engineer" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Short Bio</label>
          <textarea rows={2} value={bio} onChange={(e) => setBio(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none" />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Company History & Background</label>
          <textarea rows={4} value={history} onChange={(e) => setHistory(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none" />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Years of Experience</label>
          <input type="number" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        </div>

        <button type="submit" disabled={isSaving} className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white rounded-lg text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-2">
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
        </button>
      </form>
    </div>
  );
}