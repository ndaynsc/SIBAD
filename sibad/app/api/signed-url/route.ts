export async function POST(request: Request) {
  try {
    const body = await request.json();
    return Response.json({ signedUrl: 'placeholder', status: 'ok' });
  } catch (err) {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }
}
