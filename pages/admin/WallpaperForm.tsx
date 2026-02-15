import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { adminCreateWallpaper, adminUpdateWallpaper, adminGetWallpaper, isLoggedIn } from '../../lib/api';

const CATEGORIES = ['Abstract', 'Nature', 'Gradient', 'Architecture', 'Dark', 'City'];

const WallpaperForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: 'Abstract',
    imageUrl: '',
    resolution: '',
    size: '',
    description: '',
    colorsStr: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/admin', { replace: true });
      return;
    }
    if (isEdit && id) {
      adminGetWallpaper(Number(id)).then((w) => {
        setForm({
          title: w.title,
          slug: w.slug,
          category: w.category,
          imageUrl: w.imageUrl,
          resolution: w.resolution,
          size: w.size,
          description: w.description,
          colorsStr: w.colors.join(', '),
        });
      }).catch(() => setError('Failed to load wallpaper'));
    }
  }, [id]);

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: isEdit ? prev.slug : generateSlug(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const colors = form.colorsStr.split(',').map((c) => c.trim()).filter(Boolean);

    try {
      if (isEdit) {
        await adminUpdateWallpaper({
          id: id!,
          slug: form.slug,
          title: form.title,
          category: form.category,
          imageUrl: form.imageUrl,
          resolution: form.resolution,
          size: form.size,
          description: form.description,
          colors,
        });
      } else {
        await adminCreateWallpaper({
          slug: form.slug,
          title: form.title,
          category: form.category,
          imageUrl: form.imageUrl,
          resolution: form.resolution,
          size: form.size,
          description: form.description,
          colors,
        });
      }
      navigate('/admin/dashboard');
    } catch {
      setError('Failed to save wallpaper. Check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <button onClick={() => navigate('/admin/dashboard')} className="mb-6 flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors">
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <h1 className="text-2xl font-medium text-white mb-8">{isEdit ? 'Edit Wallpaper' : 'Add Wallpaper'}</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-neutral-400">Title</span>
          <input type="text" value={form.title} onChange={(e) => handleTitleChange(e.target.value)} required
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-white/20 focus:outline-none" />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs text-neutral-400">Slug</span>
          <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-white/20 focus:outline-none" />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs text-neutral-400">Category</span>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-white/20 focus:outline-none">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs text-neutral-400">Image URL</span>
          <input type="url" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} required placeholder="https://..."
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-white/20 focus:outline-none" />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-neutral-400">Resolution</span>
            <input type="text" value={form.resolution} onChange={(e) => setForm({ ...form, resolution: e.target.value })} placeholder="1170 x 2532"
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-white/20 focus:outline-none" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-neutral-400">Size</span>
            <input type="text" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} placeholder="2.4MB"
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-white/20 focus:outline-none" />
          </label>
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-xs text-neutral-400">Description</span>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-white/20 focus:outline-none resize-none" />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs text-neutral-400">Colors (comma-separated hex codes)</span>
          <input type="text" value={form.colorsStr} onChange={(e) => setForm({ ...form, colorsStr: e.target.value })} placeholder="#1a1a1a, #8c6b3e, #4a4a4a"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-white/20 focus:outline-none" />
        </label>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button type="submit" disabled={loading}
          className="rounded-lg bg-white px-4 py-3 text-sm font-medium text-neutral-950 hover:bg-neutral-200 transition-colors disabled:opacity-50 mt-2">
          {loading ? 'Saving...' : isEdit ? 'Update Wallpaper' : 'Create Wallpaper'}
        </button>
      </form>
    </div>
  );
};

export default WallpaperForm;
