import { TaskForm } from "@/components/tasks/task-form";
import { PageHeader } from "@/components/layout/page-header";

export default function TambahTugasPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <PageHeader
        title="Tambah Tugas"
        description="Buat tugas baru dan hubungkan dengan materi belajar."
      />
      <TaskForm mode="create" />
    </div>
  );
}
