interface Env {
  DB: D1Database;
  ADMIN_TOKEN_SECRET: string;
}

function isAuthorized(request: Request, secret: string): boolean {
  const auth = request.headers.get('Authorization');
  return auth === `Bearer ${secret}`;
}

// Create a new blog post
export const onRequestPost: PagesFunction<Env> = async (context) => {
  if (!isAuthorized(context.request, context.env.ADMIN_TOKEN_SECRET)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body: any = await context.request.json();
  const { slug, title, category, categoryColor, date, readTime, author, imageUrl, excerpt, content } = body;

  if (!slug || !title || !category || !imageUrl) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  await context.env.DB.prepare(
    `INSERT INTO blog_posts (slug, title, category, category_color, date, read_time, author, image_url, excerpt, content)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(slug, title, category, categoryColor || '', date || '', readTime || '', author || '', imageUrl, excerpt || '', JSON.stringify(content || [])).run();

  return Response.json({ success: true }, { status: 201 });
};

// Update an existing blog post
export const onRequestPut: PagesFunction<Env> = async (context) => {
  if (!isAuthorized(context.request, context.env.ADMIN_TOKEN_SECRET)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body: any = await context.request.json();
  const { id, slug, title, category, categoryColor, date, readTime, author, imageUrl, excerpt, content } = body;

  if (!id) {
    return Response.json({ error: 'Missing id' }, { status: 400 });
  }

  await context.env.DB.prepare(
    `UPDATE blog_posts SET slug = ?, title = ?, category = ?, category_color = ?, date = ?, read_time = ?, author = ?, image_url = ?, excerpt = ?, content = ?
     WHERE id = ?`
  ).bind(slug, title, category, categoryColor || '', date || '', readTime || '', author || '', imageUrl, excerpt || '', JSON.stringify(content || []), id).run();

  return Response.json({ success: true });
};
