import { Wallpaper, BlogPost } from '../types';

const API_BASE = '/api';

// ---- Public API ----

export async function fetchWallpapers(category?: string): Promise<Wallpaper[]> {
  const params = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
  const res = await fetch(`${API_BASE}/wallpapers${params}`);
  if (!res.ok) throw new Error('Failed to fetch wallpapers');
  return res.json();
}

export async function fetchWallpaperBySlug(slug: string): Promise<Wallpaper | null> {
  const res = await fetch(`${API_BASE}/wallpapers/${encodeURIComponent(slug)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch wallpaper');
  return res.json();
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const res = await fetch(`${API_BASE}/blog-posts`);
  if (!res.ok) throw new Error('Failed to fetch blog posts');
  return res.json();
}

export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const res = await fetch(`${API_BASE}/blog-posts/${encodeURIComponent(slug)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch blog post');
  return res.json();
}

// ---- Admin API ----

function getToken(): string | null {
  return localStorage.getItem('admin_token');
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function adminLogin(password: string): Promise<string> {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) throw new Error('Invalid password');
  const data = await res.json();
  localStorage.setItem('admin_token', data.token);
  return data.token;
}

export function adminLogout() {
  localStorage.removeItem('admin_token');
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

// Wallpaper CRUD
export async function adminGetWallpaper(id: number): Promise<Wallpaper> {
  const res = await fetch(`${API_BASE}/admin/wallpapers/${id}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch wallpaper');
  return res.json();
}

export async function adminCreateWallpaper(data: Omit<Wallpaper, 'id'>): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/wallpapers`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create wallpaper');
}

export async function adminUpdateWallpaper(data: Wallpaper): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/wallpapers`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update wallpaper');
}

export async function adminDeleteWallpaper(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/wallpapers/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete wallpaper');
}

// Blog Post CRUD
export async function adminGetBlogPost(id: number): Promise<BlogPost> {
  const res = await fetch(`${API_BASE}/admin/blog-posts/${id}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch blog post');
  return res.json();
}

export async function adminCreateBlogPost(data: Omit<BlogPost, 'id'>): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/blog-posts`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create blog post');
}

export async function adminUpdateBlogPost(data: BlogPost): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/blog-posts`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update blog post');
}

export async function adminDeleteBlogPost(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/blog-posts/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete blog post');
}
