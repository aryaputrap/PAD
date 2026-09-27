"use client";

import Link from "next/link";
import { BookOpen, ClipboardList, GraduationCap, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { useDashboardStats } from "@/hooks/use-dashboard";
import { motion } from "motion/react";

const ITEMS = [
  { key: "activeTasks", label: "Tugas Aktif", icon: ClipboardList, href: "/tugas" },
  { key: "materials", label: "Materi", icon: BookOpen, href: "/materi" },
  { key: "subjects", label: "Mata Pelajaran", icon: GraduationCap, href: "/materi" },
  { key: "students", label: "Siswa", icon: Users, href: "/siswa" },
] as const;

export function StatCards() {
  const { data, isLoading, isError, refetch } = useDashboardStats();

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {ITEMS.map((item, i) => (
        <motion.div
          key={item.key}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: i * 0.05, ease: "easeOut" }}
        >
          <Link href={item.href} className="block">
            <Card className="transition-colors hover:border-foreground/20">
              <CardContent className="flex items-center justify-between p-4 sm:p-5">
                <div className="min-w-0">
                  {isLoading ? (
                    <Skeleton className="mb-1.5 h-8 w-12" />
                  ) : (
                    <p className="text-2xl font-semibold tabular-nums tracking-tight sm:text-3xl">
                      {data?.[item.key] ?? 0}
                    </p>
                  )}
                  <p className="truncate text-xs font-medium text-muted-foreground sm:text-sm">
                    {item.label}
                  </p>
                </div>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <item.icon className="size-4" />
                </span>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
