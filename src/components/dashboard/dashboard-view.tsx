"use client";

import Link from "next/link";
import { BookOpen, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCards } from "@/components/dashboard/stat-cards";
import { UpcomingTasks } from "@/components/dashboard/upcoming-tasks";
import { RecentMaterials } from "@/components/dashboard/recent-materials";
import { TodaySchedule } from "@/components/dashboard/today-schedule";
import { useUser } from "@/hooks/use-user";
import { formatDate, greetingByTime } from "@/lib/format";

export function DashboardView() {
  const { data } = useUser();
  const name = data?.profile?.full_name?.split(" ")[0] ?? "Arya";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {greetingByTime()}, {name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatDate(new Date())} — berikut ringkasan akademikmu.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/materi/tambah">
              <BookOpen />
              Tambah Materi
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/tugas/tambah">
              <ClipboardList />
              Tambah Tugas
            </Link>
          </Button>
        </div>
      </div>

      <StatCards />

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <UpcomingTasks />
        </div>
        <div className="lg:col-span-2">
          <TodaySchedule />
        </div>
      </div>

      <RecentMaterials />
    </div>
  );
}
