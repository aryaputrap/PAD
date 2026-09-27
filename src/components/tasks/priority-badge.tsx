import { ArrowDown, ArrowUp, Minus, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TASK_PRIORITY_LABELS } from "@/lib/constants";
import type { TaskPriority } from "@/types";

const config: Record<
  TaskPriority,
  { icon: typeof Minus; variant: "muted" | "secondary" | "warning" | "destructive" }
> = {
  low: { icon: ArrowDown, variant: "muted" },
  normal: { icon: Minus, variant: "secondary" },
  high: { icon: ArrowUp, variant: "warning" },
  urgent: { icon: TriangleAlert, variant: "destructive" },
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const { icon: Icon, variant } = config[priority];
  return (
    <Badge variant={variant}>
      <Icon />
      {TASK_PRIORITY_LABELS[priority]}
    </Badge>
  );
}
