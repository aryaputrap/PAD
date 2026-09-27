"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Subject } from "@/types";

export function useSubjects() {
  return useQuery<Subject[]>({
    queryKey: ["subjects"],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .order("name", { ascending: true });
      if (error) throw error;
      return data as Subject[];
    },
  });
}
