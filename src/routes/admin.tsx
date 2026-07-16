import { createFileRoute, Link, useNavigate, Outlet, redirect, useLocation } from "@tanstack/react-router";
import { useState, useEffect, createContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, LogOut, Loader2, Mail, Building2, Globe, Layers,
  ChevronDown, TrendingUp, BookOpen
} from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { Logo } from "@/components/maisone/Logo";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    // If the path is exactly /admin/login, bypass the auth guard here to avoid infinite redirect loop
    if (location.pathname === "/admin/login") {
      return;
    }
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw redirect({
        to: "/admin/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  head: () => ({
    meta: [
      { title: "Admin Portal — Maisone" },
      { name: "description", content: "Access and track customer demo requests." }
    ],
  }),
  component: AdminPage,
});

export type DemoRequest = {
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

export const AdminContext = createContext<any>(null);

export function StatusDropdown({ currentStatus, onChange, options = ["Pending", "Contacted", "Completed", "Archived"] }: { currentStatus: string; onChange: (status: string) => void; options?: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const statuses = options;

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
      case "Approved":
        return {
          bg: "bg-emerald-500/10 hover:bg-emerald-500/20",
          text: "text-emerald-400",
          border: "border-emerald-500/20",
          dot: "bg-emerald-400"
        };
      case "Rejected":
        return {
          bg: "bg-red-500/10 hover:bg-red-500/20",
          text: "text-red-400",
          border: "border-red-500/20",
          dot: "bg-red-400"
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
          <div className="absolute right-0 mt-2 w-36 rounded-xl border border-white/10 bg-black/95 backdrop-blur-md py-1 shadow-2xl z-40 overflow-hidden">
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

export function ShipmentStatusDropdown({ currentStatus, onChange }: { currentStatus: string; onChange: (status: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const statuses = ["In transit", "Customs", "Delivered"];

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Delivered":
        return {
          bg: "bg-emerald-500/10 hover:bg-emerald-500/20",
          text: "text-emerald-400",
          border: "border-emerald-500/20",
          dot: "bg-emerald-400"
        };
      case "Customs":
        return {
          bg: "bg-amber-500/10 hover:bg-amber-500/20",
          text: "text-amber-400",
          border: "border-amber-500/20",
          dot: "bg-amber-400"
        };
      default: // "In transit"
        return {
          bg: "bg-blue-500/10 hover:bg-blue-500/20",
          text: "text-blue-400",
          border: "border-blue-500/20",
          dot: "bg-blue-400"
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
        <ChevronDown className={`size-3 opacity-60 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
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

export function CustomSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.04] transition-all text-xs text-white cursor-pointer focus:outline-none"
      >
        <span>{value}</span>
        <ChevronDown className={`size-3.5 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 right-0 mt-2 rounded-xl border border-white/10 bg-[#0f0f12] py-1 shadow-2xl z-40 overflow-hidden">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-xs hover:bg-white/5 transition-colors cursor-pointer ${value === opt ? "text-white font-medium bg-white/[0.02]" : "text-muted-foreground hover:text-white"}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="w-full rounded-2xl border border-white/5 glass overflow-hidden">
      <div className="border-b border-white/5 p-4 flex gap-4 bg-white/[0.01]">
        <div className="h-4 w-1/4 bg-white/5 rounded animate-pulse" />
        <div className="h-4 w-1/4 bg-white/5 rounded animate-pulse" />
        <div className="h-4 w-1/4 bg-white/5 rounded animate-pulse" />
        <div className="h-4 w-1/4 bg-white/5 rounded animate-pulse" />
      </div>
      <div className="divide-y divide-white/5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 flex gap-4 items-center">
            <div className="h-4 w-1/4 bg-white/5 rounded animate-pulse" />
            <div className="h-4 w-1/4 bg-white/5 rounded animate-pulse" />
            <div className="h-4 w-1/4 bg-white/5 rounded animate-pulse" />
            <div className="h-4 w-1/4 bg-white/5 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function OverviewSkeleton() {
  return (
    <div className="space-y-4">
      {/* Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl p-4 bg-white/[0.02] border border-white/5 animate-pulse">
            <div className="h-2 w-1/2 bg-white/5 rounded mb-3" />
            <div className="h-6 w-3/4 bg-white/10 rounded" />
          </div>
        ))}
      </div>

      {/* Chart Skeleton */}
      <div className="rounded-xl p-5 bg-white/[0.02] border border-white/5 animate-pulse h-[200px]">
        <div className="h-3 w-1/4 bg-white/5 rounded mb-2" />
        <div className="h-2 w-1/3 bg-white/5 rounded" />
        <div className="mt-8 h-20 w-full bg-white/5 rounded" />
      </div>

      {/* List Skeleton */}
      <div className="rounded-xl bg-white/[0.02] border border-white/5 overflow-hidden animate-pulse">
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="h-4 w-1/6 bg-white/5 rounded" />
        </div>
        <div className="divide-y divide-white/5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="grid grid-cols-12 gap-4 px-5 py-4 items-center">
              <div className="col-span-2 h-3 bg-white/5 rounded" />
              <div className="col-span-4 h-3 bg-white/5 rounded" />
              <div className="col-span-2 h-3 bg-white/5 rounded" />
              <div className="col-span-3 h-1 bg-white/5 rounded" />
              <div className="col-span-1 h-3 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type AdminTab = "overview" | "inquiries" | "supplier_requests" | "suppliers" | "shipments" | "trends" | "blogs";

const ADMIN_TABS = [
  { id: "overview" as const, to: "/admin" as const, label: "Overview", icon: Layers },
  { id: "inquiries" as const, to: "/admin/inquiries" as const, label: "Inquiries", icon: Mail },
  { id: "supplier_requests" as const, to: "/admin/supplier-requests" as const, label: "Supplier Requests", icon: Mail },
  { id: "suppliers" as const, to: "/admin/suppliers" as const, label: "Suppliers", icon: Building2 },
  { id: "shipments" as const, to: "/admin/shipments" as const, label: "Shipments", icon: Globe },
  { id: "trends" as const, to: "/admin/trends" as const, label: "Trend Forecasts", icon: TrendingUp },
  { id: "blogs" as const, to: "/admin/blogs" as const, label: "Blog Section", icon: BookOpen },
];

function AdminPage() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // State hooks
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Stats summary State
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    contacted: 0,
    completed: 0
  });

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

  // Re-fetch triggers
  useEffect(() => {
    if (session) {
      fetchStats();
    }
  }, [session]);

  const handleLogout = async () => {
    setAuthLoading(true);
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  // Always block render until we know auth state — prevents flash of login or admin content
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07070a] text-white">
        <Loader2 className="size-8 animate-spin text-electric" />
      </div>
    );
  }

  // Skip the admin layout entirely if rendering the login route
  if (pathname === "/admin/login") {
    return <Outlet />;
  }

  return (
    <ThemeProvider>
      <AdminContext.Provider value={{ session, stats, fetchStats }}>
        <div className="relative min-h-screen noise overflow-x-hidden bg-[#07070a] text-white">
          <div className="absolute inset-0 hero-aura pointer-events-none opacity-40" />

          {/* Header */}
          <header className="relative z-10 mx-auto max-w-7xl px-6 py-5 flex items-center justify-between border-b border-white/5 bg-[#07070a]/80 backdrop-blur-md sticky top-0">
            <div className="flex items-center gap-3">
              <Link to="/"><Logo /></Link>
              <span className="text-[10px] tracking-[0.2em] bg-electric/15 text-electric px-2.5 py-0.5 rounded-full uppercase font-semibold">Admin</span>
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
            <div className="grid grid-cols-12 gap-8 items-start">
              {/* Sidebar navigation */}
              <div className="col-span-12 md:col-span-2 space-y-1">
                {ADMIN_TABS.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <Link
                      key={tab.id}
                      to={tab.to}
                      activeOptions={{ exact: true }}
                      activeProps={{ className: "bg-accent text-accent-foreground font-semibold" }}
                      inactiveProps={{ className: "text-muted-foreground hover:text-foreground hover:bg-white/5" }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center gap-2.5 cursor-pointer"
                    >
                      <Icon className="size-3.5 shrink-0 mr-2" />
                      <span>{tab.label}</span>
                      {tab.id === "inquiries" && stats.pending > 0 && (
                        <span className="ml-auto size-1.5 rounded-full bg-amber-400 animate-pulse" />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Main content pane */}
              <div className="col-span-12 md:col-span-10 min-h-[500px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Outlet />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </main>
        </div>
      </AdminContext.Provider>
    </ThemeProvider>
  );
}
