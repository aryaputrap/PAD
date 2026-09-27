# Personal Academic Dashboard

Web app dashboard akademik pribadi — dashboard, jadwal pelajaran, materi belajar, daftar tugas, daftar siswa (Kelas X Ar-Rahman), dan global search. Dibangun sesuai `PRD.md`, dengan data siswa & jadwal dari `lampiran.md`.

## Tech Stack

- **Next.js 15** (App Router) + React 19 + TypeScript (strict)
- **Tailwind CSS 4** + komponen gaya shadcn/ui + Lucide + Motion
- **Supabase** (PostgreSQL + Auth + Row Level Security)
- **TanStack Query** (data fetching/caching) & **TanStack Table** (tabel)
- **React Hook Form** + **Zod** (form & validasi)
- Package manager: **pnpm**

## Setup

### 1. Install dependency

```bash
pnpm install
# atau: npx pnpm@9 install
```

### 2. Buat project Supabase

1. Buat project baru di [supabase.com](https://supabase.com) (free tier cukup).
2. Buka **SQL Editor**, jalankan:
   1. Isi file `supabase/migrations/20260927090000_init.sql` (tabel + RLS + index + trigger)
   2. Isi file `supabase/seed.sql` (subjects, 25 siswa X Ar-Rahman, jadwal lengkap)
3. Buka **Authentication → Users → Add user**, buat user dengan email + password.
   Tambahkan metadata `full_name` (mis. `Arya Adyatma Yusuf`) agar sapaan
   dashboard personal.

   > Alternatif CLI lokal: `supabase start` lalu `supabase db reset`
   > (file migrasi & seed sudah di path standar).

### 3. Environment variables

```bash
cp .env.local.example .env.local
```

Isi dari **Project Settings → API**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-public-key>
```

> Jangan menaruh `SUPABASE_SERVICE_ROLE_KEY` di client. `.env.local` sudah ada
> di `.gitignore`.

### 4. Jalankan

```bash
pnpm dev
```

Buka http://localhost:3000 — kamu akan diarahkan ke `/login`.

## Fitur

| Modul | Route | Keterangan |
| --- | --- | --- |
| Dashboard | `/` | Statistik real-time, tugas terdekat, materi terbaru, jadwal hari ini |
| Jadwal | `/jadwal` | Grid mingguan (desktop) + tab hari (mobile), highlight hari ini, search |
| Materi | `/materi` | CRUD lengkap, URL tersimpan di Supabase, search + filter mapel |
| Tugas | `/tugas` | CRUD + status cepat, prioritas, deadline, relasi materi, search + filter |
| Siswa | `/siswa` | Table view (25 siswa X Ar-Rahman), search nama/panggilan, responsive |
| Global Search | `/search` | `Ctrl/⌘+K` dari mana saja, hasil lintas materi/tugas/mapel/siswa/jadwal |
| Auth | `/login` | Email + password (Supabase Auth), session persistence, protected routes |

## Struktur

```text
src/
├── app/            # routes: (app)/page, materi, tugas, jadwal, siswa, search, login
├── components/     # ui/ (primitives), layout/, dashboard/, materials/, tasks/, schedule/, students/, search/, shared/
├── hooks/          # use-materials, use-tasks, use-subjects, use-students, use-schedule, use-dashboard, use-global-search, ...
├── lib/            # supabase/ (client, server, middleware), validations/ (zod), utils, constants, format
├── providers/      # TanStack Query, next-themes
└── types/          # tipe database (TypeScript)
supabase/
├── migrations/     # schema, RLS, index, trigger
└── seed.sql        # subjects + siswa X Ar-Rahman + jadwal (dari lampiran.md)
```

## Catatan

- Semua data dinamis berasal dari Supabase (tidak ada hardcode data).
- Hapus data: materials/tasks dilindungi RLS per-user (`auth.uid() = user_id`).
- Setiap aksi CRUD memakai TanStack Query invalidation (tanpa full reload).
- Pencarian memakai debounce 350ms + `ILIKE` di PostgreSQL.
- Tema: Terang / Gelap / Sistem (default: Sistem).
