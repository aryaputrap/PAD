import type { TaskPriority, TaskStatus } from "@/types";

export const DAYS = [
  { value: 1, label: "Senin" },
  { value: 2, label: "Selasa" },
  { value: 3, label: "Rabu" },
  { value: 4, label: "Kamis" },
  { value: 5, label: "Jumat" },
  { value: 6, label: "Sabtu" },
] as const;

export const DAY_LABELS: Record<number, string> = {
  1: "Senin",
  2: "Selasa",
  3: "Rabu",
  4: "Kamis",
  5: "Jumat",
  6: "Sabtu",
};

/** JS Date.getDay(): 0 = Minggu ... 6 = Sabtu → day_of_week DB: 1..6, 0 = Minggu */
export function todayDayOfWeek(): number {
  return new Date().getDay();
}

export const TASK_STATUSES: {
  value: TaskStatus;
  label: string;
}[] = [
  { value: "pending", label: "Belum Dikerjakan" },
  { value: "in_progress", label: "Sedang Dikerjakan" },
  { value: "completed", label: "Selesai" },
];

export const TASK_PRIORITIES: {
  value: TaskPriority;
  label: string;
}[] = [
  { value: "low", label: "Rendah" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "Tinggi" },
  { value: "urgent", label: "Urgent" },
];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "Belum Dikerjakan",
  in_progress: "Sedang Dikerjakan",
  completed: "Selesai",
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Rendah",
  normal: "Normal",
  high: "Tinggi",
  urgent: "Urgent",
};

export const SCHEDULE_KIND_LABELS: Record<string, string> = {
  lesson: "Pelajaran",
  break: "Istirahat",
  activity: "Kegiatan",
};
