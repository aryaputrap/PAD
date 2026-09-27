import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Judul tugas wajib diisi")
    .min(3, "Judul minimal 3 karakter")
    .max(160, "Judul maksimal 160 karakter"),
  subject_id: z.string().uuid("Mata pelajaran wajib dipilih").min(1, "Mata pelajaran wajib dipilih"),
  priority: z.enum(["low", "normal", "high", "urgent"], {
    required_error: "Prioritas wajib dipilih",
  }),
  deadline: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => {
        if (!val) return true;
        return !Number.isNaN(new Date(val).getTime());
      },
      { message: "Deadline harus berupa tanggal/waktu yang valid" }
    ),
  description: z
    .string()
    .max(1000, "Deskripsi maksimal 1000 karakter")
    .optional()
    .or(z.literal("")),
  material_id: z
    .string()
    .uuid("Materi tidak valid")
    .optional()
    .or(z.literal("")),
});

export type TaskFormValues = z.infer<typeof taskSchema>;

export const taskStatusSchema = z.enum(["pending", "in_progress", "completed"]);
