import { MaterialForm } from "@/components/materials/material-form";
import { PageHeader } from "@/components/layout/page-header";

export default function TambahMateriPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <PageHeader
        title="Tambah Materi"
        description="Simpan link materi belajar baru."
      />
      <MaterialForm mode="create" />
    </div>
  );
}
