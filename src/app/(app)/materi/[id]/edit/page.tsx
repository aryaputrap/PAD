"use client";

import { useParams } from "next/navigation";
import { MaterialForm } from "@/components/materials/material-form";
import { PageHeader } from "@/components/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { useMaterial } from "@/hooks/use-materials";

export default function EditMateriPage() {
  const params = useParams<{ id: string }>();
  const { data: material, isLoading, isError, refetch } = useMaterial(params.id);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <PageHeader title="Edit Materi" />
      {isLoading ? (
        <Skeleton className="h-96 w-full rounded-xl" />
      ) : isError || !material ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <MaterialForm mode="edit" material={material} />
      )}
    </div>
  );
}
