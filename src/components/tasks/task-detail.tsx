"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Check,
  ExternalLink,
  Loader2,
  Pencil,
  Trash2,
  Undo2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ErrorState } from "@/components/shared/error-state";
import { PriorityBadge } from "@/components/tasks/priority-badge";
import { StatusSelect } from "@/components/tasks/status-select";
import { useDeleteTask, useTask, useUpdateTaskStatus } from "@/hooks/use-tasks";
import { formatDate, formatDateTime, isOverdue } from "@/lib/format";
import { cn } from "@/lib/utils";

export function TaskDetail({ id }: { id: string }) {
  const router = useRouter();
  const { data: task, isLoading, isError, refetch } = useTask(id);
  const deleteMutation = useDeleteTask();
  const statusMutation = useUpdateTaskStatus();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !task) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  async function handleToggleComplete() {
    if (!task) return;
    const next = task.status === "completed" ? "pending" : "completed";
    statusMutation.mutate(
      { id: task.id, status: next },
      {
        onSuccess: () =>
          toast.success(
            next === "completed" ? "Tugas ditandai selesai" : "Status diperbarui"
          ),
        onError: () => toast.error("Gagal memperbarui status. Coba lagi."),
      }
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href="/tugas">
          <ArrowLeft />
          Kembali ke Daftar Tugas
        </Link>
      </Button>

      <Card>
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-xl leading-snug">{task.title}</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="muted">{task.subjects?.name ?? "—"}</Badge>
            <PriorityBadge priority={task.priority} />
            <StatusSelect task={task} />
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <CalendarDays className="size-3.5" />
                Deadline
              </p>
              <p
                className={cn(
                  "mt-1 text-sm",
                  isOverdue(task.deadline) && task.status !== "completed"
                    ? "font-medium text-destructive"
                    : ""
                )}
              >
                {task.deadline ? formatDateTime(task.deadline) : "Tidak ada deadline"}
                {isOverdue(task.deadline) && task.status !== "completed"
                  ? " · Terlambat"
                  : ""}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Dibuat
              </p>
              <p className="mt-1 text-sm">{formatDate(task.created_at)}</p>
            </div>
          </div>

          {task.description ? (
            <>
              <Separator />
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Deskripsi
                </p>
                <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed">
                  {task.description}
                </p>
              </div>
            </>
          ) : null}

          {task.materials ? (
            <>
              <Separator />
              <div>
                <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <BookOpen className="size-3.5" />
                  Materi Terkait
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <Link
                    href={`/materi/${task.materials.id}`}
                    className="text-sm font-medium underline-offset-4 hover:underline"
                  >
                    {task.materials.title}
                  </Link>
                  <Button asChild variant="outline" size="sm">
                    <a
                      href={task.materials.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink />
                      Buka Materi
                    </a>
                  </Button>
                </div>
              </div>
            </>
          ) : null}

          <Separator />

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(true)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 />
              Hapus
            </Button>
            <Button asChild variant="outline">
              <Link href={`/tugas/${task.id}/edit`}>
                <Pencil />
                Edit
              </Link>
            </Button>
            <Button onClick={handleToggleComplete} disabled={statusMutation.isPending}>
              {statusMutation.isPending ? (
                <Loader2 className="animate-spin" />
              ) : task.status === "completed" ? (
                <Undo2 />
              ) : (
                <Check />
              )}
              {task.status === "completed" ? "Buka Lagi" : "Tandai Selesai"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Hapus tugas?"
        description={`"${task.title}"\nTindakan ini tidak dapat dibatalkan.`}
        loading={deleteMutation.isPending}
        onConfirm={() => {
          deleteMutation.mutate(task.id, {
            onSuccess: () => {
              toast.success("Tugas berhasil dihapus");
              router.push("/tugas");
            },
            onError: () => toast.error("Gagal menghapus tugas. Coba lagi."),
          });
        }}
      />
    </div>
  );
}
