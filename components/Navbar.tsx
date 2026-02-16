import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutGrid, Search, UserCircle, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-neutral-950/80 backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 cursor-pointer group" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-neutral-950 transition-transform duration-200 group-hover:scale-105">
              <LayoutGrid size={18} strokeWidth={1.5} />
            </div>
            <span className="text-[15px] font-semibold tracking-tight text-white">Lumina</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                isActive('/') && !isActive('/blog')
                  ? 'text-white bg-white/[0.07]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Wallpapers
            </Link>
            <Link
              to="/blog"
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                isActive('/blog')
                  ? 'text-white bg-white/[0.07]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Blog
            </Link>
            <button className="px-4 py-1.5 rounded-full text-sm font-medium text-neutral-500 cursor-not-allowed">
              Collections
            </button>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-2.5">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={15} />
              <input
                type="text"
                placeholder="Search wallpapers..."
                className="h-9 w-52 rounded-full border border-white/[0.08] bg-white/[0.04] pl-9 pr-4 text-[13px] text-white placeholder-neutral-500 focus:border-white/20 focus:bg-white/[0.08] focus:outline-none transition-all duration-200"
              />
            </div>
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-all duration-200">
              <UserCircle size={18} strokeWidth={1.5} />
            </button>
            {/* Mobile Menu Button */}
            <button
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-full text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-neutral-950/95 backdrop-blur-2xl border-b border-white/[0.06] px-5 py-5 flex flex-col gap-1">
          <Link
            to="/"
            className={`text-[15px] font-medium py-2.5 px-4 rounded-xl transition-colors duration-200 ${
              isActive('/') && !isActive('/blog')
                ? 'text-white bg-white/[0.07]'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.05]'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Wallpapers
          </Link>
          <Link
            to="/blog"
            className={`text-[15px] font-medium py-2.5 px-4 rounded-xl transition-colors duration-200 ${
              isActive('/blog')
                ? 'text-white bg-white/[0.07]'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.05]'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Blog
          </Link>
          <button className="text-[15px] font-medium text-neutral-500 py-2.5 px-4 rounded-xl text-left cursor-not-allowed">
            Collections
          </button>

          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={15} />
            <input
              type="text"
              placeholder="Search wallpapers..."
              className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] pl-9 pr-4 text-sm text-white placeholder-neutral-500 focus:border-white/20 focus:bg-white/[0.08] focus:outline-none transition-all duration-200"
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
