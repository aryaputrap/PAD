import { format, formatDistanceToNow, isPast, isToday } from "date-fns";
import { id as localeId } from "date-fns/locale";

export function formatDate(date: string | Date): string {
  return format(new Date(date), "d MMMM yyyy", { locale: localeId });
}

export function formatDateShort(date: string | Date): string {
  return format(new Date(date), "d MMM yyyy", { locale: localeId });
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), "d MMM yyyy, HH.mm", { locale: localeId });
}

export function formatRelative(date: string | Date): string {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: localeId,
  });
}

export function isOverdue(deadline: string | null | undefined): boolean {
  if (!deadline) return false;
  return isPast(new Date(deadline)) && !isToday(new Date(deadline));
}

export function greetingByTime(): string {
  const hour = new Date().getHours();
  if (hour < 11) return "Selamat pagi";
  if (hour < 15) return "Selamat siang";
  if (hour < 19) return "Selamat sore";
  return "Selamat malam";
}
