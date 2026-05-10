import { motion } from "framer-motion";
import { Briefcase, Store, FileText, MessageSquare, BarChart3, Truck, Sparkles, Upload } from "lucide-react";

function MiniBars({ data }: { data: number[] }) {
  return (
    <div className="flex items-end gap-1 h-12">
      {data.map((h, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          whileInView={{ height: `${h}%` }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.04 }}
          className="flex-1 bg-gradient-to-t from-electric/30 to-violet-glow rounded-sm"
        />
      ))}
    </div>
  );
}

export function Portals() {
  return (
    <section id="portals" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6">— Portals</p>
          <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-balance">
            Two consoles. <span className="italic gradient-text">One ecosystem.</span>
          </h2>
          <p className="mt-6 text-muted-foreground max-w-xl">
            Brands and ateliers operate from purpose-built workspaces — synchronised in real time.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* CLIENT DASHBOARD */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-strong rounded-3xl p-3"
          >
            <div className="rounded-2xl bg-card border border-border overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Briefcase className="size-3.5 text-electric" />
                  <span className="text-xs font-medium">Client Console</span>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">House of NY</span>
              </div>

              <div className="p-4 space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { l: "Open RFQs", v: "24" },
                    { l: "Quotes In", v: "61" },
                    { l: "In Transit", v: "12" },
                  ].map((k) => (
                    <div key={k.l} className="rounded-xl bg-background border border-border p-3">
                      <p className="text-lg font-semibold tabular-nums">{k.v}</p>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{k.l}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl bg-background border border-border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-medium flex items-center gap-2"><FileText className="size-3 text-electric" /> Quotation Comparison</p>
                    <span className="text-[10px] text-muted-foreground">RFQ-7841 · Denim Jackets</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { v: "Osaka Mill #042", price: "$22", lead: "4w", best: true },
                      { v: "Atelier Camden", price: "$31", lead: "5w" },
                      { v: "Sartoria Veneto", price: "$38", lead: "6w" },
                    ].map((q) => (
                      <div key={q.v} className={`grid grid-cols-12 gap-3 items-center text-xs px-3 py-2 rounded-lg ${q.best ? "bg-electric/10 border border-electric/30" : "bg-muted/40"}`}>
                        <span className="col-span-6 truncate">{q.v}</span>
                        <span className="col-span-2 tabular-nums">{q.price}</span>
                        <span className="col-span-2 text-muted-foreground tabular-nums">{q.lead}</span>
                        <span className={`col-span-2 text-right text-[10px] ${q.best ? "text-electric" : "text-muted-foreground"}`}>
                          {q.best ? "Recommended" : "Compare"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-background border border-border p-4">
                    <p className="text-xs font-medium flex items-center gap-2 mb-2"><Truck className="size-3 text-electric" /> Order Tracking</p>
                    <p className="text-[10px] text-muted-foreground mb-2">MS-7836 · Milan → New York</p>
                    <div className="h-1 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-electric to-cyan-glow" style={{ width: "82%" }} />
                    </div>
                    <p className="text-[10px] text-emerald-400 mt-2">Customs · ETA Mar 16</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border p-4">
                    <p className="text-xs font-medium flex items-center gap-2 mb-2"><Sparkles className="size-3 text-electric" /> AI Recommendations</p>
                    <ul className="space-y-1 text-[11px] text-muted-foreground">
                      <li>· Switch denim to Osaka Mill #042</li>
                      <li>· Pre-book Milan silk for Q3</li>
                      <li>· Risk alert · Vendor LDN-119</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* VENDOR DASHBOARD */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass-strong rounded-3xl p-3"
          >
            <div className="rounded-2xl bg-card border border-border overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Store className="size-3.5 text-violet-glow" />
                  <span className="text-xs font-medium">Vendor Console</span>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Osaka Mill #042</span>
              </div>

              <div className="p-4 space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { l: "New Inquiries", v: "18" },
                    { l: "Catalog Items", v: "246" },
                    { l: "On-time Rate", v: "96%" },
                  ].map((k) => (
                    <div key={k.l} className="rounded-xl bg-background border border-border p-3">
                      <p className="text-lg font-semibold tabular-nums">{k.v}</p>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{k.l}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl bg-background border border-border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-medium flex items-center gap-2"><Upload className="size-3 text-violet-glow" /> Catalog Upload</p>
                    <span className="text-[10px] text-emerald-400">3 drafts</span>
                  </div>
                  <div className="border border-dashed border-border rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs">Drag & drop tech packs · CSV · imagery</p>
                      <p className="text-[10px] text-muted-foreground">AI auto-tags fabric, MOQ, lead time</p>
                    </div>
                    <button className="text-[10px] px-3 py-1.5 rounded-full bg-foreground text-background">Upload</button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-background border border-border p-4">
                    <p className="text-xs font-medium flex items-center gap-2 mb-3"><MessageSquare className="size-3 text-violet-glow" /> Sourcing Requests</p>
                    <ul className="space-y-1.5 text-[11px]">
                      {["500 Denim Jackets · House of NY", "1,200 Tees · Atelier LDN", "300 Selvedge · Studio Milano"].map((r) => (
                        <li key={r} className="flex items-center gap-2"><span className="size-1 rounded-full bg-violet-glow" />{r}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl bg-background border border-border p-4">
                    <p className="text-xs font-medium flex items-center gap-2 mb-3"><BarChart3 className="size-3 text-violet-glow" /> Performance</p>
                    <MiniBars data={[40, 62, 48, 72, 58, 84, 70, 92]} />
                    <p className="text-[10px] text-muted-foreground mt-2">Quote-to-order conversion · 38%</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
