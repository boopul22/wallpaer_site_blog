import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import WallpaperDetail from './pages/WallpaperDetail';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import WallpaperForm from './pages/admin/WallpaperForm';
import BlogPostForm from './pages/admin/BlogPostForm';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-neutral-950 text-neutral-300 antialiased selection:bg-white selection:text-neutral-950">
        <Navbar />
        <main className="pt-16 min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/wallpaper/:slug" element={<WallpaperDetail />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/wallpapers/new" element={<WallpaperForm />} />
            <Route path="/admin/wallpapers/edit/:id" element={<WallpaperForm />} />
            <Route path="/admin/blog-posts/new" element={<BlogPostForm />} />
            <Route path="/admin/blog-posts/edit/:id" element={<BlogPostForm />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
