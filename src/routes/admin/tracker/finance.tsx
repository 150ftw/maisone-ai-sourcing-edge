import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DollarSign, FileText, Plus, X, ArrowUpRight, AlertCircle, CheckCircle2, Clock, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  getTrackerInvoices,
  saveTrackerInvoices,
  getTrackerPayments,
  saveTrackerPayments,
  getTrackerEnquiries,
  TrackerInvoice,
  TrackerPayment,
  TrackerEnquiry
} from "@/lib/tracker-store";
import { CustomSelect } from "../../admin";

export const Route = createFileRoute("/admin/tracker/finance")({
  component: FinanceRoute,
});

export function FinanceRoute() {
  const [invoices, setInvoices] = useState<TrackerInvoice[]>([]);
  const [payments, setPayments] = useState<TrackerPayment[]>([]);
  const [enquiries, setEnquiries] = useState<TrackerEnquiry[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "sample" | "bulk" | "payments">("all");

  // Modal State for Invoice Creation
  const [isInvModalOpen, setIsInvModalOpen] = useState(false);
  const [invType, setInvType] = useState<"Sample" | "Bulk">("Bulk");
  const [invNumber, setInvNumber] = useState("");
  const [invAmount, setInvAmount] = useState("");
  const [selectedEnquiryId, setSelectedEnquiryId] = useState("");
  const [invDueDate, setInvDueDate] = useState("");

  // Modal State for Payment Recording
  const [isPmtModalOpen, setIsPmtModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState("");
  const [pmtReceived, setPmtReceived] = useState("");
  const [pmtDate, setPmtDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const invs = getTrackerInvoices();
    const pmts = getTrackerPayments();
    setInvoices(invs);
    setPayments(pmts);
    setEnquiries(getTrackerEnquiries());
    if (invs.length > 0 && !selectedInvoiceId) {
      setSelectedInvoiceId(invs[0].id);
    }
  }, []);

  const handleDeleteInvoice = (invId: string, invNum: string) => {
    if (window.confirm(`Are you sure you want to delete invoice ${invNum}? This will also delete its payment record.`)) {
      const updatedInvs = invoices.filter(i => i.id !== invId);
      const updatedPmts = payments.filter(p => p.invoice_id !== invId);
      saveTrackerInvoices(updatedInvs);
      saveTrackerPayments(updatedPmts);
      setInvoices(updatedInvs);
      setPayments(updatedPmts);
      toast.success(`Invoice ${invNum} deleted.`);
    }
  };

  const handleDeletePayment = (pmtId: string, invNum: string) => {
    if (window.confirm(`Are you sure you want to delete payment record for ${invNum}?`)) {
      const updatedPmts = payments.filter(p => p.id !== pmtId);
      saveTrackerPayments(updatedPmts);
      setPayments(updatedPmts);
      toast.success(`Payment record for ${invNum} deleted.`);
    }
  };

  // Financial summary metrics
  const totalInvoiced = invoices.reduce((sum, i) => sum + i.amount, 0);
  const totalCollected = payments.reduce((sum, p) => sum + p.amount_received, 0);
  const totalOutstanding = payments.reduce((sum, p) => sum + p.outstanding_balance, 0);

  const handleCreateInvoice = () => {
    if (!invNumber.trim() || !invAmount) {
      toast.error("Please enter a valid invoice number and amount.");
      return;
    }

    const matchedEnquiry = enquiries.find(e => e.id === selectedEnquiryId) || enquiries[0];

    const newInv: TrackerInvoice = {
      id: `inv-${Date.now()}`,
      created_at: new Date().toISOString(),
      invoice_number: invNumber,
      enquiry_id: matchedEnquiry?.id || "enq-1001",
      enquiry_number: matchedEnquiry?.enquiry_number || "ENQ-2026-001",
      client_id: matchedEnquiry?.client_id || "c-101",
      client_name: matchedEnquiry?.client_name || "Atelier Saint-Germain",
      invoice_type: invType,
      amount: parseFloat(invAmount) || 0,
      currency: "USD",
      invoice_date: new Date().toISOString().split("T")[0],
      due_date: invDueDate || new Date().toISOString().split("T")[0],
      payment_terms: "30% Deposit, 70% Balance",
      status: "Sent"
    };

    const newPmt: TrackerPayment = {
      id: `pmt-${Date.now()}`,
      created_at: new Date().toISOString(),
      invoice_id: newInv.id,
      invoice_number: newInv.invoice_number,
      enquiry_id: newInv.enquiry_id,
      enquiry_number: newInv.enquiry_number,
      client_id: newInv.client_id,
      client_name: newInv.client_name,
      payment_type: invType,
      due_date: newInv.due_date,
      amount_due: newInv.amount,
      amount_received: 0,
      outstanding_balance: newInv.amount,
      status: "Due"
    };

    const updatedInvoices = [newInv, ...invoices];
    const updatedPayments = [newPmt, ...payments];

    saveTrackerInvoices(updatedInvoices);
    saveTrackerPayments(updatedPayments);

    setInvoices(updatedInvoices);
    setPayments(updatedPayments);
    setIsInvModalOpen(false);

    setInvNumber("");
    setInvAmount("");
    toast.success(`Invoice ${newInv.invoice_number} created successfully!`);
  };

  const handleRecordPayment = () => {
    const targetInvoiceId = selectedInvoiceId || invoices[0]?.id;
    if (!targetInvoiceId || !pmtReceived || parseFloat(pmtReceived) <= 0) {
      toast.error("Please select an invoice and enter a valid payment amount.");
      return;
    }

    const allPayments = [...payments];
    let pmtIndex = allPayments.findIndex(p => p.invoice_id === targetInvoiceId);
    
    const targetInv = invoices.find(i => i.id === targetInvoiceId);
    if (!targetInv) {
      toast.error("Invoice not found.");
      return;
    }

    // If payment record doesn't exist yet, auto-create one
    if (pmtIndex === -1) {
      const createdPmt: TrackerPayment = {
        id: `pmt-${Date.now()}`,
        created_at: new Date().toISOString(),
        invoice_id: targetInv.id,
        invoice_number: targetInv.invoice_number,
        enquiry_id: targetInv.enquiry_id,
        enquiry_number: targetInv.enquiry_number,
        client_id: targetInv.client_id,
        client_name: targetInv.client_name,
        payment_type: targetInv.invoice_type,
        due_date: targetInv.due_date,
        amount_due: targetInv.amount,
        amount_received: 0,
        outstanding_balance: targetInv.amount,
        status: "Due"
      };
      allPayments.unshift(createdPmt);
      pmtIndex = 0;
    }

    const existingPmt = allPayments[pmtIndex];
    const addedAmount = parseFloat(pmtReceived) || 0;
    const newReceived = (existingPmt.amount_received || 0) + addedAmount;
    const newBalance = Math.max(0, existingPmt.amount_due - newReceived);
    const newStatus = newBalance === 0 ? "Paid" : newReceived > 0 ? "Partially Paid" : "Due";

    const updatedPmt: TrackerPayment = {
      ...existingPmt,
      amount_received: newReceived,
      outstanding_balance: newBalance,
      payment_date: pmtDate,
      status: newStatus
    };

    allPayments[pmtIndex] = updatedPmt;

    // Also update invoice status if paid
    const allInvoices = invoices.map(inv =>
      inv.id === targetInvoiceId
        ? { ...inv, status: (newBalance === 0 ? "Paid" : "Sent") as any }
        : inv
    );

    saveTrackerPayments(allPayments);
    saveTrackerInvoices(allInvoices);

    setPayments(allPayments);
    setInvoices(allInvoices);
    setIsPmtModalOpen(false);
    setPmtReceived("");
    toast.success(`Payment of $${addedAmount.toLocaleString()} recorded for ${targetInv.invoice_number}!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="font-serif text-2xl font-bold">Finance & Billing</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manual invoicing, payment recording, and automated balance tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPmtModalOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-border bg-card text-foreground font-semibold text-xs shadow-sm hover:bg-foreground/5 transition-all cursor-pointer"
          >
            Record Payment
          </button>
          <button
            onClick={() => setIsInvModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-electric text-background font-bold text-xs shadow-lg hover:brightness-110 transition-all cursor-pointer"
          >
            <Plus className="size-4" />
            Create Invoice
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-border bg-card space-y-1">
          <p className="text-xs font-semibold text-muted-foreground">Total Invoiced Amount</p>
          <p className="text-2xl font-serif font-bold text-foreground">${totalInvoiced.toLocaleString()}</p>
          <p className="text-[11px] text-muted-foreground">{invoices.length} Invoices Generated</p>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card space-y-1">
          <p className="text-xs font-semibold text-muted-foreground">Total Collected Payments</p>
          <p className="text-2xl font-serif font-bold text-emerald-400">${totalCollected.toLocaleString()}</p>
          <p className="text-[11px] text-emerald-500/80">Funds Received & Cleared</p>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card space-y-1">
          <p className="text-xs font-semibold text-muted-foreground">Outstanding Balance Due</p>
          <p className="text-2xl font-serif font-bold text-amber-400">${totalOutstanding.toLocaleString()}</p>
          <p className="text-[11px] text-amber-500/80">Calculated automatically</p>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex border-b border-border gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("all")}
          className={`py-2.5 border-b-2 transition-colors cursor-pointer ${
            activeTab === "all" ? "border-electric text-electric font-bold" : "border-transparent text-muted-foreground"
          }`}
        >
          All Invoices ({invoices.length})
        </button>
        <button
          onClick={() => setActiveTab("sample")}
          className={`py-2.5 border-b-2 transition-colors cursor-pointer ${
            activeTab === "sample" ? "border-electric text-electric font-bold" : "border-transparent text-muted-foreground"
          }`}
        >
          Sample Invoices ({invoices.filter(i => i.invoice_type === "Sample").length})
        </button>
        <button
          onClick={() => setActiveTab("bulk")}
          className={`py-2.5 border-b-2 transition-colors cursor-pointer ${
            activeTab === "bulk" ? "border-electric text-electric font-bold" : "border-transparent text-muted-foreground"
          }`}
        >
          Bulk Invoices ({invoices.filter(i => i.invoice_type === "Bulk").length})
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className={`py-2.5 border-b-2 transition-colors cursor-pointer ${
            activeTab === "payments" ? "border-electric text-electric font-bold" : "border-transparent text-muted-foreground"
          }`}
        >
          Payments & Balances ({payments.length})
        </button>
      </div>

      {/* Data Tables */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {activeTab !== "payments" ? (
          <div className="divide-y divide-border overflow-x-auto">
            <div className="p-4 bg-foreground/[0.02] grid grid-cols-12 gap-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider items-center">
              <div className="col-span-3">Invoice Number / Client</div>
              <div className="col-span-2">Enquiry Reference</div>
              <div className="col-span-2">Type / Date</div>
              <div className="col-span-2 text-right">Amount</div>
              <div className="col-span-2 text-right pr-2">Status</div>
              <div className="col-span-1 text-center">Action</div>
            </div>

            {invoices
              .filter(inv => activeTab === "all" || (activeTab === "sample" && inv.invoice_type === "Sample") || (activeTab === "bulk" && inv.invoice_type === "Bulk"))
              .map((inv) => (
                <div key={inv.id} className="p-4 grid grid-cols-12 gap-4 items-center text-xs hover:bg-foreground/[0.02]">
                  <div className="col-span-3">
                    <p className="font-mono font-bold text-electric">{inv.invoice_number}</p>
                    <p className="font-medium text-foreground">{inv.client_name}</p>
                  </div>

                  <div className="col-span-2">
                    <p className="font-semibold text-foreground">{inv.enquiry_number}</p>
                    <p className="text-[10px] text-muted-foreground">Due: {inv.due_date}</p>
                  </div>

                  <div className="col-span-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-electric/15 text-electric">
                      {inv.invoice_type}
                    </span>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{inv.invoice_date}</p>
                  </div>

                  <div className="col-span-2 text-right font-mono font-bold text-foreground">
                    ${inv.amount.toLocaleString()}
                  </div>

                  <div className="col-span-2 text-right pr-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                      inv.status === "Paid" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}>
                      {inv.status}
                    </span>
                  </div>

                  <div className="col-span-1 flex justify-center">
                    <button
                      onClick={() => handleDeleteInvoice(inv.id, inv.invoice_number)}
                      title="Delete Invoice"
                      className="p-1.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500 hover:text-white transition-all text-red-400 cursor-pointer shadow-sm"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="divide-y divide-border overflow-x-auto">
            <div className="p-4 bg-foreground/[0.02] grid grid-cols-12 gap-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider items-center">
              <div className="col-span-3">Invoice / Client</div>
              <div className="col-span-2 text-right">Amount Due</div>
              <div className="col-span-2 text-right">Received</div>
              <div className="col-span-2 text-right">Outstanding</div>
              <div className="col-span-2 text-right pr-2">Status</div>
              <div className="col-span-1 text-center">Action</div>
            </div>

            {payments.map((p) => (
              <div key={p.id} className="p-4 grid grid-cols-12 gap-4 items-center text-xs hover:bg-foreground/[0.02]">
                <div className="col-span-3">
                  <p className="font-mono font-bold text-electric">{p.invoice_number}</p>
                  <p className="font-medium text-foreground">{p.client_name}</p>
                </div>

                <div className="col-span-2 text-right font-mono font-semibold">
                  ${p.amount_due.toLocaleString()}
                </div>

                <div className="col-span-2 text-right font-mono font-semibold text-emerald-400">
                  ${p.amount_received.toLocaleString()}
                </div>

                <div className="col-span-2 text-right font-mono font-bold text-amber-400">
                  ${p.outstanding_balance.toLocaleString()}
                </div>

                <div className="col-span-2 text-right pr-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                    p.status === "Paid" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}>
                    {p.status}
                  </span>
                </div>

                <div className="col-span-1 flex justify-center">
                  <button
                    onClick={() => handleDeletePayment(p.id, p.invoice_number)}
                    title="Delete Payment Record"
                    className="p-1.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500 hover:text-white transition-all text-red-400 cursor-pointer shadow-sm"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Invoice Modal */}
      {isInvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl border border-border bg-card space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold">Create Invoice</h3>
              <button onClick={() => setIsInvModalOpen(false)} className="p-1 rounded-lg hover:bg-foreground/10">
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Invoice Type</label>
                <CustomSelect
                  value={invType}
                  onChange={(val) => setInvType(val as any)}
                  options={["Sample", "Bulk"]}
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Enquiry</label>
                <CustomSelect
                  value={enquiries.find(e => e.id === selectedEnquiryId)?.enquiry_number || enquiries[0]?.enquiry_number || "Select Enquiry"}
                  onChange={(val) => {
                    const matched = enquiries.find(e => e.enquiry_number === val);
                    if (matched) setSelectedEnquiryId(matched.id);
                  }}
                  options={enquiries.map(e => e.enquiry_number)}
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Invoice Number</label>
                <input
                  type="text"
                  value={invNumber}
                  onChange={(e) => setInvNumber(e.target.value)}
                  placeholder="BLK-INV-009"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Amount ($)</label>
                <input
                  type="number"
                  value={invAmount}
                  onChange={(e) => setInvAmount(e.target.value)}
                  placeholder="12500"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Due Date</label>
                <input
                  type="date"
                  value={invDueDate}
                  onChange={(e) => setInvDueDate(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button onClick={() => setIsInvModalOpen(false)} className="px-4 py-2 rounded-xl border border-border text-xs">
                Cancel
              </button>
              <button onClick={handleCreateInvoice} className="px-4 py-2 rounded-xl bg-electric text-background font-bold text-xs shadow-md">
                Create Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {isPmtModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl border border-border bg-card space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold">Record Payment</h3>
              <button onClick={() => setIsPmtModalOpen(false)} className="p-1 rounded-lg hover:bg-foreground/10">
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Select Invoice</label>
                {(() => {
                  const getInvLabel = (inv: TrackerInvoice) => `${inv.invoice_number} (${inv.client_name} - $${inv.amount})`;
                  const selInv = invoices.find(i => i.id === selectedInvoiceId) || invoices[0];
                  return (
                    <CustomSelect
                      value={selInv ? getInvLabel(selInv) : "Select Invoice"}
                      onChange={(val) => {
                        const matched = invoices.find(i => getInvLabel(i) === val || i.invoice_number === val);
                        if (matched) setSelectedInvoiceId(matched.id);
                      }}
                      options={invoices.map(getInvLabel)}
                    />
                  );
                })()}
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Amount Received ($)</label>
                <input
                  type="number"
                  value={pmtReceived}
                  onChange={(e) => setPmtReceived(e.target.value)}
                  placeholder="5000"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Payment Date</label>
                <input
                  type="date"
                  value={pmtDate}
                  onChange={(e) => setPmtDate(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button onClick={() => setIsPmtModalOpen(false)} className="px-4 py-2 rounded-xl border border-border text-xs">
                Cancel
              </button>
              <button onClick={handleRecordPayment} className="px-4 py-2 rounded-xl bg-electric text-background font-bold text-xs shadow-md">
                Record Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
