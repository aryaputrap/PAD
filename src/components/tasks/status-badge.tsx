import { Circle, CircleDashed, CircleCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TASK_STATUS_LABELS } from "@/lib/constants";
import type { TaskStatus } from "@/types";

const config: Record<
  TaskStatus,
  { icon: typeof Circle; variant: "outline" | "secondary" | "success" }
> = {
  pending: { icon: Circle, variant: "outline" },
  in_progress: { icon: CircleDashed, variant: "secondary" },
  completed: { icon: CircleCheck, variant: "success" },
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  const { icon: Icon, variant } = config[status];
  return (
    <Badge variant={variant}>
      <Icon />
      {TASK_STATUS_LABELS[status]}
    </Badge>
  );
}
