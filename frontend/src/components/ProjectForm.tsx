'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Upload, Video, Image as ImageIcon, PlusCircle } from 'lucide-react';

export default function ProjectForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Residential',
    status: 'Planning',
    imageUrl: '',
    videoUrl: '',
  });

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);

    const token = localStorage.getItem('access_token');
    const setter = type === 'image' ? setIsUploadingImage : setIsUploadingVideo;

    setter(true);
    try {
      const response = await fetch('http://localhost:3000/api/media/upload-single', {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: uploadData,
      });

      if (!response.ok) throw new Error('Failed to upload file');

      const data = await response.json();
      const fileUrl = data.url || data.filePath || data.path;

      setFormData((prev) => ({
        ...prev,
        [type === 'image' ? 'imageUrl' : 'videoUrl']: fileUrl,
      }));

      toast.success(`${type === 'image' ? 'Image' : 'Video'} uploaded successfully!`);
    } catch (error) {
      toast.error(`Failed to upload ${type}. Please try again.`);
    } finally {
      setter(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem('access_token');

    try {
      const response = await fetch('http://localhost:3000/api/project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create project record');

      toast.success('Project created successfully!');
      setFormData({
        title: '',
        description: '',
        category: 'Residential',
        status: 'Planning',
        imageUrl: '',
        videoUrl: '',
      });
      window.location.reload();
    } catch (error) {
      toast.error('Error creating project. Check your inputs or authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <PlusCircle className="w-5 h-5 text-cyan-400" />
        <h3 className="text-xl font-bold text-white">Add New Project Record</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Project Title</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Modern Villa Yaoundé"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>
              <option value="Infrastructure">Infrastructure</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Execution Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="Planning">Planning</option>
              <option value="In-Progress">In-Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Project Image URL or Upload</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="/uploads/image.jpg"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1 text-cyan-400 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploadingImage ? '...' : 'File'}</span>
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Project Video Walkthrough URL or Upload</label>
          <div className="flex gap-2">
            <input
              type="text"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              placeholder="/uploads/walkthrough.mp4 or external link"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1 text-cyan-400 transition-colors">
              <Video className="w-3.5 h-3.5" />
              <span>{isUploadingVideo ? '...' : 'Video'}</span>
              <input type="file" accept="video/*" onChange={(e) => handleFileUpload(e, 'video')} className="hidden" />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Project Description</label>
          <textarea
            name="description"
            required
            rows={3}
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed overview of structural specifications and architectural layout..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-600 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg transition-colors shadow-sm cursor-pointer"
        >
          {isSubmitting ? 'Saving Project Record...' : 'Publish Project'}
        </button>
      </form>
    </div>
  );
}