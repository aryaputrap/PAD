"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/use-user";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

function initials(name: string | null | undefined, email?: string | null) {
  const source = name || email || "U";
  const parts = source.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function UserMenu() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading } = useUser();

  async function handleLogout() {
    if (!isSupabaseConfigured) return;
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      queryClient.clear();
      router.push("/login");
      router.refresh();
      toast.success("Berhasil keluar");
    } catch {
      toast.error("Gagal keluar. Coba lagi.");
    }
  }

  if (!isSupabaseConfigured) return null;

  if (isLoading) {
    return <Skeleton className="size-8 rounded-full" />;
  }

  if (!data) return null;

  const { user, profile } = data;
  const displayName = profile?.full_name || user.email || "Pengguna";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label="Menu pengguna"
        >
          <Avatar className="size-8">
            {profile?.avatar_url ? (
              <AvatarImage src={profile.avatar_url} alt={displayName} />
            ) : null}
            <AvatarFallback>
              {initials(profile?.full_name, user.email)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="truncate text-sm font-medium text-foreground">
            {displayName}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive focus:text-destructive"
        >
          <LogOut />
          Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
