-- NutriTrack schema. Paste into the Supabase SQL editor and run once.

create extension if not exists "pgcrypto";

-- Everything you eat, one row per item.
create table if not exists public.entries (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null default auth.uid() references auth.users on delete cascade,
  eaten_on     date not null,
  eaten_at     time not null,
  name         text not null,
  emoji        text,
  qty          numeric,           -- null for a ticked-off plan item
  unit         text,
  per_g        boolean not null default false,
  unit_kcal    numeric,
  unit_protein numeric,
  kcal         numeric not null,
  protein      numeric not null,
  plan_id      text,              -- "slot|item" when ticked off the plan, else null
  created_at   timestamptz not null default now()
);

create index if not exists entries_user_day_idx on public.entries (user_id, eaten_on);
-- one row per planned item per day, so ticking twice can't duplicate it
create unique index if not exists entries_plan_unique
  on public.entries (user_id, eaten_on, plan_id) where plan_id is not null;

-- Weigh-ins, one row per day.
create table if not exists public.weigh_ins (
  user_id     uuid not null default auth.uid() references auth.users on delete cascade,
  measured_on date not null,
  lb          numeric not null,
  created_at  timestamptz not null default now(),
  primary key (user_id, measured_on)
);

alter table public.entries   enable row level security;
alter table public.weigh_ins enable row level security;

-- You can only ever see and touch your own rows.
drop policy if exists "own entries" on public.entries;
create policy "own entries" on public.entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own weigh_ins" on public.weigh_ins;
create policy "own weigh_ins" on public.weigh_ins
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
