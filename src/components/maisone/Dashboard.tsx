import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Bell, Search, Filter, MapPin, Package, Sparkles, User, Phone, Mail, Pencil, Trash2 } from "lucide-react";

const trend = [22, 30, 28, 42, 38, 55, 48, 65, 60, 72, 68, 84, 80, 92];

type View = "Overview" | "Suppliers" | "Shipments" | "Inventory" | "Trends";

export const SUPPLIERS = [
  { id: "JP-014", name: "Osaka Mill #042", region: "Japan", city: "Osaka", category: "Denim", lead: 21, rating: 4.9, otd: 96 },
  { id: "JP-022", name: "Kyōto Atelier", region: "Japan", city: "Kyoto", category: "Silk", lead: 28, rating: 4.8, otd: 94 },
  { id: "EU-088", name: "Milano Tessile", region: "Europe", city: "Milan", category: "Wool", lead: 24, rating: 4.7, otd: 92 },
  { id: "EU-091", name: "Maison Lyon", region: "Europe", city: "Lyon", category: "Silk", lead: 30, rating: 4.6, otd: 89 },
  { id: "UK-119", name: "Savile House", region: "United Kingdom", city: "London", category: "Tailoring", lead: 26, rating: 4.5, otd: 88 },
  { id: "US-203", name: "Brooklyn Knit Co.", region: "United States", city: "New York", category: "Knitwear", lead: 19, rating: 4.7, otd: 93 },
  { id: "US-217", name: "LA Leatherworks", region: "United States", city: "Los Angeles", category: "Leather", lead: 32, rating: 4.4, otd: 86 },
  { id: "JP-045", name: "Tokyo Weaves", region: "Japan", city: "Tokyo", category: "Knitwear", lead: 15, rating: 4.9, otd: 97 },
  { id: "EU-102", name: "Barcelona Cotton", region: "Europe", city: "Barcelona", category: "Denim", lead: 22, rating: 4.6, otd: 91 },
  { id: "UK-130", name: "Manchester Textiles", region: "United Kingdom", city: "Manchester", category: "Wool", lead: 20, rating: 4.4, otd: 87 },
  { id: "US-240", name: "Portland Craft Mill", region: "United States", city: "Portland", category: "Tailoring", lead: 25, rating: 4.8, otd: 95 },
  { id: "JP-060", name: "Nara Silks", region: "Japan", city: "Nara", category: "Silk", lead: 27, rating: 4.7, otd: 93 },
  { id: "EU-120", name: "Parisian Atelier", region: "Europe", city: "Paris", category: "Leather", lead: 29, rating: 4.8, otd: 90 }
];

export const SHIPMENTS = [
  { id: "MS-7841", route: "Tokyo → London", eta: "Mar 14", status: "In transit", prog: 64 },
  { id: "MS-7836", route: "Milan → New York", eta: "Mar 16", status: "Customs", prog: 82 },
  { id: "MS-7822", route: "Paris → Los Angeles", eta: "Mar 18", status: "In transit", prog: 41 },
  { id: "MS-7818", route: "Osaka → Berlin", eta: "Mar 20", status: "In transit", prog: 28 },
  { id: "MS-7810", route: "London → New York", eta: "Mar 13", status: "Delivered", prog: 100 },
  { id: "MS-7808", route: "Barcelona → Tokyo", eta: "Mar 22", status: "In transit", prog: 15 },
  { id: "MS-7805", route: "Manchester → Milan", eta: "Mar 15", status: "Delivered", prog: 100 },
  { id: "MS-7801", route: "New York → Paris", eta: "Mar 25", status: "In transit", prog: 10 },
  { id: "MS-7798", route: "Portland → London", eta: "Mar 24", status: "In transit", prog: 30 },
  { id: "MS-7795", route: "Los Angeles → Kyoto", eta: "Mar 17", status: "Customs", prog: 75 },
  { id: "MS-7790", route: "Lyon → Tokyo", eta: "Mar 26", status: "In transit", prog: 5 },
  { id: "MS-7788", route: "Berlin → New York", eta: "Mar 19", status: "Delivered", prog: 100 }
];

const NAV: View[] = ["Overview", "Suppliers", "Shipments", "Inventory", "Trends"];

export function Dashboard() {
  const [view, setView] = useState<View>("Overview");
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<string>("All");

  return (
    <section id="dashboard" className="relative py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6">— The Console</p>
          <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-balance">
            One console for every <span className="italic gradient-text">sourcing decision</span>.
          </h2>
          <p className="mt-6 text-muted-foreground text-sm">Try the live preview — switch tabs, filter suppliers, search shipments.</p>
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
                <span className="ml-4 text-xs text-muted-foreground">maisone.app / {view.toLowerCase()}</span>
              </div>
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-xs">
                  <Search className="size-3 text-muted-foreground" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search suppliers, POs, shipments"
                    className="bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-56"
                  />
                </div>
                <Bell className="size-4 text-muted-foreground" />
                <div className="size-7 rounded-full bg-gradient-to-br from-electric to-violet-glow" />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-3 p-3">
              {/* sidebar */}
              <div className="hidden md:block col-span-2 space-y-1">
                {NAV.map((l) => (
                  <button
                    key={l}
                    onClick={() => setView(l)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${view === l ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      }`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              {/* main */}
              <div className="col-span-12 md:col-span-10 space-y-3 min-h-[480px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={view}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-3"
                  >
                    {view === "Overview" && <Overview query={query} />}
                    {view === "Suppliers" && (
                      <Suppliers query={query} region={region} setRegion={setRegion} />
                    )}
                    {view === "Shipments" && <Shipments query={query} />}
                    {view === "Inventory" && <Inventory />}
                    {view === "Trends" && <Trends />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function Overview({ query, data }: { query: string; data?: any[] }) {
  const [shipmentsList, setShipmentsList] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("MAISONE_SHIPMENTS");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return SHIPMENTS;
  });

  useEffect(() => {
    const handleUpdate = () => {
      const saved = localStorage.getItem("MAISONE_SHIPMENTS");
      if (saved) {
        setShipmentsList(JSON.parse(saved));
      }
    };
    window.addEventListener("maisone-data-update", handleUpdate);
    return () => window.removeEventListener("maisone-data-update", handleUpdate);
  }, []);

  const listToUse = data ?? shipmentsList;

  const filteredShip = listToUse.filter((s: any) =>
    !query || s.id.toLowerCase().includes(query.toLowerCase()) || s.route.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  return (
    <>
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

      <div className="grid grid-cols-1 gap-3">
        <div className="rounded-xl p-5 bg-background border border-border">
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
      </div>

      <div className="rounded-xl bg-background border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <p className="text-sm font-medium">Active Shipments</p>
          <span className="text-[10px] text-muted-foreground">{filteredShip.length} shown</span>
        </div>
        <div className="divide-y divide-border text-xs">
          {filteredShip.map((s: any) => (
            <div key={s.id} className="grid grid-cols-12 gap-4 px-5 py-3 items-center">
              <span className="col-span-2 tabular-nums text-muted-foreground">{s.id}</span>
              <span className="col-span-4">{s.route}</span>
              <span className="col-span-2 text-muted-foreground">{s.eta}</span>
              <div className="col-span-3 h-1 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-electric to-cyan-glow"
                  initial={{ width: 0 }}
                  animate={{ width: `${s.prog}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              <span className="col-span-1 text-right text-emerald-400">{s.status}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export function Suppliers({ 
  query, 
  region, 
  setRegion, 
  data,
  onEdit,
  onDelete
}: { 
  query: string; 
  region: string; 
  setRegion: (r: string) => void; 
  data?: any[];
  onEdit?: (supplier: any) => void;
  onDelete?: (id: string) => void;
}) {
  const regions = ["All", "Japan", "United Kingdom", "Europe", "United States", "India", "China"];
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const PAGE_SIZE = 10;

  const [suppliersList, setSuppliersList] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("MAISONE_SUPPLIERS");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return SUPPLIERS;
  });

  useEffect(() => {
    const handleUpdate = () => {
      const saved = localStorage.getItem("MAISONE_SUPPLIERS");
      if (saved) {
        setSuppliersList(JSON.parse(saved));
      }
    };
    window.addEventListener("maisone-data-update", handleUpdate);
    return () => window.removeEventListener("maisone-data-update", handleUpdate);
  }, []);

  const listToUse = data ?? suppliersList;

  const filtered = useMemo(
    () =>
      listToUse.filter(
        (s: any) =>
          (region === "All" || s.region === region) &&
          (!query ||
            s.name.toLowerCase().includes(query.toLowerCase()) ||
            s.id.toLowerCase().includes(query.toLowerCase()) ||
            s.category.toLowerCase().includes(query.toLowerCase()))
      ),
    [listToUse, query, region]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(() => {
    const from = (page - 1) * PAGE_SIZE;
    return filtered.slice(from, from + PAGE_SIZE);
  }, [filtered, page]);

  return (
    <>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Filter className="size-3" /> Region:
          {regions.map((r) => (
            <button
              key={r}
              onClick={() => {
                setRegion(r);
                setPage(1);
              }}
              className={`px-3 py-1 rounded-full border text-[11px] ${region === r ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}
            >
              {r}
            </button>
          ))}
        </div>
        <span className="text-[11px] text-muted-foreground">{filtered.length} verified suppliers</span>
      </div>

      <div className="rounded-xl bg-background border border-border overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-border text-[10px] uppercase tracking-widest text-muted-foreground">
          <span className="col-span-2">ID</span>
          <span className="col-span-3">Supplier</span>
          <span className="col-span-2">Region</span>
          <span className="col-span-2">Category</span>
          <span className="col-span-1 text-right">Lead</span>
          <span className="col-span-1 text-right">OTD Rate</span>
          <span className="col-span-1 text-right">★</span>
        </div>
        <div className="divide-y divide-border text-xs">
          {paginated.length === 0 && (
            <div className="px-6 py-8 text-center text-muted-foreground">No suppliers match your filters.</div>
          )}
          {paginated.map((s: any) => {
            const isExpanded = expandedId === s.id;
            return (
              <div key={s.id} className="border-b border-border/20 last:border-0">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setExpandedId(isExpanded ? null : s.id)}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-accent/30 cursor-pointer transition-colors ${
                    isExpanded ? "bg-accent/25" : ""
                  }`}
                >
                  <span className="col-span-2 tabular-nums text-muted-foreground">{s.id}</span>
                  <span className="col-span-3 font-medium text-white">{s.name}</span>
                  <span className="col-span-2 text-muted-foreground inline-flex items-center gap-1.5">
                    <MapPin className="size-3" /> {s.city}
                  </span>
                  <span className="col-span-2">
                    <span className="px-2 py-0.5 rounded-full bg-muted text-[10px]">{s.category}</span>
                  </span>
                  <span className="col-span-1 text-right tabular-nums">{s.lead}d</span>
                  <span className="col-span-1 text-right tabular-nums text-emerald-400">{s.otd}%</span>
                  <span className="col-span-1 text-right tabular-nums">{s.rating}</span>
                </motion.div>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden bg-white/[0.01]"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 px-8 py-6 border-t border-border/30 text-xs bg-white/[0.005]">
                        <div className="flex gap-3.5">
                          <div className="size-9 rounded-xl bg-electric/10 border border-electric/20 flex items-center justify-center shrink-0">
                            <User className="size-4 text-electric" />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-semibold">Owner Details</span>
                            <span className="text-white font-medium block text-[13px]">{s.owner_details || "—"}</span>
                          </div>
                        </div>
                        <div className="flex gap-3.5">
                          <div className="size-9 rounded-xl bg-electric/10 border border-electric/20 flex items-center justify-center shrink-0">
                            <Phone className="size-4 text-electric" />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-semibold">Contact Number</span>
                            <span className="text-white font-medium block text-[13px]">{s.contact_no || "—"}</span>
                          </div>
                        </div>
                        <div className="flex gap-3.5">
                          <div className="size-9 rounded-xl bg-electric/10 border border-electric/20 flex items-center justify-center shrink-0">
                            <Mail className="size-4 text-electric" />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-semibold">Email Address</span>
                            {s.email_id ? (
                              <a
                                href={`mailto:${s.email_id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="text-electric hover:underline font-medium block text-[13px] transition-colors"
                              >
                                {s.email_id}
                              </a>
                            ) : (
                              <span className="text-muted-foreground block text-[13px]">—</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Admin action buttons */}
                      {(onEdit || onDelete) && (
                        <div className="px-8 pb-6 flex justify-end gap-3 border-t border-border/10 pt-4 bg-white/[0.01]">
                          {onEdit && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit(s);
                              }}
                              className="px-4 py-2 rounded-xl border border-white/10 hover:border-electric/50 hover:bg-electric/5 transition-all text-white font-semibold text-[11px] cursor-pointer flex items-center gap-1.5 active:scale-95 hover:scale-102"
                            >
                              <Pencil className="size-3.5 text-muted-foreground group-hover:text-white" /> Edit Details
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(s.id);
                              }}
                              className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-semibold text-[11px] cursor-pointer flex items-center gap-1.5 active:scale-95 hover:scale-102"
                            >
                              <Trash2 className="size-3.5" /> Delete
                            </button>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-2 text-xs">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            Previous
          </button>

          <div className="text-[10px] text-muted-foreground">
            Page <span className="text-foreground font-semibold">{page}</span> of {totalPages}
          </div>

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}

export function Shipments({ query, onSelect, data }: { query: string; onSelect?: (shipment: any) => void; data?: any[] }) {
  const [status, setStatus] = useState<string>("All");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const [shipmentsList, setShipmentsList] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("MAISONE_SHIPMENTS");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return SHIPMENTS;
  });

  useEffect(() => {
    const handleUpdate = () => {
      const saved = localStorage.getItem("MAISONE_SHIPMENTS");
      if (saved) {
        setShipmentsList(JSON.parse(saved));
      }
    };
    window.addEventListener("maisone-data-update", handleUpdate);
    return () => window.removeEventListener("maisone-data-update", handleUpdate);
  }, []);

  const listToUse = data ?? shipmentsList;

  const filtered = listToUse.filter(
    (s: any) =>
      (status === "All" || s.status.toLowerCase() === status.toLowerCase()) &&
      (!query || s.id.toLowerCase().includes(query.toLowerCase()) || s.route.toLowerCase().includes(query.toLowerCase()))
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(() => {
    const from = (page - 1) * PAGE_SIZE;
    return filtered.slice(from, from + PAGE_SIZE);
  }, [filtered, page]);

  const statuses = ["All", "In transit", "Customs", "Delivered"];
  return (
    <>
      <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
        <Package className="size-3" /> Status:
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatus(s);
              setPage(1);
            }}
            className={`px-3 py-1 rounded-full border text-[11px] ${status === s ? "bg-foreground text-background border-foreground" : "border-border hover:text-foreground"}`}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="rounded-xl bg-background border border-border overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-5 py-2.5 border-b border-border text-[10px] uppercase tracking-widest text-muted-foreground bg-white/[0.01]">
          <span className="col-span-2">ID</span>
          <span className="col-span-4">Route / Cargo</span>
          <span className="col-span-2">ETA</span>
          <span className="col-span-3">Progress</span>
          <span className="col-span-1 text-right">Status</span>
        </div>
        <div className="divide-y divide-border text-xs">
          {paginated.map((s: any) => (
            <div
              key={s.id}
              onClick={() => onSelect?.(s)}
              className={`grid grid-cols-12 gap-4 px-5 py-3 items-center transition-colors ${onSelect ? "hover:bg-accent/30 cursor-pointer" : ""}`}
            >
              <span className="col-span-2 tabular-nums text-muted-foreground">{s.id}</span>
              <span className="col-span-4">{s.route}</span>
              <span className="col-span-2 text-muted-foreground">{s.eta}</span>
              <div className="col-span-3 h-1 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-electric to-cyan-glow"
                  initial={{ width: 0 }}
                  animate={{ width: `${s.prog}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              <span className={`col-span-1 text-right ${s.status === "Delivered" ? "text-emerald-400" : s.status === "Customs" ? "text-amber-400" : "text-electric"}`}>{s.status}</span>
            </div>
          ))}
          {paginated.length === 0 && <div className="px-5 py-8 text-center text-muted-foreground">No shipments match.</div>}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-2 text-xs">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            Previous
          </button>

          <div className="text-[10px] text-muted-foreground">
            Page <span className="text-foreground font-semibold">{page}</span> of {totalPages}
          </div>

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}

export const DEFAULT_INVENTORY = [
  { sku: "DEN-501", name: "Selvedge Denim · 14oz", stock: 2840, reorder: 1500 },
  { sku: "SLK-220", name: "Mulberry Silk · Charmeuse", stock: 940, reorder: 1200 },
  { sku: "WOL-118", name: "Merino Wool · Fine", stock: 3210, reorder: 2000 },
  { sku: "LTR-077", name: "Italian Calf Leather", stock: 540, reorder: 600 },
  { sku: "KNT-304", name: "Cashmere Yarn · Grade A", stock: 1500, reorder: 1000 },
  { sku: "COT-412", name: "Organic Cotton · Pima", stock: 4200, reorder: 3000 },
  { sku: "LIN-156", name: "Pure Belgian Linen", stock: 850, reorder: 1000 },
  { sku: "NYL-089", name: "Recycled Nylon · Ripstop", stock: 1200, reorder: 800 },
  { sku: "PLR-215", name: "Polyester Fleece · Grid", stock: 2100, reorder: 1500 },
  { sku: "VIS-102", name: "Viscose Rayon · EcoVero", stock: 650, reorder: 1200 },
  { sku: "TNC-305", name: "Tencel Lyocell · Fine", stock: 3100, reorder: 2000 },
  { sku: "EMP-045", name: "Hemp Canvas · Heavy", stock: 450, reorder: 500 },
];

export function Inventory({ data }: { data?: any[] }) {
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const [inventoryList, setInventoryList] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("MAISONE_INVENTORY");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return DEFAULT_INVENTORY;
  });

  useEffect(() => {
    const handleUpdate = () => {
      const saved = localStorage.getItem("MAISONE_INVENTORY");
      if (saved) {
        setInventoryList(JSON.parse(saved));
      }
    };
    window.addEventListener("maisone-data-update", handleUpdate);
    return () => window.removeEventListener("maisone-data-update", handleUpdate);
  }, []);

  const listToUse = data ?? inventoryList;

  const totalPages = Math.max(1, Math.ceil(listToUse.length / PAGE_SIZE));
  const paginated = useMemo(() => {
    const from = (page - 1) * PAGE_SIZE;
    return listToUse.slice(from, from + PAGE_SIZE);
  }, [listToUse, page]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-background border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border text-sm font-medium">Inventory levels</div>
        <div className="grid grid-cols-12 gap-4 px-5 py-2 border-b border-border bg-white/[0.01] text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
          <div className="col-span-2">SKU</div>
          <div className="col-span-5">Product Name</div>
          <div className="col-span-3">Stock Level</div>
          <div className="col-span-2 text-right">Status</div>
        </div>
        <div className="divide-y divide-border text-xs">
          {paginated.map((i: any) => {
            const low = i.stock < i.reorder;
            return (
              <div key={i.sku} className="grid grid-cols-12 gap-4 px-5 py-3 items-center">
                <span className="col-span-2 text-muted-foreground tabular-nums">{i.sku}</span>
                <span className="col-span-5">{i.name}</span>
                <span className="col-span-3 tabular-nums">{i.stock.toLocaleString()} u</span>
                <span className={`col-span-2 text-right text-[11px] ${low ? "text-amber-400" : "text-emerald-400"}`}>{low ? "Reorder" : "Healthy"}</span>
              </div>
            );
          })}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            Previous
          </button>

          <div className="text-[10px] text-muted-foreground">
            Page <span className="text-foreground font-semibold">{page}</span> of {totalPages}
          </div>

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export function Trends() {
  const cats = [
    { c: "Denim", v: [30, 38, 45, 52, 60, 68, 74, 82] },
    { c: "Silk", v: [50, 48, 55, 60, 58, 65, 72, 78] },
    { c: "Knitwear", v: [20, 25, 32, 40, 48, 56, 60, 70] },
  ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      {cats.map((c) => (
        <div key={c.c} className="rounded-xl p-5 bg-background border border-border">
          <p className="text-sm font-medium">{c.c}</p>
          <p className="text-xs text-muted-foreground mb-3">Demand · 8 weeks</p>
          <svg viewBox="0 0 100 40" className="w-full h-20">
            <motion.path
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 1.4 }}
              d={`M ${c.v.map((v, i) => `${(i / (c.v.length - 1)) * 100} ${40 - v / 2.5}`).join(" L ")}`}
              fill="none"
              stroke="oklch(0.65 0.22 255)"
              strokeWidth="1.2"
            />
          </svg>
          <p className="text-[11px] text-emerald-400 mt-2">+{c.v[c.v.length - 1] - c.v[0]}% trend</p>
        </div>
      ))}
    </div>
  );
}

export function AutomationView() {
  const flows = [
    { name: "Auto-RFQ to top 5 suppliers", runs: 1240, status: "Active" },
    { name: "Sync POs → Zoho Books", runs: 836, status: "Active" },
    { name: "WhatsApp shipment alerts", runs: 4120, status: "Active" },
    { name: "Notion brief → AI sourcing", runs: 312, status: "Paused" },
  ];
  return (
    <div className="rounded-xl bg-background border border-border overflow-hidden">
      <div className="divide-y divide-border text-xs">
        {flows.map((f) => (
          <div key={f.name} className="flex items-center justify-between px-5 py-3">
            <div>
              <p className="text-foreground">{f.name}</p>
              <p className="text-muted-foreground text-[11px] mt-0.5">{f.runs.toLocaleString()} runs · last 30d</p>
            </div>
            <span className={`text-[11px] ${f.status === "Active" ? "text-emerald-400" : "text-muted-foreground"}`}>{f.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Reports() {
  const reports = [
    { t: "Q1 Sourcing Performance", d: "Generated 02 Mar" },
    { t: "Vendor Compliance Audit", d: "Generated 27 Feb" },
    { t: "Lead-time Benchmark · EU", d: "Generated 18 Feb" },
  ];
  return (
    <div className="grid sm:grid-cols-3 gap-3">
      {reports.map((r) => (
        <div key={r.t} className="rounded-xl p-5 bg-background border border-border">
          <p className="text-sm font-medium">{r.t}</p>
          <p className="text-xs text-muted-foreground mt-1">{r.d}</p>
          <button className="mt-4 text-[11px] text-electric hover:underline">Open report →</button>
        </div>
      ))}
    </div>
  );
}
