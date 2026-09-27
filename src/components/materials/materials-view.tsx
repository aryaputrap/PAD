"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PageHeader } from "@/components/layout/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useSubjects } from "@/hooks/use-subjects";
import { useDeleteMaterial, useMaterials } from "@/hooks/use-materials";
import { formatDateShort } from "@/lib/format";
import type { MaterialWithSubject } from "@/types";

export function MaterialsView({
  initialSearch = "",
  initialSubject = "",
}: {
  initialSearch?: string;
  initialSubject?: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [subjectId, setSubjectId] = useState(initialSubject || "all");
  const [deleteTarget, setDeleteTarget] = useState<MaterialWithSubject | null>(null);

  const debouncedSearch = useDebouncedValue(search, 350);

  const { data: subjects } = useSubjects();
  const { data, isLoading, isError, refetch } = useMaterials({
    search: debouncedSearch,
    subjectId: subjectId === "all" ? undefined : subjectId,
  });
  const deleteMutation = useDeleteMaterial();

  const hasFilter = Boolean(debouncedSearch) || subjectId !== "all";

  return (
    <div className="space-y-4">
      <PageHeader
        title="Materi Belajar"
        description="Kumpulan link materi dari Google Drive, Docs, YouTube, dan lainnya."
      >
        <Button asChild>
          <Link href="/materi/tambah">
            <Plus />
            Tambah Materi
          </Link>
        </Button>
      </PageHeader>

      <div className="flex flex-col gap-2 sm:flex-row">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Cari materi..."
          className="sm:w-72"
        />
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
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={hasFilter ? "Tidak ada materi yang cocok" : "Belum ada materi"}
          description={
            hasFilter
              ? "Coba ubah kata kunci atau filter mata pelajaran."
              : "Tambahkan materi belajar pertama kamu."
          }
          actionLabel="+ Tambah Materi"
          actionHref="/materi/tambah"
        />
      ) : (
        <div className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul</TableHead>
                <TableHead>Mapel</TableHead>
                <TableHead className="hidden md:table-cell">Deskripsi</TableHead>
                <TableHead className="hidden lg:table-cell">Dibuat</TableHead>
                <TableHead className="w-[120px]">
                  <span className="sr-only">Aksi</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((material) => (
                <TableRow
                  key={material.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/materi/${material.id}`)}
                >
                  <TableCell className="font-medium">
                    <span className="line-clamp-1">{material.title}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="muted">
                      {material.subjects?.name ?? "—"}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden max-w-[240px] md:table-cell">
                    <span className="line-clamp-1 text-xs text-muted-foreground">
                      {material.description ?? "—"}
                    </span>
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap text-xs text-muted-foreground tabular-nums lg:table-cell">
                    {formatDateShort(material.created_at)}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon-sm" asChild>
                            <a
                              href={material.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Buka ${material.title}`}
                            >
                              <ExternalLink />
                            </a>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Buka</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon-sm" asChild>
                            <Link
                              href={`/materi/${material.id}/edit`}
                              aria-label={`Edit ${material.title}`}
                            >
                              <Pencil />
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setDeleteTarget(material)}
                            aria-label={`Hapus ${material.title}`}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Hapus</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Hapus Materi?"
        description={`"${deleteTarget?.title}"\nData ini akan dihapus secara permanen.`}
        loading={deleteMutation.isPending}
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteMutation.mutate(deleteTarget.id, {
            onSuccess: () => {
              toast.success("Materi berhasil dihapus");
              setDeleteTarget(null);
            },
            onError: () => toast.error("Gagal menghapus materi. Coba lagi."),
          });
        }}
      />
    </div>
  );
}
