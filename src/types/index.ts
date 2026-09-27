export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Subject = {
  id: string;
  name: string;
  code: string | null;
  created_at: string;
  updated_at: string;
};

export type Material = {
  id: string;
  user_id: string;
  subject_id: string;
  title: string;
  description: string | null;
  url: string;
  created_at: string;
  updated_at: string;
};

export type MaterialWithSubject = Material & {
  subjects: Pick<Subject, "id" | "name" | "code"> | null;
};

export type TaskStatus = "pending" | "in_progress" | "completed";
export type TaskPriority = "low" | "normal" | "high" | "urgent";

export type Task = {
  id: string;
  user_id: string;
  subject_id: string;
  material_id: string | null;
  title: string;
  priority: TaskPriority;
  deadline: string | null;
  description: string | null;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
};

export type TaskWithRelations = Task & {
  subjects: Pick<Subject, "id" | "name" | "code"> | null;
  materials: Pick<Material, "id" | "title" | "url"> | null;
};

export type Student = {
  id: string;
  full_name: string;
  nickname: string | null;
  gender: "L" | "P";
  sort_no: number;
  class_name: string;
  created_at: string;
  updated_at: string;
};

export type ScheduleEntry = {
  id: string;
  day_of_week: number; // 1 = Senin ... 6 = Sabtu
  slot: number;
  time_label: string;
  title: string;
  detail: string | null;
  note: string | null;
  kind: "lesson" | "break" | "activity";
  created_at: string;
  updated_at: string;
};
