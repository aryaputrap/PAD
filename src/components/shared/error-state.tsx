"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function ErrorState({
  title = "Something went wrong",
  description = "Data tidak dapat dimuat. Silakan coba lagi.",
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-14 text-center",
        className
      )}
    >
      <div className="flex size-11 items-center justify-center rounded-full bg-destructive/10">
        <TriangleAlert className="size-5 text-destructive" />
      </div>
      <p className="mt-2 text-sm font-medium">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      {onRetry ? (
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={onRetry}
        >
          <RotateCcw />
          Coba Lagi
        </Button>
      ) : null}
    </div>
  );
}
