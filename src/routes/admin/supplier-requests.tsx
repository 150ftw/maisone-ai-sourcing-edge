import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, Search, Filter, Trash2, Mail, Building2, User, Globe,
  Calendar, MessageSquare, ShieldAlert, Check, RefreshCw,
  ChevronLeft, ChevronRight, X, Layers
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AdminContext, StatusDropdown } from "../admin";

export const Route = createFileRoute("/admin/supplier-requests")({
  component: SupplierRequestsPage,
});

export type SupplierRequest = {
  id: string;
  created_at: string;
  full_name: string;
  work_email: string;
  factory_name: string;
  region: string;
  categories: string[];
  moq: string;
  lead_time: string;
  message: string;
  status: string;
};

function SupplierRequestsPage() {
  const { session, stats, fetchStats } = useContext(AdminContext);
  
  // Dashboard States
  const [requests, setRequests] = useState<SupplierRequest[]>([]);
  const [reqLoading, setReqLoading] = useState(false);
  const [reqError, setReqError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  // Pagination States
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 5;

  // Selected Request Modal State
  const [selectedRequest, setSelectedRequest] = useState<SupplierRequest | null>(null);

  const fetchRequests = async () => {
    if (!session) return;
    setReqLoading(true);
    setReqError(null);
    try {
      let query = supabase
        .from("supplier_requests")
        .select("*", { count: "exact" });

      if (statusFilter !== "All") {
        query = query.eq("status", statusFilter);
      }

      if (search.trim()) {
        query = query.or(
          `full_name.ilike.%${search.trim()}%,factory_name.ilike.%${search.trim()}%,work_email.ilike.%${search.trim()}%`
        );
      }

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
      console.error("Failed to fetch supplier requests:", err);
      setReqError(err.message || "Failed to retrieve applications.");
    } finally {
      setReqLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchRequests();
      fetchStats();
    }
  }, [session, page]);

  useEffect(() => {
    if (!session) return;
    const delayDebounceFn = setTimeout(() => {
      setPage(1);
      fetchRequests();
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [search, statusFilter]);

  const updateRequestStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("supplier_requests")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      
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
    if (!confirm("Are you sure you want to delete this application permanently?")) return;
    
    try {
      const { error } = await supabase
        .from("supplier_requests")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setRequests(prev => prev.filter(req => req.id !== id));
      setSelectedRequest(null);
      fetchRequests();
      fetchStats();
    } catch (err: any) {
      console.error("Failed to delete application:", err);
      alert("Error deleting application: " + err.message);
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  if (!session) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl tracking-tight">Supplier Applications</h1>
          <p className="text-sm text-muted-foreground mt-1">Review and manage factory applications.</p>
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl mt-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by factory name, contact..."
            className="w-full rounded-xl bg-black/30 border border-white/10 pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-electric text-white"
          />
        </div>

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
            <option value="Approved" className="bg-[#0f0f12]">Approved</option>
            <option value="Rejected" className="bg-[#0f0f12]">Rejected</option>
          </select>
        </div>

        <div className="flex items-center justify-end px-2 text-xs text-muted-foreground">
          Showing <span className="font-semibold text-white mx-1">{requests.length}</span> of {totalCount} apps
        </div>
      </div>

      {reqError && (
        <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-6 text-red-400 flex flex-col items-center justify-center text-center">
          <ShieldAlert className="size-10 mb-3" />
          <h3 className="font-semibold text-lg mb-1">Database Error</h3>
          <p className="text-sm text-red-400/80 max-w-md">{reqError}</p>
        </div>
      )}

      {reqLoading && requests.length === 0 ? (
        <div className="overflow-x-auto rounded-3xl border border-white/5 glass">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] uppercase tracking-widest text-muted-foreground">
                <th className="px-4 py-4">Factory</th>
                <th className="px-4 py-4">Contact</th>
                <th className="px-4 py-4">Capabilities</th>
                <th className="px-4 py-4">Message</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[1, 2, 3].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-4 align-top"><div className="h-4 bg-white/5 rounded w-28 mb-2" /></td>
                  <td className="px-4 py-4 align-top"><div className="h-4 bg-white/5 rounded w-32 mb-2" /></td>
                  <td className="px-4 py-4 align-top"><div className="h-4 bg-white/5 rounded-full w-24 mb-2" /></td>
                  <td className="px-4 py-4 align-top"><div className="h-10 bg-white/5 rounded-xl w-full" /></td>
                  <td className="px-4 py-4 align-top"><div className="h-6 bg-white/5 rounded-full w-20" /></td>
                  <td className="px-4 py-4 align-top text-right"><div className="h-8 bg-white/5 rounded-full w-8 ml-auto" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : requests.length === 0 ? (
        <div className="glass rounded-3xl py-20 text-center border border-white/5">
          <p className="text-muted-foreground">No applications found matching criteria.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto lg:overflow-visible rounded-3xl border border-white/5 glass">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] uppercase tracking-widest text-muted-foreground col-auto">
                  <th className="px-4 py-4">Factory</th>
                  <th className="px-4 py-4">Contact</th>
                  <th className="px-4 py-4">Capabilities</th>
                  <th className="px-4 py-4">Message</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="px-4 py-4 align-top">
                      <div className="font-semibold text-white text-sm whitespace-nowrap">{req.factory_name}</div>
                      <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1.5 whitespace-nowrap">
                        <Globe className="size-3 shrink-0" />
                        <span>{req.region}</span>
                      </div>
                    </td>

                    <td className="px-4 py-4 align-top">
                      <div className="font-medium text-white text-xs flex items-center gap-1.5 whitespace-nowrap">
                        <User className="size-3.5 text-muted-foreground shrink-0" />
                        {req.full_name}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1.5 whitespace-nowrap">
                        <Mail className="size-3.5 text-muted-foreground shrink-0" />
                        <a href={`mailto:${req.work_email}`} className="hover:underline hover:text-white transition-colors">{req.work_email}</a>
                      </div>
                    </td>

                    <td className="px-4 py-4 align-top min-w-[200px]">
                      <div className="flex flex-wrap gap-1.5 max-w-xs">
                        {(req.categories || []).map(cat => (
                          <span key={cat} className="text-[10px] px-2 py-0.5 rounded-full bg-electric/10 text-electric border border-electric/20 whitespace-nowrap">{cat}</span>
                        ))}
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/90 border border-white/5 whitespace-nowrap">MOQ: {req.moq}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/90 border border-white/5 whitespace-nowrap">Lead: {req.lead_time}</span>
                      </div>
                    </td>

                    <td className="px-4 py-4 align-top max-w-xs">
                      {req.message ? (
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground line-clamp-3 whitespace-pre-line bg-black/20 p-2.5 rounded-xl border border-white/5">
                            {req.message}
                          </p>
                          <button 
                            onClick={() => setSelectedRequest(req)}
                            className="text-[10px] text-electric hover:underline font-medium cursor-pointer"
                          >
                            View Details
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground/50 italic">No message provided</span>
                      )}
                    </td>

                    <td className="px-4 py-4 align-top">
                      <StatusDropdown
                        currentStatus={req.status}
                        onChange={(status) => updateRequestStatus(req.id, status)}
                        options={["Pending", "Contacted", "Approved", "Rejected"]}
                      />
                    </td>

                    <td className="px-4 py-4 align-top text-right">
                      <button
                        onClick={() => deleteRequest(req.id)}
                        className="p-2 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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

      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRequest(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 glass-strong border border-white/10 rounded-3xl max-w-xl w-full p-8 max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <button
                onClick={() => setSelectedRequest(null)}
                className="absolute right-6 top-6 p-2 rounded-full hover:bg-white/5 border border-white/5 transition-colors cursor-pointer text-muted-foreground hover:text-white"
              >
                <X className="size-4" />
              </button>

              <div className="space-y-6">
                <div>
                  <span className="text-[10px] tracking-[0.2em] bg-electric/15 text-electric px-2.5 py-0.5 rounded-full uppercase font-medium">Factory Details</span>
                  <h2 className="font-serif text-3xl mt-3 text-white">{selectedRequest.factory_name}</h2>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                    <Globe className="size-3.5 text-muted-foreground" />
                    {selectedRequest.region}
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

                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2.5">Manufacturing Capabilities</h4>
                  <div className="flex flex-wrap gap-2">
                    <div className="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-foreground/90 w-full mb-1">
                      <span className="text-[9px] text-muted-foreground block uppercase">Categories</span>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {(selectedRequest.categories || []).map(cat => (
                          <span key={cat} className="text-[10px] px-2 py-0.5 rounded-full bg-electric/10 text-electric border border-electric/20 whitespace-nowrap">{cat}</span>
                        ))}
                      </div>
                    </div>
                    <div className="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-foreground/90 flex-1">
                      <span className="text-[9px] text-muted-foreground block uppercase">MOQ</span>
                      <span className="font-semibold mt-0.5 block text-white">{selectedRequest.moq}</span>
                    </div>
                    <div className="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-foreground/90 flex-1">
                      <span className="text-[9px] text-muted-foreground block uppercase">Lead Time</span>
                      <span className="font-semibold mt-0.5 block text-white">{selectedRequest.lead_time}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
                    <MessageSquare className="size-3.5" />
                    Additional Details / Message
                  </h4>
                  <p className="text-sm text-muted-foreground/90 bg-black/40 border border-white/5 p-4 rounded-2xl whitespace-pre-line leading-relaxed">
                    {selectedRequest.message || "No additional message was provided."}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-5">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Status:</span>
                    <StatusDropdown
                      currentStatus={selectedRequest.status}
                      onChange={(status) => updateRequestStatus(selectedRequest.id, status)}
                      options={["Pending", "Contacted", "Approved", "Rejected"]}
                    />
                  </div>

                  <button
                    onClick={() => deleteRequest(selectedRequest.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="size-3.5" /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
