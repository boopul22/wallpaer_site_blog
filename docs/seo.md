# FreeWallpaperVerse — SEO Optimization Plan

> **Domain:** freewallpaperverse.com
> **Stack:** Vite + React 19 + TypeScript + Tailwind CSS + Cloudflare Pages + D1
> **Status:** Documentation only — not yet implemented

---

## Table of Contents

1. [Current SEO Audit](#1-current-seo-audit)
2. [Meta Tags Strategy](#2-meta-tags-strategy)
3. [Dynamic Page Titles](#3-dynamic-page-titles)
4. [Open Graph & Twitter Cards](#4-open-graph--twitter-cards)
5. [Sitemap.xml](#5-sitemapxml)
6. [Robots.txt](#6-robotstxt)
7. [Structured Data (JSON-LD)](#7-structured-data-json-ld)
8. [Heading Hierarchy](#8-heading-hierarchy)
9. [Semantic HTML](#9-semantic-html)
10. [404 Error Page](#10-404-error-page)
11. [Image SEO](#11-image-seo)
12. [Performance & Core Web Vitals](#12-performance--core-web-vitals)
13. [Content Strategy & Keywords](#13-content-strategy--keywords)
14. [Technical SEO Checklist](#14-technical-seo-checklist)
15. [Implementation Priority & Roadmap](#15-implementation-priority--roadmap)
16. [Monitoring & Tools](#16-monitoring--tools)

---

## 1. Current SEO Audit

### What We Have (Good)
- Clean URL structure with slugs (`/wallpaper/liquid-oil`, `/blog/dark-mode-tips`)
- `lang="en"` on `<html>` tag
- All images have descriptive `alt` attributes using dynamic content
- Lazy loading (`loading="lazy"`) on wallpaper card images
- Mobile viewport meta tag present
- Responsive design with Tailwind CSS

### What We're Missing (Critical Gaps)

| Issue | Impact | Severity |
|-------|--------|----------|
| No `<meta name="description">` | Google shows random page text in search results | Critical |
| No Open Graph tags | Broken social media previews (Facebook, LinkedIn, WhatsApp) | Critical |
| No Twitter Card tags | No rich preview on Twitter/X | Critical |
| Static page title on all pages | Google sees every page as "Lumina Wallpapers" — hurts ranking | Critical |
| No `sitemap.xml` | Google can't discover all wallpaper/blog pages efficiently | High |
| No `robots.txt` | No crawl guidance, admin pages may get indexed | High |
| No structured data (JSON-LD) | Missing rich snippets in search results (images, articles) | High |
| No favicon | Looks unprofessional in browser tabs and bookmarks | High |
| No canonical URLs | Risk of duplicate content issues | Medium |
| Inconsistent heading hierarchy | H1 missing on Blog List, heading levels skipped | Medium |
| No 404 page | Users hitting bad URLs see a blank/broken page | Medium |
| No `<article>`, `<section>` semantics | Reduced accessibility and crawlability | Low |
| Client-side rendering only (no SSR) | Some crawlers can't execute JS — limited indexing | Low* |

*Google's crawler does execute JavaScript, so this is less critical than it used to be. However, social media scrapers (Facebook, Twitter, LinkedIn) do NOT execute JS — they only read the static HTML.

---

## 2. Meta Tags Strategy

### 2.1 Default Static Tags in `index.html`

These serve as **fallbacks** for crawlers that don't execute JavaScript (social media bots, some search engines).

**Add to `<head>` in `index.html`:**

```html
<!-- Primary Meta Tags -->
<title>FreeWallpaperVerse — Free Premium Phone Wallpapers</title>
<meta name="description" content="Download free premium phone wallpapers in 4K. Browse minimalist, abstract, nature, gradient, and dark wallpapers. New backgrounds added weekly. No signup required.">
<meta name="keywords" content="free wallpapers, phone wallpapers, 4K wallpapers, mobile backgrounds, abstract wallpapers, nature wallpapers, dark wallpapers, minimalist wallpapers, iPhone wallpapers, Android wallpapers">
<meta name="author" content="FreeWallpaperVerse">
<link rel="canonical" href="https://freewallpaperverse.com/">

<!-- Theme & Branding -->
<meta name="theme-color" content="#0a0a0a">
<meta name="color-scheme" content="dark">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

<!-- Mobile App Tags -->
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="FreeWallpaperVerse">
```

**File to modify:** `index.html`

### 2.2 Dynamic Meta Tag Hook

Since we can't install npm packages easily (using importmaps), create a lightweight custom React hook that manipulates the DOM directly.

**New file:** `lib/useSEO.ts`

```typescript
import { useEffect } from 'react';

interface SEOConfig {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  noindex?: boolean;
}

export function useSEO(config: SEOConfig) {
  useEffect(() => {
    // Update document title
    if (config.title) {
      document.title = config.title;
    }

    // Helper: update or create a meta tag
    const setMeta = (attr: string, key: string, value: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.content = value;
    };

    // Description
    if (config.description) {
      setMeta('name', 'description', config.description);
      setMeta('property', 'og:description', config.description);
      setMeta('name', 'twitter:description', config.description);
    }

    // Title for social
    if (config.title) {
      setMeta('property', 'og:title', config.title);
      setMeta('name', 'twitter:title', config.title);
    }

    // Canonical URL
    if (config.canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = config.canonical;
      setMeta('property', 'og:url', config.canonical);
    }

    // OG Image
    if (config.ogImage) {
      setMeta('property', 'og:image', config.ogImage);
      setMeta('name', 'twitter:image', config.ogImage);
    }

    // OG Type
    setMeta('property', 'og:type', config.ogType || 'website');

    // Noindex for admin pages
    if (config.noindex) {
      setMeta('name', 'robots', 'noindex, nofollow');
    }
  }, [config.title, config.description, config.canonical, config.ogImage, config.ogType]);
}
```

This hook will be called in every public page component to override the defaults with page-specific metadata.

---

## 3. Dynamic Page Titles

Every page must have a **unique, descriptive title** that includes:
- The primary keyword for that page
- The brand name "FreeWallpaperVerse"
- Under 60 characters (Google truncates longer titles)

### Title Templates Per Page

| Route | Title Template | Example |
|-------|---------------|---------|
| `/` | `Free Premium Phone Wallpapers \| FreeWallpaperVerse` | (static) |
| `/wallpaper/:slug` | `{title} — Free {category} Wallpaper \| FreeWallpaperVerse` | `Liquid Oil — Free Abstract Wallpaper \| FreeWallpaperVerse` |
| `/blog` | `Design Journal — Wallpaper Tips & Trends \| FreeWallpaperVerse` | (static) |
| `/blog/:slug` | `{title} \| FreeWallpaperVerse Blog` | `Why Dark Mode Saves Battery \| FreeWallpaperVerse Blog` |
| `*` (404) | `Page Not Found \| FreeWallpaperVerse` | (static) |

### Implementation Per Page

**`pages/Home.tsx`:**
```typescript
useSEO({
  title: 'Free Premium Phone Wallpapers | FreeWallpaperVerse',
  description: 'Download free premium phone wallpapers in 4K. Browse minimalist, abstract, nature, gradient, and dark wallpapers. New backgrounds added weekly.',
  canonical: 'https://freewallpaperverse.com/',
  ogImage: 'https://freewallpaperverse.com/og-image.jpg',
});
```

**`pages/WallpaperDetail.tsx`:**
```typescript
useSEO({
  title: wallpaper ? `${wallpaper.title} — Free ${wallpaper.category} Wallpaper | FreeWallpaperVerse` : undefined,
  description: wallpaper?.description,
  canonical: `https://freewallpaperverse.com/wallpaper/${slug}`,
  ogImage: wallpaper?.imageUrl,
  ogType: 'article',
});
```

**`pages/BlogList.tsx`:**
```typescript
useSEO({
  title: 'Design Journal — Wallpaper Tips & Trends | FreeWallpaperVerse',
  description: 'Read about wallpaper trends, design tips, and community showcases. Stay updated with the latest in mobile wallpaper design.',
  canonical: 'https://freewallpaperverse.com/blog',
});
```

**`pages/BlogPost.tsx`:**
```typescript
useSEO({
  title: post ? `${post.title} | FreeWallpaperVerse Blog` : undefined,
  description: post?.excerpt,
  canonical: `https://freewallpaperverse.com/blog/${slug}`,
  ogImage: post?.imageUrl,
  ogType: 'article',
});
```

---

## 4. Open Graph & Twitter Cards

### 4.1 Default OG Tags in `index.html`

These are the fallback tags for pages before JS executes:

```html
<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="FreeWallpaperVerse">
<meta property="og:url" content="https://freewallpaperverse.com/">
<meta property="og:title" content="FreeWallpaperVerse — Free Premium Phone Wallpapers">
<meta property="og:description" content="Download free premium phone wallpapers in 4K. Minimalist, abstract, and nature-inspired designs.">
<meta property="og:image" content="https://freewallpaperverse.com/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="en_US">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:url" content="https://freewallpaperverse.com/">
<meta name="twitter:title" content="FreeWallpaperVerse — Free Premium Phone Wallpapers">
<meta name="twitter:description" content="Download free premium phone wallpapers in 4K. Minimalist, abstract, and nature-inspired designs.">
<meta name="twitter:image" content="https://freewallpaperverse.com/og-image.jpg">
```

### 4.2 OG Image Requirements

Create a default social sharing image:
- **Dimensions:** 1200 x 630 pixels
- **Format:** JPG (smaller file size than PNG)
- **Content:** FreeWallpaperVerse logo/text + 3-4 sample wallpaper thumbnails in a grid + tagline
- **Background:** Dark (#0a0a0a) to match site theme
- **File location:** `public/og-image.jpg`

For individual wallpaper pages, the wallpaper's own `imageUrl` will be used as the OG image (set dynamically via `useSEO` hook).

### 4.3 Favicon

Create a simple SVG favicon:
- **File:** `public/favicon.svg`
- Use the LayoutGrid icon shape (matching the Navbar logo) in white on transparent
- Also create `public/apple-touch-icon.png` (180x180) for iOS bookmarks

---

## 5. Sitemap.xml

### 5.1 Why Dynamic?

Wallpapers and blog posts are stored in D1 database and change frequently. A static sitemap would go stale. We need a **Cloudflare Pages Function** that generates the sitemap from the database on each request (with caching).

### 5.2 Implementation

**New file:** `functions/sitemap.xml.ts`

```typescript
interface Env { DB: D1Database; }

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const base = 'https://freewallpaperverse.com';

  const { results: wallpapers } = await context.env.DB
    .prepare('SELECT slug, created_at FROM wallpapers ORDER BY created_at DESC')
    .all();

  const { results: posts } = await context.env.DB
    .prepare('SELECT slug, created_at FROM blog_posts ORDER BY created_at DESC')
    .all();

  const urls = [
    `<url><loc>${base}/</loc><priority>1.0</priority><changefreq>daily</changefreq></url>`,
    `<url><loc>${base}/blog</loc><priority>0.8</priority><changefreq>daily</changefreq></url>`,
    ...wallpapers.map((w: any) =>
      `<url><loc>${base}/wallpaper/${w.slug}</loc><lastmod>${w.created_at?.split('T')[0] || ''}</lastmod><priority>0.7</priority><changefreq>weekly</changefreq></url>`
    ),
    ...posts.map((p: any) =>
      `<url><loc>${base}/blog/${p.slug}</loc><lastmod>${p.created_at?.split('T')[0] || ''}</lastmod><priority>0.6</priority><changefreq>monthly</changefreq></url>`
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600', // Cache 1 hour
    },
  });
};
```

### 5.3 Route Configuration

**Modify:** `functions/_routes.json`

```json
{
  "version": 1,
  "include": ["/api/*", "/sitemap.xml"],
  "exclude": []
}
```

### 5.4 After Deployment

Submit the sitemap URL to:
- Google Search Console: https://search.google.com/search-console
- Bing Webmaster Tools: https://www.bing.com/webmasters

---

## 6. Robots.txt

**New file:** `public/robots.txt`

```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /api/admin/

# Sitemap
Sitemap: https://freewallpaperverse.com/sitemap.xml

# Crawl-delay (optional, for polite crawling)
Crawl-delay: 1
```

**Why block `/admin`?**
Admin pages contain login forms and dashboard data. Indexing them wastes crawl budget and exposes internal URLs.

---

## 7. Structured Data (JSON-LD)

Structured data helps Google display **rich results** — image carousels, article cards, breadcrumbs, etc.

### 7.1 Website Schema (Home Page)

**File:** `pages/Home.tsx`

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "FreeWallpaperVerse",
  "url": "https://freewallpaperverse.com",
  "description": "Free premium phone wallpapers in 4K resolution",
  "publisher": {
    "@type": "Organization",
    "name": "FreeWallpaperVerse",
    "url": "https://freewallpaperverse.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://freewallpaperverse.com/logo.png"
    }
  }
}
```

### 7.2 ImageObject Schema (Wallpaper Detail)

**File:** `pages/WallpaperDetail.tsx`

```json
{
  "@context": "https://schema.org",
  "@type": "ImageObject",
  "name": "{wallpaper.title}",
  "description": "{wallpaper.description}",
  "contentUrl": "{wallpaper.imageUrl}",
  "thumbnailUrl": "{wallpaper.imageUrl}",
  "width": "{parsed from wallpaper.resolution}",
  "height": "{parsed from wallpaper.resolution}",
  "encodingFormat": "image/jpeg",
  "license": "https://freewallpaperverse.com/license",
  "creator": {
    "@type": "Organization",
    "name": "FreeWallpaperVerse"
  },
  "isAccessibleForFree": true
}
```

### 7.3 BlogPosting Schema (Blog Post)

**File:** `pages/BlogPost.tsx`

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "{post.title}",
  "description": "{post.excerpt}",
  "image": "{post.imageUrl}",
  "datePublished": "{post.date}",
  "author": {
    "@type": "Person",
    "name": "{post.author}"
  },
  "publisher": {
    "@type": "Organization",
    "name": "FreeWallpaperVerse",
    "logo": {
      "@type": "ImageObject",
      "url": "https://freewallpaperverse.com/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://freewallpaperverse.com/blog/{post.slug}"
  }
}
```

### 7.4 How to Inject

In each component, use a `useEffect` to create and append a `<script type="application/ld+json">` element to `document.head`. Clean up on unmount by removing the script by ID.

```typescript
useEffect(() => {
  if (!data) return;
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'page-schema';
  script.textContent = JSON.stringify(schemaObject);
  document.head.appendChild(script);
  return () => { document.getElementById('page-schema')?.remove(); };
}, [data]);
```

---

## 8. Heading Hierarchy

Proper heading hierarchy helps screen readers and search engines understand page structure.

### Current Issues

| Page | Problem | Fix |
|------|---------|-----|
| `BlogList.tsx` line 23 | Uses `<h2>` for main heading — should be `<h1>` | Change to `<h1>` |
| `BlogList.tsx` line 68 | Uses `<h3>` for post titles — should be `<h2>` | Change to `<h2>` |
| `WallpaperDetail.tsx` | "You might also like" uses `<h3>` — should be `<h2>` | Change to `<h2>` |
| `BlogPost.tsx` | "Related Wallpapers" uses `<h4>` — should be `<h2>` | Change to `<h2>` |

### Correct Hierarchy Per Page

**Home (`/`):**
```
<h1> Premium Phone Wallpapers          (hero)
  <h2> {Category} Wallpapers            (section, if added)
```

**Wallpaper Detail (`/wallpaper/:slug`):**
```
<h1> {wallpaper.title}                  (wallpaper name)
  <h2> You might also like              (related section)
```

**Blog List (`/blog`):**
```
<h1> Design Journal                     (page title)
  <h2> {post.title}                     (each post card)
```

**Blog Post (`/blog/:slug`):**
```
<h1> {post.title}                       (article title)
  <h2> Related Wallpapers               (related section)
```

---

## 9. Semantic HTML

### Current Issues
- Most sections use generic `<div>` elements
- Blog post content not wrapped in `<article>`
- No `aria-label` on sections

### Recommended Changes

| File | Change |
|------|--------|
| `pages/BlogPost.tsx` | Wrap the post content (paragraphs) in `<article>` tag |
| `pages/BlogList.tsx` | Add `<section aria-label="Blog posts">` around the posts grid |
| `pages/Home.tsx` | Wrap hero in `<header>`, wallpaper grid in `<section aria-label="Wallpaper gallery">` |
| `pages/WallpaperDetail.tsx` | Wrap wallpaper info in `<article>`, related in `<section aria-label="Related wallpapers">` |
| `components/Footer.tsx` | Ensure it uses `<footer>` tag (verify) |

---

## 10. 404 Error Page

### Current State
No catch-all route exists. Users hitting invalid URLs see a blank page (React Router renders nothing).

### Implementation

**New file:** `pages/NotFound.tsx`

Content:
- Large "404" text
- "Page Not Found" heading (`<h1>`)
- Helpful message with suggestions
- "Go Home" button (link to `/`)
- "Go Back" button (`window.history.back()`)
- Uses `useSEO({ title: 'Page Not Found | FreeWallpaperVerse', noindex: true })`

**Modify:** `App.tsx` — add as last `<Route>`:
```tsx
<Route path="*" element={<NotFound />} />
```

---

## 11. Image SEO

### What We Already Do Well
- All `<img>` tags have descriptive `alt` attributes
- Lazy loading on gallery cards (`loading="lazy"`)

### Improvements to Consider

| Improvement | Description | Priority |
|------------|-------------|----------|
| **Descriptive filenames** | If hosting own images, use `abstract-blue-gradient-wallpaper.jpg` instead of random IDs | Low (using Unsplash URLs currently) |
| **`width` and `height` attributes** | Add explicit dimensions to prevent layout shift (CLS) | Medium |
| **WebP format** | Serve images in WebP for 25-35% smaller sizes | Low (depends on image source) |
| **Responsive `srcset`** | Serve different sizes for mobile vs desktop | Medium |
| **Image compression** | Ensure images are optimized before upload | Medium |

### Suggested Image Dimensions Attribute

```tsx
// WallpaperCard — add width/height to prevent CLS
<img
  src={wallpaper.imageUrl}
  alt={wallpaper.title}
  loading="lazy"
  width={390}
  height={693}  // 9:16 ratio
/>
```

---

## 12. Performance & Core Web Vitals

Google ranks pages partly based on Core Web Vitals (LCP, FID, CLS). Here are areas to improve:

### 12.1 Largest Contentful Paint (LCP)

| Issue | Fix |
|-------|-----|
| Tailwind CSS loaded from CDN (cdn.tailwindcss.com) | Install Tailwind as PostCSS plugin — eliminates runtime CSS generation |
| React + Router loaded from esm.sh CDN | Consider bundling with Vite for faster initial load |
| No preloading of critical assets | Add `<link rel="preload">` for hero images and fonts |

### 12.2 Cumulative Layout Shift (CLS)

| Issue | Fix |
|-------|-----|
| Images without explicit dimensions | Add `width` and `height` attributes to all `<img>` tags |
| Font loading causes flash | Already using `font-display: swap` via Google Fonts (good) |

### 12.3 First Input Delay (FID) / Interaction to Next Paint (INP)

Currently acceptable — the app is lightweight with minimal JS interaction.

### 12.4 Bundle Size

| Consideration | Details |
|--------------|---------|
| Current approach | Dependencies loaded via importmap from esm.sh (no bundling) |
| Production concern | Multiple HTTP requests for each dependency — consider Vite bundling |
| Tailwind CDN | ~300KB+ runtime CSS compiler — install as build tool instead |

---

## 13. Content Strategy & Keywords

### 13.1 Target Keywords

| Page | Primary Keywords | Secondary Keywords |
|------|-----------------|-------------------|
| Home | free phone wallpapers, 4K wallpapers, mobile backgrounds | premium wallpapers, download wallpapers, HD wallpapers |
| Wallpaper Detail | {category} wallpaper, free {category} background | {title}, phone wallpaper download, {resolution} wallpaper |
| Blog List | wallpaper trends, design tips, wallpaper blog | mobile design, phone customization |
| Blog Post | {topic-specific keywords from title} | wallpaper tips, background design |

### 13.2 Content Recommendations for Blog

Write blog posts targeting long-tail keywords:
- "Best dark wallpapers for OLED screens 2025"
- "How to choose the right wallpaper for your phone"
- "Minimalist wallpaper design trends"
- "Abstract vs nature wallpapers — which is better for focus?"
- "How wallpapers affect battery life on iPhone and Android"
- "Top 10 gradient wallpapers for {month} {year}"

### 13.3 Internal Linking

- Each blog post already shows "Related Wallpapers" — good for internal linking
- Each wallpaper detail shows "You might also like" — good for keeping users engaged
- Consider adding a "Related Blog Posts" section on wallpaper detail pages
- Add breadcrumbs: Home > {Category} > {Wallpaper Title}

### 13.4 URL Structure (Already Good)

```
/                           → Home
/wallpaper/liquid-oil       → Wallpaper (slug-based)
/blog                       → Blog index
/blog/dark-mode-tips        → Blog post (slug-based)
```

Clean, readable, keyword-containing URLs. No changes needed.

---

## 14. Technical SEO Checklist

### Must-Do (Before Launch)

- [ ] Add meta description to `index.html`
- [ ] Add Open Graph tags to `index.html`
- [ ] Add Twitter Card tags to `index.html`
- [ ] Create and implement `useSEO` hook
- [ ] Apply `useSEO` to all 4 public pages
- [ ] Create `public/robots.txt`
- [ ] Create `functions/sitemap.xml.ts`
- [ ] Update `functions/_routes.json` to include `/sitemap.xml`
- [ ] Create favicon (`public/favicon.svg`)
- [ ] Create OG image (`public/og-image.jpg`, 1200x630)
- [ ] Create apple touch icon (`public/apple-touch-icon.png`, 180x180)
- [ ] Fix heading hierarchy (BlogList `<h2>` → `<h1>`, etc.)
- [ ] Add 404 page with catch-all route
- [ ] Add JSON-LD structured data to Home, WallpaperDetail, BlogPost

### Should-Do (Post Launch)

- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Set up Google Analytics 4 (or Cloudflare Web Analytics)
- [ ] Add `width`/`height` to all `<img>` elements
- [ ] Wrap blog content in `<article>` tags
- [ ] Add `aria-label` to sections
- [ ] Test all pages with Google Rich Results Test
- [ ] Test social previews with opengraph.xyz

### Future Improvements

- [ ] Migrate from Tailwind CDN to PostCSS build (performance)
- [ ] Bundle dependencies with Vite instead of importmaps (performance)
- [ ] Add breadcrumb navigation with BreadcrumbList schema
- [ ] Implement search functionality (currently non-functional)
- [ ] Consider prerendering or SSR for critical pages
- [ ] Add `hreflang` tags if expanding to other languages
- [ ] Implement image optimization pipeline (WebP, responsive sizes)

---

## 15. Implementation Priority & Roadmap

### Phase 1 — Critical Foundations (Week 1)
| Task | Files | Est. Time |
|------|-------|-----------|
| Static meta/OG/Twitter tags in `index.html` | `index.html` | 30 min |
| Create `useSEO` hook | `lib/useSEO.ts` (new) | 30 min |
| Apply `useSEO` to all public pages | `pages/Home.tsx`, `WallpaperDetail.tsx`, `BlogList.tsx`, `BlogPost.tsx` | 45 min |
| Create `robots.txt` | `public/robots.txt` (new) | 5 min |
| Create favicon SVG | `public/favicon.svg` (new) | 15 min |
| Create OG image | `public/og-image.jpg` (new) | 30 min |

### Phase 2 — Discovery & Rich Results (Week 2)
| Task | Files | Est. Time |
|------|-------|-----------|
| Dynamic sitemap function | `functions/sitemap.xml.ts` (new), `functions/_routes.json` | 45 min |
| JSON-LD on Home page | `pages/Home.tsx` | 20 min |
| JSON-LD on Wallpaper Detail | `pages/WallpaperDetail.tsx` | 20 min |
| JSON-LD on Blog Post | `pages/BlogPost.tsx` | 20 min |

### Phase 3 — Structure & UX (Week 3)
| Task | Files | Est. Time |
|------|-------|-----------|
| Fix heading hierarchy | `pages/BlogList.tsx`, `WallpaperDetail.tsx`, `BlogPost.tsx` | 15 min |
| Semantic HTML improvements | Multiple page files | 30 min |
| 404 page | `pages/NotFound.tsx` (new), `App.tsx` | 30 min |
| Add image dimensions | `components/WallpaperCard.tsx`, page files | 20 min |

### Phase 4 — Monitoring & Optimization (Week 4+)
| Task | Details |
|------|---------|
| Google Search Console setup | Verify domain, submit sitemap |
| Cloudflare Web Analytics | Enable in Cloudflare dashboard (free, privacy-friendly) |
| Monitor Core Web Vitals | Use PageSpeed Insights weekly |
| Content creation | Publish 2-4 blog posts per month targeting long-tail keywords |

---

## 16. Monitoring & Tools

### Free Tools to Use

| Tool | Purpose | URL |
|------|---------|-----|
| Google Search Console | Monitor search performance, submit sitemap, check indexing | https://search.google.com/search-console |
| Google PageSpeed Insights | Check Core Web Vitals and performance | https://pagespeed.web.dev |
| Rich Results Test | Validate JSON-LD structured data | https://search.google.com/test/rich-results |
| OpenGraph.xyz | Preview social media cards | https://www.opengraph.xyz |
| Metatags.io | Preview meta tags across platforms | https://metatags.io |
| Cloudflare Web Analytics | Privacy-friendly analytics (built into Cloudflare) | Cloudflare Dashboard |
| Bing Webmaster Tools | Monitor Bing search performance | https://www.bing.com/webmasters |
| Schema.org Validator | Validate structured data | https://validator.schema.org |

### Key Metrics to Track

| Metric | Target | Tool |
|--------|--------|------|
| Pages indexed | All public pages | Google Search Console |
| Average position | Top 50 for target keywords | Google Search Console |
| Click-through rate (CTR) | > 3% for branded queries | Google Search Console |
| Core Web Vitals (LCP) | < 2.5 seconds | PageSpeed Insights |
| Core Web Vitals (CLS) | < 0.1 | PageSpeed Insights |
| Organic traffic growth | Month-over-month increase | Analytics |

---

## Files Summary

### New Files to Create
| File | Purpose |
|------|---------|
| `lib/useSEO.ts` | Custom hook for dynamic meta tags |
| `public/robots.txt` | Crawl directives |
| `public/favicon.svg` | Browser tab icon |
| `public/og-image.jpg` | Default social sharing image (1200x630) |
| `public/apple-touch-icon.png` | iOS bookmark icon (180x180) |
| `functions/sitemap.xml.ts` | Dynamic XML sitemap from D1 |
| `pages/NotFound.tsx` | 404 error page |

### Files to Modify
| File | Changes |
|------|---------|
| `index.html` | Add meta description, OG tags, Twitter cards, favicon links, theme-color |
| `App.tsx` | Import NotFound, add catch-all `<Route path="*">` |
| `pages/Home.tsx` | Add `useSEO()`, add JSON-LD WebSite schema, semantic HTML |
| `pages/WallpaperDetail.tsx` | Add `useSEO()`, add JSON-LD ImageObject, fix heading hierarchy |
| `pages/BlogList.tsx` | Add `useSEO()`, fix `<h2>` → `<h1>`, `<h3>` → `<h2>`, semantic HTML |
| `pages/BlogPost.tsx` | Add `useSEO()`, add JSON-LD BlogPosting, wrap in `<article>`, fix headings |
| `functions/_routes.json` | Add `/sitemap.xml` to include array |
