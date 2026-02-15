import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Smartphone, Crop } from 'lucide-react';
import { fetchWallpaperBySlug, fetchWallpapers } from '../lib/api';
import { Wallpaper } from '../types';

const WallpaperDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [wallpaper, setWallpaper] = useState<Wallpaper | null>(null);
  const [relatedWallpapers, setRelatedWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchWallpaperBySlug(slug)
      .then((wp) => {
        setWallpaper(wp);
        if (wp) {
          fetchWallpapers(wp.category).then((all) =>
            setRelatedWallpapers(all.filter((w) => w.slug !== slug).slice(0, 4))
          );
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="flex h-[50vh] items-center justify-center text-neutral-500">Loading...</div>;
  }

  if (!wallpaper) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center text-neutral-400">
        <h2 className="text-2xl font-medium text-white">Wallpaper not found</h2>
        <Link to="/" className="mt-4 text-emerald-500 hover:underline">Back to Gallery</Link>
      </div>
    );
  }

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Gallery
        </button>

        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          {/* Image Preview */}
          <div className="relative overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-white/10 shadow-2xl shadow-black/50">
            <img
              src={wallpaper.imageUrl}
              alt={wallpaper.title}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Info & Download */}
          <div className="flex flex-col gap-6 lg:pt-4">
            <div>
              <h1 className="text-3xl font-medium tracking-tight text-white sm:text-4xl">{wallpaper.title}</h1>
              <div className="mt-3 flex items-center gap-3">
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-neutral-300">{wallpaper.category}</span>
                <span className="text-xs text-neutral-500">{wallpaper.size} • JPG</span>
              </div>
            </div>

            <p className="text-base leading-relaxed text-neutral-400">
              {wallpaper.description}
            </p>

            <div className="mt-4 flex flex-col gap-3">
              <button className="group flex items-center justify-between rounded-xl bg-white px-5 py-3.5 text-sm font-medium text-neutral-950 transition-all hover:bg-neutral-200">
                <span className="flex items-center gap-2">
                  <Smartphone size={20} />
                  Download Full Resolution
                </span>
                <span className="opacity-60 text-xs">{wallpaper.resolution}</span>
              </button>

              <button className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-medium text-white transition-all hover:bg-white/10">
                <span className="flex items-center gap-2">
                  <Crop size={20} />
                  Download Compressed
                </span>
                <span className="text-neutral-500 text-xs">Smaller File</span>
              </button>
            </div>

            <div className="border-t border-white/10 pt-6">
              <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-neutral-500">Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-neutral-500">License</p>
                  <p className="text-sm text-neutral-300">Free for Personal Use</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Color Palette</p>
                  <div className="mt-1 flex gap-1">
                    {wallpaper.colors.map((color, idx) => (
                      <div key={idx} className="h-4 w-4 rounded-full ring-1 ring-white/10" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {relatedWallpapers.length > 0 && (
          <div className="mt-20">
            <h3 className="mb-6 text-lg font-medium text-white">You might also like</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {relatedWallpapers.map((rel) => (
                <Link key={rel.id} to={`/wallpaper/${rel.slug}`} className="group relative aspect-[9/16] cursor-pointer overflow-hidden rounded-xl bg-neutral-900 ring-1 ring-white/5">
                  <img
                    src={rel.imageUrl}
                    alt={rel.title}
                    className="h-full w-full object-cover opacity-70 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                  />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default WallpaperDetail;
