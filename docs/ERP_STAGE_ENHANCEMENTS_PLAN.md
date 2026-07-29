# 🚀 Maisone AI Sourcing Edge — ERP 13-Stage Architectural & Feasibility Blueprint

This document outlines the technical feasibility, architectural design, and step-by-step implementation blueprint for enhancing the Maisone Sourcing ERP platform across all 13 stages, Role-Based Access Control (RBAC), Public Client Portal, Email Trigger Automations, and Bulk Excel Import Workflows.

---

## 🔒 1. Core Platform Architecture & Global Access Control

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
  * **Source:** Dropdown (`Website`, `Email`, `LinkedIn`, `Referral`, `Phone`, `Existing Client`, `Sales Agent`).
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
    * "Send Client Quotation" trigger sends formatted quote & tracking link via email to the client.
    * Client can **Approve**, **Request Revision**, or **Reject** directly on the tracking portal.

---

### 🔹 Step 4 — Sampling
* **Feasibility:** 100% Feasible (Dual Costing Structure)
* **Features:**
  * **Supplier Costing (Top):** What the factory charges for sample development.
  * **Buyer Costing (Bottom):** Sample fee invoiced to the client.
  * **Data Inheritance:** Specs, fabric details, and colorways copy forward automatically from Stage 1 & 3.

---

### 🔹 Step 5 — Sample Invoice & Tracking
* **Feasibility:** 100% Feasible
* **Features:**
  * Client view includes sample info, courier tracking number (DHL/FedEx), and downloadable sample invoice.
  * **Email Trigger:** Automated email notification containing sample dispatch notice & invoice attachment.

---

### 🔹 Step 6 — Sample Payment & Ledger Export
* **Feasibility:** 100% Feasible (Ledger Breakdown + CSV/Excel Export)
* **Features:**
  * **Payment Balance Calculator:** Real-time formula: `Amount Invoiced` − `Amount Received` = `Balance Outstanding`.
  * **Invoice Email Reminder:** One-click reminder button sending payment notices via email.
  * **Excel / CSV Export:** Dedicated export button to output sample payment ledgers to CSV / Excel format (auto-updates on Save).

---

### 🔹 Step 7 — Client Approval
* **Feasibility:** 100% Feasible (PDF Sign-Off Audit Log)
* **Features:**
  * Downloadable PDF summary containing approved tech pack specs, client sign-off timestamp, and comment history.
  * **Email Trigger:** Automated sign-off confirmation email sent to client & assigned agent.

---

### 🔹 Step 8 — Bulk Order Details
* **Feasibility:** 100% Feasible
* **Features:**
  * Expanded product details: size breakdown matrix (S/M/L/XL), colorway breakdown, master carton packing specs, and official Purchase Order (PO) number.
  * **Auto Total Value:** Total order value auto-calculated: $\text{Quantity} \times \text{Approved Stage 3 Unit Price}$.

---

### 🔹 Step 9 — Production (Supplier Quotes)
* **Feasibility:** 100% Feasible
* **Features:**
  * Captures supplier-quoted production start date, expected completion date, and live production stage milestones.

---

### 🔹 Step 10 — Quality Check
* **Feasibility:** 100% Feasible (Manual Inspection Logging + Auto AQL)
* **Features:**
  * **Auto AQL 2.5 Calculator:** Input total bulk order quantity $\rightarrow$ system auto-populates required sample inspection size & allowed major/minor defect thresholds.
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
  * Bulk commercial invoice generation with combined email delivery containing live Tracker Status + attached Bulk Invoice PDF.

---

### 🔹 Step 13 — Bulk Payment & Automated Overdue Email Engine
* **Feasibility:** 100% Feasible (Smart Overdue Engine)
* **Features:**
  * **Automated Overdue Email Reminders:** If final settlement is not received before the due date:
    1. Triggers an **Overdue ERP Alert Badge** on the Admin & Agent dashboards.
    2. Sends **Automated Email Reminders** (T-3, T-0, T+3 days) to the client for overdue payment settlement.

---

## ⚡ 3. 13-Stage Automation & Less-Manual Workflow Matrix

| Stage # & Name | ❌ Currently Manual Action | 🤖 Automated "Less Manual" Solution (ERP + Email) |
| :--- | :--- | :--- |
| **Stage 1: Enquiry Received** | Typing client info, specs, date, and source manually. | **Auto-Ingest:** Web leads auto-create Stage 1 records with Enquiry ID, source, and agent assigned by region. |
| **Stage 2: Sourcing** | Manually searching factory catalogs and emailing RFQs. | **Auto-Match Engine:** Ranks top 3 best-fit factories by category & MOQ automatically, with 1-click RFQ emails. |
| **Stage 3: Costing** | Hand-calculating margins, CIF/FOB pricing, and quote emails. | **Auto-Margin & Email Trigger:** Enter factory cost $\rightarrow$ auto-calculates buyer price, builds PDF, and emails Checkpoint 1 quote link. |
| **Stage 4: Sampling** | Re-typing product specs, sizes, and tracking info. | **Auto-Inherit Specs:** Specs, fabric details, and colorways copy forward automatically from Stage 1 & 3 into Stage 4. |
| **Stage 5: Sample Invoice** | Writing sample invoices manually in Excel/Word. | **1-Click Invoice Email:** System pulls sample fee + courier cost from Stage 4, creates invoice `#SMP-INV-XXX`, and emails client. |
| **Stage 6: Sample Payment** | Manually checking bank statements & typing amounts. | **Payment Reminders & Excel:** Ledger balance auto-calculated, 1-click email payment reminders, and CSV/Excel export. |
| **Stage 7: Client Approval** | Waiting for manual email replies and updating status. | **Self-Service Client Portal Approval:** Client approves sample on tracking portal $\rightarrow$ auto-logs sign-off timestamp & sends confirmation email. |
| **Stage 8: Bulk Order** | Re-entering quantity, unit price, PO numbers, and value. | **Auto-Calculated Bulk PO:** Total Order Value ($\text{Qty} \times \text{Approved Stage 3 Unit Price}$) and PO document auto-generate in 1 click. |
| **Stage 9: Production** | Calling/emailing factories repeatedly for progress updates. | **Milestone Progress Tracking:** Agent logs production completion % with automatic delay risk detection alerts. |
| **Stage 10: Quality Check** | Manually calculating inspection sizes & defect limits. | **Auto AQL 2.5 Calculator:** Input bulk qty $\rightarrow$ auto-populates required inspection sample size & max allowed major/minor defect limits. |
| **Stage 11: Shipment** | Checking container tracking and drafting delivery emails. | **Shipment Email Trigger:** Decoupled email notice sending carrier tracking info and container ETA to the client in 1 click. |
| **Stage 12: Bulk Invoice** | Manually drafting commercial invoice & due dates. | **Auto Commercial Invoice Email:** Pulls Stage 8 value minus Stage 6 sample credits, sets Net 30 due date, and emails invoice PDF. |
| **Stage 13: Bulk Payment** | Monitoring bank accounts for late payments & reminder emails. | **Automated Overdue Email Engine:** Automated T-3, T-0, and T+3 email reminders sent to client if payment is unpaid by due date. |

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

| Feature Module | Feasibility | Database Changes | UI / Component Changes | Email Trigger / Integration |
| :--- | :---: | :---: | :---: | :---: |
| **RBAC (Admin vs. Agent)** | 100% | ❌ No (Existing Roles) | Yes (Data Masking) | N/A |
| **Public Client Tracking Link** | 100% | Yes (`tracking_token`) | Yes (`/track` route) | Yes (Token link in emails) |
| **Stage 1 (Source, MOQ, Type)** | 100% | Yes (Expand `stage_data`) | Yes ([enquiries.tsx](file:///Users/shivamsharma/Downloads/maisone-ai-sourcing-edge-main/src/routes/admin/tracker/enquiries.tsx)) | Auto-assignment email |
| **Stage 2 (Auto-Match + PDF Export)** | 100% | ❌ No | Yes (Supplier Ranker) | RFQ email to factory |
| **Stage 3 (Dual Costing & Checkpoint 1)**| 100% | ❌ No | Yes (Split Costing UI) | Quote approval email |
| **Stage 5 & 6 (Sample Invoice & Ledger)**| 100% | ❌ No | Yes (Export & Ledger UI)| Sample invoice & reminder email |
| **Stage 7 (Client Approval)** | 100% | ❌ No | Yes (Sign-Off Audit) | Approval confirmation email |
| **Stage 10 (Auto AQL 2.5 Calc)** | 100% | ❌ No | Yes (AQL Calculator) | QC pass/fail report email |
| **Stage 11 & 12 (Shipment & Bulk Inv)** | 100% | ❌ No | Yes (Invoice & Dispatch) | Shipment notice & Invoice email |
| **Stage 13 (Automated Overdue Email)**| 100% | Yes (Due Date Worker) | Yes (ERP Alert Badges) | T-3, T-0, T+3 Overdue emails |
| **Bulk Excel Import Engine** | 100% | ❌ No | Yes (`ExcelImportModal`) | Batch summary email |
