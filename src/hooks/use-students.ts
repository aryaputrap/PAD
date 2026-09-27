"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { sanitizeSearchQuery } from "@/lib/utils";
import type { Student } from "@/types";

export function useStudents(search?: string) {
  const q = sanitizeSearchQuery(search ?? "");

  return useQuery<Student[]>({
    queryKey: ["students", { search: q }],
    queryFn: async () => {
      const supabase = createClient();
      let query = supabase
        .from("students")
        .select("*")
        .order("sort_no", { ascending: true });

      if (q) {
        query = query.or(`full_name.ilike.%${q}%,nickname.ilike.%${q}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Student[];
    },
  });
}
