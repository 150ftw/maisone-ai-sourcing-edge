-- ============================================================
--  Migration: 006_unify_factories.sql
--  Unify Tracker Factories and Suppliers by using the suppliers table as the Single Source of Truth
-- ============================================================

-- 1. Alter lead_time from int to text to support Tracker ERP string formats (e.g., "21-30 Days")
ALTER TABLE public.suppliers ALTER COLUMN lead_time TYPE TEXT USING lead_time::TEXT;

-- 2. Drop the foreign key constraint that depends on tracker_factories
ALTER TABLE public.tracker_enquiries DROP CONSTRAINT IF EXISTS tracker_enquiries_factory_id_fkey;

-- 3. Drop the redundant tracker_factories table
DROP TABLE IF EXISTS public.tracker_factories;

-- 4. Add the new foreign key referencing the unified suppliers table
ALTER TABLE public.tracker_enquiries ADD CONSTRAINT tracker_enquiries_factory_id_fkey FOREIGN KEY (factory_id) REFERENCES public.suppliers(id) ON DELETE SET NULL;
