import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutGrid, Search, UserCircle, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-neutral-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer group" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-neutral-950 transition-transform group-hover:scale-105">
              <LayoutGrid size={20} strokeWidth={1.5} />
            </div>
            <span className="text-base font-medium tracking-tight text-white">Lumina</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-white hover:text-neutral-300 transition-colors">
              Wallpapers
            </Link>
            <Link to="/blog" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
              Blog
            </Link>
            <button className="text-sm font-medium text-neutral-400 hover:text-white transition-colors cursor-not-allowed opacity-50">
              Collections
            </button>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
              <input
                type="text"
                placeholder="Search..."
                className="h-9 w-48 rounded-full border border-white/10 bg-white/5 pl-9 pr-4 text-xs text-white placeholder-neutral-500 focus:border-white/20 focus:bg-white/10 focus:outline-none focus:ring-0 transition-all"
              />
            </div>
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors">
              <UserCircle size={20} strokeWidth={1.5} />
            </button>
            {/* Mobile Menu Button */}
            <button
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-neutral-950 border-b border-white/5 p-4 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-300">
          <Link
            to="/"
            className="text-base font-medium text-white py-2 hover:bg-white/5 px-4 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Wallpapers
          </Link>
          <Link
            to="/blog"
            className="text-base font-medium text-neutral-400 hover:text-white py-2 hover:bg-white/5 px-4 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Blog
          </Link>
          <button className="text-base font-medium text-neutral-400 hover:text-white py-2 hover:bg-white/5 px-4 rounded-lg transition-colors text-left cursor-not-allowed opacity-50">
            Collections
          </button>

          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
            <input
              type="text"
              placeholder="Search wallpapers..."
              className="h-10 w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-4 text-sm text-white placeholder-neutral-500 focus:border-white/20 focus:bg-white/10 focus:outline-none focus:ring-0 transition-all"
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;