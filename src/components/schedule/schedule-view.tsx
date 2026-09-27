"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Coffee } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useSchedule } from "@/hooks/use-schedule";
import { DAYS, DAY_LABELS, todayDayOfWeek } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ScheduleEntry } from "@/types";

function entryTime(entry: ScheduleEntry): string {
  return entry.note ?? entry.time_label;
}

export function ScheduleView({
  initialDay,
  initialSearch = "",
}: {
  initialDay?: number;
  initialSearch?: string;
}) {
  const today = todayDayOfWeek();
  const defaultDay = initialDay ?? (today >= 1 && today <= 6 ? today : 1);
  const [day, setDay] = useState<number>(defaultDay);
  const [search, setSearch] = useState(initialSearch);
  const debouncedSearch = useDebouncedValue(search, 350);

  const { data, isLoading, isError, refetch } = useSchedule(debouncedSearch);

  const searching = Boolean(debouncedSearch);

  // Grid structure: slot → { timeLabel, byDay }
  const slots = useMemo(() => {
    const map = new Map<
      number,
      { timeLabel: string; byDay: Map<number, ScheduleEntry> }
    >();
    for (const entry of data ?? []) {
      if (!map.has(entry.slot)) {
        map.set(entry.slot, { timeLabel: entry.time_label, byDay: new Map() });
      }
      map.get(entry.slot)!.byDay.set(entry.day_of_week, entry);
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, [data]);

  const dayEntries = useMemo(
    () =>
      (data ?? [])
        .filter((e) => e.day_of_week === day)
        .sort((a, b) => a.slot - b.slot),
    [data, day]
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title="Jadwal Pelajaran"
        description="Kelas X Ar-Rahman · SMA Al Muslim · Tahun Ajaran 2026/2027"
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Cari jadwal..."
          className="sm:w-72"
        />
        {!searching ? (
          <Tabs value={String(day)} onValueChange={(v) => setDay(Number(v))}>
            <TabsList className="w-full justify-start overflow-x-auto">
              {DAYS.map((d) => (
                <TabsTrigger
                  key={d.value}
                  value={String(d.value)}
                  className="flex-1 sm:flex-none"
                >
                  <span className="hidden sm:inline">{d.label}</span>
                  <span className="sm:hidden">{d.label.slice(0, 3)}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        ) : null}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : searching ? (
        // Hasil pencarian (semua hari)
        !data || data.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="Jadwal tidak ditemukan"
            description={`Tidak ada jadwal yang cocok dengan "${debouncedSearch}".`}
          />
        ) : (
          <div className="rounded-xl border bg-card">
            <ul className="divide-y">
              {data.map((entry) => (
                <li key={entry.id} className="flex items-center gap-3 px-4 py-3">
                  <Badge variant="muted" className="shrink-0">
                    {DAY_LABELS[entry.day_of_week]}
                  </Badge>
                  <span className="w-[96px] shrink-0 text-xs tabular-nums text-muted-foreground">
                    {entryTime(entry)}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {entry.title}
                    {entry.detail ? (
                      <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                        ({entry.detail})
                      </span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )
      ) : (
        <>
          {/* Mobile: daftar per hari */}
          <div className="rounded-xl border bg-card lg:hidden">
            {dayEntries.length === 0 ? (
              <EmptyState
                icon={CalendarDays}
                title="Tidak ada jadwal"
                className="rounded-none border-0"
              />
            ) : (
              <ul className="divide-y">
                {dayEntries.map((entry) => (
                  <li
                    key={entry.id}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3",
                      entry.kind === "break" && "text-muted-foreground"
                    )}
                  >
                    <span className="w-[92px] shrink-0 text-xs tabular-nums text-muted-foreground">
                      {entryTime(entry)}
                    </span>
                    <span className="min-w-0 flex-1 text-sm font-medium">
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
          </div>

          {/* Desktop: grid mingguan, hari ini di-highlight */}
          <div className="hidden rounded-xl border bg-card lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[110px]">Waktu</TableHead>
                  {DAYS.map((d) => (
                    <TableHead
                      key={d.value}
                      className={cn(
                        d.value === today && "bg-muted/60 text-foreground"
                      )}
                    >
                      {d.label}
                      {d.value === today ? (
                        <span className="ml-1.5 text-[10px] uppercase">• hari ini</span>
                      ) : null}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {slots.map(([slot, { timeLabel, byDay }]) => {
                  const isBreak = DAYS.some(
                    (d) => byDay.get(d.value)?.kind === "break"
                  );
                  return (
                    <TableRow key={slot}>
                      <TableCell className="whitespace-nowrap text-xs tabular-nums text-muted-foreground">
                        {timeLabel}
                      </TableCell>
                      {DAYS.map((d) => {
                        const entry = byDay.get(d.value);
                        return (
                          <TableCell
                            key={d.value}
                            className={cn(
                              "min-w-[140px]",
                              d.value === today && "bg-muted/60",
                              (!entry || entry.kind === "break" || isBreak) &&
                                "text-muted-foreground"
                            )}
                          >
                            {entry ? (
                              <span
                                className={cn(
                                  "text-xs leading-snug",
                                  entry.kind === "lesson" && "font-medium"
                                )}
                              >
                                {entry.title}
                                {entry.detail ? (
                                  <span className="block font-normal text-muted-foreground">
                                    ({entry.detail})
                                  </span>
                                ) : null}
                                {entry.note ? (
                                  <span className="block text-[10px] tabular-nums text-muted-foreground">
                                    {entry.note}
                                  </span>
                                ) : null}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground/60">
                                —
                              </span>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
