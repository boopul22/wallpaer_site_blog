import React, { useState, useEffect } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
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
      <div className="relative overflow-hidden border-b border-white/[0.06]">
        {/* Background gradient */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,_rgba(120,119,198,0.08),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,_rgba(255,255,255,0.04),transparent)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 pt-20 pb-16 text-center sm:px-6 sm:pt-28 sm:pb-20 lg:px-8">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-neutral-300 backdrop-blur-sm mb-8">
            <Sparkles size={12} className="mr-2 text-emerald-400" />
            New wallpapers weekly
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1]">
            Premium Phone
            <br />
            <span className="text-neutral-400">Wallpapers</span>
          </h1>

          <p className="mx-auto mt-6 max-w-lg text-base text-neutral-500 leading-relaxed sm:text-lg">
            Curated high-fidelity backgrounds. Minimalist,
            abstract, and nature-inspired designs.
          </p>

          {/* Category Pills */}
          <div className="mt-10 flex justify-center gap-2 overflow-x-auto no-scrollbar px-4 py-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setVisibleCount(8);
                }}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-white text-neutral-950 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                    : 'border border-white/[0.08] text-neutral-400 hover:text-white hover:border-white/20 hover:bg-white/[0.04]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-16 lg:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="spinner" />
            <p className="text-sm text-neutral-500">Loading wallpapers...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:gap-5">
              {displayedWallpapers.map((wallpaper) => (
                <WallpaperCard key={wallpaper.id} wallpaper={wallpaper} />
              ))}
            </div>

            {displayedWallpapers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 gap-2">
                <p className="text-sm text-neutral-500">No wallpapers found in this category.</p>
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="text-sm text-neutral-400 hover:text-white transition-colors duration-200"
                >
                  View all wallpapers
                </button>
              </div>
            )}

            {visibleCount < wallpapers.length && (
              <div className="mt-14 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-7 py-2.5 text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/[0.06] hover:border-white/15 transition-all duration-200"
                >
                  Load More
                  <ChevronDown size={15} />
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
