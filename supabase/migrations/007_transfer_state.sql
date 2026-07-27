-- ============================================================
--  Migration: 007_transfer_state.sql
--  Add erp_enquiry_id to demo_requests to natively track ERP transfers
-- ============================================================

ALTER TABLE public.demo_requests 
ADD COLUMN IF NOT EXISTS erp_enquiry_id UUID REFERENCES public.tracker_enquiries(id) ON DELETE SET NULL;
