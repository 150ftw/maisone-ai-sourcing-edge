import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, Search, Filter, Trash2, Mail, Building2, User, Globe,
  Calendar, MessageSquare, ShieldAlert, Check, RefreshCw,
  ChevronLeft, ChevronRight, X, Layers, Link2, ChevronDown, Briefcase, Clock
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { AdminContext, StatusDropdown, type DemoRequest } from "../admin";
import { useLanguage } from "@/lib/i18n";
import {
  getTrackerEnquiries,
  saveTrackerEnquiries,
  getTrackerClients,
  saveTrackerClients,
  TrackerEnquiry,
  TrackerClient
} from "@/lib/tracker-store";

export const Route = createFileRoute("/admin/inquiries")({
  component: InquiriesPage,
});

function InquiriesPage() {
  const navigate = useNavigate();
  const { session, stats, fetchStats } = useContext(AdminContext);
  const { t } = useLanguage();
  
  // Dashboard States
  const [requests, setRequests] = useState<DemoRequest[]>([]);
  const [reqLoading, setReqLoading] = useState(false);
  const [reqError, setReqError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Pagination States
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 5; // 5 items per page as requested

  // Selected Request Modal State
  const [selectedRequest, setSelectedRequest] = useState<DemoRequest | null>(null);

  const [trackerEnquiries, setTrackerEnquiries] = useState<TrackerEnquiry[]>([]);

  useEffect(() => {
    // Load local enquiries to check for existing transfers
    setTrackerEnquiries(getTrackerEnquiries());
  }, []);

  // Transfer Website Inquiry to Tracker ERP
  const handleTransferToTracker = async (req: DemoRequest) => {
    // Check if already transferred natively
    if (req.erp_enquiry_id) {
      toast.error("This inquiry has already been transferred to ERP.");
      return;
    }

    try {
      // 1. Get or create Client
      let clientId = null;
      let clientName = req.company || req.full_name;
      let country = req.region || "France";

      const { data: existingClient } = await supabase
        .from("tracker_clients")
        .select("id")
        .or(`company_name.ilike.${clientName},email.ilike.${req.work_email}`)
        .maybeSingle();

      if (existingClient) {
        clientId = existingClient.id;
      } else {
        const { data: newClient, error: clientError } = await supabase
          .from("tracker_clients")
          .insert([{
            company_name: clientName,
            client_name: req.full_name,
            country: country,
            contact_person: req.full_name,
            email: req.work_email,
            whatsapp: "+1 555-0192",
            payment_terms: "30% Advance, 70% LC",
            notes: "Created automatically from website inquiry"
          }])
          .select()
          .single();

        if (clientError) throw clientError;
        clientId = newClient.id;
      }

      // 2. Generate Next Enquiry Number
      const { count } = await supabase
        .from("tracker_enquiries")
        .select("*", { count: "exact", head: true });
      const nextNum = `ENQ-2026-${String((count || 0) + 1).padStart(3, "0")}`;

      // 3. Create Enquiry
      const { data: newEnq, error: enqError } = await supabase
        .from("tracker_enquiries")
        .insert([{
          enquiry_number: nextNum,
          client_id: clientId,
          client_name: clientName,
          country: country,
          product_reference: `${req.category || "Apparel"} Sourcing Request`,
          communication_channel: "Website Inquiry",
          enquiry_details: req.message || `Website Inquiry from ${req.full_name} (${req.company})`,
          fabric_details: req.category || "Custom Specification",
          images: ["https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop"],
          target_price: 0,
          current_stage: 1,
          current_status: "New"
        }])
        .select()
        .single();

      if (enqError) throw enqError;

      // 4. Create Stage History
      const stage1Data = {
        date_received: new Date().toISOString().split("T")[0],
        target_price: "0",
        fabric: req.category || "Custom Specification",
        status: "New",
        notes: `Transferred from Website Inquiry #${req.id.slice(0, 8)}`
      };

      await supabase
        .from("tracker_enquiry_stages")
        .insert([{
          enquiry_id: newEnq.id,
          stage_number: 1,
          stage_name: "Enquiry Received",
          status: "New",
          stage_data: stage1Data,
          notes: `Transfer from public website inquiry`,
          updated_by: "System Admin"
        }]);

      // 5. Update demo_requests with erp_enquiry_id
      const { error: updateError } = await supabase
        .from("demo_requests")
        .update({ erp_enquiry_id: newEnq.id })
        .eq("id", req.id);

      if (updateError) throw updateError;

      // Update local UI state
      setRequests(prev => prev.map(r => r.id === req.id ? { ...r, erp_enquiry_id: newEnq.id } : r));
      if (selectedRequest?.id === req.id) {
        setSelectedRequest(prev => prev ? { ...prev, erp_enquiry_id: newEnq.id } : null);
      }

      toast.success(`Transferred to Tracker Sourcing Enquiry #${nextNum}! Redirecting...`);
      navigate({ to: "/admin/tracker/enquiries" });
    } catch (err: any) {
      console.error("Transfer failed:", err);
      toast.error("Failed to transfer inquiry: " + (err.message || "Unknown error"));
    }

  };

  // Fetch Requests (handles server-side filtering, searching, and pagination)
  const fetchRequests = async () => {
    if (!session) return;
    setReqLoading(true);
    setReqError(null);
    try {
      let query = supabase
        .from("demo_requests")
        .select("*", { count: "exact" });

      // Apply server-side status filter
      if (statusFilter !== "All") {
        query = query.eq("status", statusFilter);
      }

      // Apply server-side search filter
      if (search.trim()) {
        query = query.or(
          `full_name.ilike.%${search.trim()}%,company.ilike.%${search.trim()}%,work_email.ilike.%${search.trim()}%,role.ilike.%${search.trim()}%`
        );
      }

      // Pagination calculation
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      query = query
        .range(from, to)
        .order("created_at", { ascending: false });

      const { data, count, error } = await query;

      if (error) throw error;
      setRequests(data || []);
      setTotalCount(count || 0);
    } catch (err: any) {
      console.error("Failed to fetch requests:", err);
      setReqError(err.message || "Failed to retrieve inquiries.");
    } finally {
      setReqLoading(false);
    }
  };

  // Re-fetch triggers
  useEffect(() => {
    if (session) {
      fetchRequests();
      fetchStats();
    }
  }, [session, page]);

  // Debounced search & status filter triggers (resetting to page 1)
  useEffect(() => {
    if (!session) return;
    const delayDebounceFn = setTimeout(() => {
      setPage(1);
      fetchRequests();
    }, 400); // 400ms debounce
    return () => clearTimeout(delayDebounceFn);
  }, [search, statusFilter]);

  const updateRequestStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("demo_requests")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      
      // Update local state
      setRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));
      if (selectedRequest?.id === id) {
        setSelectedRequest(prev => prev ? { ...prev, status } : null);
      }
      fetchStats();
    } catch (err: any) {
      console.error("Failed to update status:", err);
      alert("Error updating status: " + err.message);
    }
  };

  const deleteRequest = async (id: string) => {
    if (!confirm("Are you sure you want to delete this request permanently?")) return;
    
    try {
      const { error } = await supabase
        .from("demo_requests")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      // Remove from state
      setRequests(prev => prev.filter(req => req.id !== id));
      setSelectedRequest(null);
      // Re-fetch to keep correct count and pagination values
      fetchRequests();
      fetchStats();
    } catch (err: any) {
      console.error("Failed to delete request:", err);
      alert("Error deleting request: " + err.message);
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  if (!session) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl tracking-tight">{t("admin.inquiriesTitle")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("admin.inquiriesDesc")}</p>
        </div>
        <button 
          onClick={fetchRequests}
          disabled={reqLoading}
          className="p-2.5 rounded-full border border-foreground/10 hover:bg-foreground/5 disabled:opacity-50 transition-colors cursor-pointer shrink-0 mt-1"
          title="Refresh Data"
        >
          <RefreshCw className={`size-4 ${reqLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Analytics Summary KPI Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="glass-strong rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-foreground/5 bg-foreground/[0.01]">
          <div className="flex items-center justify-between text-muted-foreground mb-1.5 sm:mb-2">
            <span className="text-[8px] sm:text-[10px] uppercase tracking-widest text-muted-foreground font-semibold line-clamp-1">Total Leads</span>
            <Layers className="size-3.5 sm:size-4 text-electric shrink-0" />
          </div>
          <div className="text-lg sm:text-3xl font-sans font-semibold tabular-nums">{stats.total}</div>
          <p className="text-[9px] text-muted-foreground mt-1 hidden sm:block">All-time submissions</p>
        </div>
        <div className="glass-strong rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-foreground/5 bg-foreground/[0.01]">
          <div className="flex items-center justify-between text-muted-foreground mb-1.5 sm:mb-2">
            <span className="text-[8px] sm:text-[10px] uppercase tracking-widest text-muted-foreground font-semibold line-clamp-1">Pending Review</span>
            <ShieldAlert className="size-3.5 sm:size-4 text-amber-800 dark:text-amber-400 shrink-0" />
          </div>
          <div className="text-lg sm:text-3xl font-sans font-semibold tabular-nums text-amber-800 dark:text-amber-400">{stats.pending}</div>
          <p className="text-[9px] text-muted-foreground mt-1 hidden sm:block">Requires qualification</p>
        </div>
        <div className="glass-strong rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-foreground/5 bg-foreground/[0.01]">
          <div className="flex items-center justify-between text-muted-foreground mb-1.5 sm:mb-2">
            <span className="text-[8px] sm:text-[10px] uppercase tracking-widest text-muted-foreground font-semibold line-clamp-1">Qualified Leads</span>
            <Check className="size-3.5 sm:size-4 text-emerald-800 dark:text-emerald-400 shrink-0" />
          </div>
          <div className="text-lg sm:text-3xl font-sans font-semibold tabular-nums text-emerald-800 dark:text-emerald-400">{stats.completed + stats.contacted}</div>
          <p className="text-[9px] text-muted-foreground mt-1 hidden sm:block">Contacted or Completed</p>
        </div>
      </div>

      {/* Controls bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-foreground/[0.02] border border-foreground/5 p-4 rounded-2xl">
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, company, email..."
            className="w-full rounded-xl bg-foreground/[0.03] border border-foreground/10 pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-electric text-foreground"
          />
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setFilterOpen(!filterOpen)}
            className="w-full rounded-xl bg-foreground/[0.03] border border-foreground/10 pl-11 pr-4 py-2.5 text-sm text-left focus:outline-none focus:ring-1 focus:ring-electric cursor-pointer text-foreground flex items-center justify-between min-w-[160px]"
          >
            <span className="flex items-center gap-2">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              {statusFilter === "All" ? "All Statuses" : statusFilter}
            </span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </button>
          
          {filterOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setFilterOpen(false)} />
              <div className="absolute right-0 left-0 mt-2 z-50 glass-strong border border-foreground/10 rounded-2xl shadow-xl py-1.5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 bg-background/95">
                {["All", "Pending", "Contacted", "Completed", "Archived"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setStatusFilter(opt);
                      setFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs transition-colors hover:bg-foreground/5 cursor-pointer block ${
                      statusFilter === opt ? "text-electric font-semibold bg-electric/5" : "text-foreground/80"
                    }`}
                  >
                    {opt === "All" ? "All Statuses" : opt}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Metrics */}
        <div className="flex items-center justify-end px-2 text-xs text-muted-foreground">
          {t("admin.showing")} <span className="font-semibold text-foreground mx-1">{requests.length}</span> {t("admin.of")} {totalCount} {t("admin.total")}
        </div>
      </div>

      {/* Request Listing */}
      {reqError && (
        <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-6 text-red-400 flex flex-col items-center justify-center text-center">
          <ShieldAlert className="size-10 mb-3" />
          <h3 className="font-semibold text-lg mb-1">Database Error</h3>
          <p className="text-sm text-red-400/80 max-w-md">{reqError}</p>
        </div>
      )}

      {reqLoading && requests.length === 0 ? (
        /* Shimmer Skeleton Loader Rows */
        <div className="overflow-x-auto rounded-3xl border border-foreground/5 glass">
          <table className="w-full border-collapse text-left text-sm min-w-[950px]">
            <thead>
              <tr className="border-b border-foreground/5 bg-foreground/[0.01] text-[10px] uppercase tracking-widest text-muted-foreground">
                <th className="px-4 py-4 w-[20%]">{t("admin.inquiryBrand")}</th>
                <th className="px-4 py-4 w-[25%]">{t("admin.inquiryContact")}</th>
                <th className="px-4 py-4 w-[20%]">{t("admin.inquiryProfile")}</th>
                <th className="px-4 py-4 w-[20%]">{t("admin.inquiryMessage")}</th>
                <th className="px-4 py-4 w-[10%]">{t("admin.inquiryStatus")}</th>
                <th className="px-4 py-4 w-[5%] text-right">{t("admin.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[1, 2, 3].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-4 align-top">
                    <div className="h-4 bg-foreground/5 rounded w-28 mb-2" />
                    <div className="h-3 bg-foreground/5 rounded w-20" />
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="h-4 bg-foreground/5 rounded w-32 mb-2" />
                    <div className="h-3 bg-foreground/5 rounded w-40" />
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex gap-2 mb-2">
                      <div className="h-4 bg-foreground/5 rounded-full w-12" />
                      <div className="h-4 bg-foreground/5 rounded-full w-16" />
                    </div>
                    <div className="h-3 bg-foreground/5 rounded w-24" />
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="h-10 bg-foreground/5 rounded-xl w-full" />
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="h-6 bg-foreground/5 rounded-full w-20" />
                  </td>
                  <td className="px-4 py-4 align-top text-right">
                    <div className="h-8 bg-foreground/5 rounded-full w-8 ml-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : requests.length === 0 ? (
        <div className="glass rounded-3xl py-20 text-center border border-foreground/5">
          <p className="text-muted-foreground">No inquiries found matching criteria.</p>
        </div>
      ) : (
        <>
          {/* Mobile Card List */}
          <div className="md:hidden space-y-4">
            {requests.map((req) => (
              <div key={req.id} className="glass rounded-2xl p-4 border border-foreground/5 space-y-3 shadow-sm bg-card">
                <div className="flex items-start justify-between gap-3 border-b border-foreground/5 pb-3">
                  <div>
                    <h3 className="font-bold text-foreground text-sm">{req.company}</h3>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      <Building2 className="size-3 shrink-0" />
                      <span>{req.company_size} • {req.region}</span>
                    </p>
                  </div>
                  <StatusDropdown
                    currentStatus={req.status}
                    onChange={(status) => updateRequestStatus(req.id, status)}
                  />
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <User className="size-3.5 text-muted-foreground shrink-0" />
                    <span className="font-medium text-foreground">{req.full_name}</span>
                    <span className="text-muted-foreground text-[10px]">({req.role})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="size-3.5 text-muted-foreground shrink-0" />
                    <a href={`mailto:${req.work_email}`} className="text-electric hover:underline">{req.work_email}</a>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-foreground/5 text-foreground/80 border border-foreground/5">{req.category}</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-foreground/5 text-foreground/80 border border-foreground/5">{req.monthly_volume}</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-foreground/5 text-foreground/80 border border-foreground/5">{req.timeline}</span>
                </div>

                {/* Message */}
                <div className="bg-foreground/[0.02] p-2.5 rounded-xl border border-foreground/5">
                  {(() => {
                    if (req.message && req.message.startsWith("{")) {
                      try {
                        const parsed = JSON.parse(req.message);
                        if (parsed.isExistingClient) {
                          return (
                            <div className="space-y-1">
                              <div className="font-bold text-cyan-800 dark:text-[#00f2fe] text-[9px] uppercase tracking-wider">Client PO: {parsed.poNumber}</div>
                              <div className="text-[11px] text-foreground/90">
                                Samples: {parsed.samplesRequired} • Delivery: {parsed.deliveryDate}
                              </div>
                              <div className="text-[11px] text-muted-foreground/80 italic">{parsed.requestDescription}</div>
                            </div>
                          );
                        }
                      } catch(e) {}
                    }
                    return req.message ? (
                      <p className="text-[11px] text-muted-foreground break-words whitespace-pre-line line-clamp-3">
                        {req.message}
                      </p>
                    ) : (
                      <p className="text-[11px] text-muted-foreground/50 italic">No message provided</p>
                    );
                  })()}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-foreground/5">
                  <span className="text-[9px] text-muted-foreground/60">
                    Received: {new Date(req.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <button 
                      type="button"
                      onClick={() => setSelectedRequest(req)}
                      className="text-xs text-electric hover:underline font-semibold px-2 py-1 cursor-pointer"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => deleteRequest(req.id)}
                      className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-500/10 rounded-full transition-colors cursor-pointer"
                      title="Delete request"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto rounded-3xl border border-foreground/5 glass min-h-[300px]">
            <table className="w-full border-collapse text-left text-sm min-w-[950px]">
              <thead>
                <tr className="border-b border-foreground/5 bg-foreground/[0.01] text-[10px] uppercase tracking-widest text-muted-foreground">
                  <th className="px-4 py-4 w-[20%]">{t("admin.inquiryBrand")}</th>
                  <th className="px-4 py-4 w-[25%]">{t("admin.inquiryContact")}</th>
                  <th className="px-4 py-4 w-[20%]">{t("admin.inquiryProfile")}</th>
                  <th className="px-4 py-4 w-[20%]">{t("admin.inquiryMessage")}</th>
                  <th className="px-4 py-4 w-[10%]">{t("admin.inquiryStatus")}</th>
                  <th className="px-4 py-4 w-[5%] text-right">{t("admin.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-foreground/[0.01] transition-colors group">
                    {/* Company / Role */}
                    <td className="px-4 py-4 align-top">
                      <div className="font-semibold text-foreground text-sm whitespace-nowrap">{req.company}</div>
                      <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1.5 whitespace-nowrap">
                        <Building2 className="size-3 shrink-0" />
                        <span>{req.company_size} • {req.region}</span>
                      </div>
                    </td>

                    {/* Contact Details */}
                    <td className="px-4 py-4 align-top">
                      <div className="font-medium text-foreground text-xs flex items-center gap-1.5 whitespace-nowrap">
                        <User className="size-3.5 text-muted-foreground shrink-0" />
                        {req.full_name}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1.5 whitespace-nowrap">
                        <Mail className="size-3.5 text-muted-foreground shrink-0" />
                        <a href={`mailto:${req.work_email}`} className="hover:underline hover:text-foreground transition-colors">{req.work_email}</a>
                      </div>
                      <div className="text-[10px] text-muted-foreground/50 mt-1 flex items-center gap-1 whitespace-nowrap">
                        <span>Role: {req.role}</span>
                      </div>
                    </td>

                    {/* Sourcing Profile */}
                    <td className="px-4 py-4 align-top min-w-[200px]">
                      <div className="flex flex-wrap gap-1.5 max-w-xs">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-foreground/5 text-foreground/90 border border-foreground/5 whitespace-nowrap">{req.category}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-foreground/5 text-foreground/90 border border-foreground/5 whitespace-nowrap">{req.monthly_volume}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-foreground/5 text-foreground/90 border border-foreground/5 whitespace-nowrap">{req.timeline}</span>
                      </div>
                      <div className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mt-2.5 whitespace-nowrap">
                        Received: {new Date(req.created_at).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Message Clamping & Modal Trigger */}
                    <td className="px-4 py-4 align-top max-w-xs">
                      <div className="space-y-1">
                        {(() => {
                          if (req.message && req.message.startsWith("{")) {
                            try {
                              const parsed = JSON.parse(req.message);
                              if (parsed.isExistingClient) {
                                return (
                                  <div className="text-xs text-muted-foreground bg-foreground/[0.03] p-2.5 rounded-xl border border-foreground/5 space-y-1.5 break-words">
                                    <div className="font-bold text-cyan-800 dark:text-[#00f2fe] text-[10px] tracking-wide uppercase">Client PO: {parsed.poNumber}</div>
                                    <div className="text-[11px] text-foreground/90">
                                      Samples: <span className="text-foreground font-semibold">{parsed.samplesRequired}</span> • Delivery: <span className="text-foreground font-semibold">{parsed.deliveryDate}</span>
                                    </div>
                                    <div className="text-[11px] text-muted-foreground/80 line-clamp-2 italic">{parsed.requestDescription}</div>
                                  </div>
                                );
                              }
                            } catch(e) {}
                          }
                          return req.message ? (
                            <p className="text-xs text-muted-foreground line-clamp-3 whitespace-pre-line bg-foreground/[0.03] p-2.5 rounded-xl border border-foreground/5 break-all">
                              {req.message}
                            </p>
                          ) : (
                            <p className="text-xs text-muted-foreground/50 italic p-2 bg-foreground/[0.02] border border-foreground/5 rounded-xl">
                              No message provided
                            </p>
                          );
                        })()}
                        <button 
                          type="button"
                          onClick={() => setSelectedRequest(req)}
                          className="text-[10px] text-electric hover:underline font-medium cursor-pointer block mt-1"
                        >
                          View Details
                        </button>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4 align-top">
                      {req.erp_enquiry_id ? (
                        <div className="inline-flex px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] items-center gap-1" title="Managed in Tracker ERP">
                          <Check className="size-3" />
                          <span>Transferred</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleTransferToTracker(req)}
                          className="px-2.5 py-1 rounded-lg bg-electric/15 text-electric hover:bg-electric hover:text-background font-semibold text-[11px] transition-all cursor-pointer inline-flex items-center gap-1"
                          title="Transfer to Sourcing Enquiry Tracker"
                        >
                          <Briefcase className="size-3" />
                          <span>Transfer to ERP</span>
                        </button>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 align-top text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => deleteRequest(req.id)}
                          className="p-1.5 text-muted-foreground hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors cursor-pointer"
                          title="Delete request"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 border-t border-foreground/5 pt-6 text-sm">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-foreground/10 bg-foreground/[0.02] text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ChevronLeft className="size-4" /> {t("admin.previous")}
              </button>
              
              <div className="text-xs text-muted-foreground">
                Page <span className="text-foreground font-semibold">{page}</span> of {totalPages}
              </div>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-foreground/10 bg-foreground/[0.02] text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                {t("admin.next")} <ChevronRight className="size-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Detailed Modal Overlay */}
      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Blur backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRequest(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 glass-strong border border-foreground/10 rounded-3xl max-w-xl w-full p-5 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedRequest(null)}
                className="absolute right-6 top-6 p-2 rounded-full hover:bg-foreground/5 border border-foreground/5 transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>

              {/* Content */}
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] tracking-[0.2em] bg-electric/15 text-electric px-2.5 py-0.5 rounded-full uppercase font-medium">Inquiry Details</span>
                  <h2 className="font-serif text-3xl mt-3 text-foreground">{selectedRequest.company}</h2>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                    <Globe className="size-3.5 text-muted-foreground" />
                    {selectedRequest.region} • {selectedRequest.company_size} employees
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-b border-foreground/5 py-4">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground block">Contact Name</span>
                    <span className="text-sm font-medium text-foreground mt-1 block flex items-center gap-1.5">
                      <User className="size-3.5 text-muted-foreground" />
                      {selectedRequest.full_name}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground block">Role</span>
                    <span className="text-sm font-medium text-foreground mt-1 block">{selectedRequest.role}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground block">Email</span>
                    <a href={`mailto:${selectedRequest.work_email}`} className="text-sm font-medium text-electric hover:underline mt-1 block flex items-center gap-1.5">
                      <Mail className="size-3.5" />
                      {selectedRequest.work_email}
                    </a>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground block">Received Date</span>
                    <span className="text-sm font-medium text-foreground mt-1 block flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-muted-foreground" />
                      {new Date(selectedRequest.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                {(() => {
                  let parsedMsg: any = null;
                  let isExisting = false;
                  if (selectedRequest.message && selectedRequest.message.startsWith("{")) {
                    try {
                      parsedMsg = JSON.parse(selectedRequest.message);
                      isExisting = !!parsedMsg.isExistingClient;
                    } catch (e) {}
                  }

                  if (isExisting) {
                    return (
                      <>
                        <div>
                          <span className="text-[10px] tracking-[0.2em] bg-cyan-500/10 dark:bg-[#00f2fe]/10 text-cyan-800 dark:text-[#00f2fe] border border-cyan-500/20 dark:border-[#00f2fe]/20 px-2.5 py-0.5 rounded-full uppercase font-medium">Existing Client PO Request</span>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="px-3.5 py-2 rounded-xl bg-foreground/[0.03] border border-foreground/5 text-xs text-foreground/90">
                            <span className="text-[9px] text-muted-foreground block uppercase">PO Number</span>
                            <span className="font-semibold mt-0.5 block text-foreground">{parsedMsg.poNumber || "—"}</span>
                          </div>
                          <div className="px-3.5 py-2 rounded-xl bg-foreground/[0.03] border border-foreground/5 text-xs text-foreground/90">
                            <span className="text-[9px] text-muted-foreground block uppercase">Samples Req.</span>
                            <span className="font-semibold mt-0.5 block text-foreground">{parsedMsg.samplesRequired || 0}</span>
                          </div>
                          <div className="px-3.5 py-2 rounded-xl bg-foreground/[0.03] border border-foreground/5 text-xs text-foreground/90">
                            <span className="text-[9px] text-muted-foreground block uppercase">Delivery Date</span>
                            <span className="font-semibold mt-0.5 block text-foreground">{parsedMsg.deliveryDate || "—"}</span>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">Request Description</h4>
                          <p className="text-sm text-muted-foreground/90 bg-foreground/[0.04] border border-foreground/5 p-4 rounded-2xl whitespace-pre-line leading-relaxed">
                            {parsedMsg.requestDescription || "—"}
                          </p>
                        </div>

                        {parsedMsg.otherSpecifications && (
                          <div>
                            <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">Other Specifications</h4>
                            <p className="text-sm text-muted-foreground/90 bg-foreground/[0.04] border border-foreground/5 p-4 rounded-2xl whitespace-pre-line leading-relaxed">
                              {parsedMsg.otherSpecifications}
                            </p>
                          </div>
                        )}

                        {parsedMsg.file && (
                          <div className="px-3.5 py-3 rounded-xl bg-electric/5 border border-electric/15 text-xs flex items-center justify-between">
                            <div className="space-y-0.5">
                              <span className="text-[9px] text-muted-foreground block uppercase">Uploaded Document</span>
                              <span className="text-foreground font-medium">{parsedMsg.file.name}</span>
                            </div>
                            <a
                              href={parsedMsg.file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-1.5 rounded-lg bg-electric text-background font-semibold hover:scale-102 transition-transform cursor-pointer text-xs"
                            >
                              Download Tech Pack
                            </a>
                          </div>
                        )}
                      </>
                    );
                  }

                  return (
                    <>
                      <div>
                        <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2.5">Sourcing Profile</h4>
                        <div className="flex flex-wrap gap-2">
                          <div className="px-3.5 py-2 rounded-xl bg-foreground/[0.03] border border-foreground/5 text-xs text-foreground/90">
                            <span className="text-[9px] text-muted-foreground block uppercase">Category</span>
                            <span className="font-semibold mt-0.5 block text-foreground">{selectedRequest.category}</span>
                          </div>
                          <div className="px-3.5 py-2 rounded-xl bg-foreground/[0.03] border border-foreground/5 text-xs text-foreground/90">
                            <span className="text-[9px] text-muted-foreground block uppercase">Volume</span>
                            <span className="font-semibold mt-0.5 block text-foreground">{selectedRequest.monthly_volume}</span>
                          </div>
                          <div className="px-3.5 py-2 rounded-xl bg-foreground/[0.03] border border-foreground/5 text-xs text-foreground/90">
                            <span className="text-[9px] text-muted-foreground block uppercase">Timeline</span>
                            <span className="font-semibold mt-0.5 block text-foreground">{selectedRequest.timeline}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
                          <MessageSquare className="size-3.5" />
                          Client Message
                        </h4>
                        <p className="text-sm text-muted-foreground/90 bg-foreground/[0.04] border border-foreground/5 p-4 rounded-2xl whitespace-pre-line leading-relaxed">
                          {selectedRequest.message || "No additional message was provided."}
                        </p>
                      </div>
                    </>
                  );
                })()}

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-foreground/5 pt-5">
                  <div className="flex items-center justify-between sm:justify-start gap-3">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Status:</span>
                    <StatusDropdown
                      currentStatus={selectedRequest.status}
                      onChange={(status) => updateRequestStatus(selectedRequest.id, status)}
                    />
                  </div>

                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
                        const url = `${baseUrl}/book-demo?name=${encodeURIComponent(selectedRequest.full_name)}&email=${encodeURIComponent(selectedRequest.work_email)}&company=${encodeURIComponent(selectedRequest.company)}&role=${encodeURIComponent(selectedRequest.role || "")}&companySize=${encodeURIComponent(selectedRequest.company_size || "")}&region=${encodeURIComponent(selectedRequest.region || "")}`;
                        navigator.clipboard.writeText(url);
                        toast.success("Client inquiry link copied!");
                      }}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 text-xs font-semibold rounded-xl border border-foreground/10 hover:border-electric/50 hover:bg-electric/5 text-foreground transition-all cursor-pointer whitespace-nowrap"
                    >
                      <Link2 className="size-3.5" /> Share Form
                    </button>

                    <button
                      onClick={() => deleteRequest(selectedRequest.id)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 text-xs font-semibold rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Trash2 className="size-3.5" /> Delete Request
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
