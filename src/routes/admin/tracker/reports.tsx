import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { BarChart3, Download, FileSpreadsheet, FileText, Filter, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import {
  exportToCSV,
  TrackerEnquiry,
  TrackerClient,
  TrackerFactory,
  TrackerPayment
} from "@/lib/tracker-store";

export const Route = createFileRoute("/admin/tracker/reports")({
  component: ReportsRoute,
});

function ReportsRoute() {
  const [reportType, setReportType] = useState<"client" | "factory" | "order" | "payment">("order");
  const [enquiries, setEnquiries] = useState<TrackerEnquiry[]>([]);
  const [clients, setClients] = useState<TrackerClient[]>([]);
  const [factories, setFactories] = useState<TrackerFactory[]>([]);
  const [payments, setPayments] = useState<TrackerPayment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAllReportsData = async () => {
    setLoading(true);
    try {
      const { data: dbEnquiries } = await supabase.from("tracker_enquiries").select("*").order("created_at", { ascending: false });
      if (dbEnquiries) setEnquiries(dbEnquiries);

      const { data: dbClients } = await supabase.from("tracker_clients").select("*").order("created_at", { ascending: false });
      if (dbClients) setClients(dbClients);

      const { data: dbFactories } = await supabase.from("suppliers").select("*").order("created_at", { ascending: false });
      if (dbFactories) {
        setFactories(dbFactories.map((db: any) => {
          let contactPersonStr = db.owner_details || db.contact_person || "Unknown";
          if (typeof contactPersonStr === "string" && contactPersonStr.startsWith("{")) {
            try {
              const parsed = JSON.parse(contactPersonStr);
              contactPersonStr = parsed.owner || "Unknown";
            } catch (e) {}
          }
          return {
            id: db.id,
            created_at: db.created_at,
            factory_name: db.name || "Unknown",
            category: db.category || "General",
            location: `${db.city || ""}, ${db.region || ""}`.replace(/^, |^,/g, ''),
            contact_person: contactPersonStr,
            email: db.email_id || db.email || "",
            whatsapp: db.contact_no || "",
            lead_time: db.lead_time?.toString() || "30-45 Days",
            quality_rating: parseFloat(db.rating) || 4.5
          };
        }));
      }

      const { data: dbInvoices } = await supabase.from("tracker_invoices").select("*");
      const { data: dbPayments } = await supabase.from("tracker_payments").select("*").order("created_at", { ascending: false });
      if (dbPayments) {
        // Map invoice number and client name in memory
        const mappedPmts = dbPayments.map((pmt: any) => {
          const client = (dbClients || []).find((c: any) => c.id === pmt.client_id);
          const invoice = (dbInvoices || []).find((i: any) => i.id === pmt.invoice_id);
          return {
            ...pmt,
            client_name: client?.company_name || "Unknown Client",
            invoice_number: invoice?.invoice_number || "INV-UNKNOWN"
          };
        });
        setPayments(mappedPmts);
      }
    } catch (err) {
      console.error("Failed to load reports data:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAllReportsData();
  }, []);

  const handleDeleteEnquiry = async (id: string, num: string) => {
    if (window.confirm(`Delete enquiry ${num}?`)) {
      try {
        const { error } = await supabase.from("tracker_enquiries").delete().eq("id", id);
        if (error) throw error;
        loadAllReportsData();
        toast.success(`Enquiry ${num} deleted.`);
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete enquiry");
      }
    }
  };

  const handleDeleteClient = async (id: string, name: string) => {
    if (window.confirm(`Delete client record ${name}?`)) {
      try {
        const { error } = await supabase.from("tracker_clients").delete().eq("id", id);
        if (error) throw error;
        loadAllReportsData();
        toast.success(`Client ${name} deleted.`);
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete client");
      }
    }
  };

  const handleDeleteFactory = async (id: string, name: string) => {
    if (window.confirm(`Delete factory record ${name}?`)) {
      try {
        const { error } = await supabase.from("suppliers").delete().eq("id", id);
        if (error) throw error;
        loadAllReportsData();
        toast.success(`Factory ${name} deleted.`);
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete factory");
      }
    }
  };

  const handleDeletePayment = async (id: string, num?: string) => {
    const label = num || "Payment Record";
    if (window.confirm(`Delete payment record ${label}?`)) {
      try {
        const { error } = await supabase.from("tracker_payments").delete().eq("id", id);
        if (error) throw error;
        loadAllReportsData();
        toast.success(`Payment record for ${label} deleted.`);
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete payment");
      }
    }
  };

  const handleExportCSV = () => {
    let data: any[] = [];
    let filename = `Maisone_Report_${reportType}_${new Date().toISOString().split("T")[0]}.csv`;

    if (reportType === "order") {
      data = enquiries.map(e => ({
        "Enquiry Number": e.enquiry_number,
        "Client": e.client_name,
        "Country": e.country,
        "Product": e.product_reference,
        "Stage Number": e.current_stage,
        "Stage Status": e.current_status,
        "Target Price": `$${e.target_price}`,
        "Assigned Factory": e.factory_name || "N/A",
        "Assigned Agent": e.agent_name || "Direct",
        "Date Created": new Date(e.created_at).toLocaleDateString()
      }));
    } else if (reportType === "client") {
      data = clients.map(c => ({
        "Company Name": c.company_name,
        "Client Name": c.client_name,
        "Country": c.country,
        "Contact Person": c.contact_person,
        "Email": c.email,
        "WhatsApp": c.whatsapp,
        "Payment Terms": c.payment_terms
      }));
    } else if (reportType === "factory") {
      data = factories.map(f => ({
        "Factory Name": f.factory_name,
        "Category": f.category,
        "Location": f.location,
        "Contact Person": f.contact_person,
        "Email": f.email,
        "Lead Time": f.lead_time,
        "Quality Rating": f.quality_rating
      }));
    } else if (reportType === "payment") {
      data = payments.map(p => ({
        "Invoice Number": p.invoice_number,
        "Client": p.client_name,
        "Enquiry": p.enquiry_number,
        "Type": p.payment_type,
        "Amount Due": `$${p.amount_due}`,
        "Amount Received": `$${p.amount_received}`,
        "Outstanding": `$${p.outstanding_balance}`,
        "Due Date": p.due_date,
        "Status": p.status
      }));
    }

    exportToCSV(filename, data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="font-serif text-2xl font-bold">Analytics & Export Reports</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Generate and export custom CSV & Excel reports for orders, clients, factories, and payments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-electric text-background font-bold text-xs shadow-lg hover:brightness-110 transition-all cursor-pointer"
          >
            <Download className="size-4" />
            Export CSV / Excel
          </button>
        </div>
      </div>

      {/* Report Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setReportType("order")}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            reportType === "order" ? "bg-electric/15 border-electric text-electric font-bold" : "bg-card border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <BarChart3 className="size-5 mb-2 text-electric" />
          <h3 className="text-sm font-semibold">Order Reports</h3>
          <p className="text-[11px] opacity-80">{enquiries.length} Enquiries Tracked</p>
        </button>

        <button
          onClick={() => setReportType("client")}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            reportType === "client" ? "bg-electric/15 border-electric text-electric font-bold" : "bg-card border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="size-5 mb-2 text-electric" />
          <h3 className="text-sm font-semibold">Client Reports</h3>
          <p className="text-[11px] opacity-80">{clients.length} Registered Brands</p>
        </button>

        <button
          onClick={() => setReportType("factory")}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            reportType === "factory" ? "bg-electric/15 border-electric text-electric font-bold" : "bg-card border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileSpreadsheet className="size-5 mb-2 text-electric" />
          <h3 className="text-sm font-semibold">Factory Reports</h3>
          <p className="text-[11px] opacity-80">{factories.length} Global Mills</p>
        </button>

        <button
          onClick={() => setReportType("payment")}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            reportType === "payment" ? "bg-electric/15 border-electric text-electric font-bold" : "bg-card border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <Download className="size-5 mb-2 text-electric" />
          <h3 className="text-sm font-semibold">Payment Reports</h3>
          <p className="text-[11px] opacity-80">{payments.length} Financial Records</p>
        </button>
      </div>

      {/* Report Preview Table */}
      <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold capitalize">{reportType} Report Preview</h3>
            <p className="text-xs text-muted-foreground">Click "Export CSV / Excel" above to download on demand.</p>
          </div>
        </div>

        <div className="divide-y divide-border overflow-x-auto rounded-xl border border-border">
          {reportType === "order" && (
            <>
              <div className="p-3 bg-foreground/[0.02] grid grid-cols-12 gap-2 text-[10px] font-bold text-muted-foreground uppercase items-center">
                <div className="col-span-2">Enquiry #</div>
                <div className="col-span-3">Client / Country</div>
                <div className="col-span-2">Product</div>
                <div className="col-span-2">Current Stage</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1 text-center">Action</div>
              </div>
              {enquiries.map(e => (
                <div key={e.id} className="p-3 grid grid-cols-12 gap-2 text-xs items-center">
                  <div className="col-span-2 font-mono font-bold text-electric">{e.enquiry_number}</div>
                  <div className="col-span-3">{e.client_name} ({e.country})</div>
                  <div className="col-span-2 font-medium">{e.product_reference}</div>
                  <div className="col-span-2 text-muted-foreground">Stage #{e.current_stage}</div>
                  <div className="col-span-2 font-semibold text-emerald-400">{e.current_status}</div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      onClick={() => handleDeleteEnquiry(e.id, e.enquiry_number)}
                      title="Delete Record"
                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}

          {reportType === "client" && (
            <>
              <div className="p-3 bg-foreground/[0.02] grid grid-cols-12 gap-2 text-[10px] font-bold text-muted-foreground uppercase items-center">
                <div className="col-span-3">Company Name</div>
                <div className="col-span-3">Contact Person</div>
                <div className="col-span-3">Email</div>
                <div className="col-span-2">Country</div>
                <div className="col-span-1 text-center">Action</div>
              </div>
              {clients.map(c => (
                <div key={c.id} className="p-3 grid grid-cols-12 gap-2 text-xs items-center">
                  <div className="col-span-3 font-bold text-foreground">{c.company_name}</div>
                  <div className="col-span-3">{c.contact_person}</div>
                  <div className="col-span-3 font-mono text-muted-foreground">{c.email}</div>
                  <div className="col-span-2">{c.country}</div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      onClick={() => handleDeleteClient(c.id, c.company_name)}
                      title="Delete Record"
                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}

          {reportType === "factory" && (
            <>
              <div className="p-3 bg-foreground/[0.02] grid grid-cols-12 gap-2 text-[10px] font-bold text-muted-foreground uppercase items-center">
                <div className="col-span-3">Factory Name</div>
                <div className="col-span-3">Category</div>
                <div className="col-span-3">Location</div>
                <div className="col-span-2">Rating / Lead Time</div>
                <div className="col-span-1 text-center">Action</div>
              </div>
              {factories.map(f => (
                <div key={f.id} className="p-3 grid grid-cols-12 gap-2 text-xs items-center">
                  <div className="col-span-3 font-bold text-foreground">{f.factory_name}</div>
                  <div className="col-span-3">{f.category}</div>
                  <div className="col-span-3">{f.location}</div>
                  <div className="col-span-2 text-muted-foreground">{f.quality_rating} ★ ({f.lead_time})</div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      onClick={() => handleDeleteFactory(f.id, f.factory_name)}
                      title="Delete Record"
                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}

          {reportType === "payment" && (
            <>
              <div className="p-3 bg-foreground/[0.02] grid grid-cols-12 gap-2 text-[10px] font-bold text-muted-foreground uppercase items-center">
                <div className="col-span-3">Invoice Number</div>
                <div className="col-span-3">Client</div>
                <div className="col-span-2">Amount Due</div>
                <div className="col-span-2">Received</div>
                <div className="col-span-1 font-bold">Outstanding</div>
                <div className="col-span-1 text-center">Action</div>
              </div>
              {payments.map(p => (
                <div key={p.id} className="p-3 grid grid-cols-12 gap-2 text-xs items-center">
                  <div className="col-span-3 font-mono font-bold text-electric">{p.invoice_number}</div>
                  <div className="col-span-3">{p.client_name}</div>
                  <div className="col-span-2 font-mono">${p.amount_due}</div>
                  <div className="col-span-2 font-mono text-emerald-400">${p.amount_received}</div>
                  <div className="col-span-1 font-mono text-amber-400">${p.outstanding_balance}</div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      onClick={() => handleDeletePayment(p.id, p.invoice_number || "Payment Record")}
                      title="Delete Record"
                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
