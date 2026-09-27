-- ============================================================================
-- Seed Data — Personal Academic Dashboard
-- Sumber: lampiran.md (Kelas X Ar-Rahman, SMA Al Muslim — 2026/2027)
-- Jalankan SETELAH migrasi awal, mis: psql "$DATABASE_URL" -f supabase/seed.sql
-- atau paste di Supabase SQL Editor.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Subjects (master data mata pelajaran)
-- ----------------------------------------------------------------------------
insert into public.subjects (name, code) values
  ('Matematika', 'MTK'),
  ('Fisika', 'FIS'),
  ('Kimia', 'KIM'),
  ('Biologi', 'BIO'),
  ('Informatika', 'INF'),
  ('Bahasa Indonesia', 'BIND'),
  ('Bahasa Inggris', 'BING'),
  ('Sosiologi', 'SOS'),
  ('Ekonomi', 'EKO'),
  ('Sejarah', 'SEJ'),
  ('Geografi', 'GEO'),
  ('Pendidikan Agama Islam', 'PAI'),
  ('PJOK', 'PJOK'),
  ('Seni Budaya', 'SNB'),
  ('Bahasa Jepang', 'BJEP'),
  ('Bahasa Jawa', 'BJAW'),
  ('Pendidikan Pancasila', 'PP'),
  ('Projek Kokurikuler', 'PKK'),
  ('GE', 'GE'),
  ('TKA', 'TKA'),
  ('LEAD', 'LEAD')
on conflict (name) do nothing;

-- ----------------------------------------------------------------------------
-- Students — Daftar Siswa Kelas X Ar-Rahman (lampiran.md)
-- Nomor urut dinormalisasi 1..25 mengikuti urutan pada lampiran.
-- ----------------------------------------------------------------------------
insert into public.students (sort_no, full_name, nickname, gender) values
  (1, 'AFFAN RAFIE DARMAWAN', 'AFFAN', 'L'),
  (2, 'Aira Azzahra Ramadhani', 'Aira', 'P'),
  (3, 'Andi M. Nafil Putra Hidayat', 'Nafil', 'L'),
  (4, 'Arya Adyatma Yusuf', 'Arya', 'L'),
  (5, 'Arya Putra Pratama', 'Arya', 'L'),
  (6, 'Azzahra Nadine Syahdini', 'Nadine', 'P'),
  (7, 'Damita Amalia Rahma Dhian Soedradjad', 'Damita', 'P'),
  (8, 'Faaiq Shah Aryasatya', 'Faaiq', 'L'),
  (9, 'Fakhira Mutia Hafsa', 'Fakhira', 'P'),
  (10, 'FARHAN MUHAMMAD RAFIRLY', 'FARHAN', 'L'),
  (11, 'Farizah Izdihar Athaya', 'Fia', 'P'),
  (12, 'Fiorenza Alicia Sugiyanto', 'Cia', 'P'),
  (13, 'Khaliesa Amalia Putri Adhikusuma', 'Shesa', 'P'),
  (14, 'M. Atha Ibrahim', 'Atha', 'L'),
  (15, 'Maritza Maliiha', 'Ritza', 'P'),
  (16, 'Muhammad Bachtiar Prabowo', 'Bachtiar', 'L'),
  (17, 'Muhammad Ilmi Faridho', 'Ridho', 'L'),
  (18, 'NABIL HILMI HABIBI', 'NABIL', 'L'),
  (19, 'Nabilla Ramadhani', 'Nabilla', 'P'),
  (20, 'Nafeeza Izzati', 'Izza', 'P'),
  (21, 'Nasya Azkamaira Izzatirhayya', 'Aeeyra', 'P'),
  (22, 'Nauqah Layyinatuz Zahrah', 'Noqa', 'P'),
  (23, 'SAFIRA AMALIA CAHYADEWI', 'Safira', 'P'),
  (24, 'Suta Aji Feryansyah', 'Yayan', 'L'),
  (25, 'Syafira Rachmania Bahri', 'Fira', 'P');

-- ----------------------------------------------------------------------------
-- Jadwal Pelajaran Kelas X Ar-Rahman (lampiran.md)
-- day_of_week: 1=Senin 2=Selasa 3=Rabu 4=Kamis 5=Jumat 6=Sabtu
-- note: digunakan untuk waktu khusus hari Jumat, mis. '08.40-09.15'
-- ----------------------------------------------------------------------------
insert into public.schedule_entries (day_of_week, slot, time_label, title, detail, note, kind) values
  -- Senin
  (1, 1, '07.15 - 07.45', 'Salat Duha & Baca Surat Pilihan', null, null, 'activity'),
  (1, 2, '07.45 - 08.40', 'Upacara / Bedah Buku', null, null, 'activity'),
  (1, 3, '08.40 - 09.20', 'PP', 'RP', null, 'lesson'),
  (1, 4, '09.20 - 10.00', 'PP', 'RP', null, 'lesson'),
  (1, 5, '10.00 - 10.20', 'Istirahat', null, null, 'break'),
  (1, 6, '10.20 - 10.55', 'PJOK', 'MO', null, 'lesson'),
  (1, 7, '10.55 - 11.30', 'PJOK', 'MO', null, 'lesson'),
  (1, 8, '11.30 - 12.30', 'ISAMA', null, null, 'break'),
  (1, 9, '12.30 - 13.00', 'Projek Kokurikuler', 'AT, AR', null, 'lesson'),
  (1, 10, '13.00 - 13.30', 'Projek Kokurikuler', 'AT, AR', null, 'lesson'),
  (1, 11, '13.30 - 14.00', 'Fisika', 'UK', null, 'lesson'),
  (1, 12, '14.00 - 14.30', 'Fisika', 'UK', null, 'lesson'),
  (1, 13, '14.30 - 15.00', 'Matematika', 'DN', null, 'lesson'),
  (1, 14, '15.00 - 15.30', 'Matematika', 'DN', null, 'lesson'),
  (1, 15, '15.30 - 15.45', 'Salat Asar', null, null, 'break'),
  -- Selasa
  (2, 1, '07.15 - 07.45', 'Salat Duha & Baca Surat Pilihan', null, null, 'activity'),
  (2, 2, '07.45 - 08.40', 'Mengaji', null, null, 'activity'),
  (2, 3, '08.40 - 09.20', 'Sosiologi', 'SW', null, 'lesson'),
  (2, 4, '09.20 - 10.00', 'Sosiologi', 'SW', null, 'lesson'),
  (2, 5, '10.00 - 10.20', 'Istirahat', null, null, 'break'),
  (2, 6, '10.20 - 10.55', 'B. Jawa / TKA MAT', 'AT', null, 'lesson'),
  (2, 7, '10.55 - 11.30', 'B. Jawa / TKA MAT', 'AT', null, 'lesson'),
  (2, 8, '11.30 - 12.30', 'ISAMA', null, null, 'break'),
  (2, 9, '12.30 - 13.00', 'B. Jepang', 'ES', null, 'lesson'),
  (2, 10, '13.00 - 13.30', 'B. Jepang', 'ES', null, 'lesson'),
  (2, 11, '13.30 - 14.00', 'Bedah Buku', null, null, 'activity'),
  (2, 12, '14.00 - 14.30', 'Ekstrakurikuler', null, null, 'activity'),
  (2, 13, '14.30 - 15.00', 'Ekstrakurikuler', null, null, 'activity'),
  (2, 14, '15.00 - 15.30', 'Ekstrakurikuler', null, null, 'activity'),
  (2, 15, '15.30 - 15.45', 'Salat Asar', null, null, 'break'),
  -- Rabu
  (3, 1, '07.15 - 07.45', 'Salat Duha & Baca Surat Pilihan', null, null, 'activity'),
  (3, 2, '07.45 - 08.40', 'Mengaji', null, null, 'activity'),
  (3, 3, '08.40 - 09.20', 'B. Indonesia', 'AL', null, 'lesson'),
  (3, 4, '09.20 - 10.00', 'B. Indonesia', 'AL', null, 'lesson'),
  (3, 5, '10.00 - 10.20', 'Istirahat', null, null, 'break'),
  (3, 6, '10.20 - 10.55', 'B. Indonesia', 'AL', null, 'lesson'),
  (3, 7, '10.55 - 11.30', 'PAI', 'AR', null, 'lesson'),
  (3, 8, '11.30 - 12.30', 'ISAMA', null, null, 'break'),
  (3, 9, '12.30 - 13.00', 'PAI', 'AR', null, 'lesson'),
  (3, 10, '13.00 - 13.30', 'PAI', 'AR', null, 'lesson'),
  (3, 11, '13.30 - 14.00', 'Kimia', 'DW', null, 'lesson'),
  (3, 12, '14.00 - 14.30', 'Kimia', 'DW', null, 'lesson'),
  (3, 13, '14.30 - 15.00', 'TKA MAT / TKA B. Ing', 'JM / RH', null, 'lesson'),
  (3, 14, '15.00 - 15.30', 'TKA MAT / TKA B. Ing', 'JM / RH', null, 'lesson'),
  (3, 15, '15.30 - 15.45', 'Salat Asar', null, null, 'break'),
  -- Kamis
  (4, 1, '07.15 - 07.45', 'Salat Duha & Baca Surat Pilihan', null, null, 'activity'),
  (4, 2, '07.45 - 08.40', 'Mengaji', null, null, 'activity'),
  (4, 3, '08.40 - 09.20', 'B. Inggris', 'IM', null, 'lesson'),
  (4, 4, '09.20 - 10.00', 'B. Inggris', 'IM', null, 'lesson'),
  (4, 5, '10.00 - 10.20', 'Istirahat', null, null, 'break'),
  (4, 6, '10.20 - 10.55', 'GE', 'DW', null, 'lesson'),
  (4, 7, '10.55 - 11.30', 'GE', 'DW', null, 'lesson'),
  (4, 8, '11.30 - 12.30', 'ISAMA', null, null, 'break'),
  (4, 9, '12.30 - 13.00', 'LEAD', 'AR', null, 'lesson'),
  (4, 10, '13.00 - 13.30', 'LEAD', 'AR', null, 'lesson'),
  (4, 11, '13.30 - 14.00', 'Ekonomi', 'AA', null, 'lesson'),
  (4, 12, '14.00 - 14.30', 'Ekonomi', 'AA', null, 'lesson'),
  (4, 13, '14.30 - 15.00', 'Informatika', 'AT', null, 'lesson'),
  (4, 14, '15.00 - 15.30', 'Informatika', 'AT', null, 'lesson'),
  (4, 15, '15.30 - 15.45', 'Salat Asar', null, null, 'break'),
  -- Jumat (waktu khusus tercantum pada kolom note)
  (5, 1, '07.15 - 07.45', 'Salat Duha & Baca Surat Pilihan', null, null, 'activity'),
  (5, 2, '07.45 - 08.40', 'Mengaji', null, null, 'activity'),
  (5, 3, '08.40 - 09.20', 'Matematika', 'DN', '08.40-09.15', 'lesson'),
  (5, 4, '09.20 - 10.00', 'Matematika', 'DN', '09.15-09.50', 'lesson'),
  (5, 5, '10.00 - 10.20', 'Istirahat', null, '09.50-10.05', 'break'),
  (5, 6, '10.20 - 10.55', 'Seni Budaya', 'FN', '10.05-10.40', 'lesson'),
  (5, 7, '10.55 - 11.30', 'Seni Budaya', 'FN', '10.40-11.15', 'lesson'),
  (5, 8, '11.30 - 12.30', 'ISAMA', null, '11.15-12.30', 'break'),
  (5, 9, '12.30 - 13.00', 'Biologi', 'AN', null, 'lesson'),
  (5, 10, '13.00 - 13.30', 'Biologi', 'AN', null, 'lesson'),
  (5, 11, '13.30 - 14.00', 'Sejarah', 'FR', null, 'lesson'),
  (5, 12, '14.00 - 14.30', 'Sejarah', 'FR', null, 'lesson'),
  (5, 13, '14.30 - 15.00', 'Geografi', 'HR', null, 'lesson'),
  (5, 14, '15.00 - 15.30', 'Geografi', 'HR', null, 'lesson'),
  (5, 15, '15.30 - 15.45', 'Salat Asar', null, null, 'break'),
  -- Sabtu
  (6, 1, '07.15 - 07.45', 'Ekstrakurikuler & Pengembangan Diri', null, null, 'activity'),
  (6, 2, '07.45 - 08.40', 'Ekstrakurikuler & Pengembangan Diri', null, null, 'activity'),
  (6, 3, '08.40 - 09.20', 'Ekstrakurikuler & Pengembangan Diri', null, null, 'activity')
on conflict (day_of_week, slot) do nothing;
