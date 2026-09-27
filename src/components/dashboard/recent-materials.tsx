"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { useRecentMaterials } from "@/hooks/use-materials";
import { formatRelative } from "@/lib/format";

export function RecentMaterials() {
  const { data, isLoading, isError, refetch } = useRecentMaterials(5);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-semibold">Materi Terbaru</CardTitle>
        <Link
          href="/materi"
          className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Lihat semua
          <ArrowRight className="size-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="pb-4">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState className="border-0 py-8" onRetry={() => refetch()} />
        ) : !data || data.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Belum ada materi"
            description="Tambahkan materi belajar pertama kamu."
            actionLabel="+ Tambah Materi"
            actionHref="/materi/tambah"
            className="border-0 py-8"
          />
        ) : (
          <ul className="divide-y">
            {data.map((material) => (
              <li key={material.id}>
                <Link
                  href={`/materi/${material.id}`}
                  className="flex items-center gap-3 py-2.5 transition-colors hover:bg-muted/40 rounded-md px-2 -mx-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {material.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {formatRelative(material.created_at)}
                    </p>
                  </div>
                  <Badge variant="muted">{material.subjects?.name}</Badge>
                  <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
