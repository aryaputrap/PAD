"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CalendarDays,
  ClipboardList,
  Home,
  Menu,
  Users,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const MORE_ITEMS = [
  { href: "/materi", label: "Materi Belajar", icon: BookOpen },
  { href: "/siswa", label: "Daftar Siswa", icon: Users },
] as const;

export function MobileNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const moreActive = MORE_ITEMS.some(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  );

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm lg:hidden"
        aria-label="Navigasi utama"
      >
        <div className="grid grid-cols-4">
          <MobileNavItem
            href="/"
            label="Home"
            icon={Home}
            active={pathname === "/"}
          />
          <MobileNavItem
            href="/jadwal"
            label="Jadwal"
            icon={CalendarDays}
            active={pathname === "/jadwal" || pathname.startsWith("/jadwal/")}
          />
          <MobileNavItem
            href="/tugas"
            label="Tugas"
            icon={ClipboardList}
            active={pathname === "/tugas" || pathname.startsWith("/tugas/")}
          />
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className={cn(
              "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
              moreActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Menu className="size-5" />
            Lainnya
          </button>
        </div>
      </nav>

      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Menu Lainnya</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-1">
            {MORE_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMoreOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors hover:bg-accent"
              >
                <item.icon className="size-4 text-muted-foreground" />
                {item.label}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function MobileNavItem({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: typeof Home;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className="size-5" />
      {label}
    </Link>
  );
}
