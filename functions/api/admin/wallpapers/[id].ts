interface Env {
  DB: D1Database;
  ADMIN_TOKEN_SECRET: string;
}

function isAuthorized(request: Request, secret: string): boolean {
  const auth = request.headers.get('Authorization');
  return auth === `Bearer ${secret}`;
}

// Get a single wallpaper by id (for edit form)
export const onRequestGet: PagesFunction<Env> = async (context) => {
  if (!isAuthorized(context.request, context.env.ADMIN_TOKEN_SECRET)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = context.params.id as string;
  const row: any = await context.env.DB.prepare('SELECT * FROM wallpapers WHERE id = ?').bind(id).first();

  if (!row) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  return Response.json({
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    imageUrl: row.image_url,
    resolution: row.resolution,
    size: row.size,
    description: row.description,
    colors: JSON.parse(row.colors),
  });
};

// Delete a wallpaper
export const onRequestDelete: PagesFunction<Env> = async (context) => {
  if (!isAuthorized(context.request, context.env.ADMIN_TOKEN_SECRET)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = context.params.id as string;
  await context.env.DB.prepare('DELETE FROM wallpapers WHERE id = ?').bind(id).run();

  return Response.json({ success: true });
};
