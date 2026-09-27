"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, Coffee } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { useTodaySchedule } from "@/hooks/use-schedule";
import { todayDayOfWeek } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function TodaySchedule() {
  const dayOfWeek = todayDayOfWeek();
  const { data, isLoading, isError, refetch } = useTodaySchedule(dayOfWeek);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-semibold">Jadwal Hari Ini</CardTitle>
        <Link
          href="/jadwal"
          className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Jadwal lengkap
          <ArrowRight className="size-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="pb-4">
        {dayOfWeek < 1 || dayOfWeek > 6 ? (
          <EmptyState
            icon={CalendarDays}
            title="Tidak ada jadwal"
            description="Hari Minggu tidak ada jadwal pelajaran."
            className="border-0 py-8"
          />
        ) : isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState className="border-0 py-8" onRetry={() => refetch()} />
        ) : !data || data.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="Tidak ada jadwal hari ini"
            className="border-0 py-8"
          />
        ) : (
          <ul className="divide-y">
            {data.map((entry) => (
              <li
                key={entry.id}
                className={cn(
                  "flex items-center gap-3 py-2 px-2 -mx-2 rounded-md",
                  entry.kind === "break" && "text-muted-foreground"
                )}
              >
                <span className="w-[92px] shrink-0 text-xs tabular-nums text-muted-foreground">
                  {entry.time_label}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                  {entry.title}
                  {entry.detail ? (
                    <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                      ({entry.detail})
                    </span>
                  ) : null}
                </span>
                {entry.kind === "break" ? (
                  <Coffee className="size-3.5 shrink-0 text-muted-foreground" />
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
