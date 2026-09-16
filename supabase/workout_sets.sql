-- Set logging for the exercise library. Run after the other three files.

create table if not exists public.workout_sets (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null default auth.uid() references auth.users on delete cascade,
  performed_on  date not null default (now() at time zone 'utc')::date,
  exercise_slug text not null,
  exercise_name text not null,
  group_key     text,
  set_index     int  not null,
  reps          numeric,
  weight        numeric,          -- null for bodyweight or a timed hold
  unit          text not null default 'lb',
  created_at    timestamptz not null default now()
);

create index if not exists workout_sets_lookup
  on public.workout_sets (user_id, exercise_slug, performed_on desc);
create index if not exists workout_sets_day
  on public.workout_sets (user_id, performed_on desc);

alter table public.workout_sets enable row level security;

drop policy if exists "own sets" on public.workout_sets;
create policy "own sets" on public.workout_sets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
