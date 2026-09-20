-- Jalankan di Supabase SQL Editor (project yang sudah hidup).
-- Menambah kolom bukti gambar + bucket Storage "bukti".

alter table public.contributions
  add column if not exists image_path text;

alter table public.expenses
  add column if not exists image_path text;

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
