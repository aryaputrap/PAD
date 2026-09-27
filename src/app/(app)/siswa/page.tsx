import { StudentsView } from "@/components/students/students-view";

export default async function SiswaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  return <StudentsView initialSearch={sp.q ?? ""} />;
}
