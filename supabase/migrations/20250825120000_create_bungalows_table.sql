-- ===========================
-- TABLE: public.bungalows
-- ===========================
create extension if not exists "pgcrypto"; -- for gen_random_uuid()

create table if not exists public.bungalows (
  id uuid primary key default gen_random_uuid(),
  plot_number text not null,
  type text not null,                 -- e.g., '3 BHK Duplex'
  size_sqft integer not null,
  price numeric not null,
  status text not null default 'Available'
    check (status in ('Available', 'Booked', 'Sold')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_bungalows_updated_at on public.bungalows;
create trigger trg_bungalows_updated_at
before update on public.bungalows
for each row execute procedure public.set_updated_at();

-- ===========================
-- RLS
-- ===========================
alter table public.bungalows enable row level security;

-- anyone (anon/public/authenticated) can read
drop policy if exists "Bungalows: read for all" on public.bungalows;
create policy "Bungalows: read for all"
on public.bungalows
for select
to public, anon, authenticated
using (true);

-- only authenticated can insert/update/delete
drop policy if exists "Bungalows: insert (auth only)" on public.bungalows;
create policy "Bungalows: insert (auth only)"
on public.bungalows
for insert
to authenticated
with check (true);

drop policy if exists "Bungalows: update (auth only)" on public.bungalows;
create policy "Bungalows: update (auth only)"
on public.bungalows
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Bungalows: delete (auth only)" on public.bungalows;
create policy "Bungalows: delete (auth only)"
on public.bungalows
for delete
to authenticated
using (true);

-- ===========================
-- (Optional) seed data
-- ===========================
insert into public.bungalows (plot_number, type, size_sqft, price, status) values
('P-01', '3 BHK Duplex', 1850, 12500000, 'Available'),
('P-02', '4 BHK Duplex', 2450, 17500000, 'Booked')
on conflict do nothing;