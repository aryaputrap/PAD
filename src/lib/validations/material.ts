import { z } from "zod";

export const materialSchema = z.object({
  title: z
    .string()
    .min(1, "Judul materi wajib diisi")
    .min(3, "Judul minimal 3 karakter")
    .max(120, "Judul maksimal 120 karakter"),
  subject_id: z.string().uuid("Mata pelajaran wajib dipilih").min(1, "Mata pelajaran wajib dipilih"),
  description: z
    .string()
    .max(500, "Deskripsi maksimal 500 karakter")
    .optional()
    .or(z.literal("")),
  url: z
    .string()
    .min(1, "URL materi wajib diisi")
    .url("URL tidak valid")
    .max(2048, "URL terlalu panjang"),
});

export type MaterialFormValues = z.infer<typeof materialSchema>;
