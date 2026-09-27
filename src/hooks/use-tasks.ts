"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { sanitizeSearchQuery } from "@/lib/utils";
import type { TaskStatus, TaskWithRelations } from "@/types";
import type { TaskFormValues } from "@/lib/validations/task";

const TASK_SELECT =
  "id, user_id, subject_id, material_id, title, priority, deadline, description, status, created_at, updated_at, subjects(id, name, code), materials(id, title, url)";

export function useTasks(params?: {
  search?: string;
  status?: TaskStatus | "all";
  priority?: string;
  subjectId?: string;
}) {
  const search = sanitizeSearchQuery(params?.search ?? "");
  const status = params?.status;
  const priority = params?.priority;
  const subjectId = params?.subjectId;

  return useQuery<TaskWithRelations[]>({
    queryKey: ["tasks", { search, status, priority, subjectId }],
    queryFn: async () => {
      const supabase = createClient();
      let query = supabase
        .from("tasks")
        .select(TASK_SELECT)
        .order("created_at", { ascending: false });

      if (search) {
        query = query.or(
          `title.ilike.%${search}%,description.ilike.%${search}%`
        );
      }
      if (status && status !== "all") {
        query = query.eq("status", status);
      }
      if (priority && priority !== "all") {
        query = query.eq("priority", priority);
      }
      if (subjectId && subjectId !== "all") {
        query = query.eq("subject_id", subjectId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as TaskWithRelations[];
    },
  });
}

export function useUpcomingTasks(limit = 5) {
  return useQuery<TaskWithRelations[]>({
    queryKey: ["tasks", "upcoming", limit],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("tasks")
        .select(TASK_SELECT)
        .neq("status", "completed")
        .not("deadline", "is", null)
        .order("deadline", { ascending: true })
        .limit(limit);
      if (error) throw error;
      return data as TaskWithRelations[];
    },
  });
}

export function useTask(id: string) {
  return useQuery<TaskWithRelations>({
    queryKey: ["tasks", "detail", id],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("tasks")
        .select(TASK_SELECT)
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as TaskWithRelations;
    },
    enabled: Boolean(id),
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: TaskFormValues) => {
      const supabase = createClient();
      const { error } = await supabase.from("tasks").insert({
        title: values.title,
        subject_id: values.subject_id,
        priority: values.priority,
        deadline: values.deadline ? new Date(values.deadline).toISOString() : null,
        description: values.description ? values.description : null,
        material_id: values.material_id ? values.material_id : null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useUpdateTask(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: TaskFormValues) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("tasks")
        .update({
          title: values.title,
          subject_id: values.subject_id,
          priority: values.priority,
          deadline: values.deadline ? new Date(values.deadline).toISOString() : null,
          description: values.description ? values.description : null,
          material_id: values.material_id ? values.material_id : null,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string; status: TaskStatus }) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("tasks")
        .update({ status: params.status })
        .eq("id", params.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
