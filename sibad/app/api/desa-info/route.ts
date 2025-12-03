import { DEFAULT_DESA_INFO } from '@/lib/constants';

export async function GET() {
  return Response.json(DEFAULT_DESA_INFO);
}
