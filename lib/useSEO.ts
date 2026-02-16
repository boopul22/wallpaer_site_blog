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
    }, [config.title, config.description, config.canonical, config.ogImage, config.ogType, config.noindex]);
}
