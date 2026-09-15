-- Run this in the Supabase SQL editor, after schema.sql.
-- One row per person: what they told us during setup.

create table if not exists public.profiles (
  user_id        uuid primary key default auth.uid() references auth.users on delete cascade,
  name           text not null default '',
  sex            text not null default 'male',      -- male | female
  age            int  not null default 30,
  height_cm      numeric not null default 175,
  weight_lb      numeric not null default 170,
  goal_weight_lb numeric not null default 160,
  activity       text not null default 'moderate',  -- sedentary | light | moderate | very
  goal           text not null default 'lose',      -- lose | maintain | gain
  diet           text not null default 'nonveg',    -- nonveg | egg | veg | vegan
  gym_when       text not null default 'evening',   -- morning | evening | none
  gym_days       int  not null default 5,
  cuisine        text not null default 'south',     -- south | north
  target_weeks   int  not null default 26,         -- how long they want to take
  units          text not null default 'lb',        -- lb | kg
  meals_per_day  int  not null default 5,           -- 3 | 4 | 5
  avoid          text[] not null default '{}',      -- dairy, nuts, gluten, seafood, beef, pork, onion_garlic
  uses_supplements boolean not null default true
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
