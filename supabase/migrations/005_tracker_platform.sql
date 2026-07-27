-- Migration: 005_tracker_platform.sql
-- Tracker Platform ERP/CRM Database Schema

-- 1. Clients Table
CREATE TABLE IF NOT EXISTS tracker_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  company_name TEXT NOT NULL,
  client_name TEXT NOT NULL,
  country TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  payment_terms TEXT DEFAULT '30% Deposit, 70% Balance',
  notes TEXT
);

-- 2. Factories Table
CREATE TABLE IF NOT EXISTS tracker_factories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  factory_name TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  lead_time TEXT DEFAULT '30-45 Days',
  quality_rating NUMERIC(3,1) DEFAULT 4.5
);

-- 3. Agents Table
CREATE TABLE IF NOT EXISTS tracker_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  agent_name TEXT NOT NULL,
  region TEXT NOT NULL,
  clients_managed INT DEFAULT 0,
  contact_details TEXT NOT NULL
);

-- 4. Enquiries Table (Core)
CREATE TABLE IF NOT EXISTS tracker_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  enquiry_number TEXT UNIQUE NOT NULL,
  client_id UUID REFERENCES tracker_clients(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  country TEXT NOT NULL,
  product_reference TEXT NOT NULL,
  communication_channel TEXT NOT NULL DEFAULT 'Email',
  enquiry_details TEXT,
  fabric_details TEXT,
  images TEXT[] DEFAULT '{}',
  target_price NUMERIC(10,2) DEFAULT 0,
  current_stage INT NOT NULL DEFAULT 1,
  current_status TEXT NOT NULL DEFAULT 'New',
  factory_id UUID REFERENCES tracker_factories(id) ON DELETE SET NULL,
  factory_name TEXT,
  agent_id UUID REFERENCES tracker_agents(id) ON DELETE SET NULL,
  agent_name TEXT
);

-- 5. Enquiry Stage History Table (Preserves all 13 stage data and audit history)
CREATE TABLE IF NOT EXISTS tracker_enquiry_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  enquiry_id UUID NOT NULL REFERENCES tracker_enquiries(id) ON DELETE CASCADE,
  stage_number INT NOT NULL,
  stage_name TEXT NOT NULL,
  status TEXT NOT NULL,
  stage_data JSONB DEFAULT '{}'::jsonb,
  updated_by TEXT DEFAULT 'Admin User',
  notes TEXT
);

-- 6. Communication Logs Table
CREATE TABLE IF NOT EXISTS tracker_communication_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  enquiry_id UUID REFERENCES tracker_enquiries(id) ON DELETE CASCADE,
  client_id UUID REFERENCES tracker_clients(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  user_name TEXT NOT NULL,
  channel TEXT NOT NULL, -- Email, WhatsApp, Phone, Meeting, WeChat
  direction TEXT NOT NULL DEFAULT 'Outbound', -- Inbound, Outbound
  summary TEXT NOT NULL,
  attachment TEXT
);

-- 7. Invoices Table (Sample & Bulk)
CREATE TABLE IF NOT EXISTS tracker_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  invoice_number TEXT UNIQUE NOT NULL,
  enquiry_id UUID REFERENCES tracker_enquiries(id) ON DELETE SET NULL,
  client_id UUID REFERENCES tracker_clients(id) ON DELETE SET NULL,
  invoice_type TEXT NOT NULL DEFAULT 'Bulk', -- Sample, Bulk
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  invoice_date TEXT NOT NULL,
  due_date TEXT NOT NULL,
  payment_terms TEXT DEFAULT '30% Deposit, 70% Balance',
  status TEXT NOT NULL DEFAULT 'Generated' -- Not Generated, Generated, Sent, Invoiced, Paid, Overdue
);

-- 8. Payments Table (Sample & Bulk)
CREATE TABLE IF NOT EXISTS tracker_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  invoice_id UUID REFERENCES tracker_invoices(id) ON DELETE SET NULL,
  enquiry_id UUID REFERENCES tracker_enquiries(id) ON DELETE SET NULL,
  client_id UUID REFERENCES tracker_clients(id) ON DELETE SET NULL,
  payment_type TEXT NOT NULL DEFAULT 'Bulk', -- Sample, Bulk
  due_date TEXT NOT NULL,
  amount_due NUMERIC(12,2) NOT NULL DEFAULT 0,
  amount_received NUMERIC(12,2) NOT NULL DEFAULT 0,
  payment_date TEXT,
  outstanding_balance NUMERIC(12,2) GENERATED ALWAYS AS (amount_due - amount_received) STORED,
  status TEXT NOT NULL DEFAULT 'Not Due' -- Not Due, Due, Reminder Sent, Overdue, Partially Paid, Paid
);

-- 9. Tracker Settings & RBAC Table
CREATE TABLE IF NOT EXISTS tracker_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL
);

-- Enable RLS
ALTER TABLE tracker_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracker_factories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracker_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracker_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracker_enquiry_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracker_communication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracker_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracker_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracker_settings ENABLE ROW LEVEL SECURITY;

-- Allow authenticated and anon access (development policies)
CREATE POLICY "Allow public select tracker_clients" ON tracker_clients FOR SELECT USING (true);
CREATE POLICY "Allow public all tracker_clients" ON tracker_clients FOR ALL USING (true);

CREATE POLICY "Allow public all tracker_factories" ON tracker_factories FOR ALL USING (true);
CREATE POLICY "Allow public all tracker_agents" ON tracker_agents FOR ALL USING (true);
CREATE POLICY "Allow public all tracker_enquiries" ON tracker_enquiries FOR ALL USING (true);
CREATE POLICY "Allow public all tracker_enquiry_stages" ON tracker_enquiry_stages FOR ALL USING (true);
CREATE POLICY "Allow public all tracker_communication_logs" ON tracker_communication_logs FOR ALL USING (true);
CREATE POLICY "Allow public all tracker_invoices" ON tracker_invoices FOR ALL USING (true);
CREATE POLICY "Allow public all tracker_payments" ON tracker_payments FOR ALL USING (true);
CREATE POLICY "Allow public all tracker_settings" ON tracker_settings FOR ALL USING (true);
