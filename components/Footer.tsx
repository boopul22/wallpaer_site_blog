import React from 'react';
import { LayoutGrid } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/5 bg-neutral-950 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-white text-neutral-950">
              <LayoutGrid size={14} strokeWidth={1.5} />
            </div>
            <span className="text-sm font-medium text-white">Lumina</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-xs text-neutral-500 hover:text-white transition-colors">Twitter</a>
            <a href="#" className="text-xs text-neutral-500 hover:text-white transition-colors">Instagram</a>
            <a href="#" className="text-xs text-neutral-500 hover:text-white transition-colors">Dribbble</a>
          </div>
          <p className="text-xs text-neutral-600">© 2024 Lumina Wallpapers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;