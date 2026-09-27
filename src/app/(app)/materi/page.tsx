import { MaterialsView } from "@/components/materials/materials-view";

export default async function MateriPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string; q?: string }>;
}) {
  const sp = await searchParams;
  return (
    <MaterialsView initialSearch={sp.q ?? ""} initialSubject={sp.subject ?? ""} />
  );
}
