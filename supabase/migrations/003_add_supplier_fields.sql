-- ============================================================
--  Migration: 003_add_supplier_fields.sql
--  Adds contact_no, owner_details, and email_id to suppliers table.
--  Also clears all existing records and adds premium sample data in sequence.
-- ============================================================

ALTER TABLE public.suppliers 
ADD COLUMN IF NOT EXISTS contact_no TEXT,
ADD COLUMN IF NOT EXISTS owner_details TEXT,
ADD COLUMN IF NOT EXISTS email_id TEXT;

TRUNCATE TABLE public.suppliers;

INSERT INTO public.suppliers (supplier_id, name, region, city, category, lead_time, rating, otd, owner_details, contact_no, email_id)
VALUES
  ('SUP-001', 'Kyoto Denim & Silk Crafts', 'Japan', 'Kyoto', 'Denim, Silk', 21, 4.8, 95, 'Kenji Tanaka (Founder)', '+81 90-1111-2222', 'tanaka@kyotodenim.jp'),
  ('SUP-002', 'Milan Premium Knitwear', 'Europe', 'Milan', 'Knitwear, Wool', 15, 4.9, 98, 'Giovanni Rossi (CEO)', '+39 02-3333-4444', 'contact@milanpremiums.it'),
  ('SUP-003', 'LA Leather & Accessories Studio', 'United States', 'Los Angeles', 'Leather, Accessories', 25, 4.6, 92, 'Sarah Connor (Studio Lead)', '+1 213-555-0199', 'sarah@laleather.com');
