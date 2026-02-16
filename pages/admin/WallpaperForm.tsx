import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { adminCreateWallpaper, adminUpdateWallpaper, adminGetWallpaper, isLoggedIn } from '../../lib/api';

const CATEGORIES = ['Abstract', 'Nature', 'Gradient', 'Architecture', 'Dark', 'City'];

const inputClass = "w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:border-white/20 focus:bg-white/[0.06] focus:outline-none transition-all duration-200";
const labelClass = "text-[12px] font-medium text-neutral-500 uppercase tracking-wide";

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
    <div className="mx-auto max-w-2xl px-5 py-10 sm:px-6 sm:py-12">
      <button onClick={() => navigate('/admin/dashboard')} className="mb-8 flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition-colors duration-200">
        <ArrowLeft size={16} />
        Dashboard
      </button>

      <h1 className="text-2xl font-semibold text-white mb-8">{isEdit ? 'Edit Wallpaper' : 'Add Wallpaper'}</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Title</label>
          <input type="text" value={form.title} onChange={(e) => handleTitleChange(e.target.value)} required className={inputClass} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Slug</label>
          <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required className={inputClass} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Category</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Image URL</label>
          <input type="url" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} required placeholder="https://..." className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Resolution</label>
            <input type="text" value={form.resolution} onChange={(e) => setForm({ ...form, resolution: e.target.value })} placeholder="1170 x 2532" className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Size</label>
            <input type="text" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} placeholder="2.4MB" className={inputClass} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={`${inputClass} resize-none`} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Colors (comma-separated hex)</label>
          <input type="text" value={form.colorsStr} onChange={(e) => setForm({ ...form, colorsStr: e.target.value })} placeholder="#1a1a1a, #8c6b3e, #4a4a4a" className={inputClass} />
        </div>

        {error && <p className="text-red-400/90 text-[13px]">{error}</p>}

        <button type="submit" disabled={loading}
          className="rounded-xl bg-white px-4 py-3 text-sm font-medium text-neutral-950 hover:bg-neutral-100 transition-colors duration-200 disabled:opacity-40 disabled:hover:bg-white mt-2">
          {loading ? 'Saving...' : isEdit ? 'Update Wallpaper' : 'Create Wallpaper'}
        </button>
      </form>
    </div>
  );
};

export default WallpaperForm;
