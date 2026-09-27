import { GraduationCap } from "lucide-react";
import { SearchTrigger } from "@/components/search/global-search";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-sm lg:pl-8">
      <div className="flex items-center gap-2 lg:hidden">
        <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <GraduationCap className="size-4" />
        </span>
        <span className="text-sm font-semibold tracking-tight">
          Academic Dashboard
        </span>
      </div>
      <div className="flex flex-1 justify-end items-center gap-1">
        <div className="lg:mr-auto">
          <SearchTrigger />
        </div>
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
