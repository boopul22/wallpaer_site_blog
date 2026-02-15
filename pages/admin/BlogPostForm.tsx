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
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <button onClick={() => navigate('/admin/dashboard')} className="mb-6 flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors">
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <h1 className="text-2xl font-medium text-white mb-8">{isEdit ? 'Edit Blog Post' : 'Add Blog Post'}</h1>

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

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-neutral-400">Category</span>
            <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required placeholder="e.g. Trends"
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-white/20 focus:outline-none" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-neutral-400">Category Color</span>
            <select value={form.categoryColor} onChange={(e) => setForm({ ...form, categoryColor: e.target.value })}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-white/20 focus:outline-none">
              {CATEGORY_COLORS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-neutral-400">Date</span>
            <input type="text" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="Oct 12, 2023"
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-white/20 focus:outline-none" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-neutral-400">Read Time</span>
            <input type="text" value={form.readTime} onChange={(e) => setForm({ ...form, readTime: e.target.value })} placeholder="5 min read"
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-white/20 focus:outline-none" />
          </label>
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-xs text-neutral-400">Author</span>
          <input type="text" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="Your Name"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-white/20 focus:outline-none" />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs text-neutral-400">Image URL</span>
          <input type="url" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} required placeholder="https://..."
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-white/20 focus:outline-none" />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs text-neutral-400">Excerpt (short summary)</span>
          <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-white/20 focus:outline-none resize-none" />
        </label>

        {/* Paragraphs */}
        <div className="flex flex-col gap-2">
          <span className="text-xs text-neutral-400">Content Paragraphs</span>
          {paragraphs.map((p, idx) => (
            <div key={idx} className="flex gap-2">
              <textarea
                value={p}
                onChange={(e) => updateParagraph(idx, e.target.value)}
                rows={3}
                placeholder={`Paragraph ${idx + 1}`}
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-white/20 focus:outline-none resize-none"
              />
              {paragraphs.length > 1 && (
                <button type="button" onClick={() => removeParagraph(idx)} className="self-start p-2 text-neutral-500 hover:text-red-400 transition-colors">
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addParagraph} className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors self-start mt-1">
            <Plus size={14} />
            Add Paragraph
          </button>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button type="submit" disabled={loading}
          className="rounded-lg bg-white px-4 py-3 text-sm font-medium text-neutral-950 hover:bg-neutral-200 transition-colors disabled:opacity-50 mt-2">
          {loading ? 'Saving...' : isEdit ? 'Update Blog Post' : 'Create Blog Post'}
        </button>
      </form>
    </div>
  );
};

export default BlogPostForm;
