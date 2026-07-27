import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DollarSign, FileText, Plus, X, ArrowUpRight, AlertCircle, CheckCircle2, Clock, Trash2, Globe } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import {
  TrackerInvoice,
  TrackerPayment,
  TrackerEnquiry,
  TrackerSettings,
  CurrencyCode,
  CURRENCY_SYMBOLS,
  DEFAULT_EXCHANGE_RATES,
  convertCurrency,
  getTrackerSettings
} from "@/lib/tracker-store";
import { CustomSelect } from "../../admin";

export const Route = createFileRoute("/admin/tracker/finance")({
  component: FinanceRoute,
});

function FinanceRoute() {
  const [invoices, setInvoices] = useState<TrackerInvoice[]>([]);
  const [payments, setPayments] = useState<TrackerPayment[]>([]);
  const [enquiries, setEnquiries] = useState<TrackerEnquiry[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "sample" | "bulk" | "payments">("all");
  const [loading, setLoading] = useState(true);
  const [displayCurrency, setDisplayCurrency] = useState<CurrencyCode>("USD");
  const [settings, setSettings] = useState<TrackerSettings | null>(null);

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

  const loadFinanceData = async () => {
    setLoading(true);
    try {
      const { data: dbClients } = await supabase.from("tracker_clients").select("*");
      const { data: dbEnquiries } = await supabase.from("tracker_enquiries").select("*");
      if (dbEnquiries) {
        setEnquiries(dbEnquiries);
        if (dbEnquiries.length > 0 && !selectedEnquiryId) {
          setSelectedEnquiryId(dbEnquiries[0].id);
        }
      }

      let { data: dbInvoices } = await supabase.from("tracker_invoices").select("*");
      let { data: dbPayments } = await supabase.from("tracker_payments").select("*");

      // Join/map Client and Enquiry details in memory
      const mappedInvoices = (dbInvoices || []).map((inv: any) => {
        const client = (dbClients || []).find((c: any) => c.id === inv.client_id);
        const enquiry = (dbEnquiries || []).find((e: any) => e.id === inv.enquiry_id);
        return {
          ...inv,
          client_name: client?.company_name || "Unknown Client",
          enquiry_number: enquiry?.enquiry_number || "ENQ-UNKNOWN"
        };
      });

      const mappedPayments = (dbPayments || []).map((pmt: any) => {
        const client = (dbClients || []).find((c: any) => c.id === pmt.client_id);
        const enquiry = (dbEnquiries || []).find((e: any) => e.id === pmt.enquiry_id);
        const invoice = (dbInvoices || []).find((i: any) => i.id === pmt.invoice_id);
        return {
          ...pmt,
          client_name: client?.company_name || "Unknown Client",
          enquiry_number: enquiry?.enquiry_number || "ENQ-UNKNOWN",
          invoice_number: invoice?.invoice_number || "INV-UNKNOWN"
        };
      });

      setInvoices(mappedInvoices);
      setPayments(mappedPayments);

      if (mappedInvoices.length > 0 && !selectedInvoiceId) {
        setSelectedInvoiceId(mappedInvoices[0].id);
      }
    } catch (err) {
      console.error("Failed to load finance data:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadFinanceData();
  }, []);

  const handleDeleteInvoice = async (invId: string, invNum: string) => {
    if (window.confirm(`Are you sure you want to delete invoice ${invNum}? This will also delete its payment record.`)) {
      try {
        // Delete payment associated
        await supabase.from("tracker_payments").delete().eq("invoice_id", invId);
        // Delete invoice
        const { error } = await supabase.from("tracker_invoices").delete().eq("id", invId);
        if (error) throw error;
        
        loadFinanceData();
        toast.success(`Invoice ${invNum} deleted.`);
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete invoice");
      }
    }
  };

  const handleDeletePayment = async (pmtId: string, invNum?: string) => {
    const label = invNum || "Payment Record";
    if (window.confirm(`Are you sure you want to delete payment record for ${label}?`)) {
      try {
        const { error } = await supabase.from("tracker_payments").delete().eq("id", pmtId);
        if (error) throw error;
        loadFinanceData();
        toast.success(`Payment record for ${label} deleted.`);
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete payment");
      }
    }
  };

  const handleCreateInvoice = async () => {
    if (!invNumber.trim() || !invAmount) {
      toast.error("Please enter a valid invoice number and amount.");
      return;
    }

    const matchedEnquiry = enquiries.find(e => e.id === selectedEnquiryId) || enquiries[0];
    if (!matchedEnquiry) {
      toast.error("No active enquiries available to invoice.");
      return;
    }

    try {
      const { data: newInv, error: invError } = await supabase
        .from("tracker_invoices")
        .insert([{
          invoice_number: invNumber,
          enquiry_id: matchedEnquiry.id,
          client_id: matchedEnquiry.client_id,
          invoice_type: invType,
          amount: parseFloat(invAmount) || 0,
          currency: "USD",
          invoice_date: new Date().toISOString().split("T")[0],
          due_date: invDueDate || new Date().toISOString().split("T")[0],
          payment_terms: "30% Deposit, 70% Balance",
          status: "Sent"
        }])
        .select()
        .single();

      if (invError) throw invError;

      if (newInv) {
        const { error: pmtError } = await supabase
          .from("tracker_payments")
          .insert([{
            invoice_id: newInv.id,
            enquiry_id: newInv.enquiry_id,
            client_id: newInv.client_id,
            payment_type: invType,
            due_date: newInv.due_date,
            amount_due: newInv.amount,
            amount_received: 0,
            status: "Due"
          }]);

        if (pmtError) throw pmtError;
      }

      setIsInvModalOpen(false);
      setInvNumber("");
      setInvAmount("");
      loadFinanceData();
      toast.success(`Invoice ${invNumber} created successfully!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create invoice");
    }
  };

  const handleRecordPayment = async () => {
    const targetInvoiceId = selectedInvoiceId || invoices[0]?.id;
    if (!targetInvoiceId || !pmtReceived || parseFloat(pmtReceived) <= 0) {
      toast.error("Please select an invoice and enter a valid payment amount.");
      return;
    }

    const targetInv = invoices.find(i => i.id === targetInvoiceId);
    if (!targetInv) {
      toast.error("Invoice not found.");
      return;
    }

    const existingPmt = payments.find(p => p.invoice_id === targetInvoiceId);

    try {
      const addedAmount = parseFloat(pmtReceived) || 0;
      const newReceived = (existingPmt?.amount_received || 0) + addedAmount;
      const amountDue = existingPmt?.amount_due || targetInv.amount;
      const newBalance = Math.max(0, amountDue - newReceived);
      const newStatus = newBalance === 0 ? "Paid" : newReceived > 0 ? "Partially Paid" : "Due";

      if (existingPmt) {
        const { error } = await supabase
          .from("tracker_payments")
          .update({
            amount_received: newReceived,
            payment_date: pmtDate,
            status: newStatus
          })
          .eq("id", existingPmt.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("tracker_payments")
          .insert([{
            invoice_id: targetInv.id,
            enquiry_id: targetInv.enquiry_id,
            client_id: targetInv.client_id,
            payment_type: targetInv.invoice_type,
            due_date: targetInv.due_date,
            amount_due: targetInv.amount,
            amount_received: newReceived,
            payment_date: pmtDate,
            status: newStatus
          }]);
        if (error) throw error;
      }

      // Also update invoice status
      await supabase
        .from("tracker_invoices")
        .update({
          status: newBalance === 0 ? "Paid" : "Sent"
        })
        .eq("id", targetInvoiceId);

      setIsPmtModalOpen(false);
      setPmtReceived("");
      loadFinanceData();
      toast.success(`Payment of $${addedAmount.toLocaleString()} recorded for ${targetInv.invoice_number}!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to record payment");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header skeleton */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-foreground/10 rounded-xl" />
            <div className="h-3 w-72 bg-foreground/10 rounded-full" />
          </div>
          <div className="flex gap-3">
            <div className="h-9 w-36 bg-foreground/10 rounded-xl" />
            <div className="h-9 w-36 bg-foreground/10 rounded-xl" />
          </div>
        </div>
        {/* Summary cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-5 rounded-2xl border border-border bg-card space-y-2">
              <div className="h-3 w-32 bg-foreground/10 rounded-full" />
              <div className="h-8 w-24 bg-foreground/10 rounded-lg" />
              <div className="h-2.5 w-40 bg-foreground/10 rounded-full" />
            </div>
          ))}
        </div>
        {/* Tab bar skeleton */}
        <div className="flex gap-6 border-b border-border pb-0">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-8 w-24 bg-foreground/10 rounded-t-lg" />
          ))}
        </div>
        {/* Invoice table skeleton */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="h-4 w-40 bg-foreground/10 rounded-full" />
          </div>
          <div className="divide-y divide-border">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 flex items-center gap-4">
                <div className="h-3 w-28 bg-foreground/10 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-36 bg-foreground/10 rounded-full" />
                  <div className="h-2.5 w-24 bg-foreground/10 rounded-full" />
                </div>
                <div className="h-3 w-20 bg-foreground/10 rounded-full shrink-0" />
                <div className="h-3 w-20 bg-foreground/10 rounded-full shrink-0" />
                <div className="h-6 w-20 bg-foreground/10 rounded-full shrink-0" />
                <div className="size-8 rounded-lg bg-foreground/10 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const rates = settings?.exchange_rates || DEFAULT_EXCHANGE_RATES;
  const buffer = settings?.hedging_buffer_percent || 0;
  const symbol = CURRENCY_SYMBOLS[displayCurrency] || "$";

  // Financial summary metrics
  const totalInvoiced = invoices.reduce((sum, i) => sum + i.amount, 0);
  const totalCollected = payments.reduce((sum, p) => sum + p.amount_received, 0);
  const totalOutstanding = payments.reduce((sum, p) => sum + (p.amount_due - p.amount_received), 0);

  const totalInvoicedConv = convertCurrency(totalInvoiced, "USD", displayCurrency, rates, buffer);
  const totalCollectedConv = convertCurrency(totalCollected, "USD", displayCurrency, rates, buffer);
  const totalOutstandingConv = convertCurrency(totalOutstanding, "USD", displayCurrency, rates, buffer);

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

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-foreground/[0.02] shadow-sm shrink-0">
            <Globe className="size-3.5 text-electric shrink-0" />
            <select
              value={displayCurrency}
              onChange={(e) => setDisplayCurrency(e.target.value as CurrencyCode)}
              className="bg-transparent text-xs font-bold text-electric cursor-pointer outline-none"
            >
              {(["USD", "EUR", "GBP", "INR", "RMB"] as CurrencyCode[]).map((c) => (
                <option key={c} value={c}>
                  {c} ({CURRENCY_SYMBOLS[c]})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsPmtModalOpen(true)}
            className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground font-semibold text-xs shadow-sm hover:bg-foreground/5 transition-all cursor-pointer whitespace-nowrap text-center"
          >
            Record Payment
          </button>
          <button
            onClick={() => setIsInvModalOpen(true)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-electric text-background font-bold text-xs shadow-lg hover:brightness-110 transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="size-4 shrink-0" />
            Create Invoice
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card space-y-1">
          <p className="text-xs font-semibold text-muted-foreground">Total Invoiced Amount</p>
          <p className="text-xl sm:text-2xl font-serif font-bold text-foreground">{symbol}{totalInvoicedConv.toLocaleString()}</p>
          <p className="text-[11px] text-muted-foreground">{invoices.length} Invoices ({displayCurrency})</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card space-y-1">
          <p className="text-xs font-semibold text-muted-foreground">Total Collected Payments</p>
          <p className="text-xl sm:text-2xl font-serif font-bold text-emerald-600 dark:text-emerald-400">{symbol}{totalCollectedConv.toLocaleString()}</p>
          <p className="text-[11px] text-emerald-700/80 dark:text-emerald-500/80">Funds Received ({displayCurrency})</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card space-y-1 sm:col-span-2 md:col-span-1">
          <p className="text-xs font-semibold text-muted-foreground">Outstanding Balance Due</p>
          <p className="text-xl sm:text-2xl font-serif font-bold text-amber-600 dark:text-amber-400">{symbol}{totalOutstandingConv.toLocaleString()}</p>
          <p className="text-[11px] text-amber-700/80 dark:text-amber-500/80">Calculated ({displayCurrency})</p>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex border-b border-border gap-4 sm:gap-6 text-xs font-semibold overflow-x-auto no-scrollbar pb-0.5">
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
              .map((inv) => {
                const convAmt = convertCurrency(inv.amount, "USD", displayCurrency, rates, buffer);
                return (
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
                      {symbol}{convAmt.toLocaleString()}
                    </div>

                    <div className="col-span-2 text-right pr-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                        inv.status === "Paid" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
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
                );
              })}
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

            {payments.map((p) => {
              const convDue = convertCurrency(p.amount_due, "USD", displayCurrency, rates, buffer);
              const convRec = convertCurrency(p.amount_received, "USD", displayCurrency, rates, buffer);
              const convBal = convertCurrency(p.outstanding_balance, "USD", displayCurrency, rates, buffer);
              return (
                <div key={p.id} className="p-4 grid grid-cols-12 gap-4 items-center text-xs hover:bg-foreground/[0.02]">
                  <div className="col-span-3">
                    <p className="font-mono font-bold text-electric">{p.invoice_number}</p>
                    <p className="font-medium text-foreground">{p.client_name}</p>
                  </div>

                  <div className="col-span-2 text-right font-mono font-semibold">
                    {symbol}{convDue.toLocaleString()}
                  </div>

                  <div className="col-span-2 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    {symbol}{convRec.toLocaleString()}
                  </div>

                  <div className="col-span-2 text-right font-mono font-bold text-amber-600 dark:text-amber-400">
                    {symbol}{convBal.toLocaleString()}
                  </div>

                  <div className="col-span-2 text-right pr-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                      p.status === "Paid" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                    }`}>
                      {p.status}
                    </span>
                  </div>

                <div className="col-span-1 flex justify-center">
                  <button
                    onClick={() => handleDeletePayment(p.id, p.invoice_number || "Payment Record")}
                    title="Delete Payment Record"
                    className="p-1.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500 hover:text-white transition-all text-red-400 cursor-pointer shadow-sm"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
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
