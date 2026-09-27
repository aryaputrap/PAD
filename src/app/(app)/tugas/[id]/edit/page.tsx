"use client";

import { useParams } from "next/navigation";
import { TaskForm } from "@/components/tasks/task-form";
import { PageHeader } from "@/components/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { useTask } from "@/hooks/use-tasks";

export default function EditTugasPage() {
  const params = useParams<{ id: string }>();
  const { data: task, isLoading, isError, refetch } = useTask(params.id);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <PageHeader title="Edit Tugas" />
      {isLoading ? (
        <Skeleton className="h-96 w-full rounded-xl" />
      ) : isError || !task ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <TaskForm mode="edit" task={task} />
      )}
    </div>
  );
}
