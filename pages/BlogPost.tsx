import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { fetchBlogPostBySlug, fetchWallpapers } from '../lib/api';
import { useSEO } from '../lib/useSEO';
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

  useSEO({
    title: post ? `${post.title} | FreeWallpaperVerse Blog` : undefined,
    description: post?.excerpt,
    canonical: `https://freewallpaperverse.com/blog/${slug}`,
    ogImage: post?.imageUrl,
    ogType: 'article',
  });

  useEffect(() => {
    if (!post) return;
    const schema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "image": post.imageUrl,
      "datePublished": post.date,
      "author": {
        "@type": "Person",
        "name": post.author
      },
      "publisher": {
        "@type": "Organization",
        "name": "FreeWallpaperVerse",
        "logo": {
          "@type": "ImageObject",
          "url": "https://freewallpaperverse.com/logo.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://freewallpaperverse.com/blog/${slug}`
      }
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'page-schema';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    return () => { document.getElementById('page-schema')?.remove(); };
  }, [post, slug]);

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <div className="spinner" />
        <p className="text-sm text-neutral-500">Loading...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-medium text-white">Article not found</h2>
        <Link to="/blog" className="text-sm text-neutral-400 hover:text-white transition-colors duration-200">
          &larr; Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mx-auto max-w-2xl px-5 py-12 sm:px-6 sm:py-16">
        <button
          onClick={() => navigate('/blog')}
          className="mb-10 flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft size={16} />
          Back to Blog
        </button>

        {/* Article header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide bg-white/[0.05] ${post.categoryColor}`}>
              {post.category}
            </span>
            <span className="text-[12px] text-neutral-600">{post.readTime}</span>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl leading-[1.15]">
            {post.title}
          </h1>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-neutral-800 flex items-center justify-center text-[11px] text-white font-semibold">
              {post.author.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-neutral-300 font-medium">{post.author}</span>
              <span className="text-[12px] text-neutral-600">{post.date}</span>
            </div>
          </div>
        </header>

        {/* Featured image */}
        <div className="overflow-hidden rounded-xl bg-neutral-900 ring-1 ring-white/[0.06] mb-12">
          <img src={post.imageUrl} alt={post.title} className="w-full h-auto" />
        </div>

        {/* Content */}
        <article className="space-y-6">
          {post.content.map((paragraph, idx) => (
            <p key={idx} className="text-[16px] leading-[1.8] text-neutral-400">
              {paragraph}
            </p>
          ))}
        </article>

        {/* Related wallpapers */}
        {relatedWallpapers.length > 0 && (
          <div className="mt-16 border-t border-white/[0.06] pt-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-medium text-white">Related Wallpapers</h2>
              <Link to="/" className="text-[12px] text-neutral-500 hover:text-white transition-colors duration-200">
                View all &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {relatedWallpapers.map(w => (
                <Link
                  key={w.id}
                  to={`/wallpaper/${w.slug}`}
                  className="group relative aspect-[9/16] overflow-hidden rounded-xl bg-neutral-900 ring-1 ring-white/[0.06]"
                >
                  <img
                    src={w.imageUrl}
                    className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
                    alt={w.title}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-neutral-950">
                      <Download size={16} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogPost;
