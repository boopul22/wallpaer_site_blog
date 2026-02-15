interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { results } = await context.env.DB.prepare(
    'SELECT * FROM blog_posts ORDER BY created_at DESC'
  ).all();

  const posts = (results || []).map((row: any) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    categoryColor: row.category_color,
    date: row.date,
    readTime: row.read_time,
    author: row.author,
    imageUrl: row.image_url,
    excerpt: row.excerpt,
    content: JSON.parse(row.content),
  }));

  return Response.json(posts);
};
