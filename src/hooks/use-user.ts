"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";
import type { User } from "@supabase/supabase-js";

export function useUser() {
  return useQuery<{ user: User; profile: Profile | null }>({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const supabase = createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) throw error;
      if (!user) throw new Error("Sesi tidak ditemukan. Silakan masuk kembali.");

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      return { user, profile: profile as Profile | null };
    },
  });
}
