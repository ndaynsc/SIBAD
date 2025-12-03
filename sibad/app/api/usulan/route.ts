export async function GET() {
  return Response.json({ data: [] });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return Response.json({ id: '1', ...body }, { status: 201 });
  } catch (err) {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }
}
