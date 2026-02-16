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
      <div className="group relative aspect-[9/16] cursor-pointer overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-white/[0.06]">
        <img
          src={wallpaper.imageUrl}
          alt={wallpaper.title}
          loading="lazy"
          width={450}
          height={800}
          className="h-full w-full object-cover transition-all duration-500 ease-out group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent opacity-70 sm:opacity-0 sm:transition-opacity sm:duration-500 sm:group-hover:opacity-100" />

        {/* Text content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 translate-y-0 opacity-100 sm:translate-y-2 sm:opacity-0 sm:transition-all sm:duration-500 sm:ease-out sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
          <h3 className="text-sm font-medium text-white leading-snug">{wallpaper.title}</h3>
          <p className="text-[11px] text-white/50 mt-0.5 font-medium uppercase tracking-wide">{wallpaper.category}</p>
        </div>

        {/* Download button */}
        <button
          className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm text-neutral-950 shadow-lg transition-all duration-300 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 hover:bg-white hover:scale-105 active:scale-95"
          onClick={(e) => {
            e.preventDefault();
            window.open(wallpaper.imageUrl, '_blank');
          }}
          aria-label="Download wallpaper"
        >
          <Download size={15} strokeWidth={2} />
        </button>
      </div>
    </Link>
  );
};

export default WallpaperCard;
