-- Jalankan di Supabase SQL Editor jika project sudah pernah pakai schema lama.
-- Membuka baca publik untuk monitoring; tulis tetap butuh login.

drop policy if exists "settings_select" on public.settings;
create policy "settings_select" on public.settings for select to anon, authenticated using (true);

drop policy if exists "members_all" on public.members;
drop policy if exists "members_select" on public.members;
drop policy if exists "members_insert" on public.members;
drop policy if exists "members_update" on public.members;
drop policy if exists "members_delete" on public.members;
create policy "members_select" on public.members for select to anon, authenticated using (true);
create policy "members_insert" on public.members for insert to authenticated with check (true);
create policy "members_update" on public.members for update to authenticated using (true) with check (true);
create policy "members_delete" on public.members for delete to authenticated using (true);

drop policy if exists "contributions_all" on public.contributions;
drop policy if exists "contributions_select" on public.contributions;
drop policy if exists "contributions_insert" on public.contributions;
drop policy if exists "contributions_update" on public.contributions;
drop policy if exists "contributions_delete" on public.contributions;
create policy "contributions_select" on public.contributions for select to anon, authenticated using (true);
create policy "contributions_insert" on public.contributions for insert to authenticated with check (true);
create policy "contributions_update" on public.contributions for update to authenticated using (true) with check (true);
create policy "contributions_delete" on public.contributions for delete to authenticated using (true);

drop policy if exists "expenses_all" on public.expenses;
drop policy if exists "expenses_select" on public.expenses;
drop policy if exists "expenses_insert" on public.expenses;
drop policy if exists "expenses_update" on public.expenses;
drop policy if exists "expenses_delete" on public.expenses;
create policy "expenses_select" on public.expenses for select to anon, authenticated using (true);
create policy "expenses_insert" on public.expenses for insert to authenticated with check (true);
create policy "expenses_update" on public.expenses for update to authenticated using (true) with check (true);
create policy "expenses_delete" on public.expenses for delete to authenticated using (true);
