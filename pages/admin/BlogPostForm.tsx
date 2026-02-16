import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { adminCreateBlogPost, adminUpdateBlogPost, adminGetBlogPost, isLoggedIn } from '../../lib/api';

const CATEGORY_COLORS = [
  { label: 'Emerald', value: 'text-emerald-500' },
  { label: 'Purple', value: 'text-purple-500' },
  { label: 'Blue', value: 'text-blue-500' },
  { label: 'Red', value: 'text-red-500' },
  { label: 'Yellow', value: 'text-yellow-500' },
  { label: 'Pink', value: 'text-pink-500' },
];

const inputClass = "w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:border-white/20 focus:bg-white/[0.06] focus:outline-none transition-all duration-200";
const labelClass = "text-[12px] font-medium text-neutral-500 uppercase tracking-wide";

const BlogPostForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: '',
    categoryColor: 'text-emerald-500',
    date: '',
    readTime: '',
    author: '',
    imageUrl: '',
    excerpt: '',
  });
  const [paragraphs, setParagraphs] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/admin', { replace: true });
      return;
    }
    if (isEdit && id) {
      adminGetBlogPost(Number(id)).then((p) => {
        setForm({
          title: p.title,
          slug: p.slug,
          category: p.category,
          categoryColor: p.categoryColor,
          date: p.date,
          readTime: p.readTime,
          author: p.author,
          imageUrl: p.imageUrl,
          excerpt: p.excerpt,
        });
        setParagraphs(p.content.length > 0 ? p.content : ['']);
      }).catch(() => setError('Failed to load blog post'));
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

  const updateParagraph = (index: number, value: string) => {
    setParagraphs((prev) => prev.map((p, i) => (i === index ? value : p)));
  };

  const addParagraph = () => {
    setParagraphs((prev) => [...prev, '']);
  };

  const removeParagraph = (index: number) => {
    if (paragraphs.length <= 1) return;
    setParagraphs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const content = paragraphs.filter((p) => p.trim());

    try {
      if (isEdit) {
        await adminUpdateBlogPost({
          id: id!,
          ...form,
          content,
        });
      } else {
        await adminCreateBlogPost({
          ...form,
          content,
        });
      }
      navigate('/admin/dashboard');
    } catch {
      setError('Failed to save blog post. Check your inputs.');
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

      <h1 className="text-2xl font-semibold text-white mb-8">{isEdit ? 'Edit Blog Post' : 'Add Blog Post'}</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Title</label>
          <input type="text" value={form.title} onChange={(e) => handleTitleChange(e.target.value)} required className={inputClass} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Slug</label>
          <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Category</label>
            <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required placeholder="e.g. Trends" className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Category Color</label>
            <select value={form.categoryColor} onChange={(e) => setForm({ ...form, categoryColor: e.target.value })} className={inputClass}>
              {CATEGORY_COLORS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Date</label>
            <input type="text" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="Oct 12, 2023" className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Read Time</label>
            <input type="text" value={form.readTime} onChange={(e) => setForm({ ...form, readTime: e.target.value })} placeholder="5 min read" className={inputClass} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Author</label>
          <input type="text" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="Your Name" className={inputClass} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Image URL</label>
          <input type="url" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} required placeholder="https://..." className={inputClass} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Excerpt</label>
          <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} className={`${inputClass} resize-none`} />
        </div>

        {/* Paragraphs */}
        <div className="flex flex-col gap-3">
          <label className={labelClass}>Content Paragraphs</label>
          {paragraphs.map((p, idx) => (
            <div key={idx} className="flex gap-2">
              <textarea
                value={p}
                onChange={(e) => updateParagraph(idx, e.target.value)}
                rows={3}
                placeholder={`Paragraph ${idx + 1}`}
                className={`flex-1 ${inputClass} resize-none`}
              />
              {paragraphs.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeParagraph(idx)}
                  className="self-start p-2 rounded-lg text-neutral-600 hover:text-red-400 hover:bg-red-400/[0.06] transition-all duration-200"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addParagraph}
            className="flex items-center gap-1.5 text-[13px] text-neutral-500 hover:text-white transition-colors duration-200 self-start py-1"
          >
            <Plus size={14} />
            Add Paragraph
          </button>
        </div>

        {error && <p className="text-red-400/90 text-[13px]">{error}</p>}

        <button type="submit" disabled={loading}
          className="rounded-xl bg-white px-4 py-3 text-sm font-medium text-neutral-950 hover:bg-neutral-100 transition-colors duration-200 disabled:opacity-40 disabled:hover:bg-white mt-2">
          {loading ? 'Saving...' : isEdit ? 'Update Blog Post' : 'Create Blog Post'}
        </button>
      </form>
    </div>
  );
};

export default BlogPostForm;
