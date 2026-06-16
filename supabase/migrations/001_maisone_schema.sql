-- ============================================================
--  Maisone — Full Database Schema
--  Migration: 001_maisone_schema.sql
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
--  TABLE: demo_requests
--  Submitted by the public Book Demo form.
-- ============================================================
create table if not exists public.demo_requests (
  id             uuid primary key default uuid_generate_v4(),
  created_at     timestamptz not null default now(),
  full_name      text not null,
  work_email     text not null,
  company        text not null,
  role           text not null default '',
  company_size   text not null default '',
  region         text not null default '',
  category       text not null default '',
  monthly_volume text not null default '',
  timeline       text not null default '',
  message        text,
  status         text not null default 'Pending'
    check (status in ('Pending', 'Contacted', 'Completed', 'Archived'))
);

-- ============================================================
--  TABLE: suppliers
-- ============================================================
create table if not exists public.suppliers (
  id          uuid primary key default uuid_generate_v4(),
  created_at  timestamptz not null default now(),
  supplier_id text not null unique,
  name        text not null,
  region      text not null,
  city        text not null,
  category    text not null,
  lead_time   int not null default 21,
  rating      numeric(3,1) not null default 4.5
    check (rating >= 1 and rating <= 5),
  otd         int not null default 90
    check (otd >= 0 and otd <= 100)
);

-- ============================================================
--  TABLE: shipments
-- ============================================================
create table if not exists public.shipments (
  id          uuid primary key default uuid_generate_v4(),
  created_at  timestamptz not null default now(),
  shipment_id text not null unique,
  route       text not null,
  eta         text not null,
  status      text not null default 'In transit'
    check (status in ('In transit', 'Customs', 'Delivered')),
  progress    int not null default 0
    check (progress >= 0 and progress <= 100)
);

-- ============================================================
--  TABLE: inventory
-- ============================================================
create table if not exists public.inventory (
  id          uuid primary key default uuid_generate_v4(),
  created_at  timestamptz not null default now(),
  sku         text not null unique,
  name        text not null,
  stock       int not null default 0 check (stock >= 0),
  reorder     int not null default 0 check (reorder >= 0)
);

-- ============================================================
--  ROW LEVEL SECURITY
-- ============================================================

-- demo_requests: public INSERT, authenticated full-access
alter table public.demo_requests enable row level security;

create policy "Public can submit demo requests"
  on public.demo_requests for insert
  to anon
  with check (true);

create policy "Authenticated can view demo requests"
  on public.demo_requests for select
  to authenticated
  using (true);

create policy "Authenticated can update demo requests"
  on public.demo_requests for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated can delete demo requests"
  on public.demo_requests for delete
  to authenticated
  using (true);

-- suppliers: authenticated full-access
alter table public.suppliers enable row level security;

create policy "Authenticated can manage suppliers"
  on public.suppliers for all
  to authenticated
  using (true)
  with check (true);

-- shipments: authenticated full-access
alter table public.shipments enable row level security;

create policy "Authenticated can manage shipments"
  on public.shipments for all
  to authenticated
  using (true)
  with check (true);

-- inventory: authenticated full-access
alter table public.inventory enable row level security;

create policy "Authenticated can manage inventory"
  on public.inventory for all
  to authenticated
  using (true)
  with check (true);

-- ============================================================
--  SEED DATA: Suppliers
-- ============================================================
insert into public.suppliers (supplier_id, name, region, city, category, lead_time, rating, otd)
values
  ('JP-014', 'Osaka Mill #042',       'Japan',          'Osaka',       'Denim',     21, 4.9, 96),
  ('JP-022', 'Kyōto Atelier',         'Japan',          'Kyoto',       'Silk',      28, 4.8, 94),
  ('EU-088', 'Milano Tessile',        'Europe',         'Milan',       'Wool',      24, 4.7, 92),
  ('EU-091', 'Maison Lyon',           'Europe',         'Lyon',        'Silk',      30, 4.6, 89),
  ('UK-119', 'Savile House',          'United Kingdom', 'London',      'Tailoring', 26, 4.5, 88),
  ('US-203', 'Brooklyn Knit Co.',     'United States',  'New York',    'Knitwear',  19, 4.7, 93),
  ('US-217', 'LA Leatherworks',       'United States',  'Los Angeles', 'Leather',   32, 4.4, 86),
  ('JP-045', 'Tokyo Weaves',          'Japan',          'Tokyo',       'Knitwear',  15, 4.9, 97),
  ('EU-102', 'Barcelona Cotton',      'Europe',         'Barcelona',   'Denim',     22, 4.6, 91),
  ('UK-130', 'Manchester Textiles',   'United Kingdom', 'Manchester',  'Wool',      20, 4.4, 87),
  ('US-240', 'Portland Craft Mill',   'United States',  'Portland',    'Tailoring', 25, 4.8, 95),
  ('JP-060', 'Nara Silks',            'Japan',          'Nara',        'Silk',      27, 4.7, 93),
  ('EU-120', 'Parisian Atelier',      'Europe',         'Paris',       'Leather',   29, 4.8, 90)
on conflict (supplier_id) do nothing;

-- ============================================================
--  SEED DATA: Shipments
-- ============================================================
insert into public.shipments (shipment_id, route, eta, status, progress)
values
  ('MS-7841', 'Tokyo → London',        'Mar 14', 'In transit', 64),
  ('MS-7836', 'Milan → New York',      'Mar 16', 'Customs',    82),
  ('MS-7822', 'Paris → Los Angeles',   'Mar 18', 'In transit', 41),
  ('MS-7818', 'Osaka → Berlin',        'Mar 20', 'In transit', 28),
  ('MS-7810', 'London → New York',     'Mar 13', 'Delivered',  100),
  ('MS-7808', 'Barcelona → Tokyo',     'Mar 22', 'In transit', 15),
  ('MS-7805', 'Manchester → Milan',    'Mar 15', 'Delivered',  100),
  ('MS-7801', 'New York → Paris',      'Mar 25', 'In transit', 10),
  ('MS-7798', 'Portland → London',     'Mar 24', 'In transit', 30),
  ('MS-7795', 'Los Angeles → Kyoto',   'Mar 17', 'Customs',    75),
  ('MS-7790', 'Lyon → Tokyo',          'Mar 26', 'In transit', 5),
  ('MS-7788', 'Berlin → New York',     'Mar 19', 'Delivered',  100)
on conflict (shipment_id) do nothing;

-- ============================================================
--  SEED DATA: Inventory
-- ============================================================
insert into public.inventory (sku, name, stock, reorder)
values
  ('DEN-501', 'Selvedge Denim · 14oz',     2840, 1500),
  ('SLK-220', 'Mulberry Silk · Charmeuse',  940, 1200),
  ('WOL-118', 'Merino Wool · Fine',        3210, 2000),
  ('LTR-077', 'Italian Calf Leather',       540,  600),
  ('KNT-304', 'Cashmere Yarn · Grade A',  1500, 1000),
  ('COT-412', 'Organic Cotton · Pima',    4200, 3000),
  ('LIN-156', 'Pure Belgian Linen',         850, 1000),
  ('NYL-089', 'Recycled Nylon · Ripstop', 1200,  800),
  ('PLR-215', 'Polyester Fleece · Grid',  2100, 1500),
  ('VIS-102', 'Viscose Rayon · EcoVero',   650, 1200),
  ('TNC-305', 'Tencel Lyocell · Fine',    3100, 2000),
  ('EMP-045', 'Hemp Canvas · Heavy',       450,  500)
on conflict (sku) do nothing;
