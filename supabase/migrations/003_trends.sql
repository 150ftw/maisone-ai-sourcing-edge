-- ============================================================
--  Maisone — Trend Forecasting Schema
--  Migration: 003_trends.sql
-- ============================================================

create table if not exists public.trends (
  id          uuid primary key default uuid_generate_v4(),
  created_at  timestamptz not null default now(),
  region      text not null,
  season      text not null,
  fabrics     jsonb not null,
  colors      jsonb not null,
  silhouettes jsonb not null,
  unique(region, season)
);

-- Row Level Security
alter table public.trends enable row level security;

create policy "Public can view trends"
  on public.trends for select
  using (true);

create policy "Allow public all trends"
  on public.trends for all
  using (true);
