import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <h2 className="mb-2 text-3xl font-medium tracking-tight text-white">Design Journal</h2>
        <p className="mb-12 text-neutral-400">Updates on wallpaper trends, design tips, and community showcases.</p>

        {loading ? (
          <div className="text-center py-12 text-neutral-500">Loading posts...</div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="group cursor-pointer flex flex-col gap-4">
                <div className="overflow-hidden rounded-xl bg-neutral-900 ring-1 ring-white/5 aspect-[16/9]">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div>
                  <span className={`text-xs font-medium ${post.categoryColor}`}>{post.category}</span>
                  <h3 className="mt-1 text-lg font-medium text-white group-hover:underline transition-colors decoration-white/30 underline-offset-4">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-400 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <span className="mt-4 block text-xs text-neutral-500">{post.date} • {post.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogList;
