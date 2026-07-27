import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Briefcase, TrendingUp, Clock, CheckCircle2, AlertCircle, DollarSign,
  Plus, ArrowRight, ArrowUpRight, Filter, Search, FileText
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  STAGE_NAMES,
  TrackerEnquiry,
  TrackerInvoice,
  TrackerPayment
} from "@/lib/tracker-store";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";

export const Route = createFileRoute("/admin/tracker/")({
  component: TrackerDashboard,
});

function TrackerDashboard() {
  const [enquiries, setEnquiries] = useState<TrackerEnquiry[]>([]);
  const [invoices, setInvoices] = useState<TrackerInvoice[]>([]);
  const [payments, setPayments] = useState<TrackerPayment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [
        { data: dbEnquiries },
        { data: dbInvoices },
        { data: dbPayments }
      ] = await Promise.all([
        supabase.from("tracker_enquiries").select("*").order("created_at", { ascending: false }),
        supabase.from("tracker_invoices").select("*").order("created_at", { ascending: false }),
        supabase.from("tracker_payments").select("*").order("created_at", { ascending: false })
      ]);

      setEnquiries(dbEnquiries ?? []);
      setInvoices(dbInvoices ?? []);
      setPayments(dbPayments ?? []);
    } catch (err) {
      console.error("Failed to load dashboard statistics:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Compute key stats
  const totalEnquiries = enquiries.length;
  const activeEnquiries = enquiries.filter(e => e.current_stage < 13 && e.current_status !== "Dropped").length;
  const inProduction = enquiries.filter(e => e.current_stage === 9).length;
  const pendingApprovals = enquiries.filter(e => e.current_stage === 7 || e.current_status === "Waiting").length;
  const pendingPayments = payments.filter(p => p.status === "Due" || p.status === "Overdue" || p.status === "Partially Paid").length;
  const completedOrders = enquiries.filter(e => e.current_stage === 13 && e.current_status === "Paid").length;
  
  const outstandingRevenue = payments.reduce((acc, p) => acc + (p.outstanding_balance || 0), 0);
  const totalRevenue = invoices.reduce((acc, inv) => acc + (inv.amount || 0), 0);

  // Chart data calculation
  const stageCounts: Record<string, number> = {};
  enquiries.forEach(e => {
    stageCounts[e.current_status] = (stageCounts[e.current_status] || 0) + 1;
  });
  const statusPieData = Object.keys(stageCounts).map(status => ({
    name: status,
    value: stageCounts[status]
  }));

  const COLORS = ["#C2A46D", "#60A5FA", "#34D399", "#F59E0B", "#F87171", "#A78BFA"];

  const monthlyOrdersData = [
    { month: "Jan", orders: 0, revenue: 0 },
    { month: "Feb", orders: 0, revenue: 0 },
    { month: "Mar", orders: 0, revenue: 0 },
    { month: "Apr", orders: 0, revenue: 0 },
    { month: "May", orders: 0, revenue: 0 },
    { month: "Jun", orders: 0, revenue: 0 },
    { month: "Jul", orders: totalEnquiries, revenue: totalRevenue }
  ];

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Header skeleton */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="space-y-2">
            <div className="h-4 w-24 bg-foreground/10 rounded-full" />
            <div className="h-8 w-56 bg-foreground/10 rounded-xl" />
            <div className="h-3 w-80 bg-foreground/10 rounded-full" />
          </div>
          <div className="h-9 w-32 bg-foreground/10 rounded-xl" />
        </div>

        {/* Metric Cards skeleton — 4 cols */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-5 rounded-2xl border border-border bg-card space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-3 w-24 bg-foreground/10 rounded-full" />
                <div className="size-4 bg-foreground/10 rounded" />
              </div>
              <div className="h-8 w-16 bg-foreground/10 rounded-lg" />
              <div className="h-3 w-32 bg-foreground/10 rounded-full" />
            </div>
          ))}
        </div>

        {/* Secondary metric row — 3 cols */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 rounded-xl border border-border bg-card/50 flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-2.5 w-28 bg-foreground/10 rounded-full" />
                <div className="h-6 w-16 bg-foreground/10 rounded-lg" />
              </div>
              <div className="size-6 bg-foreground/10 rounded-full" />
            </div>
          ))}
        </div>

        {/* Charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 p-6 rounded-2xl border border-border bg-card space-y-4">
            <div className="h-5 w-64 bg-foreground/10 rounded-full" />
            <div className="h-3 w-48 bg-foreground/10 rounded-full" />
            <div className="h-[250px] w-full bg-foreground/10 rounded-xl" />
          </div>
          <div className="lg:col-span-4 p-6 rounded-2xl border border-border bg-card space-y-4">
            <div className="h-5 w-40 bg-foreground/10 rounded-full" />
            <div className="h-3 w-48 bg-foreground/10 rounded-full" />
            <div className="h-[200px] w-full bg-foreground/10 rounded-xl" />
          </div>
        </div>

        {/* Recent Enquiries table skeleton */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-5 w-56 bg-foreground/10 rounded-full" />
              <div className="h-3 w-72 bg-foreground/10 rounded-full" />
            </div>
            <div className="h-4 w-28 bg-foreground/10 rounded-full" />
          </div>
          <div className="divide-y divide-border">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-foreground/10 shrink-0" />
                  <div className="space-y-2">
                    <div className="h-3 w-48 bg-foreground/10 rounded-full" />
                    <div className="h-2.5 w-32 bg-foreground/10 rounded-full" />
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="space-y-2 hidden sm:block">
                    <div className="h-3 w-36 bg-foreground/10 rounded-full" />
                    <div className="h-2.5 w-24 bg-foreground/10 rounded-full" />
                  </div>
                  <div className="h-6 w-20 bg-foreground/10 rounded-full" />
                  <div className="size-8 rounded-lg bg-foreground/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] px-2.5 py-0.5 rounded-full bg-electric/15 text-electric">
              Internal ERP & CRM
            </span>
            <span className="text-xs text-muted-foreground">• Version 1.0</span>
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">Tracker Platform</h1>
          <p className="text-xs text-muted-foreground mt-1">
            End-to-end manual tracking from initial enquiry to final bulk payment settlement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/tracker/enquiries"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-electric text-background font-bold text-xs shadow-lg hover:brightness-110 transition-all cursor-pointer"
          >
            <Plus className="size-4" />
            New Enquiry
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Enquiries */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm hover:border-electric/40 transition-colors">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-semibold">Total Enquiries</span>
            <Briefcase className="size-4 text-electric" />
          </div>
          <p className="text-2xl font-serif font-bold text-foreground">{totalEnquiries}</p>
          <p className="text-[11px] text-muted-foreground mt-1">{activeEnquiries} active in pipeline</p>
        </div>

        {/* Orders In Production */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm hover:border-blue-500/40 transition-colors">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-semibold">In Production</span>
            <TrendingUp className="size-4 text-blue-500" />
          </div>
          <p className="text-2xl font-serif font-bold text-foreground">{inProduction}</p>
          <p className="text-[11px] text-blue-400 mt-1">Stage 9 active factory orders</p>
        </div>

        {/* Pending Approvals */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-semibold">Pending Approvals</span>
            <Clock className="size-4 text-amber-500" />
          </div>
          <p className="text-2xl font-serif font-bold text-foreground">{pendingApprovals}</p>
          <p className="text-[11px] text-amber-400 mt-1">Awaiting client decision</p>
        </div>

        {/* Outstanding Revenue */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-semibold">Outstanding Revenue</span>
            <DollarSign className="size-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-serif font-bold text-foreground">${outstandingRevenue.toLocaleString()}</p>
          <p className="text-[11px] text-emerald-400 mt-1">{pendingPayments} pending invoice payments</p>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card/50 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Completed Orders</p>
            <p className="text-xl font-bold text-foreground mt-0.5">{completedOrders}</p>
          </div>
          <CheckCircle2 className="size-6 text-emerald-500/80" />
        </div>

        <div className="p-4 rounded-xl border border-border bg-card/50 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Total Invoiced</p>
            <p className="text-xl font-bold text-foreground mt-0.5">${totalRevenue.toLocaleString()}</p>
          </div>
          <FileText className="size-6 text-electric/80" />
        </div>

        <div className="p-4 rounded-xl border border-border bg-card/50 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Pending Payments</p>
            <p className="text-xl font-bold text-foreground mt-0.5">{pendingPayments} Payments</p>
          </div>
          <AlertCircle className="size-6 text-amber-500/80" />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue & Monthly Orders Trend */}
        <div className="lg:col-span-8 p-6 rounded-2xl border border-border bg-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-semibold">Enquiry Pipeline & Revenue Trend</h3>
              <p className="text-xs text-muted-foreground">Monthly growth of tracked client projects</p>
            </div>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyOrdersData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C2A46D" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#C2A46D" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 'auto']} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip contentStyle={{ backgroundColor: "#1A1A1A", borderColor: "#333", borderRadius: "12px", fontSize: "12px" }} />
                <Area type="monotone" dataKey="revenue" stroke="#C2A46D" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown Pie */}
        <div className="lg:col-span-4 p-6 rounded-2xl border border-border bg-card space-y-4">
          <div>
            <h3 className="font-serif text-lg font-semibold">Status Breakdown</h3>
            <p className="text-xs text-muted-foreground">Distribution across pipeline stages</p>
          </div>
          <div className="h-[200px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                  {statusPieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1A1A1A", borderColor: "#333", borderRadius: "12px", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Enquiries Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-semibold">Recently Updated Enquiries</h3>
            <p className="text-xs text-muted-foreground">Active projects and their 13-stage progression status</p>
          </div>
          <Link to="/admin/tracker/enquiries" className="text-xs font-semibold text-electric hover:underline flex items-center gap-1">
            View All Enquiries <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-border overflow-x-auto">
          {enquiries.map((e) => (
            <div key={e.id} className="p-4 flex items-center justify-between gap-4 hover:bg-foreground/[0.02] transition-colors">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-xl bg-electric/10 text-electric font-serif text-xs font-bold flex items-center justify-center border border-electric/20 shrink-0">
                  #{e.current_stage}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-electric">{e.enquiry_number}</span>
                    <span className="text-xs font-semibold text-foreground">{e.product_reference}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{e.client_name} • {e.country}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-medium text-foreground">Stage {e.current_stage}: {STAGE_NAMES[e.current_stage - 1]}</p>
                  <p className="text-[11px] text-muted-foreground">{e.factory_name || "Factory Pending"}</p>
                </div>

                <span className="text-xs px-3 py-1 rounded-full font-medium bg-secondary border border-border text-foreground">
                  {e.current_status}
                </span>

                <Link
                  to="/admin/tracker/enquiries"
                  className="size-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
                >
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
