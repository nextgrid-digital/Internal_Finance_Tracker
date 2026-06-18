-- Finance Tracker schema
-- Run this against your Supabase project (SQL editor, `supabase db push`,
-- or the Supabase MCP `execute_sql`).

create extension if not exists "pgcrypto";

-- Members ------------------------------------------------------------
create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  split_percentage numeric not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Income (each row is a project / payment) ---------------------------
create table if not exists public.income (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  client text,
  amount numeric not null default 0,
  received_on date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);

-- Expenses (optionally linked to an income row) ----------------------
create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  amount numeric not null default 0,
  category text not null default 'general',
  income_id uuid references public.income(id) on delete set null,
  spent_on date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);

-- Payouts (actual transfers made to members) -------------------------
create table if not exists public.payouts (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  amount numeric not null default 0,
  status text not null default 'pending' check (status in ('pending', 'paid')),
  period text,
  paid_at date,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists expenses_income_id_idx on public.expenses (income_id);
create index if not exists payouts_member_id_idx on public.payouts (member_id);

-- Row Level Security -------------------------------------------------
-- Enabled with no public policies: the Data API denies anon/authenticated
-- access, while the server-side service-role key (used by this app's
-- server actions) bypasses RLS. This keeps the tables private for an
-- internal founder tool that authenticates via Clerk.
alter table public.members enable row level security;
alter table public.income enable row level security;
alter table public.expenses enable row level security;
alter table public.payouts enable row level security;

-- Seed editable placeholder members (35 / 35 / 30) -------------------
insert into public.members (name, split_percentage, active)
select * from (values
  ('Person 1', 35, true),
  ('Person 2', 35, true),
  ('Person 4', 30, true)
) as seed(name, split_percentage, active)
where not exists (select 1 from public.members);
