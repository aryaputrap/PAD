"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  Search,
  Users,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useGlobalSearch } from "@/hooks/use-global-search";
import { DAY_LABELS, TASK_STATUS_LABELS } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/supabase/client";

type SearchContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const SearchContext = createContext<SearchContextValue>({
  open: false,
  setOpen: () => {},
});

export function useSearchDialog() {
  return useContext(SearchContext);
}

export function SearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 350);
  const router = useRouter();
  const { data, isLoading } = useGlobalSearch(debouncedQuery, { limit: 5 });

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next);
    if (!next) setQuery("");
  }, []);

  function navigate(href: string) {
    handleOpenChange(false);
    router.push(href);
  }

  const hasResults = Boolean(
    data &&
      (data.materials.length ||
        data.tasks.length ||
        data.subjects.length ||
        data.students.length ||
        data.schedule.length)
  );

  return (
    <SearchContext.Provider value={{ open, setOpen }}>
      {children}
      <CommandDialog open={open} onOpenChange={handleOpenChange}>
        <CommandInput
          placeholder="Cari materi, tugas, siswa, jadwal..."
          value={query}
          onValueChange={setQuery}
          aria-label="Pencarian global"
        />
        <CommandList>
          {query.trim().length === 0 ? (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">
              Ketik untuk mencari di seluruh aplikasi.
              <span className="mt-1 block text-xs">
                Materi · Tugas · Mata Pelajaran · Siswa · Jadwal
              </span>
            </div>
          ) : isLoading ? (
            <div className="space-y-2 p-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-9 animate-pulse rounded-md bg-muted" />
              ))}
            </div>
          ) : !hasResults ? (
            <CommandEmpty>
              Tidak ada hasil untuk &quot;{debouncedQuery}&quot;.
            </CommandEmpty>
          ) : (
            <>
              {data && data.materials.length > 0 && (
                <CommandGroup heading="MATERI">
                  {data.materials.map((m) => (
                    <CommandItem
                      key={m.id}
                      value={`materi-${m.title}`}
                      onSelect={() => navigate(`/materi/${m.id}`)}
                    >
                      <BookOpen className="text-muted-foreground" />
                      <span className="flex-1 truncate">{m.title}</span>
                      <Badge variant="muted">{m.subjects?.name}</Badge>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {data && data.tasks.length > 0 && (
                <CommandGroup heading="TUGAS">
                  {data.tasks.map((t) => (
                    <CommandItem
                      key={t.id}
                      value={`tugas-${t.title}`}
                      onSelect={() => navigate(`/tugas/${t.id}`)}
                    >
                      <ClipboardList className="text-muted-foreground" />
                      <span className="flex-1 truncate">{t.title}</span>
                      <Badge variant="muted">
                        {TASK_STATUS_LABELS[t.status]}
                      </Badge>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {data && data.subjects.length > 0 && (
                <CommandGroup heading="MATA PELAJARAN">
                  {data.subjects.map((s) => (
                    <CommandItem
                      key={s.id}
                      value={`mapel-${s.name}`}
                      onSelect={() => navigate(`/materi?subject=${s.id}`)}
                    >
                      <GraduationCap className="text-muted-foreground" />
                      <span className="flex-1 truncate">{s.name}</span>
                      {s.code ? (
                        <Badge variant="muted">{s.code}</Badge>
                      ) : null}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {data && data.students.length > 0 && (
                <CommandGroup heading="SISWA">
                  {data.students.map((s) => (
                    <CommandItem
                      key={s.id}
                      value={`siswa-${s.full_name}`}
                      onSelect={() => navigate(`/siswa?q=${encodeURIComponent(s.full_name)}`)}
                    >
                      <Users className="text-muted-foreground" />
                      <span className="flex-1 truncate">{s.full_name}</span>
                      {s.nickname ? (
                        <Badge variant="muted">{s.nickname}</Badge>
                      ) : null}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {data && data.schedule.length > 0 && (
                <CommandGroup heading="JADWAL">
                  {data.schedule.map((sc) => (
                    <CommandItem
                      key={sc.id}
                      value={`jadwal-${sc.day_of_week}-${sc.slot}-${sc.title}`}
                      onSelect={() =>
                        navigate(`/jadwal?day=${sc.day_of_week}&q=${encodeURIComponent(sc.title)}`)
                      }
                    >
                      <CalendarDays className="text-muted-foreground" />
                      <span className="flex-1 truncate">{sc.title}</span>
                      <Badge variant="muted">
                        {DAY_LABELS[sc.day_of_week]} · {sc.time_label}
                      </Badge>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              <div className="border-t p-2">
                <CommandItem
                  value="__lihat-semua__"
                  onSelect={() =>
                    navigate(`/search?q=${encodeURIComponent(debouncedQuery)}`)
                  }
                >
                  <Search className="text-muted-foreground" />
                  Lihat semua hasil untuk &quot;{debouncedQuery}&quot;
                </CommandItem>
              </div>
            </>
          )}
          {!isSupabaseConfigured ? (
            <div className="px-3 py-3 text-xs text-muted-foreground">
              Supabase belum dikonfigurasi — isi variabel lingkungan di
              .env.local.
            </div>
          ) : null}
        </CommandList>
      </CommandDialog>
    </SearchContext.Provider>
  );
}

export function SearchTrigger() {
  const { setOpen } = useSearchDialog();
  return (
    <>
      {/* Desktop trigger */}
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="hidden w-64 justify-start gap-2 text-muted-foreground lg:flex"
        aria-label="Buka pencarian global"
      >
        <Search className="size-4" />
        <span className="flex-1 text-left text-sm">Cari apa saja...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
          Ctrl K
        </kbd>
      </Button>
      {/* Mobile trigger */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="lg:hidden"
        aria-label="Buka pencarian"
      >
        <Search className="size-4" />
      </Button>
    </>
  );
}
