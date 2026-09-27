"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { sanitizeSearchQuery } from "@/lib/utils";
import type { MaterialWithSubject } from "@/types";
import type { MaterialFormValues } from "@/lib/validations/material";

const MATERIAL_SELECT = "id, user_id, subject_id, title, description, url, created_at, updated_at, subjects(id, name, code)";

export function useMaterials(params?: { search?: string; subjectId?: string }) {
  const search = sanitizeSearchQuery(params?.search ?? "");
  const subjectId = params?.subjectId;

  return useQuery<MaterialWithSubject[]>({
    queryKey: ["materials", { search, subjectId }],
    queryFn: async () => {
      const supabase = createClient();
      let query = supabase
        .from("materials")
        .select(MATERIAL_SELECT)
        .order("created_at", { ascending: false });

      if (search) {
        query = query.or(
          `title.ilike.%${search}%,description.ilike.%${search}%`
        );
      }
      if (subjectId) {
        query = query.eq("subject_id", subjectId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as MaterialWithSubject[];
    },
  });
}

export function useRecentMaterials(limit = 5) {
  return useQuery<MaterialWithSubject[]>({
    queryKey: ["materials", "recent", limit],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("materials")
        .select(MATERIAL_SELECT)
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data as MaterialWithSubject[];
    },
  });
}

export function useMaterial(id: string) {
  return useQuery<MaterialWithSubject>({
    queryKey: ["materials", "detail", id],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("materials")
        .select(MATERIAL_SELECT)
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as MaterialWithSubject;
    },
    enabled: Boolean(id),
  });
}

export function useCreateMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: MaterialFormValues) => {
      const supabase = createClient();
      const { error } = await supabase.from("materials").insert({
        title: values.title,
        subject_id: values.subject_id,
        description: values.description ? values.description : null,
        url: values.url,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
  });
}

export function useUpdateMaterial(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: MaterialFormValues) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("materials")
        .update({
          title: values.title,
          subject_id: values.subject_id,
          description: values.description ? values.description : null,
          url: values.url,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
  });
}

export function useDeleteMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase.from("materials").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
