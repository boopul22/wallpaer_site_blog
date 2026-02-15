interface Env {
  ADMIN_PASSWORD: string;
  ADMIN_TOKEN_SECRET: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const body: any = await context.request.json();
  const { password } = body;

  if (!password || password !== context.env.ADMIN_PASSWORD) {
    return Response.json({ error: 'Invalid password' }, { status: 401 });
  }

  return Response.json({ token: context.env.ADMIN_TOKEN_SECRET });
};
