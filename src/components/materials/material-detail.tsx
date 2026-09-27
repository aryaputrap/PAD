"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  Link2,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ErrorState } from "@/components/shared/error-state";
import { useDeleteMaterial, useMaterial } from "@/hooks/use-materials";
import { formatDate } from "@/lib/format";

export function MaterialDetail({ id }: { id: string }) {
  const router = useRouter();
  const { data: material, isLoading, isError, refetch } = useMaterial(id);
  const deleteMutation = useDeleteMaterial();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !material) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href="/materi">
          <ArrowLeft />
          Kembali ke Materi Belajar
        </Link>
      </Button>

      <Card>
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-xl leading-snug">{material.title}</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="muted">{material.subjects?.name ?? "—"}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {material.description ? (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Deskripsi
              </p>
              <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed">
                {material.description}
              </p>
            </div>
          ) : null}

          <div>
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <Link2 className="size-3.5" />
              URL Materi
            </p>
            <a
              href={material.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 block truncate text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {material.url}
            </a>
            <Button asChild className="mt-3">
              <a
                href={material.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink />
                Buka Materi
              </a>
            </Button>
          </div>

          <Separator />

          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5" />
            Dibuat: {formatDate(material.created_at)}
          </p>

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
              <Link href={`/materi/${material.id}/edit`}>
                <Pencil />
                Edit
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Hapus Materi?"
        description={`"${material.title}"\nData ini akan dihapus secara permanen.`}
        loading={deleteMutation.isPending}
        onConfirm={() => {
          deleteMutation.mutate(material.id, {
            onSuccess: () => {
              toast.success("Materi berhasil dihapus");
              router.push("/materi");
            },
            onError: () => toast.error("Gagal menghapus materi. Coba lagi."),
          });
        }}
      />
    </div>
  );
}
