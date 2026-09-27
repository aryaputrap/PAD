"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
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
import { taskSchema, type TaskFormValues } from "@/lib/validations/task";
import { TASK_PRIORITIES } from "@/lib/constants";
import { useSubjects } from "@/hooks/use-subjects";
import { useMaterials } from "@/hooks/use-materials";
import { useCreateTask, useUpdateTask } from "@/hooks/use-tasks";
import type { TaskWithRelations } from "@/types";

const NONE_VALUE = "__none__";

export function TaskForm({
  task,
  mode,
}: {
  task?: TaskWithRelations;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const { data: subjects, isLoading: subjectsLoading } = useSubjects();
  const { data: materials, isLoading: materialsLoading } = useMaterials();

  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask(task?.id ?? "");
  const isPending = createMutation.isPending || updateMutation.isPending;

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title ?? "",
      subject_id: task?.subject_id ?? "",
      priority: task?.priority ?? "normal",
      deadline: task?.deadline
        ? format(new Date(task.deadline), "yyyy-MM-dd'T'HH:mm")
        : "",
      description: task?.description ?? "",
      material_id: task?.material_id ?? "",
    },
  });

  const selectedSubjectId = form.watch("subject_id");

  async function onSubmit(values: TaskFormValues) {
    try {
      if (mode === "create") {
        await createMutation.mutateAsync(values);
        toast.success("Tugas berhasil ditambahkan");
      } else {
        await updateMutation.mutateAsync(values);
        toast.success("Tugas berhasil diperbarui");
      }
      router.push("/tugas");
    } catch {
      toast.error(
        mode === "create"
          ? "Gagal menambahkan tugas. Coba lagi."
          : "Gagal memperbarui tugas. Coba lagi."
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
                    <FormLabel>Judul Tugas *</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Latihan SPLDV" {...field} />
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
                      onValueChange={(v) => {
                        field.onChange(v);
                        form.setValue("material_id", "");
                      }}
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

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioritas *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Prioritas" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TASK_PRIORITIES.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
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
                      placeholder="Catatan tambahan tentang tugas ini..."
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
              name="material_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Materi Terkait</FormLabel>
                  <Select
                    onValueChange={(v) =>
                      field.onChange(v === NONE_VALUE ? "" : v)
                    }
                    value={field.value || NONE_VALUE}
                    disabled={materialsLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Materi (opsional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={NONE_VALUE}>
                        Tanpa materi terkait
                      </SelectItem>
                      {materials
                        ?.filter(
                          (m) =>
                            !selectedSubjectId ||
                            m.subject_id === selectedSubjectId
                        )
                        .map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.title} — {m.subjects?.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
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
                {mode === "create" ? "Simpan Tugas" : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
