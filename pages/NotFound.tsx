import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    useSEO({
        title: 'Page Not Found | FreeWallpaperVerse',
        noindex: true
    });

    return (
        <section className="flex h-[80vh] flex-col items-center justify-center px-4 text-center animate-in fade-in duration-500">
            <h1 className="text-9xl font-bold text-neutral-800 select-none">404</h1>
            <h2 className="mt-4 text-2xl font-semibold text-white">Page Not Found</h2>
            <p className="mt-2.5 max-w-md text-neutral-400 text-sm leading-relaxed">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>

            <div className="mt-8 flex items-center justify-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="rounded-full border border-white/[0.08] bg-white/[0.03] px-6 py-2.5 text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/[0.06] hover:border-white/15 transition-all duration-200"
                >
                    Go Back
                </button>
                <Link
                    to="/"
                    className="rounded-full bg-white px-6 py-2.5 text-sm font-medium text-neutral-950 hover:bg-neutral-100 transition-all duration-200"
                >
                    Go Home
                </Link>
            </div>
        </section>
    );
};

export default NotFound;
