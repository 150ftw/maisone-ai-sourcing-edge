-- Migration: 008_fix_suppliers_rls.sql
-- Fix Row Level Security (RLS) policies for suppliers table to enable ERP factory management

-- Allow public (anon & authenticated) full access to suppliers table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'suppliers' AND policyname = 'Allow public all suppliers'
  ) THEN
    CREATE POLICY "Allow public all suppliers" ON public.suppliers FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
