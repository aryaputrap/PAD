-- ============================================================================
-- Personal Academic Dashboard — Initial Migration
-- Tables: profiles, subjects, materials, tasks, students, schedule_entries
-- Includes: indexes, foreign keys, RLS policies, triggers
-- ============================================================================

-- ----------------------------------------------------------------------------
-- profiles
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- subjects (master data mata pelajaran)
-- ----------------------------------------------------------------------------
create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  code text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- materials (materi belajar — hanya menyimpan URL)
-- ----------------------------------------------------------------------------
create table if not exists public.materials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  subject_id uuid not null references public.subjects (id) on delete restrict,
  title text not null,
  description text,
  url text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- tasks (daftar tugas)
-- ----------------------------------------------------------------------------
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  subject_id uuid not null references public.subjects (id) on delete restrict,
  material_id uuid references public.materials (id) on delete set null,
  title text not null,
  priority text not null default 'normal'
    check (priority in ('low', 'normal', 'high', 'urgent')),
  deadline timestamptz,
  description text,
  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- students (daftar siswa — Kelas X Ar-Rahman)
-- ----------------------------------------------------------------------------
create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  nickname text,
  gender text not null check (gender in ('L', 'P')),
  sort_no integer,
  class_name text not null default 'X Ar-Rahman',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- schedule_entries (jadwal pelajaran)
-- day_of_week: 1 = Senin ... 6 = Sabtu
-- slot: nomor baris waktu pada grid (1..15)
-- kind: lesson | break | activity
-- ----------------------------------------------------------------------------
create table if not exists public.schedule_entries (
  id uuid primary key default gen_random_uuid(),
  day_of_week smallint not null check (day_of_week between 1 and 6),
  slot smallint not null,
  time_label text not null,
  title text not null,
  detail text,
  note text,
  kind text not null default 'lesson' check (kind in ('lesson', 'break', 'activity')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (day_of_week, slot)
);

-- ----------------------------------------------------------------------------
-- Indexes
-- ----------------------------------------------------------------------------
create index if not exists materials_user_id_idx on public.materials (user_id);
create index if not exists materials_subject_id_idx on public.materials (subject_id);
create index if not exists materials_created_at_idx on public.materials (created_at);

create index if not exists tasks_user_id_idx on public.tasks (user_id);
create index if not exists tasks_subject_id_idx on public.tasks (subject_id);
create index if not exists tasks_material_id_idx on public.tasks (material_id);
create index if not exists tasks_deadline_idx on public.tasks (deadline);
create index if not exists tasks_status_idx on public.tasks (status);

create index if not exists students_sort_no_idx on public.students (sort_no);
create index if not exists schedule_entries_day_slot_idx
  on public.schedule_entries (day_of_week, slot);

-- ----------------------------------------------------------------------------
-- updated_at trigger
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_subjects_updated_at on public.subjects;
create trigger set_subjects_updated_at
  before update on public.subjects
  for each row execute function public.set_updated_at();

drop trigger if exists set_materials_updated_at on public.materials;
create trigger set_materials_updated_at
  before update on public.materials
  for each row execute function public.set_updated_at();

drop trigger if exists set_tasks_updated_at on public.tasks;
create trigger set_tasks_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();

drop trigger if exists set_students_updated_at on public.students;
create trigger set_students_updated_at
  before update on public.students
  for each row execute function public.set_updated_at();

drop trigger if exists set_schedule_entries_updated_at on public.schedule_entries;
create trigger set_schedule_entries_updated_at
  before update on public.schedule_entries
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Buat profile otomatis saat user baru mendaftar
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.subjects enable row level security;
alter table public.materials enable row level security;
alter table public.tasks enable row level security;
alter table public.students enable row level security;
alter table public.schedule_entries enable row level security;

-- profiles: user hanya dapat mengakses profilnya sendiri
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- subjects: master data, dapat dibaca semua user terautentikasi
drop policy if exists "subjects_read_authenticated" on public.subjects;
create policy "subjects_read_authenticated"
  on public.subjects for select
  to authenticated
  using (true);

-- materials: user hanya dapat mengakses datanya sendiri
drop policy if exists "materials_all_own" on public.materials;
create policy "materials_all_own"
  on public.materials for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- tasks: user hanya dapat mengakses datanya sendiri
drop policy if exists "tasks_all_own" on public.tasks;
create policy "tasks_all_own"
  on public.tasks for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- students: data kelas bersama, dapat dibaca semua user terautentikasi
drop policy if exists "students_read_authenticated" on public.students;
create policy "students_read_authenticated"
  on public.students for select
  to authenticated
  using (true);

-- schedule_entries: data kelas bersama, dapat dibaca semua user terautentikasi
drop policy if exists "schedule_read_authenticated" on public.schedule_entries;
create policy "schedule_read_authenticated"
  on public.schedule_entries for select
  to authenticated
  using (true);
