interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const slug = context.params.slug as string;

  const row: any = await context.env.DB.prepare(
    'SELECT * FROM wallpapers WHERE slug = ?'
  ).bind(slug).first();

  if (!row) {
    return Response.json({ error: 'Wallpaper not found' }, { status: 404 });
  }

  const wallpaper = {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    imageUrl: row.image_url,
    resolution: row.resolution,
    size: row.size,
    description: row.description,
    colors: JSON.parse(row.colors),
  };

  return Response.json(wallpaper);
};
