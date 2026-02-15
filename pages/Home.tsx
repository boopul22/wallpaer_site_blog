import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { fetchWallpapers } from '../lib/api';
import { Wallpaper } from '../types';
import WallpaperCard from '../components/WallpaperCard';

const CATEGORIES = ['All', 'Abstract', 'Nature', 'Gradient', 'Architecture', 'Dark', 'City'];

const Home: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(8);
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchWallpapers(selectedCategory)
      .then(setWallpapers)
      .catch(() => setWallpapers([]))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  const displayedWallpapers = wallpapers.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 4);
  };

  return (
    <section className="animate-in fade-in duration-500">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-800/30 via-neutral-950/0 to-neutral-950/0" />
        <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-neutral-300 backdrop-blur-sm mb-6">
            <span className="mr-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
            New v2.0 Release
          </div>
          <h1 className="text-4xl font-medium tracking-tight text-white sm:text-6xl mb-6">
            Premium Phone Wallpapers
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-neutral-400 mb-10">
            Curated collection of high-fidelity backgrounds for your digital life. <br className="hidden sm:block" />
            Minimalist, abstract, and nature-inspired designs.
          </p>

          {/* Category Pills */}
          <div className="flex justify-center gap-2 overflow-x-auto no-scrollbar py-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                    setSelectedCategory(cat);
                    setVisibleCount(8);
                }}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-white text-neutral-950 scale-105'
                    : 'border border-white/10 bg-white/5 text-neutral-300 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-12 text-neutral-500">Loading wallpapers...</div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:gap-6">
              {displayedWallpapers.map((wallpaper) => (
                <WallpaperCard key={wallpaper.id} wallpaper={wallpaper} />
              ))}
            </div>

            {displayedWallpapers.length === 0 && (
                <div className="text-center py-12 text-neutral-500">
                    No wallpapers found in this category.
                </div>
            )}

            {visibleCount < wallpapers.length && (
              <div className="mt-12 flex justify-center">
                <button
                    onClick={handleLoadMore}
                    className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
                >
                  Load More
                  <ChevronDown size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Home;
