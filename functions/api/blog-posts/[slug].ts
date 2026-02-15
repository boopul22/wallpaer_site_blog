interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const slug = context.params.slug as string;

  const row: any = await context.env.DB.prepare(
    'SELECT * FROM blog_posts WHERE slug = ?'
  ).bind(slug).first();

  if (!row) {
    return Response.json({ error: 'Blog post not found' }, { status: 404 });
  }

  const post = {
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
  };

  return Response.json(post);
};
