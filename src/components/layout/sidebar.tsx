"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export const NAV_ITEMS = [
  { href: "/jadwal", label: "Jadwal Pelajaran", icon: CalendarDays },
  { href: "/materi", label: "Materi Belajar", icon: BookOpen },
  { href: "/tugas", label: "Daftar Tugas", icon: ClipboardList },
  { href: "/siswa", label: "Daftar Siswa", icon: Users },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r bg-card lg:flex">
      <div className="flex h-14 items-center gap-2 border-b px-5">
        <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <GraduationCap className="size-4" />
        </span>
        <span className="text-sm font-semibold tracking-tight">
          Academic Dashboard
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/"
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-accent/60 hover:text-accent-foreground"
          )}
        >
          <LayoutDashboard className="size-4" />
          Dashboard
        </Link>

        <p className="px-3 pb-1 pt-4 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Academic
        </p>
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-accent-foreground"
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Separator />
      <div className="p-4">
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Kelas X Ar-Rahman
          <br />
          SMA Al Muslim · 2026/2027
        </p>
      </div>
    </aside>
  );
}
