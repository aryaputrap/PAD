"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export type DashboardStats = {
  activeTasks: number;
  materials: number;
  subjects: number;
  students: number;
};

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const supabase = createClient();

      const [tasks, materials, subjects, students] = await Promise.all([
        supabase
          .from("tasks")
          .select("id", { count: "exact", head: true })
          .neq("status", "completed"),
        supabase.from("materials").select("id", { count: "exact", head: true }),
        supabase.from("subjects").select("id", { count: "exact", head: true }),
        supabase.from("students").select("id", { count: "exact", head: true }),
      ]);

      const firstError =
        tasks.error || materials.error || subjects.error || students.error;
      if (firstError) throw firstError;

      return {
        activeTasks: tasks.count ?? 0,
        materials: materials.count ?? 0,
        subjects: subjects.count ?? 0,
        students: students.count ?? 0,
      };
    },
  });
}
