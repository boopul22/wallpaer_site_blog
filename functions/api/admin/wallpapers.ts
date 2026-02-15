interface Env {
  DB: D1Database;
  ADMIN_TOKEN_SECRET: string;
}

function isAuthorized(request: Request, secret: string): boolean {
  const auth = request.headers.get('Authorization');
  return auth === `Bearer ${secret}`;
}

// Create a new wallpaper
export const onRequestPost: PagesFunction<Env> = async (context) => {
  if (!isAuthorized(context.request, context.env.ADMIN_TOKEN_SECRET)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body: any = await context.request.json();
  const { slug, title, category, imageUrl, resolution, size, description, colors } = body;

  if (!slug || !title || !category || !imageUrl) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  await context.env.DB.prepare(
    `INSERT INTO wallpapers (slug, title, category, image_url, resolution, size, description, colors)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(slug, title, category, imageUrl, resolution || '', size || '', description || '', JSON.stringify(colors || [])).run();

  return Response.json({ success: true }, { status: 201 });
};

// Update an existing wallpaper
export const onRequestPut: PagesFunction<Env> = async (context) => {
  if (!isAuthorized(context.request, context.env.ADMIN_TOKEN_SECRET)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body: any = await context.request.json();
  const { id, slug, title, category, imageUrl, resolution, size, description, colors } = body;

  if (!id) {
    return Response.json({ error: 'Missing id' }, { status: 400 });
  }

  await context.env.DB.prepare(
    `UPDATE wallpapers SET slug = ?, title = ?, category = ?, image_url = ?, resolution = ?, size = ?, description = ?, colors = ?
     WHERE id = ?`
  ).bind(slug, title, category, imageUrl, resolution || '', size || '', description || '', JSON.stringify(colors || []), id).run();

  return Response.json({ success: true });
};
