import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Bersihkan karakter khusus PostgREST (`,` `(` `)` `%` `.`) dari kata kunci ilike. */
export function sanitizeSearchQuery(query: string): string {
  return query.replace(/[%,().]/g, " ").trim();
}
