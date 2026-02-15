import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { fetchBlogPostBySlug, fetchWallpapers } from '../lib/api';
import { BlogPost as BlogPostType, Wallpaper } from '../types';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedWallpapers, setRelatedWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    Promise.all([
      fetchBlogPostBySlug(slug),
      fetchWallpapers(),
    ]).then(([p, wallpapers]) => {
      setPost(p);
      setRelatedWallpapers(wallpapers.slice(0, 2));
    }).finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="flex h-[50vh] items-center justify-center text-neutral-500">Loading...</div>;
  }

  if (!post) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center text-neutral-400">
        <h2 className="text-2xl font-medium text-white">Article not found</h2>
        <Link to="/blog" className="mt-4 text-emerald-500 hover:underline">Back to Blog</Link>
      </div>
    );
  }

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <button
          onClick={() => navigate('/blog')}
          className="mb-8 flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Blog
        </button>

        <header className="mb-10 text-center">
          <span className={`rounded-full px-3 py-1 text-xs font-medium bg-white/5 ${post.categoryColor}`}>
            {post.category}
          </span>
          <h1 className="mt-6 text-3xl font-medium tracking-tight text-white sm:text-4xl">{post.title}</h1>
          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-neutral-700 flex items-center justify-center text-[10px] text-white font-bold">
                {post.author.charAt(0)}
              </div>
              <span>{post.author}</span>
            </div>
            <span>•</span>
            <span>{post.date}</span>
          </div>
        </header>

        <div className="overflow-hidden rounded-xl bg-neutral-900 ring-1 ring-white/10 mb-10">
          <img src={post.imageUrl} alt={post.title} className="w-full h-auto" />
        </div>

        <div className="prose prose-invert prose-neutral prose-lg mx-auto">
          {post.content.map((paragraph, idx) => (
            <p key={idx} className="text-neutral-300 leading-7 mb-6">{paragraph}</p>
          ))}
        </div>

        <div className="mt-16 border-t border-white/10 pt-10">
          <h4 className="mb-6 text-sm font-medium text-white">Related Wallpapers</h4>
          <div className="grid grid-cols-2 gap-4">
            {relatedWallpapers.map(w => (
              <Link key={w.id} to={`/wallpaper/${w.slug}`} className="group relative aspect-[9/16] cursor-pointer overflow-hidden rounded-xl bg-neutral-900 ring-1 ring-white/5">
                <img
                  src={w.imageUrl}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt={w.title}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Download className="text-white" size={24} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogPost;
