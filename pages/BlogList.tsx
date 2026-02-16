import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { fetchBlogPosts } from '../lib/api';
import { BlogPost } from '../types';

const BlogList: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts()
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="animate-in fade-in duration-500">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="pt-16 pb-12 sm:pt-20 sm:pb-14 border-b border-white/[0.06]">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Design Journal
          </h2>
          <p className="mt-3 text-base text-neutral-500 max-w-lg">
            Updates on wallpaper trends, design tips, and community showcases.
          </p>
        </div>

        {/* Posts */}
        <div className="py-12 sm:py-14">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="spinner" />
              <p className="text-sm text-neutral-500">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-sm text-neutral-500">No posts yet. Check back soon.</p>
            </div>
          ) : (
            <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group flex flex-col"
                >
                  {/* Image */}
                  <div className="overflow-hidden rounded-xl bg-neutral-900 ring-1 ring-white/[0.06] aspect-[16/9] mb-5">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-[11px] font-semibold uppercase tracking-wide ${post.categoryColor}`}>
                        {post.category}
                      </span>
                      <span className="text-[11px] text-neutral-600">{post.readTime}</span>
                    </div>

                    <h3 className="text-[17px] font-medium text-white leading-snug group-hover:text-neutral-300 transition-colors duration-200">
                      {post.title}
                    </h3>

                    <p className="mt-2.5 text-sm leading-relaxed text-neutral-500 line-clamp-2 flex-1">
                      {post.excerpt}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-[12px] text-neutral-600">{post.date}</span>
                      <span className="flex items-center gap-1 text-[12px] text-neutral-500 group-hover:text-white transition-colors duration-200">
                        Read
                        <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogList;
