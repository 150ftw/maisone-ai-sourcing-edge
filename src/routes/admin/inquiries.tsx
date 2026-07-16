import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, Search, Filter, Trash2, Mail, Building2, User, Globe,
  Calendar, MessageSquare, ShieldAlert, Check, RefreshCw,
  ChevronLeft, ChevronRight, X, Layers, Link2
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { AdminContext, StatusDropdown, type DemoRequest } from "../admin";

export const Route = createFileRoute("/admin/inquiries")({
  component: InquiriesPage,
});

function InquiriesPage() {
  const { session, stats, fetchStats } = useContext(AdminContext);
  
  // Dashboard States
  const [requests, setRequests] = useState<DemoRequest[]>([]);
  const [reqLoading, setReqLoading] = useState(false);
  const [reqError, setReqError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  // Pagination States
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 5; // 5 items per page as requested

  // Selected Request Modal State
  const [selectedRequest, setSelectedRequest] = useState<DemoRequest | null>(null);

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl tracking-tight">Inquiries</h1>
          <p className="text-sm text-muted-foreground mt-1">Review, qualify, and update status of brand requests.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchRequests}
            disabled={reqLoading}
            className="p-2.5 rounded-full border border-white/10 hover:bg-white/5 disabled:opacity-50 transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`size-4 ${reqLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Analytics Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-strong rounded-2xl p-5 border border-white/5 bg-white/[0.01]">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60">Total Leads</span>
            <Layers className="size-4 text-electric" />
          </div>
          <div className="text-3xl font-serif">{stats.total}</div>
          <p className="text-[10px] text-muted-foreground/60 mt-1">All-time submissions</p>
        </div>
        <div className="glass-strong rounded-2xl p-5 border border-white/5 bg-white/[0.01]">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60">Pending Review</span>
            <ShieldAlert className="size-4 text-amber-400" />
          </div>
          <div className="text-3xl font-serif text-amber-400">{stats.pending}</div>
          <p className="text-[10px] text-muted-foreground/60 mt-1">Requires qualification</p>
        </div>
        <div className="glass-strong rounded-2xl p-5 border border-white/5 bg-white/[0.01]">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60">Qualified Leads</span>
            <Check className="size-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-serif text-emerald-400">{stats.completed + stats.contacted}</div>
          <p className="text-[10px] text-muted-foreground/60 mt-1">Contacted or Completed</p>
        </div>
      </div>

      {/* Controls bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, company, email..."
            className="w-full rounded-xl bg-black/30 border border-white/10 pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-electric text-white"
          />
        </div>

        {/* Filter */}
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full rounded-xl bg-[#07070a] border border-white/10 pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-electric appearance-none cursor-pointer text-white"
          >
            <option value="All" className="bg-[#0f0f12]">All Statuses</option>
            <option value="Pending" className="bg-[#0f0f12]">Pending</option>
            <option value="Contacted" className="bg-[#0f0f12]">Contacted</option>
            <option value="Completed" className="bg-[#0f0f12]">Completed</option>
            <option value="Archived" className="bg-[#0f0f12]">Archived</option>
          </select>
        </div>

        {/* Metrics */}
        <div className="flex items-center justify-end px-2 text-xs text-muted-foreground">
          Showing <span className="font-semibold text-white mx-1">{requests.length}</span> of {totalCount} total inquiries
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
        <div className="overflow-x-auto rounded-3xl border border-white/5 glass">
          <table className="w-full border-collapse text-left text-sm min-w-[950px]">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] uppercase tracking-widest text-muted-foreground">
                <th className="px-4 py-4 w-[20%]">Brand / Company</th>
                <th className="px-4 py-4 w-[25%]">Contact</th>
                <th className="px-4 py-4 w-[20%]">Sourcing Profile</th>
                <th className="px-4 py-4 w-[20%]">Message</th>
                <th className="px-4 py-4 w-[10%]">Status</th>
                <th className="px-4 py-4 w-[5%] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[1, 2, 3].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-4 align-top">
                    <div className="h-4 bg-white/5 rounded w-28 mb-2" />
                    <div className="h-3 bg-white/5 rounded w-20" />
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="h-4 bg-white/5 rounded w-32 mb-2" />
                    <div className="h-3 bg-white/5 rounded w-40" />
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex gap-2 mb-2">
                      <div className="h-4 bg-white/5 rounded-full w-12" />
                      <div className="h-4 bg-white/5 rounded-full w-16" />
                    </div>
                    <div className="h-3 bg-white/5 rounded w-24" />
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="h-10 bg-white/5 rounded-xl w-full" />
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="h-6 bg-white/5 rounded-full w-20" />
                  </td>
                  <td className="px-4 py-4 align-top text-right">
                    <div className="h-8 bg-white/5 rounded-full w-8 ml-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : requests.length === 0 ? (
        <div className="glass rounded-3xl py-20 text-center border border-white/5">
          <p className="text-muted-foreground">No inquiries found matching criteria.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-3xl border border-white/5 glass min-h-[300px]">
            <table className="w-full border-collapse text-left text-sm min-w-[950px]">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] uppercase tracking-widest text-muted-foreground">
                  <th className="px-4 py-4 w-[20%]">Brand / Company</th>
                  <th className="px-4 py-4 w-[25%]">Contact</th>
                  <th className="px-4 py-4 w-[20%]">Sourcing Profile</th>
                  <th className="px-4 py-4 w-[20%]">Message</th>
                  <th className="px-4 py-4 w-[10%]">Status</th>
                  <th className="px-4 py-4 w-[5%] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-white/[0.01] transition-colors group">
                    {/* Company / Role */}
                    <td className="px-4 py-4 align-top">
                      <div className="font-semibold text-white text-sm whitespace-nowrap">{req.company}</div>
                      <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1.5 whitespace-nowrap">
                        <Building2 className="size-3 shrink-0" />
                        <span>{req.company_size} • {req.region}</span>
                      </div>
                    </td>

                    {/* Contact Details */}
                    <td className="px-4 py-4 align-top">
                      <div className="font-medium text-white text-xs flex items-center gap-1.5 whitespace-nowrap">
                        <User className="size-3.5 text-muted-foreground shrink-0" />
                        {req.full_name}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1.5 whitespace-nowrap">
                        <Mail className="size-3.5 text-muted-foreground shrink-0" />
                        <a href={`mailto:${req.work_email}`} className="hover:underline hover:text-white transition-colors">{req.work_email}</a>
                      </div>
                      <div className="text-[10px] text-muted-foreground/50 mt-1 flex items-center gap-1 whitespace-nowrap">
                        <span>Role: {req.role}</span>
                      </div>
                    </td>

                    {/* Sourcing Profile */}
                    <td className="px-4 py-4 align-top min-w-[200px]">
                      <div className="flex flex-wrap gap-1.5 max-w-xs">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/90 border border-white/5 whitespace-nowrap">{req.category}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/90 border border-white/5 whitespace-nowrap">{req.monthly_volume}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/90 border border-white/5 whitespace-nowrap">{req.timeline}</span>
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
                                  <div className="text-xs text-muted-foreground bg-black/20 p-2.5 rounded-xl border border-white/5 space-y-1.5 break-words">
                                    <div className="font-bold text-[#00f2fe] text-[10px] tracking-wide uppercase">Client PO: {parsed.poNumber}</div>
                                    <div className="text-[11px] text-white/90">
                                      Samples: <span className="text-white font-semibold">{parsed.samplesRequired}</span> • Delivery: <span className="text-white font-semibold">{parsed.deliveryDate}</span>
                                    </div>
                                    <div className="text-[11px] text-muted-foreground/80 line-clamp-2 italic">{parsed.requestDescription}</div>
                                  </div>
                                );
                              }
                            } catch(e) {}
                          }
                          return req.message ? (
                            <p className="text-xs text-muted-foreground line-clamp-3 whitespace-pre-line bg-black/20 p-2.5 rounded-xl border border-white/5 break-all">
                              {req.message}
                            </p>
                          ) : (
                            <p className="text-xs text-muted-foreground/50 italic p-2 bg-white/[0.02] border border-white/5 rounded-xl">
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

                    {/* Status Dropdown */}
                    <td className="px-4 py-4 align-top">
                      <StatusDropdown
                        currentStatus={req.status}
                        onChange={(status) => updateRequestStatus(req.id, status)}
                      />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 align-top text-right">
                      <button
                        onClick={() => deleteRequest(req.id)}
                        className="p-2 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                        title="Delete request"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 border-t border-white/5 pt-6 text-sm">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/[0.02] text-muted-foreground hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ChevronLeft className="size-4" /> Previous
              </button>
              
              <div className="text-xs text-muted-foreground">
                Page <span className="text-white font-semibold">{page}</span> of {totalPages}
              </div>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/[0.02] text-muted-foreground hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                Next <ChevronRight className="size-4" />
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
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 glass-strong border border-white/10 rounded-3xl max-w-xl w-full p-8 max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedRequest(null)}
                className="absolute right-6 top-6 p-2 rounded-full hover:bg-white/5 border border-white/5 transition-colors cursor-pointer text-muted-foreground hover:text-white"
              >
                <X className="size-4" />
              </button>

              {/* Content */}
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] tracking-[0.2em] bg-electric/15 text-electric px-2.5 py-0.5 rounded-full uppercase font-medium">Inquiry Details</span>
                  <h2 className="font-serif text-3xl mt-3 text-white">{selectedRequest.company}</h2>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                    <Globe className="size-3.5 text-muted-foreground" />
                    {selectedRequest.region} • {selectedRequest.company_size} employees
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-b border-white/5 py-4">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground block">Contact Name</span>
                    <span className="text-sm font-medium text-white mt-1 block flex items-center gap-1.5">
                      <User className="size-3.5 text-muted-foreground" />
                      {selectedRequest.full_name}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground block">Role</span>
                    <span className="text-sm font-medium text-white mt-1 block">{selectedRequest.role}</span>
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
                    <span className="text-sm font-medium text-white mt-1 block flex items-center gap-1.5">
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
                          <span className="text-[10px] tracking-[0.2em] bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/20 px-2.5 py-0.5 rounded-full uppercase font-medium">Existing Client PO Request</span>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-foreground/90">
                            <span className="text-[9px] text-muted-foreground block uppercase">PO Number</span>
                            <span className="font-semibold mt-0.5 block text-white">{parsedMsg.poNumber || "—"}</span>
                          </div>
                          <div className="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-foreground/90">
                            <span className="text-[9px] text-muted-foreground block uppercase">Samples Req.</span>
                            <span className="font-semibold mt-0.5 block text-white">{parsedMsg.samplesRequired || 0}</span>
                          </div>
                          <div className="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-foreground/90">
                            <span className="text-[9px] text-muted-foreground block uppercase">Delivery Date</span>
                            <span className="font-semibold mt-0.5 block text-white">{parsedMsg.deliveryDate || "—"}</span>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">Request Description</h4>
                          <p className="text-sm text-muted-foreground/90 bg-black/40 border border-white/5 p-4 rounded-2xl whitespace-pre-line leading-relaxed">
                            {parsedMsg.requestDescription || "—"}
                          </p>
                        </div>

                        {parsedMsg.otherSpecifications && (
                          <div>
                            <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">Other Specifications</h4>
                            <p className="text-sm text-muted-foreground/90 bg-black/40 border border-white/5 p-4 rounded-2xl whitespace-pre-line leading-relaxed">
                              {parsedMsg.otherSpecifications}
                            </p>
                          </div>
                        )}

                        {parsedMsg.file && (
                          <div className="px-3.5 py-3 rounded-xl bg-electric/5 border border-electric/15 text-xs flex items-center justify-between">
                            <div className="space-y-0.5">
                              <span className="text-[9px] text-muted-foreground block uppercase">Uploaded Document</span>
                              <span className="text-white font-medium">{parsedMsg.file.name}</span>
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
                          <div className="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-foreground/90">
                            <span className="text-[9px] text-muted-foreground block uppercase">Category</span>
                            <span className="font-semibold mt-0.5 block text-white">{selectedRequest.category}</span>
                          </div>
                          <div className="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-foreground/90">
                            <span className="text-[9px] text-muted-foreground block uppercase">Volume</span>
                            <span className="font-semibold mt-0.5 block text-white">{selectedRequest.monthly_volume}</span>
                          </div>
                          <div className="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-foreground/90">
                            <span className="text-[9px] text-muted-foreground block uppercase">Timeline</span>
                            <span className="font-semibold mt-0.5 block text-white">{selectedRequest.timeline}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
                          <MessageSquare className="size-3.5" />
                          Client Message
                        </h4>
                        <p className="text-sm text-muted-foreground/90 bg-black/40 border border-white/5 p-4 rounded-2xl whitespace-pre-line leading-relaxed">
                          {selectedRequest.message || "No additional message was provided."}
                        </p>
                      </div>
                    </>
                  );
                })()}

                <div className="flex items-center justify-between border-t border-white/5 pt-5">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Status:</span>
                    <StatusDropdown
                      currentStatus={selectedRequest.status}
                      onChange={(status) => updateRequestStatus(selectedRequest.id, status)}
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
                        const url = `${baseUrl}/book-demo?name=${encodeURIComponent(selectedRequest.full_name)}&email=${encodeURIComponent(selectedRequest.work_email)}&company=${encodeURIComponent(selectedRequest.company)}&role=${encodeURIComponent(selectedRequest.role || "")}&companySize=${encodeURIComponent(selectedRequest.company_size || "")}&region=${encodeURIComponent(selectedRequest.region || "")}`;
                        navigator.clipboard.writeText(url);
                        toast.success("Client inquiry link copied!");
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl border border-white/10 hover:border-electric/50 hover:bg-electric/5 text-white transition-all cursor-pointer"
                    >
                      <Link2 className="size-3.5" /> Share Form
                    </button>

                    <button
                      onClick={() => deleteRequest(selectedRequest.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 transition-colors cursor-pointer"
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
