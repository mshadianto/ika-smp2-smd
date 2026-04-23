-- ============================================================
-- IKA SMPN 2 Samarinda — Supabase Schema
-- Run this entire file in Supabase Dashboard > SQL Editor
-- Safe to re-run (uses IF NOT EXISTS / on conflict / or replace)
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Alumni
create table if not exists alumni (
  id uuid primary key default uuid_generate_v4(),
  nama text not null,
  angkatan text,
  kelas text,
  pekerjaan text,
  kota text,
  telepon text,
  email text,
  bio text,
  avatar_url text,
  registered date default current_date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Market Items (admin-only write)
create table if not exists market_items (
  id uuid primary key default uuid_generate_v4(),
  alumni_id uuid references alumni(id) on delete set null,
  judul text not null,
  harga numeric default 0,
  kategori text,
  deskripsi text,
  kontak text,
  lokasi text,
  image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- UMKM
create table if not exists umkm (
  id uuid primary key default uuid_generate_v4(),
  alumni_id uuid references alumni(id) on delete set null,
  nama_usaha text not null,
  kategori text,
  deskripsi text,
  alamat text,
  telepon text,
  instagram text,
  website text,
  logo_url text,
  created_at timestamptz default now()
);

-- Events
create table if not exists events (
  id uuid primary key default uuid_generate_v4(),
  judul text not null,
  tanggal date,
  lokasi text,
  deskripsi text,
  biaya text,
  created_at timestamptz default now()
);

-- Gallery Albums
create table if not exists gallery_albums (
  id uuid primary key default uuid_generate_v4(),
  upload_by uuid references alumni(id) on delete set null,
  judul text not null,
  album_kategori text,
  deskripsi text,
  tanggal date default current_date,
  created_at timestamptz default now()
);

create table if not exists gallery_photos (
  id uuid primary key default uuid_generate_v4(),
  album_id uuid references gallery_albums(id) on delete cascade,
  caption text,
  color text,
  image_url text,
  ord integer default 0,
  created_at timestamptz default now()
);

-- Forum
create table if not exists forum_threads (
  id uuid primary key default uuid_generate_v4(),
  author_id uuid references alumni(id) on delete set null,
  judul text not null,
  kategori text,
  konten text,
  pinned boolean default false,
  likes integer default 0,
  created_at timestamptz default now()
);

create table if not exists forum_replies (
  id uuid primary key default uuid_generate_v4(),
  thread_id uuid references forum_threads(id) on delete cascade,
  author_id uuid references alumni(id) on delete set null,
  konten text,
  likes integer default 0,
  created_at timestamptz default now()
);

-- Admin emails table (source of truth for admin check)
create table if not exists admin_emails (
  email text primary key,
  added_at timestamptz default now()
);

insert into admin_emails (email) values
  ('sopian.hadianto@gmail.com'),
  ('firman20@yahoo.com')
on conflict (email) do nothing;

-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

alter table alumni enable row level security;
alter table market_items enable row level security;
alter table umkm enable row level security;
alter table events enable row level security;
alter table gallery_albums enable row level security;
alter table gallery_photos enable row level security;
alter table forum_threads enable row level security;
alter table forum_replies enable row level security;
alter table admin_emails enable row level security;

-- Helper function: is current user an admin?
create or replace function is_admin()
returns boolean
language sql stable security definer as $$
  select exists (
    select 1 from admin_emails
    where email = auth.jwt() ->> 'email'
  );
$$;

-- Drop existing policies first so this file is safely re-runnable
drop policy if exists "public_read_alumni" on alumni;
drop policy if exists "public_read_market" on market_items;
drop policy if exists "public_read_umkm" on umkm;
drop policy if exists "public_read_events" on events;
drop policy if exists "public_read_gallery_albums" on gallery_albums;
drop policy if exists "public_read_gallery_photos" on gallery_photos;
drop policy if exists "public_read_forum" on forum_threads;
drop policy if exists "public_read_replies" on forum_replies;
drop policy if exists "admin_write_market" on market_items;
drop policy if exists "anyone_insert_alumni" on alumni;
drop policy if exists "admin_update_alumni" on alumni;
drop policy if exists "admin_delete_alumni" on alumni;
drop policy if exists "anyone_insert_umkm" on umkm;
drop policy if exists "admin_modify_umkm" on umkm;
drop policy if exists "admin_delete_umkm" on umkm;
drop policy if exists "admin_write_events" on events;
drop policy if exists "anyone_insert_album" on gallery_albums;
drop policy if exists "anyone_insert_photo" on gallery_photos;
drop policy if exists "admin_modify_album" on gallery_albums;
drop policy if exists "admin_delete_album" on gallery_albums;
drop policy if exists "anyone_insert_thread" on forum_threads;
drop policy if exists "anyone_insert_reply" on forum_replies;
drop policy if exists "anyone_update_thread_likes" on forum_threads;
drop policy if exists "anyone_update_reply_likes" on forum_replies;
drop policy if exists "admin_delete_thread" on forum_threads;
drop policy if exists "admin_delete_reply" on forum_replies;
drop policy if exists "read_admin_emails" on admin_emails;

-- PUBLIC READ policies (all tables)
create policy "public_read_alumni" on alumni for select using (true);
create policy "public_read_market" on market_items for select using (true);
create policy "public_read_umkm" on umkm for select using (true);
create policy "public_read_events" on events for select using (true);
create policy "public_read_gallery_albums" on gallery_albums for select using (true);
create policy "public_read_gallery_photos" on gallery_photos for select using (true);
create policy "public_read_forum" on forum_threads for select using (true);
create policy "public_read_replies" on forum_replies for select using (true);

-- MARKETPLACE: admin-only write
create policy "admin_write_market" on market_items
  for all using (is_admin()) with check (is_admin());

-- ALUMNI: anyone can insert (self-registration), only admin can update/delete
create policy "anyone_insert_alumni" on alumni for insert with check (true);
create policy "admin_update_alumni" on alumni for update using (is_admin());
create policy "admin_delete_alumni" on alumni for delete using (is_admin());

-- UMKM: anyone can insert, admin can manage
create policy "anyone_insert_umkm" on umkm for insert with check (true);
create policy "admin_modify_umkm" on umkm for update using (is_admin());
create policy "admin_delete_umkm" on umkm for delete using (is_admin());

-- EVENTS: admin-only write
create policy "admin_write_events" on events
  for all using (is_admin()) with check (is_admin());

-- GALLERY: anyone can insert, admin can manage
create policy "anyone_insert_album" on gallery_albums for insert with check (true);
create policy "anyone_insert_photo" on gallery_photos for insert with check (true);
create policy "admin_modify_album" on gallery_albums for update using (is_admin());
create policy "admin_delete_album" on gallery_albums for delete using (is_admin());

-- FORUM: anyone can post threads/replies, admin can moderate
create policy "anyone_insert_thread" on forum_threads for insert with check (true);
create policy "anyone_insert_reply" on forum_replies for insert with check (true);
create policy "anyone_update_thread_likes" on forum_threads for update using (true);
create policy "anyone_update_reply_likes" on forum_replies for update using (true);
create policy "admin_delete_thread" on forum_threads for delete using (is_admin());
create policy "admin_delete_reply" on forum_replies for delete using (is_admin());

-- Admin emails: read-only for logged-in users
create policy "read_admin_emails" on admin_emails for select using (auth.role() = 'authenticated');
