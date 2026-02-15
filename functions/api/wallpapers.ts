interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const category = url.searchParams.get('category');

  let query = 'SELECT * FROM wallpapers';
  const params: string[] = [];

  if (category && category !== 'All') {
    query += ' WHERE category = ?';
    params.push(category);
  }

  query += ' ORDER BY created_at DESC';

  const { results } = await context.env.DB.prepare(query).bind(...params).all();

  const wallpapers = (results || []).map((row: any) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    imageUrl: row.image_url,
    resolution: row.resolution,
    size: row.size,
    description: row.description,
    colors: JSON.parse(row.colors),
  }));

  return Response.json(wallpapers);
};
