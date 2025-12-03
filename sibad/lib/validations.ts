import { z } from 'zod';

export const UsulanBantuanSchema = z.object({
  id: z.string().optional(),
  judul: z.string().min(1, 'Judul wajib diisi'),
  deskripsi: z.string().min(1, 'Deskripsi wajib diisi'),
  kategori: z.string().optional(),
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
});

export type UsulanBantuan = z.infer<typeof UsulanBantuanSchema>;
