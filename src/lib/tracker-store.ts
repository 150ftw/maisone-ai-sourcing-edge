// src/lib/tracker-store.ts
// Tracker Platform ERP/CRM Type Definitions and Local Storage / Supabase Data Layer

export type UserRole = "Admin" | "Staff" | "Finance" | "Factory" | "Agent" | "Read Only";

export interface TrackerClient {
  id: string;
  created_at: string;
  company_name: string;
  client_name: string;
  country: string;
  contact_person: string;
  email: string;
  whatsapp: string;
  payment_terms: string;
  notes: string;
}

export interface TrackerFactory {
  id: string;
  created_at: string;
  factory_name: string;
  category: string;
  location: string;
  contact_person: string;
  email: string;
  whatsapp: string;
  lead_time: string;
  quality_rating: number;
}

export interface TrackerAgent {
  id: string;
  created_at: string;
  agent_name: string;
  region: string;
  clients_managed: number;
  contact_details: string;
}

// 13 Stages Constants & Definitions
export const STAGE_NAMES = [
  "Enquiry Received",
  "Sourcing",
  "Costing",
  "Sampling",
  "Sample Invoice",
  "Sample Payment",
  "Client Approval",
  "Bulk Order",
  "Production",
  "Quality Check",
  "Shipment",
  "Bulk Invoice",
  "Bulk Payment"
] as const;

export type StageNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export const STAGE_STATUS_OPTIONS: Record<number, string[]> = {
  1: ["New", "Under Review", "Sourcing", "Dropped"],
  2: ["Sourcing", "Submitted", "Factory Selected", "No Suitable Factory"],
  3: ["Requested", "Received", "Sent", "Approved", "Negotiation", "Rejected"],
  4: ["Requested", "Development", "Ready", "Dispatched", "Received"],
  5: ["Not Invoiced", "Invoiced", "Sent"],
  6: ["Not Due", "Due", "Reminder Sent", "Overdue", "Paid"],
  7: ["Waiting", "Revision Requested", "Approved", "Rejected", "Hold"],
  8: ["Waiting", "Received", "Hold", "Lost"],
  9: ["Forwarded", "Production", "Delayed", "Ready For QC"],
  10: ["Pending", "Passed", "Failed", "Rework"],
  11: ["Pending", "Shipped", "In Transit", "Delivered"],
  12: ["Not Generated", "Generated", "Sent"],
  13: ["Not Due", "Due", "Overdue", "Partially Paid", "Paid"],
};

export interface TrackerEnquiryStageRecord {
  id: string;
  enquiry_id: string;
  stage_number: StageNumber;
  stage_name: string;
  status: string;
  stage_data: Record<string, any>;
  updated_by: string;
  created_at: string;
  notes?: string;
}

export interface TrackerEnquiry {
  id: string;
  created_at: string;
  updated_at: string;
  enquiry_number: string;
  client_id: string;
  client_name: string;
  country: string;
  product_reference: string;
  communication_channel: string;
  enquiry_details: string;
  fabric_details: string;
  images: string[];
  target_price: number;
  current_stage: StageNumber;
  current_status: string;
  factory_id?: string;
  factory_name?: string;
  agent_id?: string;
  agent_name?: string;
  // Stage specific snapshots
  stage_data?: Record<number, Record<string, any>>;
  history?: TrackerEnquiryStageRecord[];
}

export interface TrackerCommunicationLog {
  id: string;
  created_at: string;
  enquiry_id: string;
  enquiry_number?: string;
  client_id: string;
  client_name?: string;
  date: string;
  time: string;
  user_name: string;
  channel: "Email" | "WhatsApp" | "Phone" | "Meeting" | "WeChat";
  direction: "Inbound" | "Outbound";
  summary: string;
  attachment?: string;
}

export interface TrackerInvoice {
  id: string;
  created_at: string;
  invoice_number: string;
  enquiry_id: string;
  enquiry_number?: string;
  client_id: string;
  client_name: string;
  invoice_type: "Sample" | "Bulk";
  amount: number;
  currency: string;
  invoice_date: string;
  due_date: string;
  payment_terms: string;
  status: "Not Generated" | "Generated" | "Sent" | "Invoiced" | "Paid" | "Overdue";
}

export interface TrackerPayment {
  id: string;
  created_at: string;
  invoice_id?: string;
  invoice_number?: string;
  enquiry_id: string;
  enquiry_number?: string;
  client_id: string;
  client_name: string;
  payment_type: "Sample" | "Bulk";
  due_date: string;
  amount_due: number;
  amount_received: number;
  payment_date?: string;
  outstanding_balance: number;
  status: "Not Due" | "Due" | "Reminder Sent" | "Overdue" | "Partially Paid" | "Paid";
}

export interface TrackerSettings {
  agency_name: string;
  currency: string;
  fiscal_year_start: string;
  active_roles: UserRole[];
  permissions: Record<string, string[]>;
}

// Initial Demo Seed Data - Empty for production system
const DEFAULT_CLIENTS: TrackerClient[] = [];
const DEFAULT_FACTORIES: TrackerFactory[] = [];
const DEFAULT_AGENTS: TrackerAgent[] = [];
const DEFAULT_ENQUIRIES: TrackerEnquiry[] = [];
const DEFAULT_COMMUNICATION_LOGS: TrackerCommunicationLog[] = [];
const DEFAULT_INVOICES: TrackerInvoice[] = [];
const DEFAULT_PAYMENTS: TrackerPayment[] = [];

const DEFAULT_SETTINGS: TrackerSettings = {
  agency_name: "Maisone Global Sourcing ERP",
  currency: "USD",
  fiscal_year_start: "January 1",
  active_roles: ["Admin", "Staff"],
  permissions: {
    "Admin": ["All Access", "Create/Edit/Delete All", "Manage Finance", "Manage Roles"],
    "Staff": ["View All", "Create/Edit Enquiries", "Add Communication Logs", "View Finance"],
    "Finance": ["View Enquiries", "Manage Invoices", "Record Payments", "Export Financial Reports"],
    "Factory": ["View Assigned Enquiries", "Update Production Stage", "Upload QC Photos"],
    "Agent": ["View Regional Enquiries", "Add Client Logs", "Submit Costing"],
    "Read Only": ["View Dashboards", "View Reports"]
  }
};

// LocalStorage Helper Keys
const STORAGE_KEYS = {
  CLIENTS: "maisone_tracker_clients_v2",
  FACTORIES: "maisone_tracker_factories_v2",
  AGENTS: "maisone_tracker_agents_v2",
  ENQUIRIES: "maisone_tracker_enquiries_v2",
  LOGS: "maisone_tracker_logs_v2",
  INVOICES: "maisone_tracker_invoices_v2",
  PAYMENTS: "maisone_tracker_payments_v2",
  SETTINGS: "maisone_tracker_settings_v2"
};

// Getter functions with fallback seeding
export function getTrackerClients(): TrackerClient[] {
  if (typeof window === "undefined") return DEFAULT_CLIENTS;
  const raw = localStorage.getItem(STORAGE_KEYS.CLIENTS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(DEFAULT_CLIENTS));
    return DEFAULT_CLIENTS;
  }
  try { return JSON.parse(raw); } catch { return DEFAULT_CLIENTS; }
}

export function saveTrackerClients(clients: TrackerClient[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  }
}

export function getTrackerFactories(): TrackerFactory[] {
  if (typeof window === "undefined") return DEFAULT_FACTORIES;
  const raw = localStorage.getItem(STORAGE_KEYS.FACTORIES);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.FACTORIES, JSON.stringify(DEFAULT_FACTORIES));
    return DEFAULT_FACTORIES;
  }
  try { return JSON.parse(raw); } catch { return DEFAULT_FACTORIES; }
}

export function saveTrackerFactories(factories: TrackerFactory[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.FACTORIES, JSON.stringify(factories));
  }
}

export function getTrackerAgents(): TrackerAgent[] {
  if (typeof window === "undefined") return DEFAULT_AGENTS;
  const raw = localStorage.getItem(STORAGE_KEYS.AGENTS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(DEFAULT_AGENTS));
    return DEFAULT_AGENTS;
  }
  try { return JSON.parse(raw); } catch { return DEFAULT_AGENTS; }
}

export function saveTrackerAgents(agents: TrackerAgent[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
  }
}

export function getTrackerEnquiries(): TrackerEnquiry[] {
  if (typeof window === "undefined") return DEFAULT_ENQUIRIES;
  const raw = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(DEFAULT_ENQUIRIES));
    return DEFAULT_ENQUIRIES;
  }
  try { return JSON.parse(raw); } catch { return DEFAULT_ENQUIRIES; }
}

export function saveTrackerEnquiries(enquiries: TrackerEnquiry[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
  }
}

export function getTrackerCommunicationLogs(): TrackerCommunicationLog[] {
  if (typeof window === "undefined") return DEFAULT_COMMUNICATION_LOGS;
  const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(DEFAULT_COMMUNICATION_LOGS));
    return DEFAULT_COMMUNICATION_LOGS;
  }
  try { return JSON.parse(raw); } catch { return DEFAULT_COMMUNICATION_LOGS; }
}

export function saveTrackerCommunicationLogs(logs: TrackerCommunicationLog[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  }
}

export function getTrackerInvoices(): TrackerInvoice[] {
  if (typeof window === "undefined") return DEFAULT_INVOICES;
  const raw = localStorage.getItem(STORAGE_KEYS.INVOICES);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(DEFAULT_INVOICES));
    return DEFAULT_INVOICES;
  }
  try { return JSON.parse(raw); } catch { return DEFAULT_INVOICES; }
}

export function saveTrackerInvoices(invoices: TrackerInvoice[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  }
}

export function getTrackerPayments(): TrackerPayment[] {
  if (typeof window === "undefined") return DEFAULT_PAYMENTS;
  const raw = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(DEFAULT_PAYMENTS));
    return DEFAULT_PAYMENTS;
  }
  try { return JSON.parse(raw); } catch { return DEFAULT_PAYMENTS; }
}

export function saveTrackerPayments(payments: TrackerPayment[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  }
}

export function getTrackerSettings(): TrackerSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    return DEFAULT_SETTINGS;
  }
  try { return JSON.parse(raw); } catch { return DEFAULT_SETTINGS; }
}

export function saveTrackerSettings(settings: TrackerSettings) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }
}

// Export CSV Utility Helper
export function exportToCSV(filename: string, rows: Record<string, any>[]) {
  if (!rows || !rows.length) return;
  const separator = ",";
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    "\n" +
    rows
      .map((row) =>
        keys
          .map((k) => {
            let cell = row[k] === null || row[k] === undefined ? "" : row[k];
            cell = cell instanceof Date ? cell.toLocaleString() : cell.toString();
            cell = cell.replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`;
            }
            return cell;
          })
          .join(separator)
      )
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
