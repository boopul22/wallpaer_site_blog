import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.06] bg-neutral-950">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
            {/* Brand */}
            <div>
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-neutral-950">
                  <LayoutGrid size={14} strokeWidth={1.5} />
                </div>
                <span className="text-sm font-semibold text-white">Lumina</span>
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-neutral-500 max-w-xs">
                Curated collection of premium wallpapers for your digital devices.
              </p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-xs font-medium uppercase tracking-wider text-neutral-400 mb-4">Browse</h4>
                <div className="flex flex-col gap-2.5">
                  <Link to="/" className="text-sm text-neutral-500 hover:text-white transition-colors duration-200">Wallpapers</Link>
                  <Link to="/blog" className="text-sm text-neutral-500 hover:text-white transition-colors duration-200">Blog</Link>
                  <span className="text-sm text-neutral-600 cursor-not-allowed">Collections</span>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-medium uppercase tracking-wider text-neutral-400 mb-4">Social</h4>
                <div className="flex flex-col gap-2.5">
                  <a href="#" className="text-sm text-neutral-500 hover:text-white transition-colors duration-200">Twitter</a>
                  <a href="#" className="text-sm text-neutral-500 hover:text-white transition-colors duration-200">Instagram</a>
                  <a href="#" className="text-sm text-neutral-500 hover:text-white transition-colors duration-200">Dribbble</a>
                </div>
              </div>
            </div>

            {/* Newsletter hint */}
            <div>
              <h4 className="text-xs font-medium uppercase tracking-wider text-neutral-400 mb-4">Stay updated</h4>
              <p className="text-sm text-neutral-500 mb-4">Get notified when we publish new wallpapers.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="h-9 flex-1 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 text-[13px] text-white placeholder-neutral-600 focus:border-white/20 focus:outline-none transition-all duration-200"
                />
                <button className="h-9 rounded-lg bg-white px-4 text-[13px] font-medium text-neutral-950 hover:bg-neutral-200 transition-colors duration-200">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-600">&copy; {new Date().getFullYear()} Lumina Wallpapers. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors duration-200">Privacy</a>
            <a href="#" className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors duration-200">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
