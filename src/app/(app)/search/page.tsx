import { SearchView } from "@/components/search/search-view";

const VALID_TABS = ["all", "materials", "tasks", "subjects", "students", "schedule"] as const;
type TabValue = (typeof VALID_TABS)[number];

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tab?: string }>;
}) {
  const sp = await searchParams;
  const tab = VALID_TABS.includes(sp.tab as TabValue)
    ? (sp.tab as TabValue)
    : "all";
  return <SearchView initialQuery={sp.q ?? ""} initialTab={tab} />;
}
