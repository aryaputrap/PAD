"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { sanitizeSearchQuery } from "@/lib/utils";
import type { ScheduleEntry } from "@/types";

export function useSchedule(search?: string) {
  const q = sanitizeSearchQuery(search ?? "");

  return useQuery<ScheduleEntry[]>({
    queryKey: ["schedule", { search: q }],
    queryFn: async () => {
      const supabase = createClient();
      let query = supabase
        .from("schedule_entries")
        .select("*")
        .order("day_of_week", { ascending: true })
        .order("slot", { ascending: true });

      if (q) {
        query = query.or(`title.ilike.%${q}%,detail.ilike.%${q}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ScheduleEntry[];
    },
  });
}

export function useTodaySchedule(dayOfWeek: number) {
  return useQuery<ScheduleEntry[]>({
    queryKey: ["schedule", "today", dayOfWeek],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("schedule_entries")
        .select("*")
        .eq("day_of_week", dayOfWeek)
        .order("slot", { ascending: true });
      if (error) throw error;
      return data as ScheduleEntry[];
    },
    enabled: dayOfWeek >= 1 && dayOfWeek <= 6,
  });
}
