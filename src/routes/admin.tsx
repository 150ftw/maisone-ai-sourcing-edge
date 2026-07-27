import { createFileRoute, Link, useNavigate, Outlet, redirect, useLocation } from "@tanstack/react-router";
import { useState, useEffect, createContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, LogOut, Loader2, Mail, Building2, Globe, Layers,
  ChevronDown, TrendingUp, BookOpen, MessageSquare,
  LayoutDashboard, Briefcase, Users, Factory, UserCheck, MessageSquareCode, DollarSign, BarChart3, Settings
} from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { Logo } from "@/components/maisone/Logo";
import { supabase } from "@/lib/supabase";
import { SettingsMenu } from "@/components/maisone/SettingsMenu";
import { useLanguage } from "@/lib/i18n";

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
          text: "text-amber-800 dark:text-amber-400",
          border: "border-amber-500/20",
          dot: "bg-amber-800 dark:bg-amber-400"
        };
      case "Contacted":
        return {
          bg: "bg-blue-500/10 hover:bg-blue-500/20",
          text: "text-blue-600 dark:text-blue-400",
          border: "border-blue-500/20",
          dot: "bg-blue-500 dark:bg-blue-400"
        };
      case "Completed":
      case "Approved":
        return {
          bg: "bg-emerald-500/10 hover:bg-emerald-500/20",
          text: "text-emerald-600 dark:text-emerald-400",
          border: "border-emerald-500/20",
          dot: "bg-emerald-500 dark:bg-emerald-400"
        };
      case "Rejected":
        return {
          bg: "bg-red-500/10 hover:bg-red-500/20",
          text: "text-red-600 dark:text-red-400",
          border: "border-red-500/20",
          dot: "bg-red-500 dark:bg-red-400"
        };
      default:
        return {
          bg: "bg-zinc-500/10 hover:bg-zinc-500/20",
          text: "text-muted-foreground",
          border: "border-zinc-500/20",
          dot: "bg-zinc-500 dark:bg-zinc-400"
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
          <div className="absolute right-0 mt-2 w-36 rounded-xl border border-border bg-background/95 backdrop-blur-md py-1 shadow-2xl z-40 overflow-hidden">
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
                  className={`w-full text-left px-4 py-2.5 text-xs flex items-center gap-2 hover:bg-foreground/5 transition-colors cursor-pointer ${styles.text}`}
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
        className="custom-select-btn w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-foreground/[0.02] border border-border hover:border-foreground/20 focus:border-foreground/40 focus:bg-foreground/[0.04] transition-all text-xs text-foreground cursor-pointer focus:outline-none"
      >
        <span>{value}</span>
        <ChevronDown className={`size-3.5 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 right-0 mt-2 rounded-xl border border-border bg-card py-1 shadow-2xl z-40 overflow-hidden">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-xs hover:bg-foreground/5 transition-colors cursor-pointer ${value === opt ? "text-foreground font-medium bg-foreground/[0.02]" : "text-muted-foreground hover:text-foreground"}`}
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
    <div className="w-full rounded-2xl border border-border glass overflow-hidden">
      <div className="border-b border-border p-4 flex gap-4 bg-foreground/[0.01]">
        <div className="h-4 w-1/4 bg-foreground/5 rounded animate-pulse" />
        <div className="h-4 w-1/4 bg-foreground/5 rounded animate-pulse" />
        <div className="h-4 w-1/4 bg-foreground/5 rounded animate-pulse" />
        <div className="h-4 w-1/4 bg-foreground/5 rounded animate-pulse" />
      </div>
      <div className="divide-y divide-border">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 flex gap-4 items-center">
            <div className="h-4 w-1/4 bg-foreground/5 rounded animate-pulse" />
            <div className="h-4 w-1/4 bg-foreground/5 rounded animate-pulse" />
            <div className="h-4 w-1/4 bg-foreground/5 rounded animate-pulse" />
            <div className="h-4 w-1/4 bg-foreground/5 rounded animate-pulse" />
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
          <div key={i} className="rounded-xl p-4 bg-foreground/[0.02] border border-border animate-pulse">
            <div className="h-2 w-1/2 bg-foreground/5 rounded mb-3" />
            <div className="h-6 w-3/4 bg-foreground/10 rounded" />
          </div>
        ))}
      </div>

      {/* Chart Skeleton */}
      <div className="rounded-xl p-5 bg-foreground/[0.02] border border-border animate-pulse h-[200px]">
        <div className="h-3 w-1/4 bg-foreground/5 rounded mb-2" />
        <div className="h-2 w-1/3 bg-foreground/5 rounded" />
        <div className="mt-8 h-20 w-full bg-foreground/5 rounded" />
      </div>

      {/* List Skeleton */}
      <div className="rounded-xl bg-foreground/[0.02] border border-border overflow-hidden animate-pulse">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="h-4 w-1/6 bg-foreground/5 rounded" />
        </div>
        <div className="divide-y divide-border">
          {[1, 2, 3].map((i) => (
            <div key={i} className="grid grid-cols-12 gap-4 px-5 py-4 items-center">
              <div className="col-span-2 h-3 bg-foreground/5 rounded" />
              <div className="col-span-4 h-3 bg-foreground/5 rounded" />
              <div className="col-span-2 h-3 bg-foreground/5 rounded" />
              <div className="col-span-3 h-1 bg-foreground/5 rounded" />
              <div className="col-span-1 h-3 bg-foreground/5 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const ADMIN_TABS = [
  { id: "inquiries" as const, to: "/admin/inquiries" as const, labelKey: "admin.tabs.inquiries", icon: Mail },
  { id: "supplier_requests" as const, to: "/admin/supplier-requests" as const, labelKey: "admin.tabs.supplierRequests", icon: Mail },
  { id: "suppliers" as const, to: "/admin/suppliers" as const, labelKey: "admin.tabs.suppliers", icon: Building2 },
  { id: "trends" as const, to: "/admin/trends" as const, labelKey: "admin.tabs.trends", icon: TrendingUp },
  { id: "blogs" as const, to: "/admin/blogs" as const, labelKey: "admin.tabs.blogs", icon: BookOpen },
  { id: "testimonials" as const, to: "/admin/testimonials" as const, labelKey: "admin.tabs.testimonials", icon: MessageSquare },
];

const TRACKER_TABS = [
  { id: "tracker_dashboard", to: "/admin/tracker", label: "Dashboard", icon: LayoutDashboard },
  { id: "tracker_enquiries", to: "/admin/tracker/enquiries", label: "Enquiries", icon: Briefcase },
  { id: "tracker_clients", to: "/admin/tracker/clients", label: "Clients", icon: Users },
  { id: "tracker_factories", to: "/admin/tracker/factories", label: "Factories", icon: Factory },
  { id: "tracker_agents", to: "/admin/tracker/agents", label: "Agents", icon: UserCheck },
  { id: "tracker_finance", to: "/admin/tracker/finance", label: "Finance", icon: DollarSign },
  { id: "tracker_reports", to: "/admin/tracker/reports", label: "Reports", icon: BarChart3 },
  { id: "tracker_settings", to: "/admin/tracker/settings", label: "Settings", icon: Settings },
];

function AdminPage() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const allTabs = [...TRACKER_TABS, ...ADMIN_TABS.map(tab => ({ ...tab, label: t(tab.labelKey) }))];

  const activeTab = allTabs.find(tab => {
    if (tab.to === "/admin/tracker") {
      return pathname === "/admin/tracker" || pathname === "/admin/tracker/";
    }
    return pathname.startsWith(tab.to);
  }) || allTabs[0];

  // State hooks
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
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
        <div className="relative min-h-screen noise overflow-x-hidden bg-background text-foreground transition-colors">
          <div className="absolute inset-0 hero-aura pointer-events-none opacity-40" />

          {/* Header */}
          <header className="relative z-40 w-full px-6 sm:px-10 py-5 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-md sticky top-0">
            <div className="flex items-center gap-3">
              <Link to="/"><Logo /></Link>
              <span className="text-[10px] tracking-[0.2em] bg-electric/15 text-electric px-2.5 py-0.5 rounded-full uppercase font-semibold">{t("admin.badge")}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <SettingsMenu />
              {session ? (
                <button
                  onClick={handleLogout}
                  title={t("admin.signOut")}
                  className="size-11 rounded-full flex items-center justify-center border border-border text-foreground/80 hover:text-foreground hover:bg-secondary/50 transition-all cursor-pointer glass-strong shadow-lg shrink-0 sm:w-auto sm:h-11 sm:px-5 sm:rounded-full sm:inline-flex sm:items-center sm:gap-2 sm:text-sm whitespace-nowrap"
                >
                  <LogOut className="size-4 shrink-0" />
                  <span className="hidden sm:inline">{t("admin.signOut")}</span>
                </button>
              ) : (
                <Link to="/" className="inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground">
                  <ArrowLeft className="size-4" /> {t("admin.backToSite")}
                </Link>
              )}
            </div>
          </header>

          {/* Main Content */}
          <main className="relative w-full px-6 sm:px-10 py-8">
            <div className="flex flex-col md:flex-row gap-8 items-start w-full">
              {/* Sidebar navigation */}
              <div className="w-full md:w-56 shrink-0 space-y-6">
                {/* Mobile Dropdown Trigger */}
                <div className="md:hidden mb-2">
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-card text-foreground font-semibold text-xs transition-all shadow-sm cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      {activeTab && <activeTab.icon className="size-4 text-electric" />}
                      <span>{activeTab ? activeTab.label : "Select Section"}</span>
                    </div>
                    <ChevronDown className={`size-4 text-muted-foreground transition-transform duration-200 ${mobileMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {mobileMenuOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden border border-border/60 bg-card rounded-xl mt-2 p-2 space-y-3 shadow-xl"
                      >
                        <div className="space-y-1">
                          <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-electric/80 mb-1">Tracker Platform</p>
                          {TRACKER_TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isCurrent = activeTab.id === tab.id;
                            return (
                              <Link
                                key={tab.id}
                                to={tab.to}
                                activeOptions={{ exact: tab.to === "/admin/tracker" }}
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center gap-2.5 cursor-pointer ${
                                  isCurrent ? "bg-electric/15 text-electric font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                                }`}
                              >
                                <Icon className="size-3.5 shrink-0" />
                                <span>{tab.label}</span>
                              </Link>
                            );
                          })}
                        </div>

                        <div className="border-t border-border pt-2 space-y-1">
                          <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-1">Core Admin</p>
                          {ADMIN_TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isCurrent = activeTab.id === tab.id;
                            return (
                              <Link
                                key={tab.id}
                                to={tab.to}
                                activeOptions={{ exact: true }}
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center gap-2.5 cursor-pointer ${
                                  isCurrent ? "bg-accent text-accent-foreground font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                                }`}
                              >
                                <Icon className="size-3.5 shrink-0" />
                                <span>{t(tab.labelKey)}</span>
                                {tab.id === "inquiries" && stats.pending > 0 && (
                                  <span className="ml-auto size-1.5 rounded-full bg-amber-400 animate-pulse" />
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Desktop sidebar */}
                <div className="hidden md:block space-y-6">
                  {/* Tracker Platform Group (TOP) */}
                  <div className="space-y-1">
                    <div className="px-3 mb-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-electric">Tracker Platform</p>
                    </div>
                    {TRACKER_TABS.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <Link
                          key={tab.id}
                          to={tab.to}
                          activeOptions={{ exact: tab.to === "/admin/tracker" }}
                          activeProps={{ className: "bg-electric/15 text-electric font-semibold border-l-2 border-electric pl-2.5" }}
                          inactiveProps={{ className: "text-muted-foreground hover:text-foreground hover:bg-foreground/5" }}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center gap-2.5 cursor-pointer"
                        >
                          <Icon className="size-3.5 shrink-0" />
                          <span>{tab.label}</span>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Core Admin Group (BELOW TRACKER) */}
                  <div className="space-y-1 border-t border-border pt-4">
                    <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-2">Core Admin</p>
                    {ADMIN_TABS.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <Link
                          key={tab.id}
                          to={tab.to}
                          activeOptions={{ exact: true }}
                          activeProps={{ className: "bg-accent text-accent-foreground font-semibold" }}
                          inactiveProps={{ className: "text-muted-foreground hover:text-foreground hover:bg-foreground/5" }}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center gap-2.5 cursor-pointer"
                        >
                          <Icon className="size-3.5 shrink-0" />
                          <span>{t(tab.labelKey)}</span>
                          {tab.id === "inquiries" && stats.pending > 0 && (
                            <span className="ml-auto size-1.5 rounded-full bg-amber-400 animate-pulse" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Main content pane */}
              <div className="flex-1 w-full min-w-0 min-h-[500px]">
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
