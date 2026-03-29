-- Run this in Supabase SQL editor.
-- Creates portfolio tables, storage policies, and strict RLS for single-admin workflow.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  profession text not null,
  summary text not null,
  company_name text,
  years_building int default 15,
  years_electrical int default 6,
  years_mechanical int default 6,
  certification text,
  cv_url text,
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null,
  category text not null check (category in ('building', 'interior', 'exterior', 'electrical', 'mechanical')),
  location text,
  completed_at date,
  youtube_url text,
  hero_image_url text,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  media_type text not null check (media_type in ('image', 'video_link')),
  media_url text not null,
  caption text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.references (
  id uuid primary key default gen_random_uuid(),
  referee_name text not null,
  referee_role text not null,
  company_name text,
  summary text,
  issued_date date,
  document_url text,
  verified boolean not null default false,
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.keep_alive (
  id int primary key default 1,
  touched_at timestamptz not null default now(),
  note text not null default 'supabase keep alive'
);

insert into public.keep_alive (id, touched_at)
values (1, now())
on conflict (id) do update set touched_at = excluded.touched_at;

create index if not exists idx_projects_completed_at on public.projects (completed_at desc);
create index if not exists idx_projects_featured on public.projects (featured);
create index if not exists idx_project_media_project_id on public.project_media (project_id);
create index if not exists idx_project_media_sort_order on public.project_media (project_id, sort_order asc);
create index if not exists idx_references_issued_date on public.references (issued_date desc);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_media enable row level security;
alter table public.references enable row level security;
alter table public.keep_alive enable row level security;

-- Public read policies for website visitors.
drop policy if exists "public read profiles" on public.profiles;
create policy "public read profiles"
on public.profiles
for select
to anon, authenticated
using (true);

drop policy if exists "public read projects" on public.projects;
create policy "public read projects"
on public.projects
for select
to anon, authenticated
using (true);

drop policy if exists "public read project media" on public.project_media;
create policy "public read project media"
on public.project_media
for select
to anon, authenticated
using (true);

drop policy if exists "public read references" on public.references;
create policy "public read references"
on public.references
for select
to anon, authenticated
using (is_public = true);

-- Admin write policy for authenticated users.
-- In dashboard usage, only your admin user should exist for writes.
drop policy if exists "admin manage profiles" on public.profiles;
create policy "admin manage profiles"
on public.profiles
for all
to authenticated
using (true)
with check (true);

drop policy if exists "admin manage projects" on public.projects;
create policy "admin manage projects"
on public.projects
for all
to authenticated
using (true)
with check (true);

drop policy if exists "admin manage project media" on public.project_media;
create policy "admin manage project media"
on public.project_media
for all
to authenticated
using (true)
with check (true);

drop policy if exists "admin manage references" on public.references;
create policy "admin manage references"
on public.references
for all
to authenticated
using (true)
with check (true);

-- Keep alive policy: allow anon upsert against only row id=1.
drop policy if exists "anon upsert keep alive" on public.keep_alive;
create policy "anon upsert keep alive"
on public.keep_alive
for insert
to anon
with check (id = 1);

drop policy if exists "anon update keep alive" on public.keep_alive;
create policy "anon update keep alive"
on public.keep_alive
for update
to anon
using (id = 1)
with check (id = 1);

drop policy if exists "public read keep alive" on public.keep_alive;
create policy "public read keep alive"
on public.keep_alive
for select
to anon, authenticated
using (id = 1);

-- Storage bucket setup for images and reference letter files.
insert into storage.buckets (id, name, public)
values ('portfolio-media', 'portfolio-media', true)
on conflict (id) do nothing;

-- Public read access for storage objects.
drop policy if exists "public read portfolio media" on storage.objects;
create policy "public read portfolio media"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'portfolio-media');

-- Authenticated upload/delete for admin dashboard.
drop policy if exists "admin upload portfolio media" on storage.objects;
create policy "admin upload portfolio media"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'portfolio-media');

drop policy if exists "admin delete portfolio media" on storage.objects;
create policy "admin delete portfolio media"
on storage.objects
for delete
to authenticated
using (bucket_id = 'portfolio-media');
