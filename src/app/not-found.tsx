import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="text-4xl font-semibold tracking-tight">404</p>
      <p className="text-sm text-muted-foreground">
        Halaman yang kamu cari tidak ditemukan.
      </p>
      <Button asChild variant="outline" className="mt-2">
        <Link href="/">Kembali ke Dashboard</Link>
      </Button>
    </main>
  );
}
