import React from 'react';
import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import { Wallpaper } from '../types';

interface WallpaperCardProps {
  wallpaper: Wallpaper;
}

const WallpaperCard: React.FC<WallpaperCardProps> = ({ wallpaper }) => {
  return (
    <Link to={`/wallpaper/${wallpaper.slug}`}>
      <div className="group relative aspect-[9/16] cursor-pointer overflow-hidden rounded-xl bg-neutral-900 ring-1 ring-white/5">
        <img
          src={wallpaper.imageUrl}
          alt={wallpaper.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {/* Gradient overlay - always visible on mobile for text readability, interactive on desktop */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 sm:opacity-0 sm:transition-opacity sm:duration-300 sm:group-hover:opacity-100" />

        {/* Text content - always visible on mobile, slide-up on desktop */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-0 opacity-100 sm:translate-y-4 sm:opacity-0 sm:transition-all sm:duration-300 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
          <h3 className="text-sm font-medium text-white">{wallpaper.title}</h3>
          <p className="text-xs text-neutral-400">{wallpaper.category}</p>
        </div>

        {/* Download button - visible on mobile top-right, standard hover on desktop */}
        <button
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white text-neutral-950 shadow-lg transition-all duration-300 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 hover:scale-110 active:scale-95"
          onClick={(e) => {
            e.preventDefault();
            window.open(wallpaper.imageUrl, '_blank');
          }}
          aria-label="Download wallpaper"
        >
          <Download size={16} />
        </button>
      </div>
    </Link>
  );
};

export default WallpaperCard;