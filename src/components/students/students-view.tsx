"use client";

import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/layout/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useStudents } from "@/hooks/use-students";
import type { Student } from "@/types";

export function StudentsView({ initialSearch = "" }: { initialSearch?: string }) {
  const [search, setSearch] = useState(initialSearch);
  const debouncedSearch = useDebouncedValue(search, 350);
  const { data, isLoading, isError, refetch } = useStudents(debouncedSearch);

  const columns = useMemo<ColumnDef<Student>[]>(
    () => [
      {
        id: "sort_no",
        header: "No.",
        cell: ({ row }) => (
          <span className="tabular-nums text-muted-foreground">
            {row.original.sort_no}
          </span>
        ),
      },
      {
        id: "full_name",
        header: "Nama Siswa",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.full_name}</span>
        ),
      },
      {
        id: "nickname",
        header: "Panggilan",
        cell: ({ row }) => row.original.nickname ?? "—",
      },
      {
        id: "gender",
        header: "JK",
        cell: ({ row }) => (
          <Badge variant="muted">
            {row.original.gender === "L" ? "Laki-laki" : "Perempuan"}
          </Badge>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      <PageHeader
        title="Daftar Siswa"
        description={
          isLoading
            ? "Kelas X Ar-Rahman"
            : `Kelas X Ar-Rahman · ${data?.length ?? 0} siswa${
                debouncedSearch ? ` (hasil untuk "${debouncedSearch}")` : ""
              }`
        }
      />

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Cari nama siswa atau panggilan..."
        className="sm:w-80"
      />

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-11 w-full rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Siswa tidak ditemukan"
          description={
            debouncedSearch
              ? `Tidak ada siswa yang cocok dengan "${debouncedSearch}".`
              : "Belum ada data siswa."
          }
        />
      ) : (
        <div className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
