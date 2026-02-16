import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Smartphone, Crop, Shield } from 'lucide-react';
import { fetchWallpaperBySlug, fetchWallpapers } from '../lib/api';
import { useSEO } from '../lib/useSEO';
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

  useSEO({
    title: wallpaper ? `${wallpaper.title} — Free ${wallpaper.category} Wallpaper | FreeWallpaperVerse` : undefined,
    description: wallpaper?.description,
    canonical: `https://freewallpaperverse.com/wallpaper/${slug}`,
    ogImage: wallpaper?.imageUrl,
    ogType: 'article',
  });

  useEffect(() => {
    if (!wallpaper) return;
    const schema = {
      "@context": "https://schema.org",
      "@type": "ImageObject",
      "name": wallpaper.title,
      "description": wallpaper.description,
      "contentUrl": wallpaper.imageUrl,
      "thumbnailUrl": wallpaper.imageUrl,
      "license": "https://freewallpaperverse.com/license",
      "creator": {
        "@type": "Organization",
        "name": "FreeWallpaperVerse"
      },
      "isAccessibleForFree": true
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'page-schema';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    return () => { document.getElementById('page-schema')?.remove(); };
  }, [wallpaper]);

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <div className="spinner" />
        <p className="text-sm text-neutral-500">Loading...</p>
      </div>
    );
  }

  if (!wallpaper) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-medium text-white">Wallpaper not found</h2>
        <Link to="/" className="text-sm text-neutral-400 hover:text-white transition-colors duration-200">
          &larr; Back to Gallery
        </Link>
      </div>
    );
  }

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-10 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <article className="grid gap-8 lg:grid-cols-[1fr,420px] lg:gap-14 lg:items-start">
          {/* Image Preview */}
          <div className="relative overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-white/[0.06]">
            <img
              src={wallpaper.imageUrl}
              alt={wallpaper.title}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Info & Download */}
          <div className="flex flex-col gap-8 lg:sticky lg:top-24">
            {/* Title area */}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <span className="rounded-full bg-white/[0.06] px-3 py-1 text-[11px] font-medium text-neutral-300 uppercase tracking-wide">
                  {wallpaper.category}
                </span>
                <span className="text-[11px] text-neutral-600 uppercase tracking-wide">{wallpaper.size}</span>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl leading-tight">
                {wallpaper.title}
              </h1>
            </div>

            <p className="text-[15px] leading-relaxed text-neutral-400">
              {wallpaper.description}
            </p>

            {/* Download buttons */}
            <div className="flex flex-col gap-2.5">
              <button className="group flex items-center justify-between rounded-xl bg-white px-5 py-3.5 text-sm font-medium text-neutral-950 transition-all duration-200 hover:bg-neutral-100">
                <span className="flex items-center gap-2.5">
                  <Smartphone size={18} />
                  Download Full Resolution
                </span>
                <span className="text-[11px] text-neutral-500 font-normal">{wallpaper.resolution}</span>
              </button>

              <button className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-3.5 text-sm font-medium text-neutral-300 transition-all duration-200 hover:bg-white/[0.06] hover:border-white/15">
                <span className="flex items-center gap-2.5">
                  <Crop size={18} />
                  Download Compressed
                </span>
                <span className="text-[11px] text-neutral-500 font-normal">Smaller File</span>
              </button>
            </div>

            {/* Details */}
            <div className="border-t border-white/[0.06] pt-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-500 mb-2">License</p>
                  <div className="flex items-center gap-2">
                    <Shield size={14} className="text-emerald-500/70" />
                    <p className="text-sm text-neutral-300">Free for Personal Use</p>
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-500 mb-2">Color Palette</p>
                  <div className="flex gap-1.5">
                    {wallpaper.colors.map((color, idx) => (
                      <div
                        key={idx}
                        className="h-5 w-5 rounded-full ring-1 ring-white/[0.08] ring-offset-1 ring-offset-neutral-950"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related */}
        {relatedWallpapers.length > 0 && (
          <section aria-label="Related wallpapers" className="mt-20 sm:mt-28">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-medium text-white">You might also like</h2>
              <Link to="/" className="text-sm text-neutral-500 hover:text-white transition-colors duration-200">
                View all &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {relatedWallpapers.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/wallpaper/${rel.slug}`}
                  className="group relative aspect-[9/16] cursor-pointer overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-white/[0.06]"
                >
                  <img
                    src={rel.imageUrl}
                    alt={rel.title}
                    className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-sm font-medium text-white">{rel.title}</p>
                    <p className="text-[11px] text-white/50 mt-0.5">{rel.category}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </section>
  );
};

export default WallpaperDetail;
