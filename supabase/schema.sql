create extension if not exists "pgcrypto";

create table if not exists public.food_entries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  meal text not null check (meal in ('Breakfast', 'Lunch', 'Dinner', 'Snack')),
  calories numeric(10,1) not null default 0,
  protein numeric(10,1) not null default 0,
  carbs numeric(10,1) not null default 0,
  fat numeric(10,1) not null default 0,
  serving text not null default '1 serving',
  created_at timestamptz not null default now()
);

alter table public.food_entries enable row level security;

create policy if not exists "Allow anon select food entries"
on public.food_entries
for select
using (true);

create policy if not exists "Allow anon insert food entries"
on public.food_entries
for insert
with check (true);

create policy if not exists "Allow anon delete food entries"
on public.food_entries
for delete
using (true);
