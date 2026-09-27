"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { sanitizeSearchQuery } from "@/lib/utils";
import type {
  MaterialWithSubject,
  TaskWithRelations,
  Subject,
  Student,
  ScheduleEntry,
} from "@/types";

export type GlobalSearchResults = {
  materials: MaterialWithSubject[];
  tasks: TaskWithRelations[];
  subjects: Subject[];
  students: Student[];
  schedule: ScheduleEntry[];
};

type SearchCategory = "materials" | "tasks" | "subjects" | "students" | "schedule";

export function useGlobalSearch(query: string, options?: { limit?: number; only?: SearchCategory[] }) {
  const q = sanitizeSearchQuery(query);
  const limit = options?.limit ?? 5;
  const only = options?.only;

  return useQuery<GlobalSearchResults>({
    queryKey: ["global-search", q, limit, only],
    enabled: q.length >= 1,
    queryFn: async () => {
      const supabase = createClient();
      const pattern = `%${q}%`;
      const want = (category: SearchCategory) => !only || only.includes(category);

      const [materials, tasks, subjects, students, schedule] = await Promise.all([
        want("materials")
          ? supabase
              .from("materials")
              .select("id, user_id, subject_id, title, description, url, created_at, updated_at, subjects(id, name, code)")
              .or(`title.ilike.${pattern},description.ilike.${pattern}`)
              .order("created_at", { ascending: false })
              .limit(limit)
          : Promise.resolve({ data: [], error: null }),
        want("tasks")
          ? supabase
              .from("tasks")
              .select("id, user_id, subject_id, material_id, title, priority, deadline, description, status, created_at, updated_at, subjects(id, name, code), materials(id, title, url)")
              .or(`title.ilike.${pattern},description.ilike.${pattern}`)
              .order("created_at", { ascending: false })
              .limit(limit)
          : Promise.resolve({ data: [], error: null }),
        want("subjects")
          ? supabase
              .from("subjects")
              .select("*")
              .or(`name.ilike.${pattern},code.ilike.${pattern}`)
              .order("name", { ascending: true })
              .limit(limit)
          : Promise.resolve({ data: [], error: null }),
        want("students")
          ? supabase
              .from("students")
              .select("*")
              .or(`full_name.ilike.${pattern},nickname.ilike.${pattern}`)
              .order("sort_no", { ascending: true })
              .limit(limit)
          : Promise.resolve({ data: [], error: null }),
        want("schedule")
          ? supabase
              .from("schedule_entries")
              .select("*")
              .or(`title.ilike.${pattern},detail.ilike.${pattern}`)
              .order("day_of_week", { ascending: true })
              .order("slot", { ascending: true })
              .limit(limit)
          : Promise.resolve({ data: [], error: null }),
      ]);

      const firstError =
        materials.error || tasks.error || subjects.error || students.error || schedule.error;
      if (firstError) throw firstError;

      return {
        materials: (materials.data ?? []) as MaterialWithSubject[],
        tasks: (tasks.data ?? []) as TaskWithRelations[],
        subjects: (subjects.data ?? []) as Subject[],
        students: (students.data ?? []) as Student[],
        schedule: (schedule.data ?? []) as ScheduleEntry[],
      };
    },
  });
}
