import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, LogOut, Image, FileText } from 'lucide-react';
import { fetchWallpapers, fetchBlogPosts, adminDeleteWallpaper, adminDeleteBlogPost, adminLogout, isLoggedIn } from '../../lib/api';
import { Wallpaper, BlogPost } from '../../types';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'wallpapers' | 'blog'>('wallpapers');
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/admin', { replace: true });
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [w, p] = await Promise.all([fetchWallpapers(), fetchBlogPosts()]);
      setWallpapers(w);
      setPosts(p);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWallpaper = async (id: number, title: string) => {
    if (!confirm(`Delete wallpaper "${title}"?`)) return;
    try {
      await adminDeleteWallpaper(id);
      setWallpapers((prev) => prev.filter((w) => Number(w.id) !== id));
    } catch {
      alert('Failed to delete wallpaper');
    }
  };

  const handleDeletePost = async (id: number, title: string) => {
    if (!confirm(`Delete blog post "${title}"?`)) return;
    try {
      await adminDeleteBlogPost(id);
      setPosts((prev) => prev.filter((p) => Number(p.id) !== id));
    } catch {
      alert('Failed to delete blog post');
    }
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/admin');
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-6 sm:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-neutral-500">Manage your wallpapers and blog posts</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg border border-white/[0.08] px-3.5 py-2 text-sm text-neutral-400 hover:text-white hover:border-white/15 transition-all duration-200"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-8 p-1 bg-white/[0.03] rounded-xl border border-white/[0.06] w-fit">
        <button
          onClick={() => setTab('wallpapers')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-medium transition-all duration-200 ${
            tab === 'wallpapers'
              ? 'bg-white text-neutral-950 shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Image size={14} />
          Wallpapers
          <span className={`text-[11px] ${tab === 'wallpapers' ? 'text-neutral-500' : 'text-neutral-600'}`}>
            {wallpapers.length}
          </span>
        </button>
        <button
          onClick={() => setTab('blog')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-medium transition-all duration-200 ${
            tab === 'blog'
              ? 'bg-white text-neutral-950 shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <FileText size={14} />
          Blog Posts
          <span className={`text-[11px] ${tab === 'blog' ? 'text-neutral-500' : 'text-neutral-600'}`}>
            {posts.length}
          </span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="spinner" />
          <p className="text-sm text-neutral-500">Loading...</p>
        </div>
      ) : tab === 'wallpapers' ? (
        <div>
          <div className="flex justify-end mb-5">
            <Link
              to="/admin/wallpapers/new"
              className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-neutral-950 hover:bg-neutral-100 transition-colors duration-200"
            >
              <Plus size={15} />
              Add Wallpaper
            </Link>
          </div>
          <div className="space-y-1.5">
            {wallpapers.map((w) => (
              <div key={w.id} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 hover:bg-white/[0.04] transition-colors duration-200">
                <div className="flex items-center gap-4 min-w-0">
                  <img src={w.imageUrl} alt={w.title} className="h-11 w-11 rounded-lg object-cover flex-shrink-0 ring-1 ring-white/[0.06]" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{w.title}</p>
                    <p className="text-[12px] text-neutral-500 mt-0.5">{w.category} &middot; {w.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Link to={`/admin/wallpapers/edit/${w.id}`} className="p-2 rounded-lg text-neutral-500 hover:text-white hover:bg-white/[0.06] transition-all duration-200">
                    <Pencil size={15} />
                  </Link>
                  <button onClick={() => handleDeleteWallpaper(Number(w.id), w.title)} className="p-2 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-400/[0.06] transition-all duration-200">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
            {wallpapers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Image size={24} className="text-neutral-600" />
                <p className="text-sm text-neutral-500">No wallpapers yet</p>
                <Link to="/admin/wallpapers/new" className="text-sm text-neutral-400 hover:text-white transition-colors duration-200">
                  Add your first wallpaper &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-end mb-5">
            <Link
              to="/admin/blog-posts/new"
              className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-neutral-950 hover:bg-neutral-100 transition-colors duration-200"
            >
              <Plus size={15} />
              Add Blog Post
            </Link>
          </div>
          <div className="space-y-1.5">
            {posts.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 hover:bg-white/[0.04] transition-colors duration-200">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{p.title}</p>
                  <p className="text-[12px] text-neutral-500 mt-0.5">{p.category} &middot; {p.author} &middot; {p.date}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Link to={`/admin/blog-posts/edit/${p.id}`} className="p-2 rounded-lg text-neutral-500 hover:text-white hover:bg-white/[0.06] transition-all duration-200">
                    <Pencil size={15} />
                  </Link>
                  <button onClick={() => handleDeletePost(Number(p.id), p.title)} className="p-2 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-400/[0.06] transition-all duration-200">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
            {posts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <FileText size={24} className="text-neutral-600" />
                <p className="text-sm text-neutral-500">No blog posts yet</p>
                <Link to="/admin/blog-posts/new" className="text-sm text-neutral-400 hover:text-white transition-colors duration-200">
                  Write your first post &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
