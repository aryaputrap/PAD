# Product Requirements Document (PRD)

# Personal Academic Dashboard

**Version:** 1.0
**Status:** Development Ready
**Platform:** Responsive Web Application
**Primary User:** Single personal user
**Backend:** Supabase
**Database:** PostgreSQL
**Frontend:** Next.js + React + TypeScript
**Styling:** Tailwind CSS + shadcn/ui

---

# 1. Product Overview

## 1.1 Product Name

**Personal Academic Dashboard**

## 1.2 Product Description

Personal Academic Dashboard adalah sebuah web application untuk mengelola kebutuhan akademik pribadi dalam satu tempat.

Aplikasi berfungsi sebagai pusat informasi akademik yang mengintegrasikan:

* Dashboard / Overview
* Jadwal Pelajaran
* Materi Belajar
* Daftar Tugas
* Daftar Siswa
* Global Search

Aplikasi harus memiliki desain modern, clean, responsive, dan nyaman digunakan baik pada desktop maupun smartphone.

Data utama aplikasi disimpan di **Supabase PostgreSQL** sehingga perubahan data dapat langsung tersinkronisasi dengan database.

---

# 2. Scope

## 2.1 Fitur yang Termasuk

### Core Features

1. Dashboard / Overview
2. Jadwal Pelajaran
3. Materi Belajar
4. Daftar Tugas
5. Daftar Siswa
6. Global Search
7. Authentication
8. Supabase Database
9. Responsive Design

## 2.2 Fitur yang Tidak Termasuk

Jangan menambahkan fitur berikut pada versi pertama:

* Nilai akademik
* Kalender akademik terpisah
* Catatan belajar
* Arsip akademik
* Attendance / absensi
* Chat
* Notifikasi push
* Sistem kelas multi-user
* Social features
* Sistem guru
* Sistem admin sekolah
* Payment
* Gamification

Fokus utama adalah membuat personal academic dashboard yang sederhana tetapi terintegrasi.

---

# 3. Product Goals

## 3.1 Primary Goals

Aplikasi harus memungkinkan user untuk:

1. Melihat ringkasan aktivitas akademik.
2. Menyimpan materi belajar.
3. Menyimpan URL materi belajar di Supabase.
4. Membuat dan mengelola tugas.
5. Menghubungkan tugas dengan materi belajar.
6. Mengelompokkan materi dan tugas berdasarkan mata pelajaran.
7. Mencari informasi akademik menggunakan global search.
8. Mengakses aplikasi dengan nyaman dari desktop maupun smartphone.

---

# 4. Design Principles

Aplikasi harus mengikuti prinsip berikut:

### 4.1 Clean

Interface tidak boleh terlalu ramai.

### 4.2 Dashboard-oriented

Informasi penting harus dapat dilihat dengan cepat.

### 4.3 Responsive

Semua halaman harus dapat digunakan pada:

* Desktop
* Laptop
* Tablet
* Smartphone

### 4.4 Data-driven

UI harus menggunakan data dari Supabase, bukan hardcoded data.

### 4.5 Consistent

Komponen UI, spacing, typography, button, modal, form, table, dan state harus konsisten.

### 4.6 Fast

Navigasi dan interaksi harus terasa cepat.

Gunakan loading state, skeleton, optimistic UI jika sesuai, dan caching untuk mengurangi request yang tidak perlu.

---

# 5. Recommended Tech Stack

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Lucide React
* Motion

## Backend

* Supabase
* PostgreSQL
* Supabase Auth
* Supabase Row Level Security

## Data Fetching

* TanStack Query

## Form

* React Hook Form
* Zod

## Table

* TanStack Table

## Deployment

* Vercel

## Package Manager

* pnpm

---

# 6. Application Architecture

High-level architecture:

```text
User
 │
 ▼
Next.js Application
 │
 ├── UI Components
 ├── Pages
 ├── Forms
 ├── Search
 └── Data Layer
        │
        ▼
   Supabase Client
        │
        ▼
   Supabase
        │
        ├── Authentication
        └── PostgreSQL Database
```

---

# 7. Application Navigation

Desktop navigation:

```text
Academic Dashboard

Dashboard

ACADEMIC
├── Jadwal Pelajaran
├── Materi Belajar
├── Daftar Tugas
└── Daftar Siswa
```

Global Search harus tersedia pada top navigation.

Mobile navigation dapat menggunakan:

* compact top bar
* hamburger menu
* bottom navigation

Jangan menampilkan sidebar desktop secara penuh pada layar smartphone.

---

# 8. Authentication

## 8.1 Login

Aplikasi harus memiliki authentication menggunakan Supabase Auth.

Login minimal menggunakan:

* Email
* Password

UI:

```text
Academic Dashboard

Welcome back

Email
[________________________]

Password
[________________________]

[ Sign In ]
```

## 8.2 Session

User yang sudah login harus mempertahankan session.

Jika user belum login dan mencoba mengakses halaman private:

```text
redirect → /login
```

## 8.3 Logout

User harus dapat logout dari aplikasi.

---

# 9. Database Design

Database menggunakan PostgreSQL melalui Supabase.

Minimal tabel:

```text
profiles
subjects
materials
tasks
```

Tabel Jadwal Pelajaran dan Daftar Siswa akan ditentukan dan dimasukkan secara terpisah oleh user/AI agent.

---

# 10. Profiles Table

Table:

```text
profiles
```

Fields:

```text
id
email
full_name
avatar_url
created_at
updated_at
```

Relationship:

```text
profiles.id
    ↓
auth.users.id
```

Profile harus terkait dengan authenticated user.

---

# 11. Subjects Table

Table:

```text
subjects
```

Fields:

```text
id
name
code
created_at
updated_at
```

Example:

```text
Matematika
Fisika
Kimia
Biologi
Informatika
Bahasa Indonesia
Bahasa Inggris
```

Mata pelajaran menjadi master data.

Jangan membuat nama mata pelajaran sebagai free-text pada form Materi dan Tugas.

Gunakan:

```text
subject_id
```

sebagai foreign key.

---

# 12. Materials Feature

## 12.1 Purpose

Fitur Materi Belajar digunakan untuk menyimpan seluruh materi pembelajaran yang dibutuhkan user.

Materi dapat berupa link ke:

* Google Drive
* Google Docs
* Google Slides
* Website
* YouTube
* LMS
* PDF online
* Resource lainnya

Aplikasi hanya perlu menyimpan URL.

---

# 13. Materials Database

Table:

```text
materials
```

Fields:

```text
id
user_id
subject_id
title
description
url
created_at
updated_at
```

Relationship:

```text
materials.user_id
        ↓
auth.users.id

materials.subject_id
        ↓
subjects.id
```

---

# 14. Add Material

User dapat membuat materi baru.

Form:

```text
Tambah Materi

Judul Materi *
[____________________________]

Mata Pelajaran *
[ Pilih Mata Pelajaran ▼ ]

Deskripsi
[____________________________]
[____________________________]

URL Materi *
[____________________________]

[ Batal ]       [ Simpan Materi ]
```

## Required Fields

### Judul Materi

Required.

### Mata Pelajaran

Required.

Harus menggunakan dropdown.

### Deskripsi

Optional.

### URL

Required.

---

# 15. Material Validation

Validation menggunakan Zod.

Rules:

```text
title:
required
minimum reasonable length

subject_id:
required

description:
optional

url:
required
must be valid URL
```

Jika validation gagal, tampilkan error pada field terkait.

Contoh:

```text
URL Materi
[invalid-url]

URL tidak valid.
```

---

# 16. Material List

Halaman:

```text
/materi
```

Header:

```text
Materi Belajar

[ 🔍 Cari materi... ]

[ Mata Pelajaran ▼ ]

[ + Tambah Materi ]
```

List dapat menggunakan table atau responsive list.

Setiap item menampilkan:

```text
Judul
Mata Pelajaran
Deskripsi singkat
Tanggal dibuat
Action
```

Action:

```text
Buka
Edit
Hapus
```

---

# 17. Material Detail

Route:

```text
/materi/[id]
```

Tampilan:

```text
Sistem Persamaan Linear

Matematika

Deskripsi:
Materi mengenai ...

URL Materi:
https://...

[ Buka Materi ]

Created:
25 September 2026

[ Edit ]
[ Hapus ]
```

Button `Buka Materi` harus menggunakan URL yang disimpan di Supabase.

Jangan hardcode URL di frontend.

---

# 18. Material CRUD

User harus dapat:

```text
Create
Read
Update
Delete
```

Untuk delete gunakan confirmation dialog.

Contoh:

```text
Hapus Materi?

"Sistem Persamaan Linear"

Data ini akan dihapus secara permanen.

[ Batal ] [ Hapus ]
```

---

# 19. Tasks Feature

## 19.1 Purpose

Fitur Daftar Tugas digunakan untuk mengelola tugas akademik pribadi.

User dapat membuat tugas dan menghubungkannya dengan materi belajar.

---

# 20. Tasks Database

Table:

```text
tasks
```

Fields:

```text
id
user_id
subject_id
material_id
title
priority
deadline
description
status
created_at
updated_at
```

Relationships:

```text
tasks.user_id
        ↓
auth.users.id

tasks.subject_id
        ↓
subjects.id

tasks.material_id
        ↓
materials.id
```

`material_id` harus nullable.

Artinya tugas tidak wajib memiliki materi terkait.

---

# 21. Task Status

Gunakan:

```text
pending
in_progress
completed
```

UI:

```text
Belum Dikerjakan
Sedang Dikerjakan
Selesai
```

---

# 22. Task Priority

Gunakan:

```text
low
normal
high
urgent
```

UI:

```text
Rendah
Normal
Tinggi
Urgent
```

Jangan menggunakan warna sebagai satu-satunya indikator prioritas.

Tambahkan text/icon agar informasi tetap jelas untuk accessibility.

---

# 23. Add Task

Form:

```text
Tambah Tugas

Judul Tugas *
[____________________________]

Mata Pelajaran *
[ Pilih Mata Pelajaran ▼ ]

Prioritas *
[ Normal ▼ ]

Deadline
[ Tanggal ]

Deskripsi
[____________________________]
[____________________________]

Materi Terkait
[ Pilih Materi ▼ ]

[ Batal ]       [ Simpan Tugas ]
```

---

# 24. Task Validation

Rules:

```text
title:
required

subject_id:
required

priority:
required

deadline:
optional

description:
optional

material_id:
optional
```

Jika deadline digunakan, harus berupa tanggal/waktu valid.

---

# 25. Task List

Route:

```text
/tugas
```

Header:

```text
Daftar Tugas

[ 🔍 Cari tugas... ]

[ Semua Status ▼ ]
[ Semua Prioritas ▼ ]
[ Semua Mata Pelajaran ▼ ]

[ + Tambah Tugas ]
```

Setiap task menampilkan:

```text
Judul
Mata Pelajaran
Prioritas
Deadline
Status
Materi terkait
```

---

# 26. Task Interaction

User dapat:

* Membuka detail tugas
* Mengubah status
* Edit tugas
* Delete tugas
* Membuka materi terkait

Contoh:

```text
Latihan SPLDV

Matematika

Priority:
High

Deadline:
27 September 2026

Status:
Sedang Dikerjakan

Materi:
Sistem Persamaan Linear

[ Buka Materi ]

[ Tandai Selesai ]
[ Edit ]
```

---

# 27. Task Status Update

User harus dapat mengubah status dengan cepat tanpa membuka form edit penuh.

Contoh:

```text
[ Belum Dikerjakan ▼ ]
```

klik:

```text
Belum Dikerjakan
Sedang Dikerjakan
Selesai
```

Perubahan disimpan ke Supabase.

---

# 28. Dashboard / Overview

Route:

```text
/
```

atau:

```text
/dashboard
```

Dashboard adalah halaman utama aplikasi.

Dashboard tidak memiliki database sendiri.

Dashboard mengambil data dari tabel lain.

---

# 29. Overview Statistics

Minimal tampilkan:

```text
Active Tasks
Materials
Subjects
Students
```

Untuk Students, gunakan data dari modul siswa yang nantinya dimasukkan oleh user/AI agent.

Contoh:

```text
┌──────────────┐
│ 5            │
│ Active Tasks │
└──────────────┘

┌──────────────┐
│ 24           │
│ Materials    │
└──────────────┘

┌──────────────┐
│ 15           │
│ Subjects     │
└──────────────┘
```

---

# 30. Dashboard Sections

Dashboard minimal memiliki:

## Welcome Section

```text
Good evening, Arya

Here's your academic overview.
```

Greeting dapat menyesuaikan waktu:

```text
Morning
Afternoon
Evening
```

## Statistics

Menampilkan jumlah data.

## Upcoming Tasks

Menampilkan beberapa tugas dengan deadline terdekat.

## Recent Materials

Menampilkan materi terbaru.

## Today's Schedule

Bagian ini disediakan sebagai integration point untuk modul Jadwal Pelajaran yang akan dimasukkan secara terpisah.

Jangan membuat struktur jadwal sendiri jika belum diberikan.

---

# 31. Global Search

Global Search merupakan fitur utama aplikasi.

Search harus dapat mencari data dari beberapa entity.

Minimal:

```text
Materials
Tasks
Subjects
Students
Schedule
```

Schedule dan Students akan mengikuti schema yang nantinya diberikan oleh user/AI agent.

---

# 32. Global Search UI

Desktop:

```text
┌────────────────────────────────────────────┐
│ 🔍 Search anything...                    K │
└────────────────────────────────────────────┘
```

Mobile:

```text
┌──────────────────────────────┐
│ 🔍 Search anything...        │
└──────────────────────────────┘
```

---

# 33. Global Search Behavior

Ketika user mengetik:

```text
matematika
```

hasil dapat dikelompokkan:

```text
MATERI

Sistem Persamaan Linear
Matematika

TUGAS

Latihan SPLDV
Matematika

JADWAL

Matematika
Senin · 14:30
```

Search result harus dapat diklik.

---

# 34. Search Categories

Global search menyediakan filter:

```text
All
Materials
Tasks
Subjects
Students
Schedule
```

Search page:

```text
/search?q=matematika
```

---

# 35. Contextual Search

Selain global search, setiap halaman yang memiliki banyak data harus memiliki search lokal.

## Materi

```text
[ 🔍 Cari materi... ]
```

Search berdasarkan:

* title
* description
* subject

## Tugas

```text
[ 🔍 Cari tugas... ]
```

Search berdasarkan:

* title
* description
* subject

## Siswa

Search berdasarkan:

* nama lengkap
* nama panggilan

## Jadwal

Search berdasarkan data jadwal yang diberikan nantinya.

---

# 36. Search Performance

Gunakan debounce.

Recommended debounce:

```text
300–400ms
```

Jangan mengirim request Supabase pada setiap karakter tanpa debounce.

---

# 37. Supabase Search

Untuk data yang berasal dari PostgreSQL, gunakan query yang sesuai.

Untuk pencarian sederhana dapat menggunakan:

```sql
ILIKE
```

Contoh konsep:

```sql
WHERE title ILIKE '%query%'
```

Search query harus tetap mempertimbangkan authentication dan RLS.

Jangan menggunakan service-role key di client.

---

# 38. Responsive Design

Aplikasi wajib responsive.

Breakpoints minimal:

```text
Mobile
Tablet
Desktop
Large Desktop
```

Tidak boleh ada halaman yang hanya dirancang untuk desktop.

---

# 39. Desktop Layout

Desktop menggunakan sidebar.

```text
┌────────────────┬───────────────────────────────────┐
│                │                                   │
│ Academic       │                                   │
│ Dashboard      │             CONTENT               │
│                │                                   │
│ Dashboard      │                                   │
│                │                                   │
│ Jadwal         │                                   │
│ Materi         │                                   │
│ Tugas          │                                   │
│ Siswa          │                                   │
│                │                                   │
└────────────────┴───────────────────────────────────┘
```

Sidebar harus tetap sederhana.

---

# 40. Mobile Layout

Pada mobile:

* Sidebar desktop disembunyikan.
* Gunakan top navigation dan/atau bottom navigation.
* Content menggunakan full width.
* Form menggunakan single-column layout.
* Button tidak boleh terlalu kecil.
* Table dapat menggunakan horizontal scrolling jika diperlukan.

---

# 41. Mobile Navigation

Recommended:

```text
┌────────────────────────────┐
│ Academic Dashboard      ◉  │
├────────────────────────────┤
│                            │
│          Content           │
│                            │
├────────────────────────────┤
│ Home │ Jadwal │ Tugas │ More│
└────────────────────────────┘
```

Menu `More` dapat membuka:

```text
Materi
Siswa
```

Alternatif lain adalah menggunakan hamburger menu.

---

# 42. Students Table

Modul Daftar Siswa tetap merupakan bagian dari aplikasi.

Namun schema, seed data, dan detail implementasinya **tidak didefinisikan dalam PRD ini**.

User akan memberikan:

* database structure
* data siswa
* kebutuhan filtering
* kebutuhan search

kepada AI agent secara terpisah.

Requirement yang sudah ditetapkan:

* hanya table view
* tidak menggunakan card view
* responsive
* memiliki search
* dapat digunakan di mobile

Pada mobile, table boleh menggunakan horizontal scrolling.

---

# 43. Schedule Module

Modul Jadwal Pelajaran juga merupakan bagian dari aplikasi.

Namun:

* schema
* jadwal
* data mata pelajaran
* detail waktu
* struktur jadwal

akan diberikan secara terpisah oleh user kepada AI agent.

Jangan mengarang atau membuat jadwal baru.

Dashboard hanya perlu menyediakan integration point untuk menampilkan:

```text
Today's Schedule
```

dan halaman:

```text
Jadwal Pelajaran
```

---

# 44. UI Components

Buat reusable components.

Minimal:

```text
Button
Input
Textarea
Select
Dialog
Dropdown
Badge
Card
Table
Tabs
Tooltip
Toast
Skeleton
EmptyState
LoadingState
ErrorState
SearchInput
PageHeader
Sidebar
MobileNavigation
```

---

# 45. Form Components

Gunakan React Hook Form.

Semua form harus memiliki:

* label
* validation
* error message
* loading state
* submit state
* disabled state
* cancel action

Contoh:

```text
URL Materi *

[ https://... ]

URL harus berupa URL yang valid.

[ Simpan ]
```

---

# 46. Loading State

Jangan menampilkan blank page ketika data sedang dimuat.

Gunakan skeleton.

Contoh:

```text
┌──────────────────────┐
│ █████████████        │
│ ███████              │
│ ███████████████      │
└──────────────────────┘
```

---

# 47. Empty State

Jika belum ada materi:

```text
Belum ada materi

Tambahkan materi belajar pertama kamu.

[ + Tambah Materi ]
```

Jika belum ada tugas:

```text
Tidak ada tugas

Semua tugas sudah selesai atau belum ada tugas.

[ + Tambah Tugas ]
```

---

# 48. Error State

Jika Supabase gagal:

```text
Something went wrong

Data tidak dapat dimuat.

[ Coba Lagi ]
```

Jangan menampilkan raw database error kepada user.

---

# 49. Toast Notification

Gunakan toast untuk aksi sederhana.

Contoh:

```text
✓ Materi berhasil ditambahkan
```

```text
✓ Tugas berhasil diperbarui
```

```text
✓ Tugas ditandai selesai
```

```text
✓ Materi berhasil dihapus
```

---

# 50. Delete Confirmation

Delete tidak boleh langsung terjadi ketika user menekan tombol delete.

Gunakan confirmation dialog.

```text
Hapus tugas?

Latihan SPLDV

Tindakan ini tidak dapat dibatalkan.

[ Batal ] [ Hapus ]
```

---

# 51. URL Handling

URL materi harus:

1. Disimpan di Supabase.
2. Divalidasi menggunakan Zod.
3. Tidak di-hardcode.
4. Dapat dibuka menggunakan external link.
5. Menggunakan `target="_blank"` jika sesuai.
6. Menggunakan `rel="noopener noreferrer"` untuk external link.

---

# 52. Security

Gunakan Supabase Row Level Security.

Data personal seperti:

```text
materials
tasks
```

harus memiliki:

```text
user_id
```

Policy harus memastikan user hanya dapat mengakses datanya sendiri.

Concept:

```text
auth.uid() = user_id
```

Jangan expose:

```text
SUPABASE_SERVICE_ROLE_KEY
```

ke browser/client.

Service role key hanya boleh berada pada server environment jika memang diperlukan.

---

# 53. Environment Variables

Gunakan:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Jangan memasukkan secret key ke source code.

Gunakan `.env.local`.

Tambahkan `.env.local` ke `.gitignore`.

---

# 54. Data Fetching

Gunakan TanStack Query untuk data client-side yang membutuhkan:

* caching
* refetch
* mutation
* loading state
* error state

Contoh hooks:

```text
useMaterials()
useMaterial(id)
useCreateMaterial()
useUpdateMaterial()
useDeleteMaterial()

useTasks()
useTask(id)
useCreateTask()
useUpdateTask()
useDeleteTask()

useSubjects()
```

---

# 55. Query Invalidation

Setelah mutation berhasil:

```text
Create Material
        ↓
invalidate materials query
        ↓
UI refresh
```

Begitu juga:

```text
Create Task
Update Task
Delete Task
Update Status
```

Jangan melakukan full page reload untuk setiap perubahan.

---

# 56. Folder Architecture

Recommended structure:

```text
src/
│
├── app/
│   ├── page.tsx
│   ├── login/
│   │   └── page.tsx
│   │
│   ├── materi/
│   │   ├── page.tsx
│   │   ├── tambah/
│   │   └── [id]/
│   │
│   ├── tugas/
│   │   ├── page.tsx
│   │   ├── tambah/
│   │   └── [id]/
│   │
│   ├── jadwal/
│   │   └── page.tsx
│   │
│   ├── siswa/
│   │   └── page.tsx
│   │
│   └── search/
│       └── page.tsx
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── dashboard/
│   ├── materials/
│   ├── tasks/
│   ├── schedule/
│   ├── students/
│   └── search/
│
├── hooks/
│
├── lib/
│   ├── supabase/
│   ├── validations/
│   └── utils/
│
├── types/
│
└── providers/
```

---

# 57. Dashboard Data Flow

Dashboard harus mengambil data dari database.

```text
Dashboard
│
├── count materials
├── count tasks
├── count subjects
├── count students
│
├── upcoming tasks
├── recent materials
└── today's schedule
```

Tidak boleh menggunakan angka dummy setelah database sudah tersedia.

---

# 58. Upcoming Tasks

Tugas yang memiliki deadline harus dapat diurutkan berdasarkan:

```text
deadline ASC
```

Dashboard hanya perlu menampilkan beberapa tugas terdekat.

Contoh:

```text
Upcoming Tasks

Latihan SPLDV
Matematika
27 Sep

Laporan Praktikum
Fisika
29 Sep

Tugas Bahasa Inggris
Bahasa Inggris
1 Oct
```

---

# 59. Recent Materials

Materi terbaru diurutkan berdasarkan:

```text
created_at DESC
```

Contoh:

```text
Recent Materials

Sistem Persamaan Linear
Matematika
2 hours ago

Struktur Atom
Kimia
Yesterday

Fotosintesis
Biologi
3 days ago
```

---

# 60. Search Result Ranking

Untuk global search, hasil dapat diprioritaskan:

```text
Exact title match
↓
Title partial match
↓
Subject match
↓
Description match
```

Tidak perlu membuat ranking AI.

Gunakan pencarian database yang deterministic.

---

# 61. Accessibility

Aplikasi harus memperhatikan:

* semantic HTML
* keyboard navigation
* visible focus state
* accessible labels
* sufficient contrast
* aria-label pada icon-only button
* form error association
* dialog focus management

Icon-only button harus memiliki tooltip atau accessible label.

Contoh:

```text
aria-label="Search"
```

---

# 62. Dark / Light Theme

Aplikasi sebaiknya mendukung:

```text
Light
Dark
System
```

Default:

```text
System
```

Gunakan Tailwind dark mode.

Tema harus tetap memiliki contrast yang baik.

---

# 63. Visual Direction

Recommended visual style:

**Modern academic dashboard**

Karakter:

* clean
* minimal
* slightly premium
* modern
* professional
* compact
* tidak terlalu corporate
* tidak seperti admin panel sekolah lama

Gunakan:

* rounded corners secukupnya
* subtle borders
* soft shadows
* whitespace yang baik
* typography yang jelas
* restrained color palette

Hindari:

* gradient berlebihan
* glassmorphism ekstrem
* terlalu banyak animasi
* neon colors
* dashboard penuh card tanpa hierarchy

---

# 63.1 UI/UX Design Points
 
Aplikasi harus mengikuti poin UI/UX berikut secara konsisten di seluruh halaman:
 
1. **Dark, modern, minimalism**
   Desain mengutamakan tampilan gelap yang modern dan minimalis, tanpa elemen visual yang berlebihan.
2. **Black and white color**
   Palet warna utama berbasis hitam dan putih (grayscale), dengan penggunaan warna aksen secukupnya hanya untuk status atau elemen penting (misalnya error, warning, success).
3. **Smooth, understated animations and transitions**
   Semua animasi dan transisi halus, tidak mencolok, dan tidak mengganggu workflow. Selaras dengan prinsip Motion pada section 66.
4. **Loading state, empty state, error state, dan skeleton**
   Setiap halaman dan komponen data harus memiliki keempat state ini secara konsisten, selaras dengan Error Handling pada section 68.
5. **Clean modals, drawers, dan forms**
   Modal, drawer, dan form harus memiliki layout yang rapi, spacing yang konsisten, dan tidak terasa penuh sesak.
6. **Global search lintas fitur**
   Search harus dapat menemukan data relevan di seluruh fitur (materials, tasks, subjects, students, schedule), selaras dengan Search Flow pada section 75.
7. **Hindari tampilan dashboard generic template**
   Dashboard tidak boleh terlihat seperti template admin panel generik. Harus memiliki karakter dan hierarchy visual yang jelas, selaras dengan Visual Direction pada section 63.
8. **Sidebar/navigation yang jelas**
   Navigasi (sidebar desktop, mobile nav) harus jelas, mudah dipahami, dan konsisten di seluruh halaman, selaras dengan Application Navigation pada section 7.
   
---

# 64. Responsive Tables

Untuk table yang terlalu lebar:

```css
overflow-x: auto;
```

Jangan mengecilkan font sampai sulit dibaca.

Khusus Daftar Siswa:

```text
Mobile
↓
Horizontal scroll
↓
Tetap table
```

Tidak boleh diubah menjadi card.

---

# 65. Responsive Forms

Desktop:

```text
┌───────────────┬───────────────┐
│ Judul         │ Mata Pelajaran│
└───────────────┴───────────────┘
```

Mobile:

```text
Judul
[________________]

Mata Pelajaran
[________________]

Deskripsi
[________________]

URL
[________________]
```

Form harus berubah menjadi single-column pada layar kecil.

---

# 66. Animation

Gunakan Motion hanya untuk micro-interactions.

Contoh:

* page transition ringan
* dialog
* dropdown
* hover
* list appearance
* button feedback

Hindari animasi yang mengganggu workflow.

---

# 67. Performance

Target:

* fast initial load
* minimal unnecessary requests
* query caching
* debounced search
* lazy loading jika diperlukan
* optimized components

Jangan mengambil seluruh database jika hanya membutuhkan beberapa record.

Contoh:

Dashboard tidak perlu mengambil seluruh tasks jika hanya menampilkan 5 tugas terdekat.

---

# 68. Error Handling

Semua Supabase operation harus memiliki:

```text
loading
success
error
empty
```

states.

Contoh:

```text
try
  mutation
catch
  show user-friendly error
```

Jangan membocorkan detail internal database.

---

# 69. CRUD Requirements

## Materials

```text
CREATE
READ
UPDATE
DELETE
```

## Tasks

```text
CREATE
READ
UPDATE
DELETE
STATUS UPDATE
```

## Subjects

Untuk versi awal, subjects dapat dikelola melalui database/seed.

Tidak perlu membuat UI CRUD Subject kecuali diperlukan kemudian.

## Students

Implementasi diberikan terpisah.

## Schedule

Implementasi diberikan terpisah.

---

# 70. Seed Data

Development environment dapat menggunakan sample data.

Namun sample data harus mudah dihapus.

Jangan hardcode sample data langsung ke component.

Gunakan:

```text
Supabase seed
```

atau SQL migration.

---

# 71. Database Migration

Gunakan Supabase migrations untuk:

* table creation
* indexes
* foreign keys
* RLS
* policies

Jangan hanya membuat database secara manual tanpa migration jika project akan dikembangkan melalui Git.

---

# 72. Recommended Indexes

Tambahkan index yang relevan.

Contoh:

```text
materials.user_id
materials.subject_id
materials.created_at

tasks.user_id
tasks.subject_id
tasks.material_id
tasks.deadline
tasks.status
```

Untuk search skala kecil, `ILIKE` sudah cukup.

Jika jumlah data nantinya besar, pertimbangkan PostgreSQL full-text search.

---

# 73. URL Database Example

Contoh record:

```json
{
  "title": "Sistem Persamaan Linear",
  "subject_id": "subject-id",
  "description": "Materi mengenai SPLDV",
  "url": "https://example.com/material",
  "user_id": "user-id"
}
```

URL tersebut harus berasal dari database.

Frontend tidak boleh memiliki daftar URL materi secara hardcoded.

---

# 74. User Experience Flow

## First Visit

```text
Landing/Login
      ↓
Login
      ↓
Dashboard
```

## Add Material

```text
Dashboard
 ↓
Materi
 ↓
Tambah Materi
 ↓
Fill Form
 ↓
Validation
 ↓
Supabase Insert
 ↓
Success
 ↓
Material List
```

## Add Task

```text
Dashboard
 ↓
Tugas
 ↓
Tambah Tugas
 ↓
Select Subject
 ↓
Optional: Select Material
 ↓
Save
 ↓
Supabase
 ↓
Task List
```

---

# 75. Search Flow

```text
User clicks search
        ↓
Type query
        ↓
Debounce 300–400ms
        ↓
Search Supabase
        ↓
Group results
        ↓
Display results
        ↓
User selects result
        ↓
Navigate to detail
```

---

# 76. Definition of Done

Project dianggap selesai jika:

### Authentication

* [ ] Login bekerja
* [ ] Logout bekerja
* [ ] Protected routes bekerja
* [ ] Session persistence bekerja

### Dashboard

* [ ] Dashboard menampilkan data real
* [ ] Statistics berasal dari Supabase
* [ ] Upcoming tasks bekerja
* [ ] Recent materials bekerja
* [ ] Integration point jadwal tersedia

### Materials

* [ ] Create bekerja
* [ ] Read bekerja
* [ ] Update bekerja
* [ ] Delete bekerja
* [ ] URL tersimpan di Supabase
* [ ] URL tervalidasi
* [ ] Search bekerja
* [ ] Filter subject bekerja

### Tasks

* [ ] Create bekerja
* [ ] Read bekerja
* [ ] Update bekerja
* [ ] Delete bekerja
* [ ] Status update bekerja
* [ ] Priority bekerja
* [ ] Deadline bekerja
* [ ] Subject relation bekerja
* [ ] Material relation bekerja
* [ ] Search bekerja
* [ ] Filter bekerja

### Students

* [ ] Integration point tersedia
* [ ] Table view
* [ ] Search
* [ ] Responsive table
* [ ] Tidak menggunakan card view

### Schedule

* [ ] Integration point tersedia
* [ ] Responsive
* [ ] Dapat diintegrasikan dengan dashboard

### Global Search

* [ ] Search bar tersedia
* [ ] Search materials
* [ ] Search tasks
* [ ] Search subjects
* [ ] Search students
* [ ] Search schedule
* [ ] Debounce
* [ ] Search results page
* [ ] Result navigation

### Responsive

* [ ] Desktop
* [ ] Tablet
* [ ] Mobile
* [ ] Responsive forms
* [ ] Responsive navigation
* [ ] Responsive tables

### Security

* [ ] RLS aktif
* [ ] User hanya dapat mengakses data personalnya
* [ ] Service role key tidak terekspos
* [ ] Environment variables digunakan

---

# 77. Non-Functional Requirements

## Performance

Aplikasi harus terasa cepat dan tidak melakukan unnecessary network request.

## Reliability

Error Supabase harus ditangani dengan graceful UI.

## Security

Semua data personal harus dilindungi RLS.

## Maintainability

Gunakan reusable components dan typed data.

## Scalability

Struktur database harus memungkinkan penambahan fitur di masa depan tanpa perlu merombak seluruh schema.

---

# 78. Important Implementation Rules for AI Coding Agent

AI coding agent harus mengikuti aturan berikut:

1. Jangan membuat data akademik hardcoded.
2. Semua data dynamic harus berasal dari Supabase.
3. URL materi harus disimpan di database.
4. Jangan menyimpan secret key di client.
5. Gunakan TypeScript strict typing.
6. Gunakan reusable components.
7. Jangan membuat duplicate UI components.
8. Gunakan React Hook Form + Zod untuk form.
9. Gunakan TanStack Query untuk client-side server state.
10. Gunakan Supabase RLS.
11. Jangan melakukan full page reload setelah CRUD.
12. Gunakan loading, error, dan empty state.
13. Semua halaman harus responsive.
14. Jangan mengubah daftar siswa menjadi card.
15. Jangan membuat data Jadwal Pelajaran atau Daftar Siswa sendiri karena data dan schema akan diberikan secara terpisah.
16. Jangan menambahkan fitur di luar scope tanpa alasan teknis yang jelas.
17. Jangan membuat sistem yang terlalu kompleks untuk kebutuhan personal dashboard.
18. Prioritaskan UX yang cepat dan sederhana.
19. Search harus menggunakan debounce.
20. Jangan hardcode jumlah statistik pada Dashboard.

---

# 79. Final Application Structure

Final product:

```text
                 ACADEMIC DASHBOARD
                         │
          ┌──────────────┼──────────────┐
          │              │              │
      Dashboard        Search       Authentication
          │
          ├──────────────┐
          │              │
       Academic        Data
          │
    ┌─────┼──────┬──────┐
    │     │      │      │
  Jadwal Materi Tugas  Siswa
           │      │
           └──┬───┘
              │
          Subjects
              │
           Supabase
              │
          PostgreSQL
```

---

# 80. Final Product Vision

Personal Academic Dashboard harus terasa seperti **personal productivity application khusus akademik**, bukan sekadar CRUD database.

User membuka aplikasi dan langsung mendapatkan:

```text
Dashboard
│
├── Apa yang harus saya kerjakan?
├── Materi apa yang baru saya simpan?
├── Apa jadwal saya hari ini?
└── Berapa banyak tugas/materi yang saya punya?
```

Kemudian user dapat berpindah ke:

```text
Jadwal
Materi
Tugas
Siswa
```

dengan global search yang selalu tersedia.

Semua data terhubung melalui Supabase dan perubahan data langsung tercermin pada dashboard.

Prioritas utama:

**Simple → Fast → Connected → Responsive → Maintainable**

Jangan membangun fitur yang tidak dibutuhkan. Fokus pada empat modul utama, dashboard overview, search, dan integrasi Supabase yang solid.
