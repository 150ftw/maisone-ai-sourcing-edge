-- ============================================================
--  Migration: 002_supplier_requests.sql
-- ============================================================

-- ============================================================
--  TABLE: supplier_requests
--  Submitted by the public Join as Supplier form.
-- ============================================================
create table if not exists public.supplier_requests (
  id             uuid primary key default uuid_generate_v4(),
  created_at     timestamptz not null default now(),
  full_name      text not null,
  work_email     text not null,
  factory_name   text not null,
  region         text not null default '',
  categories     text[] not null default '{}',
  moq            text not null default '',
  lead_time      text not null default '',
  message        text,
  status         text not null default 'Pending'
    check (status in ('Pending', 'Contacted', 'Approved', 'Rejected'))
);

-- ============================================================
--  ROW LEVEL SECURITY
-- ============================================================

-- supplier_requests: public INSERT, authenticated full-access
alter table public.supplier_requests enable row level security;

drop policy if exists "Public can submit supplier requests" on public.supplier_requests;
create policy "Public can submit supplier requests"
  on public.supplier_requests for insert
  with check (true);

drop policy if exists "Authenticated can view supplier requests" on public.supplier_requests;
create policy "Authenticated can view supplier requests"
  on public.supplier_requests for select
  to authenticated
  using (true);

drop policy if exists "Authenticated can update supplier requests" on public.supplier_requests;
create policy "Authenticated can update supplier requests"
  on public.supplier_requests for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated can delete supplier requests" on public.supplier_requests;
create policy "Authenticated can delete supplier requests"
  on public.supplier_requests for delete
  to authenticated
  using (true);
