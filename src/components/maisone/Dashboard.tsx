import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Bell, Search } from "lucide-react";

const trend = [22, 30, 28, 42, 38, 55, 48, 65, 60, 72, 68, 84, 80, 92];

export function Dashboard() {
  return (
    <section id="dashboard" className="relative py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6">— The Console</p>
          <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-balance">
            One console for every <span className="italic gradient-text">sourcing decision</span>.
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative glass-strong rounded-3xl p-3 shadow-2xl"
        >
          <div className="rounded-2xl bg-card overflow-hidden border border-border">
            {/* top bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-red-500/70" />
                <span className="size-2.5 rounded-full bg-yellow-500/70" />
                <span className="size-2.5 rounded-full bg-emerald-500/70" />
                <span className="ml-4 text-xs text-muted-foreground">maisone.app / overview</span>
              </div>
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-xs text-muted-foreground">
                  <Search className="size-3" /> Search suppliers, POs, shipments
                </div>
                <Bell className="size-4 text-muted-foreground" />
                <div className="size-7 rounded-full bg-gradient-to-br from-electric to-violet-glow" />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-3 p-3">
              {/* sidebar */}
              <div className="hidden md:block col-span-2 space-y-1">
                {["Overview", "Suppliers", "Shipments", "Inventory", "Trends", "Automation", "Reports"].map((l, i) => (
                  <div key={l} className={`px-3 py-2 rounded-lg text-xs ${i === 0 ? "bg-accent text-foreground" : "text-muted-foreground"}`}>
                    {l}
                  </div>
                ))}
              </div>

              {/* main */}
              <div className="col-span-12 md:col-span-10 space-y-3">
                {/* KPIs */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: "Active Suppliers", value: "2,418", delta: "+12.6%", up: true },
                    { label: "Open POs", value: "184", delta: "+4.2%", up: true },
                    { label: "Avg Lead Time", value: "27d", delta: "-3.1d", up: true },
                    { label: "On-time Rate", value: "94.7%", delta: "+1.8%", up: true },
                  ].map((k) => (
                    <div key={k.label} className="rounded-xl p-4 bg-background border border-border">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{k.label}</p>
                      <p className="text-2xl font-semibold mt-1 tabular-nums">{k.value}</p>
                      <div className={`mt-1 inline-flex items-center gap-1 text-[11px] ${k.up ? "text-emerald-400" : "text-red-400"}`}>
                        {k.up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                        {k.delta}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  {/* Trend chart */}
                  <div className="lg:col-span-2 rounded-xl p-5 bg-background border border-border">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm font-medium">Sourcing Volume</p>
                        <p className="text-xs text-muted-foreground">Last 14 weeks · 4 regions</p>
                      </div>
                      <div className="flex gap-2 text-[10px] text-muted-foreground">
                        {["JP", "UK", "EU", "US"].map((r) => (
                          <span key={r} className="px-2 py-0.5 rounded-full bg-muted">{r}</span>
                        ))}
                      </div>
                    </div>
                    <svg viewBox="0 0 300 100" className="w-full h-32">
                      <defs>
                        <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="oklch(0.65 0.22 255)" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="oklch(0.65 0.22 255)" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <motion.path
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5 }}
                        d={`M ${trend.map((v, i) => `${(i / (trend.length - 1)) * 300} ${100 - v}`).join(" L ")}`}
                        fill="none"
                        stroke="oklch(0.65 0.22 255)"
                        strokeWidth="1.5"
                      />
                      <path
                        d={`M 0 100 L ${trend.map((v, i) => `${(i / (trend.length - 1)) * 300} ${100 - v}`).join(" L ")} L 300 100 Z`}
                        fill="url(#area)"
                      />
                    </svg>
                  </div>

                  {/* Recommendations */}
                  <div className="rounded-xl p-5 bg-background border border-border">
                    <p className="text-sm font-medium mb-1">AI Recommendations</p>
                    <p className="text-xs text-muted-foreground mb-4">Live · updated 2m ago</p>
                    <div className="space-y-3">
                      {[
                        { t: "Switch denim to Osaka Mill #042", s: "−18% cost · +6d lead" },
                        { t: "Pre-book Milan silk for Q3", s: "Trend confidence 87%" },
                        { t: "Risk alert · Vendor LDN-119", s: "Compliance review" },
                      ].map((r) => (
                        <div key={r.t} className="flex items-start gap-3 text-xs">
                          <div className="mt-1 size-1.5 rounded-full bg-electric" />
                          <div>
                            <p className="text-foreground">{r.t}</p>
                            <p className="text-muted-foreground mt-0.5">{r.s}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Shipments table */}
                <div className="rounded-xl bg-background border border-border overflow-hidden">
                  <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                    <p className="text-sm font-medium">Active Shipments</p>
                    <span className="text-[10px] text-muted-foreground">12 in transit</span>
                  </div>
                  <div className="divide-y divide-border text-xs">
                    {[
                      { id: "MS-7841", route: "Tokyo → London", eta: "Mar 14", status: "In transit", prog: 64 },
                      { id: "MS-7836", route: "Milan → New York", eta: "Mar 16", status: "Customs", prog: 82 },
                      { id: "MS-7822", route: "Paris → Los Angeles", eta: "Mar 18", status: "In transit", prog: 41 },
                    ].map((s) => (
                      <div key={s.id} className="grid grid-cols-12 gap-4 px-5 py-3 items-center">
                        <span className="col-span-2 tabular-nums text-muted-foreground">{s.id}</span>
                        <span className="col-span-4">{s.route}</span>
                        <span className="col-span-2 text-muted-foreground">{s.eta}</span>
                        <div className="col-span-3 h-1 rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-electric to-cyan-glow" style={{ width: `${s.prog}%` }} />
                        </div>
                        <span className="col-span-1 text-right text-emerald-400">{s.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
