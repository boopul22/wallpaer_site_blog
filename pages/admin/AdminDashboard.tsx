import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, LogOut } from 'lucide-react';
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
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-medium text-white">Admin Dashboard</h1>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors">
          <LogOut size={16} />
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setTab('wallpapers')}
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
            tab === 'wallpapers' ? 'bg-white text-neutral-950' : 'border border-white/10 bg-white/5 text-neutral-300 hover:bg-white/10'
          }`}
        >
          Wallpapers ({wallpapers.length})
        </button>
        <button
          onClick={() => setTab('blog')}
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
            tab === 'blog' ? 'bg-white text-neutral-950' : 'border border-white/10 bg-white/5 text-neutral-300 hover:bg-white/10'
          }`}
        >
          Blog Posts ({posts.length})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-neutral-500">Loading...</div>
      ) : tab === 'wallpapers' ? (
        <div>
          <div className="flex justify-end mb-4">
            <Link
              to="/admin/wallpapers/new"
              className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-neutral-200 transition-colors"
            >
              <Plus size={16} />
              Add Wallpaper
            </Link>
          </div>
          <div className="space-y-2">
            {wallpapers.map((w) => (
              <div key={w.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                <div className="flex items-center gap-4 min-w-0">
                  <img src={w.imageUrl} alt={w.title} className="h-10 w-10 rounded object-cover flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate">{w.title}</p>
                    <p className="text-xs text-neutral-500">{w.category} • {w.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link to={`/admin/wallpapers/edit/${w.id}`} className="p-2 text-neutral-400 hover:text-white transition-colors">
                    <Pencil size={16} />
                  </Link>
                  <button onClick={() => handleDeleteWallpaper(Number(w.id), w.title)} className="p-2 text-neutral-400 hover:text-red-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {wallpapers.length === 0 && (
              <p className="text-center py-8 text-neutral-500">No wallpapers yet.</p>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-end mb-4">
            <Link
              to="/admin/blog-posts/new"
              className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-neutral-200 transition-colors"
            >
              <Plus size={16} />
              Add Blog Post
            </Link>
          </div>
          <div className="space-y-2">
            {posts.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm text-white truncate">{p.title}</p>
                  <p className="text-xs text-neutral-500">{p.category} • {p.author} • {p.date}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link to={`/admin/blog-posts/edit/${p.id}`} className="p-2 text-neutral-400 hover:text-white transition-colors">
                    <Pencil size={16} />
                  </Link>
                  <button onClick={() => handleDeletePost(Number(p.id), p.title)} className="p-2 text-neutral-400 hover:text-red-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {posts.length === 0 && (
              <p className="text-center py-8 text-neutral-500">No blog posts yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
