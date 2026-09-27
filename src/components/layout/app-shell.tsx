"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SearchProvider } from "@/components/search/global-search";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { GraduationCap } from "lucide-react";

function SetupNotice() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <GraduationCap className="size-6" />
      </span>
      <h1 className="text-xl font-semibold">Konfigurasi Supabase diperlukan</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Aplikasi memerlukan koneksi ke Supabase. Buat file{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
          .env.local
        </code>{" "}
        berdasarkan{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
          .env.local.example
        </code>
        , jalankan migrasi database, lalu restart server development. Lihat
        README.md untuk panduan lengkap.
      </p>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <SearchProvider>
      <Sidebar />
      <div className="flex min-h-dvh flex-col lg:pl-60">
        <Topbar />
        <main className="flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-8">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {isSupabaseConfigured ? children : <SetupNotice />}
          </motion.div>
        </main>
      </div>
      <MobileNav />
    </SearchProvider>
  );
}
