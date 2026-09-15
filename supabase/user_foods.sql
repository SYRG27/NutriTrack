-- Your own version of a food: the numbers off the packet in your kitchen,
-- not the ones in the shared catalogue. Run after the other two files.

create table if not exists public.user_foods (
  user_id      uuid not null default auth.uid() references auth.users on delete cascade,
  name         text not null,
  emoji        text not null default '🍽️',
  unit         text not null default 'serving',
  per_g        boolean not null default false,
  unit_kcal    numeric not null,
  unit_protein numeric not null,
  updated_at   timestamptz not null default now(),
  primary key (user_id, name)
);

alter table public.user_foods enable row level security;

drop policy if exists "own foods" on public.user_foods;
create policy "own foods" on public.user_foods
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
