import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, LogOut, Loader2, Search, Filter, 
  Trash2, Mail, Building2, User, Globe, Layers,
  Calendar, MessageSquare, ShieldAlert, Sparkles, Check, RefreshCw,
  ChevronLeft, ChevronRight, X
} from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { Logo } from "@/components/maisone/Logo";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal — Maisone" },
      { name: "description", content: "Access and track customer demo requests." }
    ],
  }),
  component: AdminPage,
});

type DemoRequest = {
  id: string;
  created_at: string;
  full_name: string;
  work_email: string;
  company: string;
  role: string;
  company_size: string;
  region: string;
  category: string;
  monthly_volume: string;
  timeline: string;
  message: string;
  status: string;
};

function StatusDropdown({ currentStatus, onChange }: { currentStatus: string; onChange: (status: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const statuses = ["Pending", "Contacted", "Completed", "Archived"];

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Pending":
        return {
          bg: "bg-amber-500/10 hover:bg-amber-500/20",
          text: "text-amber-400",
          border: "border-amber-500/20",
          dot: "bg-amber-400"
        };
      case "Contacted":
        return {
          bg: "bg-blue-500/10 hover:bg-blue-500/20",
          text: "text-blue-400",
          border: "border-blue-500/20",
          dot: "bg-blue-400"
        };
      case "Completed":
        return {
          bg: "bg-emerald-500/10 hover:bg-emerald-500/20",
          text: "text-emerald-400",
          border: "border-emerald-500/20",
          dot: "bg-emerald-400"
        };
      default:
        return {
          bg: "bg-zinc-500/10 hover:bg-zinc-500/20",
          text: "text-zinc-400",
          border: "border-zinc-500/20",
          dot: "bg-zinc-400"
        };
    }
  };

  const current = getStatusStyles(currentStatus);

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center justify-between gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${current.bg} ${current.text} ${current.border}`}
      >
        <span className={`size-1.5 rounded-full ${current.dot}`} />
        {currentStatus}
        <svg
          className={`size-3 opacity-60 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 mt-2 w-36 rounded-xl border border-white/10 bg-black/95 backdrop-blur-md py-1 shadow-2xl z-40 overflow-hidden">
            {statuses.map((status) => {
              const styles = getStatusStyles(status);
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => {
                    onChange(status);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs flex items-center gap-2 hover:bg-white/5 transition-colors cursor-pointer ${styles.text}`}
                >
                  <span className={`size-1.5 rounded-full ${styles.dot}`} />
                  {status}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function AdminPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // Auth Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Dashboard States
  const [requests, setRequests] = useState<DemoRequest[]>([]);
  const [reqLoading, setReqLoading] = useState(false);
  const [reqError, setReqError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  // Stats summary State
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    contacted: 0,
    completed: 0
  });
  
  // Pagination States
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 10;

  // Selected Request Modal State
  const [selectedRequest, setSelectedRequest] = useState<DemoRequest | null>(null);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch Stats (real-time overview counts)
  const fetchStats = async () => {
    if (!session) return;
    try {
      const { data, error } = await supabase
        .from("demo_requests")
        .select("status");
      if (error) throw error;
      if (data) {
        const counts = data.reduce((acc: any, curr: any) => {
          acc.total++;
          if (curr.status === "Pending") acc.pending++;
          if (curr.status === "Contacted") acc.contacted++;
          if (curr.status === "Completed") acc.completed++;
          return acc;
        }, { total: 0, pending: 0, contacted: 0, completed: 0 });
        setStats(counts);
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (err: any) {
      console.error(err);
      setLoginError(err.message || "Invalid email or password.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setRequests([]);
    setPage(1);
    setTotalCount(0);
  };

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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07070a] text-white">
        <Loader2 className="size-8 animate-spin text-electric" />
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="relative min-h-screen noise overflow-x-hidden bg-[#07070a] text-white">
        <div className="absolute inset-0 hero-aura pointer-events-none opacity-40" />
        
        {/* Header */}
        <header className="relative z-10 mx-auto max-w-7xl px-6 py-5 flex items-center justify-between border-b border-white/5 bg-[#07070a]/80 backdrop-blur-md sticky top-0">
          <div className="flex items-center gap-3">
            <Link to="/"><Logo /></Link>
            <span className="text-[10px] tracking-[0.2em] bg-electric/15 text-electric px-2.5 py-0.5 rounded-full uppercase font-medium">Admin</span>
          </div>
          {session ? (
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground border border-white/10 px-4 py-2 rounded-full hover:bg-white/5 transition-all cursor-pointer"
            >
              <LogOut className="size-4" /> Sign Out
            </button>
          ) : (
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="size-4" /> Back to site
            </Link>
          )}
        </header>

        {/* Main Content */}
        <main className="relative z-10 mx-auto max-w-7xl px-6 py-12">
          {!session ? (
            /* Admin Login Panel */
            <div className="max-w-md mx-auto my-12">
              <motion.div 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }}
                className="glass-strong rounded-3xl p-8 border border-white/10"
              >
                <div className="text-center mb-8">
                  <div className="mx-auto size-12 rounded-full bg-electric/10 flex items-center justify-center mb-4">
                    <Sparkles className="size-6 text-electric" />
                  </div>
                  <h1 className="font-serif text-3xl mb-2">Atelier Access</h1>
                  <p className="text-sm text-muted-foreground">Sign in to manage and review platform demo requests.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Work Email</label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="admin@maisone.com" 
                      className="mt-2 w-full rounded-xl bg-black/50 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-electric"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Password</label>
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="mt-2 w-full rounded-xl bg-black/50 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-electric"
                    />
                  </div>

                  {loginError && (
                    <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-xs text-red-400 flex items-center gap-2">
                      <ShieldAlert className="size-4 shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={loginLoading}
                    className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-black font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {loginLoading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>
              </motion.div>
            </div>
          ) : (
            /* Admin Dashboard Panel */
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-4xl tracking-tight">Demo Inquiries</h1>
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
                    className="w-full rounded-xl bg-black/30 border border-white/10 pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-electric"
                  />
                </div>

                {/* Filter */}
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="w-full rounded-xl bg-[#07070a] border border-white/10 pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-electric appearance-none cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Completed">Completed</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                {/* Metrics */}
                <div className="flex items-center justify-end px-2 text-xs text-muted-foreground">
                  Showing <span className="font-semibold text-foreground mx-1">{requests.length}</span> of {totalCount} total inquiries
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
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] uppercase tracking-widest text-muted-foreground">
                        <th className="px-6 py-4">Brand / Company</th>
                        <th className="px-6 py-4">Contact</th>
                        <th className="px-6 py-4">Sourcing Profile</th>
                        <th className="px-6 py-4">Message</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[1, 2, 3].map((i) => (
                        <tr key={i} className="animate-pulse">
                          <td className="px-6 py-5">
                            <div className="h-4 bg-white/5 rounded w-28 mb-2" />
                            <div className="h-3 bg-white/5 rounded w-20" />
                          </td>
                          <td className="px-6 py-5">
                            <div className="h-4 bg-white/5 rounded w-32 mb-2" />
                            <div className="h-3 bg-white/5 rounded w-40" />
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex gap-2 mb-2">
                              <div className="h-4 bg-white/5 rounded-full w-12" />
                              <div className="h-4 bg-white/5 rounded-full w-16" />
                            </div>
                            <div className="h-3 bg-white/5 rounded w-24" />
                          </td>
                          <td className="px-6 py-5">
                            <div className="h-10 bg-white/5 rounded-xl w-full" />
                          </td>
                          <td className="px-6 py-5">
                            <div className="h-6 bg-white/5 rounded-full w-20" />
                          </td>
                          <td className="px-6 py-5 text-right">
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
                  <div className="overflow-x-auto lg:overflow-visible rounded-3xl border border-white/5 glass">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] uppercase tracking-widest text-muted-foreground">
                          <th className="px-6 py-4">Brand / Company</th>
                          <th className="px-6 py-4">Contact</th>
                          <th className="px-6 py-4">Sourcing Profile</th>
                          <th className="px-6 py-4">Message</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {requests.map((req) => (
                          <tr key={req.id} className="hover:bg-white/[0.01] transition-colors group">
                            {/* Company / Role */}
                            <td className="px-6 py-5 vertical-align-top">
                              <div className="font-medium text-foreground text-base">{req.company}</div>
                              <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                <Building2 className="size-3 shrink-0" />
                                <span>{req.company_size} • {req.region}</span>
                              </div>
                            </td>

                            {/* Contact Details */}
                            <td className="px-6 py-5">
                              <div className="font-medium text-foreground flex items-center gap-1.5">
                                <User className="size-3.5 text-muted-foreground shrink-0" />
                                {req.full_name}
                              </div>
                              <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                                <Mail className="size-3.5 text-muted-foreground shrink-0" />
                                <a href={`mailto:${req.work_email}`} className="hover:underline hover:text-foreground transition-colors">{req.work_email}</a>
                              </div>
                              <div className="text-[10px] text-muted-foreground/60 mt-1 flex items-center gap-1">
                                <span>Role: {req.role}</span>
                              </div>
                            </td>

                            {/* Sourcing Profile */}
                            <td className="px-6 py-5 min-w-[280px]">
                              <div className="flex flex-wrap gap-1.5 max-w-xs">
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-foreground/90 border border-white/5">{req.category}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-foreground/90 border border-white/5">{req.monthly_volume}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-foreground/90 border border-white/5">{req.timeline}</span>
                              </div>
                              <div className="text-[10px] text-muted-foreground/60 mt-2">
                                Received: {new Date(req.created_at).toLocaleDateString()}
                              </div>
                            </td>

                            {/* Message Clamping & Modal Trigger */}
                            <td className="px-6 py-5 max-w-xs">
                              {req.message ? (
                                <div className="space-y-1">
                                  <p className="text-xs text-muted-foreground line-clamp-3 whitespace-pre-line bg-black/20 p-2.5 rounded-xl border border-white/5">
                                    {req.message}
                                  </p>
                                  <button 
                                    onClick={() => setSelectedRequest(req)}
                                    className="text-[10px] text-electric hover:underline font-medium cursor-pointer"
                                  >
                                    View Full Details
                                  </button>
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground/50 italic">No message provided</span>
                              )}
                            </td>

                            {/* Status Dropdown */}
                            <td className="px-6 py-5">
                              <StatusDropdown
                                currentStatus={req.status}
                                onChange={(status) => updateRequestStatus(req.id, status)}
                              />
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-5 text-right">
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
            </div>
          )}
        </main>

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

                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2.5">Sourcing Profile</h4>
                    <div className="flex flex-wrap gap-2">
                      <div className="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-foreground/90">
                        <span className="text-[9px] text-muted-foreground block uppercase">Category</span>
                        <span className="font-semibold mt-0.5 block">{selectedRequest.category}</span>
                      </div>
                      <div className="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-foreground/90">
                        <span className="text-[9px] text-muted-foreground block uppercase">Volume</span>
                        <span className="font-semibold mt-0.5 block">{selectedRequest.monthly_volume}</span>
                      </div>
                      <div className="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-foreground/90">
                        <span className="text-[9px] text-muted-foreground block uppercase">Timeline</span>
                        <span className="font-semibold mt-0.5 block">{selectedRequest.timeline}</span>
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

                  <div className="flex items-center justify-between border-t border-white/5 pt-5">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Status:</span>
                      <StatusDropdown
                        currentStatus={selectedRequest.status}
                        onChange={(status) => updateRequestStatus(selectedRequest.id, status)}
                      />
                    </div>

                    <button
                      onClick={() => deleteRequest(selectedRequest.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="size-3.5" /> Delete Request
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </ThemeProvider>
  );
}
