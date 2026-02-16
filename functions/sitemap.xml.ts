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
