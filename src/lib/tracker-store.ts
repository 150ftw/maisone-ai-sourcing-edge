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

// Initial Demo Seed Data
const DEFAULT_CLIENTS: TrackerClient[] = [
  {
    id: "c-101",
    created_at: "2026-06-01T10:00:00Z",
    company_name: "Atelier Saint-Germain",
    client_name: "Claire Dubois",
    country: "France",
    contact_person: "Claire Dubois",
    email: "claire@ateliersaintgermain.fr",
    whatsapp: "+33 6 12 34 56 78",
    payment_terms: "30% Deposit, 70% Balance",
    notes: "High-end luxury tailored outerwear. Prefers Italian wool and French silk."
  },
  {
    id: "c-102",
    created_at: "2026-06-05T14:30:00Z",
    company_name: "Savile & Co",
    client_name: "James Worthington",
    country: "United Kingdom",
    contact_person: "James Worthington",
    email: "james@savileco.co.uk",
    whatsapp: "+44 7700 900077",
    payment_terms: "50% Deposit, 50% Before Shipment",
    notes: "Bespoke tailoring and heavy wool coat capsules."
  },
  {
    id: "c-103",
    created_at: "2026-06-10T09:15:00Z",
    company_name: "Urban Threads LA",
    client_name: "Marcus Vance",
    country: "United States",
    contact_person: "Marcus Vance",
    email: "marcus@urbanthreadsla.com",
    whatsapp: "+1 310 555 0192",
    payment_terms: "Net 30",
    notes: "Streetwear and heavy organic denim line."
  },
  {
    id: "c-104",
    created_at: "2026-06-15T11:45:00Z",
    company_name: "Tokyo Minimal",
    client_name: "Kenji Sato",
    country: "Japan",
    contact_person: "Kenji Sato",
    email: "sato@tokyominimal.jp",
    whatsapp: "+81 90 1234 5678",
    payment_terms: "30% Deposit, 70% LC",
    notes: "Technical outerwear and recycled nylon jackets."
  }
];

const DEFAULT_FACTORIES: TrackerFactory[] = [
  {
    id: "f-201",
    created_at: "2026-05-01T08:00:00Z",
    factory_name: "Milano Tex Craft",
    category: "Tailoring & Wool",
    location: "Milan, Italy",
    contact_person: "Gianni Rossi",
    email: "gianni@milanotex.it",
    whatsapp: "+39 02 5555 019",
    lead_time: "25-30 Days",
    quality_rating: 4.9
  },
  {
    id: "f-202",
    created_at: "2026-05-10T11:00:00Z",
    factory_name: "Okayama Denim Mills",
    category: "Selvedge Denim",
    location: "Kurashiki, Japan",
    contact_person: "Hiroshi Tanaka",
    email: "tanaka@okayamadenim.jp",
    whatsapp: "+81 86 422 1100",
    lead_time: "35-45 Days",
    quality_rating: 4.8
  },
  {
    id: "f-203",
    created_at: "2026-05-15T13:20:00Z",
    factory_name: "Rajasthan Artisans Ltd",
    category: "Organic Cotton & Embroidery",
    location: "Jaipur, India",
    contact_person: "Priya Sharma",
    email: "priya@rajasthanartisans.in",
    whatsapp: "+91 98290 12345",
    lead_time: "20-30 Days",
    quality_rating: 4.7
  },
  {
    id: "f-204",
    created_at: "2026-05-20T16:00:00Z",
    factory_name: "Guangzhou Tech Apparel",
    category: "Outerwear & Synthetics",
    location: "Guangzhou, China",
    contact_person: "Li Wei",
    email: "liwei@gztechapparel.cn",
    whatsapp: "+86 20 8888 9999",
    lead_time: "15-25 Days",
    quality_rating: 4.6
  }
];

const DEFAULT_AGENTS: TrackerAgent[] = [
  {
    id: "a-301",
    created_at: "2026-05-01T09:00:00Z",
    agent_name: "Sophie Laurent",
    region: "Europe & UK",
    clients_managed: 8,
    contact_details: "sophie.l@maisone-agents.com | +33 6 98 76 54 32"
  },
  {
    id: "a-302",
    created_at: "2026-05-05T10:30:00Z",
    agent_name: "David Miller",
    region: "North America",
    clients_managed: 5,
    contact_details: "david.m@maisone-agents.com | +1 212 555 0144"
  },
  {
    id: "a-303",
    created_at: "2026-05-12T14:00:00Z",
    agent_name: "Akira Takahashi",
    region: "Asia Pacific",
    clients_managed: 6,
    contact_details: "akira.t@maisone-agents.com | +81 3 5555 1234"
  }
];

const DEFAULT_ENQUIRIES: TrackerEnquiry[] = [
  {
    id: "enq-1001",
    created_at: "2026-07-01T10:00:00Z",
    updated_at: "2026-07-25T16:30:00Z",
    enquiry_number: "ENQ-2026-001",
    client_id: "c-101",
    client_name: "Atelier Saint-Germain",
    country: "France",
    product_reference: "ASG-FW26 Double-Breasted Trench Coat",
    communication_channel: "Email",
    enquiry_details: "Request for 300 units of double-breasted virgin wool trench coats with horn buttons.",
    fabric_details: "100% Virgin Wool, 450gsm, Water-repellent finish, Natural Camel tone.",
    images: ["https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop"],
    target_price: 185.00,
    current_stage: 9, // Production
    current_status: "Production",
    factory_id: "f-201",
    factory_name: "Milano Tex Craft",
    agent_id: "a-301",
    agent_name: "Sophie Laurent",
    stage_data: {
      1: { date_received: "2026-07-01", channel: "Email", target_price: 185, status: "Under Review" },
      2: { shortlisted: ["Milano Tex Craft", "Guangzhou Tech"], submitted_date: "2026-07-03", status: "Factory Selected" },
      3: { factory: "Milano Tex Craft", cost_requested: "2026-07-04", cost_received: "2026-07-06", cost_breakdown: "FOB $172.50 per unit", status: "Approved" },
      4: { sample_request_date: "2026-07-07", sample_size: "M", quantity: 2, sample_start: "2026-07-08", sample_ready: "2026-07-14", courier: "DHL", tracking: "DHL-98421034", revisions: 1, status: "Received" },
      5: { invoice_number: "SMP-INV-001", amount: 450, currency: "USD", invoice_date: "2026-07-08", terms: "Immediate", status: "Invoiced" },
      6: { due_date: "2026-07-12", amount_due: 450, amount_received: 450, payment_date: "2026-07-10", balance: 0, status: "Paid" },
      7: { feedback_date: "2026-07-16", decision: "Approved", notes: "Fit is perfect, approved for bulk bulk production.", final_date: "2026-07-16", status: "Approved" },
      8: { po_number: "PO-ASG-9921", order_value: 51750, quantity: 300, terms: "30% Deposit, 70% Balance", delivery_date: "2026-09-15", status: "Received" },
      9: { factory: "Milano Tex Craft", prod_start: "2026-07-20", milestones: "Cutting completed (July 22), Sewing 40% completed", update: "On track for early September shipment", expected_completion: "2026-09-02", status: "Production" }
    },
    history: [
      { id: "h-1", enquiry_id: "enq-1001", stage_number: 1, stage_name: "Enquiry Received", status: "Under Review", stage_data: {}, updated_by: "Sophie Laurent", created_at: "2026-07-01T10:00:00Z" },
      { id: "h-2", enquiry_id: "enq-1001", stage_number: 2, stage_name: "Sourcing", status: "Factory Selected", stage_data: {}, updated_by: "Sophie Laurent", created_at: "2026-07-03T11:20:00Z" },
      { id: "h-3", enquiry_id: "enq-1001", stage_number: 3, stage_name: "Costing", status: "Approved", stage_data: {}, updated_by: "Admin", created_at: "2026-07-06T15:00:00Z" },
      { id: "h-4", enquiry_id: "enq-1001", stage_number: 4, stage_name: "Sampling", status: "Received", stage_data: {}, updated_by: "Sophie Laurent", created_at: "2026-07-15T09:40:00Z" },
      { id: "h-5", enquiry_id: "enq-1001", stage_number: 7, stage_name: "Client Approval", status: "Approved", stage_data: {}, updated_by: "Claire Dubois", created_at: "2026-07-16T14:15:00Z" },
      { id: "h-6", enquiry_id: "enq-1001", stage_number: 8, stage_name: "Bulk Order", status: "Received", stage_data: {}, updated_by: "Sophie Laurent", created_at: "2026-07-18T10:00:00Z" },
      { id: "h-7", enquiry_id: "enq-1001", stage_number: 9, stage_name: "Production", status: "Production", stage_data: {}, updated_by: "Gianni Rossi", created_at: "2026-07-20T08:30:00Z" }
    ]
  },
  {
    id: "enq-1002",
    created_at: "2026-07-05T11:00:00Z",
    updated_at: "2026-07-26T10:00:00Z",
    enquiry_number: "ENQ-2026-002",
    client_id: "c-102",
    client_name: "Savile & Co",
    country: "United Kingdom",
    product_reference: "SAV-SS27 Herringbone Overcoat",
    communication_channel: "WhatsApp",
    enquiry_details: "Enquiry for 150 units heavy tweed herringbone overcoats.",
    fabric_details: "100% British Wool Tweed, 520gsm, Brown/Navy Herringbone weave.",
    images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop"],
    target_price: 210.00,
    current_stage: 4, // Sampling
    current_status: "Development",
    factory_id: "f-201",
    factory_name: "Milano Tex Craft",
    agent_id: "a-301",
    agent_name: "Sophie Laurent",
    stage_data: {
      1: { date_received: "2026-07-05", channel: "WhatsApp", target_price: 210, status: "Under Review" },
      2: { shortlisted: ["Milano Tex Craft"], submitted_date: "2026-07-07", status: "Factory Selected" },
      3: { factory: "Milano Tex Craft", cost_requested: "2026-07-08", cost_received: "2026-07-11", cost_breakdown: "FOB $195.00 per unit", status: "Approved" },
      4: { sample_request_date: "2026-07-14", sample_size: "L", quantity: 1, sample_start: "2026-07-16", sample_ready: "2026-07-28", courier: "FedEx", tracking: "", revisions: 0, status: "Development" }
    },
    history: [
      { id: "h-201", enquiry_id: "enq-1002", stage_number: 1, stage_name: "Enquiry Received", status: "Under Review", stage_data: {}, updated_by: "Sophie Laurent", created_at: "2026-07-05T11:00:00Z" },
      { id: "h-202", enquiry_id: "enq-1002", stage_number: 3, stage_name: "Costing", status: "Approved", stage_data: {}, updated_by: "Sophie Laurent", created_at: "2026-07-11T16:00:00Z" },
      { id: "h-203", enquiry_id: "enq-1002", stage_number: 4, stage_name: "Sampling", status: "Development", stage_data: {}, updated_by: "Gianni Rossi", created_at: "2026-07-16T09:00:00Z" }
    ]
  },
  {
    id: "enq-1003",
    created_at: "2026-07-10T14:15:00Z",
    updated_at: "2026-07-27T09:30:00Z",
    enquiry_number: "ENQ-2026-003",
    client_id: "c-103",
    client_name: "Urban Threads LA",
    country: "United States",
    product_reference: "UT-26 Vintage Wash Selvedge Denim Jacket",
    communication_channel: "Email",
    enquiry_details: "500 units of heavy 14oz selvedge denim jackets with vintage wash.",
    fabric_details: "14oz 100% Japanese Selvedge Cotton Denim, Vintage Indigo wash.",
    images: ["https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop"],
    target_price: 95.00,
    current_stage: 6, // Sample Payment
    current_status: "Due",
    factory_id: "f-202",
    factory_name: "Okayama Denim Mills",
    agent_id: "a-302",
    agent_name: "David Miller",
    stage_data: {
      1: { date_received: "2026-07-10", channel: "Email", target_price: 95, status: "Sourcing" },
      2: { shortlisted: ["Okayama Denim Mills"], submitted_date: "2026-07-12", status: "Factory Selected" },
      3: { factory: "Okayama Denim Mills", cost_requested: "2026-07-13", cost_received: "2026-07-15", cost_breakdown: "FOB $88.00 per unit", status: "Approved" },
      4: { sample_request_date: "2026-07-16", sample_size: "L", quantity: 2, sample_start: "2026-07-18", sample_ready: "2026-07-25", courier: "UPS", tracking: "UPS-3849102", revisions: 0, status: "Ready" },
      5: { invoice_number: "SMP-INV-003", amount: 350, currency: "USD", invoice_date: "2026-07-22", terms: "Immediate", status: "Sent" },
      6: { due_date: "2026-07-29", amount_due: 350, amount_received: 0, payment_date: "", balance: 350, status: "Due" }
    },
    history: [
      { id: "h-301", enquiry_id: "enq-1003", stage_number: 1, stage_name: "Enquiry Received", status: "Sourcing", stage_data: {}, updated_by: "David Miller", created_at: "2026-07-10T14:15:00Z" },
      { id: "h-302", enquiry_id: "enq-1003", stage_number: 5, stage_name: "Sample Invoice", status: "Sent", stage_data: {}, updated_by: "Finance Admin", created_at: "2026-07-22T10:00:00Z" }
    ]
  },
  {
    id: "enq-1004",
    created_at: "2026-07-15T09:00:00Z",
    updated_at: "2026-07-27T11:00:00Z",
    enquiry_number: "ENQ-2026-004",
    client_id: "c-104",
    client_name: "Tokyo Minimal",
    country: "Japan",
    product_reference: "TM-26 Recycled Waterproof Shell Jacket",
    communication_channel: "WeChat",
    enquiry_details: "400 units technical 3-layer waterproof hooded jackets.",
    fabric_details: "Recycled 3-Layer Nylon, 20,000mm Waterproof rating, Heat-sealed seams.",
    images: ["https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop"],
    target_price: 130.00,
    current_stage: 2, // Sourcing
    current_status: "Submitted",
    factory_id: "f-204",
    factory_name: "Guangzhou Tech Apparel",
    agent_id: "a-303",
    agent_name: "Akira Takahashi",
    stage_data: {
      1: { date_received: "2026-07-15", channel: "WeChat", target_price: 130, status: "Sourcing" },
      2: { shortlisted: ["Guangzhou Tech Apparel", "Milano Tex Craft"], submitted_date: "2026-07-20", status: "Submitted" }
    },
    history: [
      { id: "h-401", enquiry_id: "enq-1004", stage_number: 1, stage_name: "Enquiry Received", status: "Sourcing", stage_data: {}, updated_by: "Akira Takahashi", created_at: "2026-07-15T09:00:00Z" }
    ]
  }
];

const DEFAULT_COMMUNICATION_LOGS: TrackerCommunicationLog[] = [
  {
    id: "log-1",
    created_at: "2026-07-01T10:15:00Z",
    enquiry_id: "enq-1001",
    enquiry_number: "ENQ-2026-001",
    client_id: "c-101",
    client_name: "Atelier Saint-Germain",
    date: "2026-07-01",
    time: "10:15 AM",
    user_name: "Sophie Laurent",
    channel: "Email",
    direction: "Inbound",
    summary: "Received tech pack and request for quote for 300 units double-breasted wool trench coat.",
    attachment: "ASG_TrenchCoat_TechPack.pdf"
  },
  {
    id: "log-2",
    created_at: "2026-07-04T11:00:00Z",
    enquiry_id: "enq-1001",
    enquiry_number: "ENQ-2026-001",
    client_id: "c-101",
    client_name: "Atelier Saint-Germain",
    date: "2026-07-04",
    time: "11:00 AM",
    user_name: "Sophie Laurent",
    channel: "Email",
    direction: "Outbound",
    summary: "Sent tech pack and fabric swatches request to Milano Tex Craft factory.",
    attachment: "Factory_Brief_Milano.pdf"
  },
  {
    id: "log-3",
    created_at: "2026-07-10T15:30:00Z",
    enquiry_id: "enq-1003",
    enquiry_number: "ENQ-2026-003",
    client_id: "c-103",
    client_name: "Urban Threads LA",
    date: "2026-07-10",
    time: "03:30 PM",
    user_name: "David Miller",
    channel: "WhatsApp",
    direction: "Inbound",
    summary: "Discussed vintage wash intensity requirements and hardware finishes.",
    attachment: "Denim_Wash_Reference.jpg"
  }
];

const DEFAULT_INVOICES: TrackerInvoice[] = [
  {
    id: "inv-001",
    created_at: "2026-07-08T09:00:00Z",
    invoice_number: "SMP-INV-001",
    enquiry_id: "enq-1001",
    enquiry_number: "ENQ-2026-001",
    client_id: "c-101",
    client_name: "Atelier Saint-Germain",
    invoice_type: "Sample",
    amount: 450.00,
    currency: "USD",
    invoice_date: "2026-07-08",
    due_date: "2026-07-12",
    payment_terms: "Immediate",
    status: "Paid"
  },
  {
    id: "inv-002",
    created_at: "2026-07-18T10:00:00Z",
    invoice_number: "BLK-INV-001",
    enquiry_id: "enq-1001",
    enquiry_number: "ENQ-2026-001",
    client_id: "c-101",
    client_name: "Atelier Saint-Germain",
    invoice_type: "Bulk",
    amount: 15525.00, // 30% deposit of $51,750
    currency: "USD",
    invoice_date: "2026-07-18",
    due_date: "2026-07-25",
    payment_terms: "30% Deposit",
    status: "Sent"
  },
  {
    id: "inv-003",
    created_at: "2026-07-22T10:00:00Z",
    invoice_number: "SMP-INV-003",
    enquiry_id: "enq-1003",
    enquiry_number: "ENQ-2026-003",
    client_id: "c-103",
    client_name: "Urban Threads LA",
    invoice_type: "Sample",
    amount: 350.00,
    currency: "USD",
    invoice_date: "2026-07-22",
    due_date: "2026-07-29",
    payment_terms: "Immediate",
    status: "Sent"
  }
];

const DEFAULT_PAYMENTS: TrackerPayment[] = [
  {
    id: "pmt-001",
    created_at: "2026-07-10T10:00:00Z",
    invoice_id: "inv-001",
    invoice_number: "SMP-INV-001",
    enquiry_id: "enq-1001",
    enquiry_number: "ENQ-2026-001",
    client_id: "c-101",
    client_name: "Atelier Saint-Germain",
    payment_type: "Sample",
    due_date: "2026-07-12",
    amount_due: 450.00,
    amount_received: 450.00,
    payment_date: "2026-07-10",
    outstanding_balance: 0.00,
    status: "Paid"
  },
  {
    id: "pmt-002",
    created_at: "2026-07-18T10:00:00Z",
    invoice_id: "inv-002",
    invoice_number: "BLK-INV-001",
    enquiry_id: "enq-1001",
    enquiry_number: "ENQ-2026-001",
    client_id: "c-101",
    client_name: "Atelier Saint-Germain",
    payment_type: "Bulk",
    due_date: "2026-07-25",
    amount_due: 15525.00,
    amount_received: 5000.00,
    payment_date: "2026-07-24",
    outstanding_balance: 10525.00,
    status: "Partially Paid"
  },
  {
    id: "pmt-003",
    created_at: "2026-07-22T10:00:00Z",
    invoice_id: "inv-003",
    invoice_number: "SMP-INV-003",
    enquiry_id: "enq-1003",
    enquiry_number: "ENQ-2026-003",
    client_id: "c-103",
    client_name: "Urban Threads LA",
    payment_type: "Sample",
    due_date: "2026-07-29",
    amount_due: 350.00,
    amount_received: 0.00,
    payment_date: "",
    outstanding_balance: 350.00,
    status: "Due"
  }
];

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
  CLIENTS: "maisone_tracker_clients_v1",
  FACTORIES: "maisone_tracker_factories_v1",
  AGENTS: "maisone_tracker_agents_v1",
  ENQUIRIES: "maisone_tracker_enquiries_v1",
  LOGS: "maisone_tracker_logs_v1",
  INVOICES: "maisone_tracker_invoices_v1",
  PAYMENTS: "maisone_tracker_payments_v1",
  SETTINGS: "maisone_tracker_settings_v1"
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
