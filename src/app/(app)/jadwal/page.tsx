import { ScheduleView } from "@/components/schedule/schedule-view";

export default async function JadwalPage({
  searchParams,
}: {
  searchParams: Promise<{ day?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const day = sp.day ? Number(sp.day) : undefined;
  return (
    <ScheduleView
      initialDay={day && day >= 1 && day <= 6 ? day : undefined}
      initialSearch={sp.q ?? ""}
    />
  );
}
