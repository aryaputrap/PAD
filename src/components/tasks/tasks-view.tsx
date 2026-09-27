"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  BookOpen,
  Check,
  ClipboardList,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/layout/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { PriorityBadge } from "@/components/tasks/priority-badge";
import { StatusSelect } from "@/components/tasks/status-select";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useSubjects } from "@/hooks/use-subjects";
import { useDeleteTask, useTasks, useUpdateTaskStatus } from "@/hooks/use-tasks";
import { TASK_PRIORITIES, TASK_STATUSES } from "@/lib/constants";
import { formatDateTime, isOverdue } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { TaskWithRelations } from "@/types";

export function TasksView() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [priority, setPriority] = useState<string>("all");
  const [subjectId, setSubjectId] = useState<string>("all");
  const [deleteTarget, setDeleteTarget] = useState<TaskWithRelations | null>(null);

  const debouncedSearch = useDebouncedValue(search, 350);

  const { data: subjects } = useSubjects();
  const { data, isLoading, isError, refetch } = useTasks({
    search: debouncedSearch,
    status: status as never,
    priority,
    subjectId,
  });
  const deleteMutation = useDeleteTask();
  const statusMutation = useUpdateTaskStatus();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const columns = useMemo<ColumnDef<TaskWithRelations>[]>(
    () => [
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => <StatusSelect task={row.original} />,
      },
      {
        id: "title",
        header: "Judul",
        cell: ({ row }) => (
          <div className="min-w-[160px]">
            <p className="font-medium leading-tight">{row.original.title}</p>
            {row.original.materials ? (
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <BookOpen className="size-3" />
                <span className="truncate">{row.original.materials.title}</span>
              </p>
            ) : null}
          </div>
        ),
      },
      {
        id: "subject",
        header: "Mapel",
        cell: ({ row }) => (
          <Badge variant="muted">{row.original.subjects?.name ?? "—"}</Badge>
        ),
      },
      {
        id: "priority",
        header: "Prioritas",
        cell: ({ row }) => <PriorityBadge priority={row.original.priority} />,
      },
      {
        id: "deadline",
        header: "Deadline",
        cell: ({ row }) =>
          row.original.deadline ? (
            <span
              className={cn(
                "whitespace-nowrap text-xs tabular-nums",
                isOverdue(row.original.deadline) &&
                  row.original.status !== "completed"
                  ? "font-medium text-destructive"
                  : "text-muted-foreground"
              )}
            >
              {formatDateTime(row.original.deadline)}
              {isOverdue(row.original.deadline) &&
                row.original.status !== "completed" &&
                " · Terlambat"}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          ),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Aksi</span>,
        cell: ({ row }) => {
          const task = row.original;
          return (
            <div onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Aksi untuk ${task.title}`}
                  >
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => router.push(`/tugas/${task.id}`)}
                  >
                    <ClipboardList />
                    Detail
                  </DropdownMenuItem>
                  {task.materials ? (
                    <DropdownMenuItem asChild>
                      <a
                        href={task.materials.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink />
                        Buka Materi
                      </a>
                    </DropdownMenuItem>
                  ) : null}
                  <DropdownMenuItem
                    onClick={() => router.push(`/tugas/${task.id}/edit`)}
                  >
                    <Pencil />
                    Edit
                  </DropdownMenuItem>
                  {task.status !== "completed" ? (
                    <DropdownMenuItem
                      onClick={() => {
                        setPendingId(task.id);
                        statusMutation.mutate(
                          { id: task.id, status: "completed" },
                          {
                            onSuccess: () => {
                              toast.success("Tugas ditandai selesai");
                              setPendingId(null);
                            },
                            onError: () => {
                              toast.error("Gagal memperbarui status.");
                              setPendingId(null);
                            },
                          }
                        );
                      }}
                      disabled={statusMutation.isPending}
                    >
                      <Check />
                      Tandai Selesai
                    </DropdownMenuItem>
                  ) : null}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setDeleteTarget(task)}
                  >
                    <Trash2 />
                    Hapus
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {pendingId === task.id ? (
                <span className="sr-only">Memperbarui...</span>
              ) : null}
            </div>
          );
        },
      },
    ],
    [router, statusMutation, pendingId]
  );

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const hasFilter =
    debouncedSearch || status !== "all" || priority !== "all" || subjectId !== "all";

  return (
    <div className="space-y-4">
      <PageHeader
        title="Daftar Tugas"
        description="Kelola semua tugas akademikmu."
      >
        <Button asChild>
          <Link href="/tugas/tambah">
            <Plus />
            Tambah Tugas
          </Link>
        </Button>
      </PageHeader>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Cari tugas..."
          className="sm:w-64"
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="sm:w-48" aria-label="Filter status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            {TASK_STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="sm:w-44" aria-label="Filter prioritas">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Prioritas</SelectItem>
            {TASK_PRIORITIES.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={subjectId} onValueChange={setSubjectId}>
          <SelectTrigger className="sm:w-56" aria-label="Filter mata pelajaran">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Mata Pelajaran</SelectItem>
            {subjects?.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title={hasFilter ? "Tidak ada tugas yang cocok" : "Tidak ada tugas"}
          description={
            hasFilter
              ? "Coba ubah kata kunci atau filter."
              : "Semua tugas sudah selesai atau belum ada tugas."
          }
          actionLabel="+ Tambah Tugas"
          actionHref="/tugas/tambah"
        />
      ) : (
        <div className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/tugas/${row.original.id}`)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Hapus tugas?"
        description={`"${deleteTarget?.title}"\nTindakan ini tidak dapat dibatalkan.`}
        loading={deleteMutation.isPending}
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteMutation.mutate(deleteTarget.id, {
            onSuccess: () => {
              toast.success("Tugas berhasil dihapus");
              setDeleteTarget(null);
            },
            onError: () => toast.error("Gagal menghapus tugas. Coba lagi."),
          });
        }}
      />
    </div>
  );
}
