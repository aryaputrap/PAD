"use client";

import Link from "next/link";
import { ArrowRight, ClipboardList } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { useUpcomingTasks } from "@/hooks/use-tasks";
import { formatDateTime, isOverdue } from "@/lib/format";
import { PriorityBadge } from "@/components/tasks/priority-badge";
import { cn } from "@/lib/utils";

export function UpcomingTasks() {
  const { data, isLoading, isError, refetch } = useUpcomingTasks(5);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-semibold">
          Tugas Terdekat
        </CardTitle>
        <Link
          href="/tugas"
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
            icon={ClipboardList}
            title="Tidak ada tugas dengan deadline"
            description="Semua tugas sudah selesai atau belum ada deadline."
            actionLabel="+ Tambah Tugas"
            actionHref="/tugas/tambah"
            className="border-0 py-8"
          />
        ) : (
          <ul className="divide-y">
            {data.map((task) => (
              <li key={task.id}>
                <Link
                  href={`/tugas/${task.id}`}
                  className="flex items-center gap-3 py-2.5 transition-colors hover:bg-muted/40 rounded-md px-2 -mx-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {task.subjects?.name ?? "—"}
                    </p>
                  </div>
                  <PriorityBadge priority={task.priority} />
                  <span
                    className={cn(
                      "shrink-0 text-xs tabular-nums",
                      isOverdue(task.deadline)
                        ? "font-medium text-destructive"
                        : "text-muted-foreground"
                    )}
                  >
                    {task.deadline ? formatDateTime(task.deadline) : "—"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
