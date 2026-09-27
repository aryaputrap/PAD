"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  Search,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import {
  useGlobalSearch,
  type GlobalSearchResults,
} from "@/hooks/use-global-search";
import { DAY_LABELS, TASK_STATUS_LABELS } from "@/lib/constants";
import { formatDateShort } from "@/lib/format";
import type { TaskPriority } from "@/types";
import { TASK_PRIORITY_LABELS } from "@/lib/constants";

type TabValue = "all" | "materials" | "tasks" | "subjects" | "students" | "schedule";

const TABS: { value: TabValue; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "materials", label: "Materi" },
  { value: "tasks", label: "Tugas" },
  { value: "subjects", label: "Mapel" },
  { value: "students", label: "Siswa" },
  { value: "schedule", label: "Jadwal" },
];

export function SearchView({
  initialQuery = "",
  initialTab = "all",
}: {
  initialQuery?: string;
  initialTab?: TabValue;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [tab, setTab] = useState<TabValue>(initialTab);
  const debouncedQuery = useDebouncedValue(query, 350);

  const { data, isLoading, isError, refetch } = useGlobalSearch(debouncedQuery, {
    limit: 20,
    only: tab === "all" ? undefined : [tab],
  });

  function updateUrl(nextQuery: string, nextTab: TabValue) {
    const params = new URLSearchParams();
    if (nextQuery) params.set("q", nextQuery);
    if (nextTab !== "all") params.set("tab", nextTab);
    router.replace(`/search${params.size ? `?${params.toString()}` : ""}`, {
      scroll: false,
    });
  }

  const searching = debouncedQuery.trim().length > 0;
  const total =
    (data?.materials.length ?? 0) +
    (data?.tasks.length ?? 0) +
    (data?.subjects.length ?? 0) +
    (data?.students.length ?? 0) +
    (data?.schedule.length ?? 0);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Pencarian"
        description="Cari materi, tugas, mata pelajaran, siswa, dan jadwal."
      />

      <div className="flex flex-col gap-3">
        <SearchInput
          value={query}
          onChange={(v) => {
            setQuery(v);
            updateUrl(v, tab);
          }}
          placeholder="Cari apa saja... (mis. matematika)"
          className="sm:w-96"
        />
        <Tabs
          value={tab}
          onValueChange={(v) => {
            const next = v as TabValue;
            setTab(next);
            updateUrl(query, next);
          }}
        >
          <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
            {TABS.map((t) => (
              <TabsTrigger key={t.value} value={t.value} className="flex-1 sm:flex-none">
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {!searching ? (
        <EmptyState
          icon={Search}
          title="Mulai mengetik untuk mencari"
          description="Hasil akan dikelompokkan per kategori: materi, tugas, mapel, siswa, dan jadwal."
        />
      ) : isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !data || total === 0 ? (
        <EmptyState
          icon={Search}
          title={`Tidak ada hasil untuk "${debouncedQuery}"`}
          description="Coba kata kunci lain atau periksa ejaan."
        />
      ) : (
        <div className="space-y-6">
          <p className="text-xs text-muted-foreground">
            {total} hasil untuk &quot;{debouncedQuery}&quot;
          </p>

          {data.materials.length > 0 && (
            <ResultSection title="MATERI" icon={BookOpen}>
              {data.materials.map((m) => (
                <ResultRow
                  key={m.id}
                  href={`/materi/${m.id}`}
                  title={m.title}
                  subtitle={m.description ?? undefined}
                >
                  <Badge variant="muted">{m.subjects?.name}</Badge>
                </ResultRow>
              ))}
            </ResultSection>
          )}

          {data.tasks.length > 0 && (
            <ResultSection title="TUGAS" icon={ClipboardList}>
              {data.tasks.map((t) => (
                <ResultRow
                  key={t.id}
                  href={`/tugas/${t.id}`}
                  title={t.title}
                  subtitle={
                    t.deadline
                      ? `Deadline: ${formatDateShort(t.deadline)}`
                      : undefined
                  }
                >
                  <Badge variant="muted">
                    {TASK_PRIORITY_LABELS[t.priority as TaskPriority]}
                  </Badge>
                  <Badge variant="muted">{TASK_STATUS_LABELS[t.status]}</Badge>
                  <Badge variant="muted">{t.subjects?.name}</Badge>
                </ResultRow>
              ))}
            </ResultSection>
          )}

          {data.subjects.length > 0 && (
            <ResultSection title="MATA PELAJARAN" icon={GraduationCap}>
              {data.subjects.map((s) => (
                <ResultRow key={s.id} href={`/materi?subject=${s.id}`} title={s.name}>
                  {s.code ? <Badge variant="muted">{s.code}</Badge> : null}
                </ResultRow>
              ))}
            </ResultSection>
          )}

          {data.students.length > 0 && (
            <ResultSection title="SISWA" icon={Users}>
              {data.students.map((s) => (
                <ResultRow
                  key={s.id}
                  href={`/siswa?q=${encodeURIComponent(s.full_name)}`}
                  title={s.full_name}
                  subtitle={s.class_name}
                >
                  {s.nickname ? <Badge variant="muted">{s.nickname}</Badge> : null}
                  <Badge variant="muted">
                    {s.gender === "L" ? "Laki-laki" : "Perempuan"}
                  </Badge>
                </ResultRow>
              ))}
            </ResultSection>
          )}

          {data.schedule.length > 0 && (
            <ResultSection title="JADWAL" icon={CalendarDays}>
              {data.schedule.map((sc) => (
                <ResultRow
                  key={sc.id}
                  href={`/jadwal?day=${sc.day_of_week}`}
                  title={sc.title}
                  subtitle={`${DAY_LABELS[sc.day_of_week]} · ${sc.note ?? sc.time_label}${
                    sc.detail ? ` · ${sc.detail}` : ""
                  }`}
                >
                  <Badge variant="muted">{DAY_LABELS[sc.day_of_week]}</Badge>
                </ResultRow>
              ))}
            </ResultSection>
          )}
        </div>
      )}
    </div>
  );
}

function ResultSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof BookOpen;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <Icon className="size-3.5" />
        {title}
      </h2>
      <ul className="divide-y rounded-xl border bg-card">{children}</ul>
    </section>
  );
}

function ResultRow({
  href,
  title,
  subtitle,
  children,
}: {
  href: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40"
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">{title}</span>
          {subtitle ? (
            <span className="block truncate text-xs text-muted-foreground">
              {subtitle}
            </span>
          ) : null}
        </span>
        <span className="flex flex-wrap items-center justify-end gap-1">
          {children}
        </span>
      </Link>
    </li>
  );
}

export type { GlobalSearchResults };
