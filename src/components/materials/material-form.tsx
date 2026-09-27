"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { materialSchema, type MaterialFormValues } from "@/lib/validations/material";
import { useSubjects } from "@/hooks/use-subjects";
import { useCreateMaterial, useUpdateMaterial } from "@/hooks/use-materials";
import type { MaterialWithSubject } from "@/types";

export function MaterialForm({
  material,
  mode,
}: {
  material?: MaterialWithSubject;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const { data: subjects, isLoading: subjectsLoading } = useSubjects();

  const createMutation = useCreateMaterial();
  const updateMutation = useUpdateMaterial(material?.id ?? "");
  const isPending = createMutation.isPending || updateMutation.isPending;

  const form = useForm<MaterialFormValues>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      title: material?.title ?? "",
      subject_id: material?.subject_id ?? "",
      description: material?.description ?? "",
      url: material?.url ?? "",
    },
  });

  async function onSubmit(values: MaterialFormValues) {
    try {
      if (mode === "create") {
        await createMutation.mutateAsync(values);
        toast.success("Materi berhasil ditambahkan");
      } else {
        await updateMutation.mutateAsync(values);
        toast.success("Materi berhasil diperbarui");
      }
      router.push("/materi");
    } catch {
      toast.error(
        mode === "create"
          ? "Gagal menambahkan materi. Coba lagi."
          : "Gagal memperbarui materi. Coba lagi."
      );
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul Materi *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Contoh: Sistem Persamaan Linear"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mata Pelajaran *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={subjectsLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Mata Pelajaran" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects?.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ringkasan singkat materi (opsional)..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Materi *</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      inputMode="url"
                      placeholder="https://..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isPending}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : null}
                {mode === "create" ? "Simpan Materi" : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
