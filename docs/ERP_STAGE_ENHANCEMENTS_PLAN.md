# 🚀 Maisone AI Sourcing Edge — ERP 13-Stage Architectural & Feasibility Blueprint

This document outlines the technical feasibility, architectural design, and step-by-step implementation blueprint for enhancing the Maisone Sourcing ERP platform across all 13 stages, Role-Based Access Control (RBAC), Public Client Portal, Automation Utilities, and Bulk Excel Import Workflows.

---

## 🔒 1. Core Platform Architecture & Global Enhancements

### A. Role-Based Access Control (RBAC) — Admin vs. Agent
* **Status:** **100% Feasible**
* **Access Rules:**
  * 👑 **Admin Role:** Full access to internal factory/supplier identity, raw factory FOB quotes, internal logistics overhead, source house profit margins, and financial settlement overrides.
  * 💼 **Agent Role:** Restricted/Masked view. Agents can view stage progression, upload tech packs/specs, manage client communications, and view *Buyer (Client) Costing*, but *Supplier (Factory) Costing* and factory names are automatically masked or hidden.
* **Implementation Location:** Role-aware data masking utilities in `src/lib/tracker-store.ts` and conditional UI rendering based on `userRole`.

### B. Public Client Tracking Link & Stage Commenting Stream
* **Status:** **100% Feasible**
* **Access Rules:**
  * Unique, cryptographically signed token generated per enquiry (e.g. `/track/$trackingToken`).
  * Clients open this link without logging in to view real-time stage progression, dispatch notices, and download approved quotations.
  * **Stage Comments Stream:** Interactive comment sidebar on each stage allowing clients and agents to communicate directly on specific milestones.

---

## 📋 2. Step-by-Step (Stage 1 to 13) Technical Specifications

---

### 🔹 Step 1 — Enquiry Received
* **Feasibility:** 100% Feasible (Schema & Form Extension)
* **Fields & Rules:**
  * **Enquiry ID:** Auto-generated (`ENQ-YYYY-XXXX`).
  * **Date Received:** Date picker.
  * **Source:** Dropdown (`Website`, `Email`, `WhatsApp`, `LinkedIn`, `Referral`, `Phone`, `Existing Client`, `Sales Agent`).
  * **Status:** `New`, `Under Review`, `Qualified`, `Rejected`.
  * **Assigned Agent:** Dropdown selection from active agents.
  * **Client Type:** `New` vs `Existing`.
  * **Product Category Selector:** Apparel / Clothing selection with dedicated **MOQ for Clothing** input.

---

### 🔹 Step 2 — Sourcing & Factory Auto-Match
* **Feasibility:** 100% Feasible (Auto-Match Algorithm + Quotation Builder)
* **Features:**
  * **Auto-Sort Factories:** Intelligent matching algorithm scoring suppliers based on category (e.g. *Denim*, *Knitwear*, *Outerwear*), MOQ capacity, lead time, and quality ratings.
  * **Admin Selection Override:** Admins can manually override or reassign the top factory choice.
  * **Quotation 1, 2, 3 Builder:** Interactive builder to customize up to 3 sourcing quotation options with images, fabric descriptions, and unit prices.
  * **Export PDF:** Client-ready PDF generator to compile selected quotations for client presentation.

---

### 🔹 Step 3 — Costing (Checkpoint 1)
* **Feasibility:** 100% Feasible (Dual Costing + Client Approval Checkpoint)
* **Features:**
  * **Supplier Costing (Top Section — Admin Only):** Raw FOB factory cost, fabric cost/meter, internal handling, source house margin markup.
  * **Buyer Costing (Bottom Section — Admin, Agent & Client):** Client FOB/CIF price, shipping packaging, total order estimation.
  * 🎯 **IMPORTANT (Checkpoint 1):** 
    * "Send Client Quotation" trigger sends formatted quote to client via tracking link/email.
    * Client can **Approve**, **Request Revision**, or **Reject** directly on the tracking portal.

---

### 🔹 Step 4 — Sampling
* **Feasibility:** 100% Feasible (Dual Costing Structure)
* **Features:**
  * **Supplier Costing (Top):** What the factory charges for sample development.
  * **Buyer Costing (Bottom):** Sample fee invoiced to the client.

---

### 🔹 Step 5 — Sample Invoice & Tracking
* **Feasibility:** 100% Feasible
* **Features:**
  * Client view includes sample info, courier tracking number (DHL/FedEx), and downloadable sample invoice.

---

### 🔹 Step 6 — Sample Payment & Ledger Export
* **Feasibility:** 100% Feasible (Ledger Breakdown + CSV/Excel Export)
* **Features:**
  * **Payment Balance Calculator:** Real-time formula: `Amount Invoiced` − `Amount Received` = `Balance Outstanding`.
  * **Invoice Reminder:** One-click reminder button generating payment notices.
  * **Excel / CSV Export:** Dedicated export button to output sample payment ledgers to CSV / Excel format (auto-updates on Save).

---

### 🔹 Step 7 — Client Approval
* **Feasibility:** 100% Feasible (PDF Sign-Off Audit Log)
* **Features:**
  * Downloadable PDF summary containing approved tech pack specs, client sign-off timestamp, and comment history.

---

### 🔹 Step 8 — Bulk Order Details
* **Feasibility:** 100% Feasible
* **Features:**
  * Expanded product details: size breakdown matrix (S/M/L/XL), colorway breakdown, master carton packing specs, and official Purchase Order (PO) number.

---

### 🔹 Step 9 — Production (Supplier Quotes)
* **Feasibility:** 100% Feasible
* **Features:**
  * Captures supplier-quoted production start date, expected completion date, and live production stage milestones.

---

### 🔹 Step 10 — Quality Check
* **Feasibility:** 100% Feasible (Manual Inspection Logging)
* **Features:**
  * Log inspection date, AQL outcome (`Passed`, `Failed`, `Rework`), defect counts, and upload inspection photos/reports.

---

### 🔹 Step 11 — Shipment Dispatch Notice
* **Feasibility:** 100% Feasible (Decoupled Email Trigger)
* **Features:**
  * Send carrier tracking information and ETA to the client via email independently without requiring Stage 12 (Bulk Invoice) to be finalized.

---

### 🔹 Step 12 — Bulk Invoice
* **Feasibility:** 100% Feasible (In Accordance with Step 11)
* **Features:**
  * Bulk invoice generation with combined email delivery containing live Tracker Status + attached Bulk Invoice.

---

### 🔹 Step 13 — Bulk Payment & Automated Overdue Reminders
* **Feasibility:** 100% Feasible (Smart Overdue Engine)
* **Features:**
  * **Automated Overdue Detection:** If final settlement is not received before the due date:
    1. Triggers an **Overdue ERP Alert Badge** on the Admin & Agent dashboards.
    2. Sends an **Automated Email Reminder** to the client for overdue payment settlement.

---

## 🤖 3. Automation & Error Reduction Suite

To drastically reduce manual data entry errors, save operational time, and ensure financial accuracy across the platform:

### 1. AI Tech-Pack & Spec Parser (OCR & LLM Extraction)
* **Problem:** Manual typing of fabric specs, GSM, pantone colors, size charts, and measurements leads to typos that ruin factory production.
* **Automation:** Upload any PDF/Image tech-pack or client spec sheet. The ERP automatically extracts fabric composition, measurement grids (S/M/L/XL), target price, and colorways into Stage 1 fields.

### 2. Auto-Sync Courier Tracking API (DHL, FedEx, UPS, AfterShip)
* **Problem:** Staff manually checking tracking links and updating delivery status in Stage 4 & Stage 11.
* **Automation:** Polling courier APIs automatically updates stage statuses (`Dispatched` ➔ `In Transit` ➔ `Delivered`) and alerts clients the moment packages arrive.

### 3. Automated Margin & FX Currency Engine
* **Problem:** Currency conversion math errors (USD, EUR, GBP, INR, RMB), freight margin calculation mistakes, or incorrect FOB/CIF quotes.
* **Automation:** Real-time Forex rates integration + automatic calculation of Buyer Costing from Supplier Costing:
  $$\text{Buyer Price} = \frac{\text{Supplier Price} + \text{Freight}}{1 - \text{Agency Margin \%}}$$

### 4. Event-Driven WhatsApp & Email Webhooks
* **Problem:** Delays in manually informing clients about milestone approvals or tracking links.
* **Automation:** Instant WhatsApp & Email notifications triggered on Checkpoints (e.g. Checkpoint 1 quote ready, sample dispatched, AQL inspection passed).

### 5. Supplier Capacity & Risk Scorecard
* **Problem:** Assigning orders to factories that are overloaded or have poor On-Time Delivery (OTD %) history.
* **Automation:** Real-time scorecard calculates active load, OTD %, and quality pass rate, warning admins before an order is placed with a high-risk supplier.

### 6. Automated Invoice Reminders & Overdue Tracking
* **Problem:** Forgetting to follow up on unpaid sample or bulk invoices.
* **Automation:** Automated T-3, T-0, and T+3 overdue notification engine for finance teams and clients.

### 7. Automated AQL 2.5 Inspection Calculator
* **Problem:** Manual calculation of sample inspection size and allowed defect thresholds.
* **Automation:** Input bulk quantity (e.g., 5,000 units), system automatically computes required sample inspection size (e.g., 200 units) and major/minor defect limits.

### 8. Immutable Milestone Locking & Versioning
* **Problem:** Accidental modification of approved tech-packs or quotes after client sign-off.
* **Automation:** Once Stage 3 or 7 is approved, the ERP locks the specs. Modifications require an Admin Unlock Request logged in the audit trail.

---

## 📊 4. Bulk Excel / CSV Import Engine

To onboard bulk client enquiries and supplier directories without manual data entry:

```
[ 📄 Step 1: Upload File ] ➔ [ 🔍 Step 2: Validate & Preview Data ] ➔ [ 🚀 Step 3: Bulk Insert ]
```

### A. Client Enquiry Excel Import
* **Import Flow:** Upload `.xlsx`, `.xls`, or `.csv` via the **"Import Enquiries"** modal on `enquiries.tsx`.
* **Smart Matching:** Auto-matches `Client Name` to existing clients (or auto-creates client record if new).
* **Auto-Seeding:** Auto-generates sequential enquiry IDs (`ENQ-2026-001`, `ENQ-2026-002`...) and seeds Stage 1 data.
* **Template Headers:** `Client Name`, `Country`, `Product Reference`, `Target Price`, `Channel`, `Fabric Specs`, `Source`, `Quantity`.

### B. Factory & Supplier Excel Import
* **Import Flow:** Upload supplier catalogs via **"Import Factories"** modal on `factories.tsx` / `suppliers.tsx`.
* **Duplicate Detection:** Validates `Email` and `Factory Name` against DB to prevent duplicates.
* **Data Formatting:** Formats lead time integer days, rating scores, and categories automatically.
* **Template Headers:** `Factory Name`, `Country`, `City`, `Categories`, `Lead Time (Days)`, `Contact Person`, `Email`, `Phone`, `Rating`, `OTD %`.

---

## 📊 5. Technical Feasibility & Implementation Matrix

| Feature Module | Feasibility | Database Changes | UI / Component Changes |
| :--- | :---: | :---: | :---: |
| **RBAC (Admin vs. Agent)** | 100% | ❌ No (Existing Roles) | Yes (Data Masking Components) |
| **Public Client Tracking Link** | 100% | Yes (`tracking_token`) | Yes (New `/track` public route) |
| **Stage 1 (Source, MOQ, Type)** | 100% | Yes (Expand `stage_data`) | Yes (`src/routes/admin/tracker/enquiries.tsx`) |
| **Stage 2 (Auto-Match + PDF Export)** | 100% | ❌ No | Yes (Supplier Ranker + PDF Utility) |
| **Stage 3 & 4 (Dual Costing)** | 100% | ❌ No | Yes (Split Supplier/Buyer View) |
| **Stage 6 (Payment Ledger + Excel)**| 100% | ❌ No | Yes (Export Utility) |
| **Stage 7 & 11 (PDF & Shipment Email)**| 100% | ❌ No | Yes (Email & PDF Generators) |
| **Stage 13 (Automated Overdue Email)**| 100% | Yes (Due Date Cron/Worker) | Yes (ERP Alert Badges) |
| **AI Tech-Pack Parser** | 100% | ❌ No | Yes (File Upload Parser Component) |
| **Auto Courier Sync (DHL/FedEx)** | 100% | ❌ No | Yes (Tracking API Integrator) |
| **Bulk Excel Import Engine** | 100% | ❌ No | Yes (`ExcelImportModal` Component) |
