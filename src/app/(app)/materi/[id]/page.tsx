import { MaterialDetail } from "@/components/materials/material-detail";

export default async function MateriDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MaterialDetail id={id} />;
}
