-- Water, one row per day. Run after the other four files.

create table if not exists public.water_log (
  user_id   uuid not null default auth.uid() references auth.users on delete cascade,
  logged_on date not null,
  ml        int  not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, logged_on)
);

alter table public.water_log enable row level security;

drop policy if exists "own water" on public.water_log;
create policy "own water" on public.water_log
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
