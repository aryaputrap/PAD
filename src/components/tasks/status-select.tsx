"use client";

import { Circle, CircleCheck, CircleDashed, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateTaskStatus } from "@/hooks/use-tasks";
import { TASK_STATUSES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Task, TaskStatus } from "@/types";

const icons: Record<TaskStatus, typeof Circle> = {
  pending: Circle,
  in_progress: CircleDashed,
  completed: CircleCheck,
};

export function StatusSelect({ task }: { task: Pick<Task, "id" | "status"> }) {
  const mutation = useUpdateTaskStatus();

  function onChange(value: string) {
    const status = value as TaskStatus;
    if (status === task.status) return;
    mutation.mutate(
      { id: task.id, status },
      {
        onSuccess: () => {
          if (status === "completed") {
            toast.success("Tugas ditandai selesai");
          } else {
            toast.success("Status tugas diperbarui");
          }
        },
        onError: () => toast.error("Gagal memperbarui status tugas."),
      }
    );
  }

  const Icon = mutation.isPending ? Loader2 : icons[task.status];

  return (
    <Select value={task.status} onValueChange={onChange} disabled={mutation.isPending}>
      <SelectTrigger
        className={cn(
          "h-8 w-auto gap-2 border-transparent bg-transparent px-2 text-xs font-medium shadow-none hover:bg-accent [&>svg]:hidden",
          task.status === "completed" && "text-success"
        )}
        aria-label="Ubah status tugas"
        onClick={(e) => e.stopPropagation()}
      >
        <Icon className={cn("size-3.5", mutation.isPending && "animate-spin")} />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {TASK_STATUSES.map((s) => {
          const ItemIcon = icons[s.value];
          return (
            <SelectItem key={s.value} value={s.value}>
              <span className="flex items-center gap-2">
                <ItemIcon className="size-3.5" />
                {s.label}
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
