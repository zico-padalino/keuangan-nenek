-- Jalankan di Supabase SQL Editor (Project → SQL → New query)

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  id int primary key default 1 check (id = 1),
  nenek_name text not null default 'Nenek',
  monthly_dues numeric(14, 2) not null default 500000,
  updated_at timestamptz not null default now()
);

insert into public.settings (id, nenek_name, monthly_dues)
values (1, 'Nenek', 500000)
on conflict (id) do nothing;

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  user_id uuid references public.profiles (id) on delete set null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.contributions (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members (id) on delete cascade,
  amount numeric(14, 2) not null check (amount > 0),
  period_month int not null check (period_month between 1 and 12),
  period_year int not null check (period_year >= 2000),
  note text,
  image_path text,
  paid_at date not null default current_date,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  amount numeric(14, 2) not null check (amount > 0),
  category text not null default 'umum',
  description text not null,
  image_path text,
  spent_at date not null default current_date,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists contributions_period_idx
  on public.contributions (period_year, period_month);

create index if not exists contributions_member_idx
  on public.contributions (member_id);

create index if not exists expenses_spent_at_idx
  on public.expenses (spent_at desc);

alter table public.profiles enable row level security;
alter table public.settings enable row level security;
alter table public.members enable row level security;
alter table public.contributions enable row level security;
alter table public.expenses enable row level security;

-- Monitoring publik (anon bisa baca). CRUD hanya untuk user yang login.
create policy "profiles_select" on public.profiles for select to authenticated using (true);
create policy "profiles_insert" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "profiles_update" on public.profiles for update to authenticated using (auth.uid() = id);

create policy "settings_select" on public.settings for select to anon, authenticated using (true);
create policy "settings_update" on public.settings for update to authenticated using (true);

create policy "members_select" on public.members for select to anon, authenticated using (true);
create policy "members_insert" on public.members for insert to authenticated with check (true);
create policy "members_update" on public.members for update to authenticated using (true) with check (true);
create policy "members_delete" on public.members for delete to authenticated using (true);

create policy "contributions_select" on public.contributions for select to anon, authenticated using (true);
create policy "contributions_insert" on public.contributions for insert to authenticated with check (true);
create policy "contributions_update" on public.contributions for update to authenticated using (true) with check (true);
create policy "contributions_delete" on public.contributions for delete to authenticated using (true);

create policy "expenses_select" on public.expenses for select to anon, authenticated using (true);
create policy "expenses_insert" on public.expenses for insert to authenticated with check (true);
create policy "expenses_update" on public.expenses for update to authenticated using (true) with check (true);
create policy "expenses_delete" on public.expenses for delete to authenticated using (true);

-- Auto-buat profil saat daftar
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Storage bukti transfer / struk (baca publik, upload hanya login)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'bukti',
  'bukti',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "bukti_public_read" on storage.objects;
drop policy if exists "bukti_auth_insert" on storage.objects;
drop policy if exists "bukti_auth_update" on storage.objects;
drop policy if exists "bukti_auth_delete" on storage.objects;

create policy "bukti_public_read"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'bukti');

create policy "bukti_auth_insert"
on storage.objects for insert
to authenticated
with check (bucket_id = 'bukti');

create policy "bukti_auth_update"
on storage.objects for update
to authenticated
using (bucket_id = 'bukti')
with check (bucket_id = 'bukti');

create policy "bukti_auth_delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'bukti');
