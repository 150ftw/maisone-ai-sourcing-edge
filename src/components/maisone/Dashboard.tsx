import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Bell, Search, Filter, MapPin, Package, Sparkles, User, Phone, Mail, Pencil, Trash2, Link2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/lib/i18n";

const trend = [22, 30, 28, 42, 38, 55, 48, 65, 60, 72, 68, 84, 80, 92];

type View = "Overview" | "Suppliers" | "Trends";

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

const NAV: View[] = ["Overview", "Suppliers", "Trends"];

export function Dashboard() {
  const { t } = useLanguage();
  const NAV_LABELS: Record<View, string> = {
    Overview: t("dashboard.tabOverview"),
    Suppliers: t("dashboard.tabSuppliers"),
    Trends: t("dashboard.tabTrends"),
  };
  const [view, setView] = useState<View>("Overview");
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<string>("All");

  return (
    <section id="dashboard" className="relative py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6">{t("dashboard.label")}</p>
          <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-balance">
            {t("dashboard.heading")} <span className="italic gradient-text">{t("dashboard.headingHighlight")}</span>{t("dashboard.headingEnd")}
          </h2>
          <p className="mt-6 text-muted-foreground text-sm">{t("dashboard.subtitle")}</p>
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
                    placeholder={t("dashboard.searchPlaceholder")}
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
                    {NAV_LABELS[l]}
                  </button>
                ))}
              </div>

              {/* main */}
              <div className="col-span-12 md:col-span-10 space-y-3 min-h-[620px]">
                {/* Mobile Nav Tabs */}
                <div className="md:hidden flex border border-border rounded-xl p-1 gap-1 bg-muted/30">
                  {NAV.map((l) => (
                    <button
                      key={l}
                      onClick={() => setView(l)}
                      className={`flex-1 text-center py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${view === l ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      {NAV_LABELS[l]}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={view}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-3"
                  >
                    {view === "Overview" && <Overview query={query} hideShipments={true} />}
                    {view === "Suppliers" && (
                      <Suppliers query={query} region={region} setRegion={setRegion} />
                    )}
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

export function Overview({ query, data, hideShipments, metrics }: { 
  query: string; 
  data?: any[]; 
  hideShipments?: boolean;
  metrics?: {
    activeSuppliers: string | number;
    openPos: string | number;
    avgLeadTime: string | number;
    onTimeRate: string | number;
  };
}) {
  const { t } = useLanguage();
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
    <div className="space-y-3 min-h-[565px]">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: t("dashboard.activeSuppliers"), value: metrics ? metrics.activeSuppliers : "2,418", delta: "+12.6%", up: true },
          { label: t("dashboard.openPos"), value: metrics ? metrics.openPos : "184", delta: "+4.2%", up: true },
          { label: t("dashboard.avgLeadTime"), value: metrics ? metrics.avgLeadTime : "27d", delta: "-3.1d", up: true },
          { label: t("dashboard.onTimeRate"), value: metrics ? metrics.onTimeRate : "94.7%", delta: "+1.8%", up: true },
        ].map((k) => (
          <div key={k.label} className="rounded-xl p-4 bg-card border border-border">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{k.label}</p>
            <p className="text-2xl font-semibold mt-1 tabular-nums">{k.value}</p>
            <div className={`mt-1 inline-flex items-center gap-1 text-[11px] ${k.up ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
              {k.up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
              {k.delta}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3">
        <div className="rounded-xl p-5 bg-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium">{t("dashboard.sourcingVolume")}</p>
              <p className="text-xs text-muted-foreground">{t("dashboard.lastWeeks")}</p>
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

      {!hideShipments && (
        <div className="rounded-xl bg-background border border-border overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <p className="text-sm font-medium">{t("dashboard.activeShipments")}</p>
            <span className="text-[10px] text-muted-foreground">{filteredShip.length} {t("dashboard.shown")}</span>
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
      )}
    </div>
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
  const { t } = useLanguage();
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
    () => {
      const result = listToUse.filter(
        (s: any) =>
          (region === "All" || s.region === region) &&
          (!query ||
            s.name.toLowerCase().includes(query.toLowerCase()) ||
            s.id.toLowerCase().includes(query.toLowerCase()) ||
            s.category.toLowerCase().includes(query.toLowerCase()))
      );
      return result.sort((a: any, b: any) => a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' }));
    },
    [listToUse, query, region]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(() => {
    const from = (page - 1) * PAGE_SIZE;
    return filtered.slice(from, from + PAGE_SIZE);
  }, [filtered, page]);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-wrap bg-foreground/[0.01] border border-border/15 p-3 rounded-2xl mb-2">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 mr-1 font-semibold uppercase tracking-wider text-[10px]">
            <Filter className="size-3" /> {t("dashboard.region")}:
          </div>
          {regions.map((r) => (
            <button
              key={r}
              onClick={() => {
                setRegion(r);
                setPage(1);
              }}
              className={`whitespace-nowrap px-3 py-1 rounded-full border text-[11px] transition-all cursor-pointer ${
                region === r
                  ? "bg-foreground text-background border-foreground font-semibold"
                  : "border-border text-muted-foreground hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <span className="text-[11px] text-muted-foreground font-medium">{filtered.length} {t("dashboard.verifiedSuppliers")}</span>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-4">
        {paginated.length === 0 ? (
          <div className="px-6 py-8 text-center text-muted-foreground">{t("dashboard.noSuppliers")}</div>
        ) : (
          paginated.map((s: any) => {
            const isExpanded = expandedId === s.id;
            
            let parsedDetails: any = null;
            let ownerText = s.owner_details || "—";
            if (s.owner_details && s.owner_details.startsWith("{")) {
              try {
                parsedDetails = JSON.parse(s.owner_details);
                ownerText = parsedDetails.owner || "—";
              } catch (e) {}
            }
            
            return (
              <div key={s.id} className="glass rounded-2xl p-4 border border-border space-y-3 bg-card shadow-sm text-xs">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 border-b border-border/5 pb-3">
                  <div>
                    <span className="text-[10px] tabular-nums text-muted-foreground/60">{s.id}</span>
                    <h3 className="font-bold text-foreground text-sm mt-0.5">{s.name}</h3>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-1">
                      <MapPin className="size-3 shrink-0" />
                      <span>{s.city}, {s.region}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : s.id)}
                    className="px-3 py-1.5 rounded-lg border border-border hover:border-electric/30 text-[10px] font-semibold text-electric cursor-pointer hover:bg-electric/5"
                  >
                    {isExpanded ? "Hide Details" : "View Profile"}
                  </button>
                </div>

                {/* Categories & quick metrics */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex flex-wrap gap-1">
                    {(s.category ? s.category.split(", ") : []).map((cat: string) => (
                      <span key={cat} className="px-2 py-0.5 rounded-full bg-muted text-[9px] font-medium text-foreground/80">{cat}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 shrink-0 font-medium tabular-nums text-[11px]">
                    <span>Lead: <span className="text-foreground font-semibold">{s.lead}d</span></span>
                    <span>OTD: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{s.otd}%</span></span>
                    <span className="flex items-center gap-0.5">★ <span className="text-foreground font-semibold">{s.rating}</span></span>
                  </div>
                </div>

                {/* Collapsible Details */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-border/20 pt-3 space-y-4 text-xs"
                    >
                      {/* Contact information */}
                      <div className="grid grid-cols-1 gap-2.5 bg-foreground/[0.01] p-3 rounded-xl border border-border/10">
                        <div className="flex items-center gap-2">
                          <User className="size-3.5 text-electric shrink-0" />
                          <span className="text-muted-foreground mr-1.5">{t("dashboard.ownerDetails")}:</span>
                          <span className="text-foreground font-medium">{ownerText}</span>
                        </div>
                        {s.contact_no && (
                          <div className="flex items-center gap-2">
                            <Phone className="size-3.5 text-electric shrink-0" />
                            <span className="text-muted-foreground mr-1.5">{t("dashboard.contactNo")}:</span>
                            <span className="text-foreground font-medium">{s.contact_no}</span>
                          </div>
                        )}
                        {s.email_id && (
                          <div className="flex items-center gap-2">
                            <Mail className="size-3.5 text-electric shrink-0" />
                            <span className="text-muted-foreground mr-1.5">{t("dashboard.emailAddress")}:</span>
                            <a href={`mailto:${s.email_id}`} className="text-electric hover:underline font-medium">{s.email_id}</a>
                          </div>
                        )}
                      </div>

                      {/* Capabilities */}
                      {parsedDetails && (
                        <div className="space-y-3 bg-foreground/[0.01] p-3 rounded-xl border border-border/10">
                          {parsedDetails.clientele && (
                            <div>
                              <span className="text-[9px] uppercase tracking-wider text-muted-foreground block font-bold">Key Clientele</span>
                              <span className="text-foreground leading-relaxed block mt-0.5">{parsedDetails.clientele}</span>
                            </div>
                          )}
                          {parsedDetails.fabrics && (
                            <div>
                              <span className="text-[9px] uppercase tracking-wider text-muted-foreground block font-bold">Fabrics & Materials</span>
                              <span className="text-foreground leading-relaxed block mt-0.5">{parsedDetails.fabrics}</span>
                            </div>
                          )}
                          {parsedDetails.capabilities && (
                            <div>
                              <span className="text-[9px] uppercase tracking-wider text-muted-foreground block font-bold">Core Capabilities</span>
                              <span className="text-foreground leading-relaxed block mt-0.5">{parsedDetails.capabilities}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Logistics & Compliance */}
                      {parsedDetails && (
                        <div className="grid grid-cols-2 gap-3 bg-foreground/[0.01] p-3 rounded-xl border border-border/10">
                          <div>
                            <span className="text-[9px] uppercase tracking-wider text-muted-foreground block font-bold">Production Cap</span>
                            <span className="text-foreground font-medium block mt-0.5">{parsedDetails.productionCapacity || "—"}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase tracking-wider text-muted-foreground block font-bold">Min Order (MOQ)</span>
                            <span className="text-foreground font-medium block mt-0.5">{parsedDetails.moq || "100–500 units"}</span>
                          </div>
                          <div className="col-span-2 border-t border-border/5 pt-2 mt-1">
                            <span className="text-[9px] uppercase tracking-wider text-muted-foreground block font-bold">Sampling Lead Time</span>
                            <span className="text-foreground font-medium block mt-0.5">{parsedDetails.samplingLeadTime || "—"}</span>
                          </div>
                          <div className="col-span-2 border-t border-border/5 pt-2">
                            <span className="text-[9px] uppercase tracking-wider text-muted-foreground block font-bold">Quality Control (QC)</span>
                            <span className="text-foreground block mt-0.5 leading-relaxed">{parsedDetails.qualityControl || "—"}</span>
                          </div>
                          {parsedDetails.certifications && (
                            <div className="col-span-2 border-t border-border/5 pt-2">
                              <span className="text-[9px] uppercase tracking-wider text-muted-foreground block font-bold">Certifications</span>
                              <span className="text-foreground block mt-0.5 leading-relaxed">{parsedDetails.certifications}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Admin action buttons */}
                      {(onEdit || onDelete) && (
                        <div className="flex justify-end gap-2.5 pt-2 border-t border-border/10">
                          {onEdit && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit(s);
                              }}
                              className="px-3 py-1.5 rounded-lg border border-border hover:border-electric/50 text-[10px] font-semibold text-foreground cursor-pointer flex items-center gap-1.5"
                            >
                              <Pencil className="size-3.5" /> Edit
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(s.id);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-[10px] font-semibold text-red-400 cursor-pointer flex items-center gap-1.5"
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
          })
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block w-full overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="rounded-xl bg-card border border-border overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-border text-[10px] uppercase tracking-widest text-muted-foreground">
              <span className="col-span-2">ID</span>
              <span className="col-span-3">{t("dashboard.tabSuppliers")}</span>
              <span className="col-span-2">{t("dashboard.region")}</span>
              <span className="col-span-2">Category</span>
              <span className="col-span-1 text-right">Lead</span>
              <span className="col-span-1 text-right">OTD Rate</span>
              <span className="col-span-1 text-right">★</span>
            </div>
            <div className="divide-y divide-border text-xs">
              {paginated.length === 0 && (
                <div className="px-6 py-8 text-center text-muted-foreground">{t("dashboard.noSuppliers")}</div>
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
                      <span className="col-span-3 font-medium text-foreground">{s.name}</span>
                      <span className="col-span-2 text-muted-foreground inline-flex items-center gap-1.5">
                        <MapPin className="size-3" /> {s.city}
                      </span>
                      <span className="col-span-2">
                        <span className="px-2 py-0.5 rounded-full bg-muted text-[10px]">{s.category}</span>
                      </span>
                      <span className="col-span-1 text-right tabular-nums">{s.lead}d</span>
                      <span className="col-span-1 text-right tabular-nums text-emerald-600 dark:text-emerald-400">{s.otd}%</span>
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
                          {(() => {
                            let parsedDetails: any = null;
                            let ownerText = s.owner_details || "—";
                            if (s.owner_details && s.owner_details.startsWith("{")) {
                              try {
                                parsedDetails = JSON.parse(s.owner_details);
                                ownerText = parsedDetails.owner || "—";
                              } catch (e) {}
                            }
                            return (
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 px-8 py-6 border-t border-border/30 text-xs bg-white/[0.005]">
                                {/* Left: Contact Info */}
                                <div className="space-y-4">
                                  <div className="flex gap-3.5">
                                    <div className="size-9 rounded-xl bg-electric/10 border border-electric/20 flex items-center justify-center shrink-0">
                                      <User className="size-4 text-electric" />
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-semibold">{t("dashboard.ownerDetails")}</span>
                                      <span className="text-foreground font-medium block text-[13px]">{ownerText}</span>
                                    </div>
                                  </div>
                                  <div className="flex gap-3.5">
                                    <div className="size-9 rounded-xl bg-electric/10 border border-electric/20 flex items-center justify-center shrink-0">
                                      <Phone className="size-4 text-electric" />
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-semibold">{t("dashboard.contactNo")}</span>
                                      <span className="text-foreground font-medium block text-[13px]">{s.contact_no || "—"}</span>
                                    </div>
                                  </div>
                                  <div className="flex gap-3.5">
                                    <div className="size-9 rounded-xl bg-electric/10 border border-electric/20 flex items-center justify-center shrink-0">
                                      <Mail className="size-4 text-electric" />
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-semibold">{t("dashboard.emailAddress")}</span>
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

                                {/* Center: Capabilities & Production */}
                                <div className="space-y-3 border-t sm:border-t-0 sm:border-l border-border/20 pt-4 sm:pt-0 sm:pl-8">
                                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-bold mb-1">Capabilities & Production</span>
                                  {parsedDetails ? (
                                    <div className="space-y-2">
                                      <div>
                                        <span className="text-muted-foreground font-medium">Clientele:</span> <span className="text-foreground ml-1">{parsedDetails.clientele || "—"}</span>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground font-medium">Fabrics:</span> <span className="text-foreground ml-1">{parsedDetails.fabrics || "—"}</span>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground font-medium">Capabilities:</span> <span className="text-foreground block mt-0.5 leading-relaxed">{parsedDetails.capabilities || "—"}</span>
                                      </div>
                                      <div className="grid grid-cols-2 gap-2 pt-1">
                                        <div>
                                          <span className="text-muted-foreground font-medium block">Monthly Capacity</span>
                                          <span className="text-foreground font-medium">{parsedDetails.productionCapacity || "—"}</span>
                                        </div>
                                        <div>
                                          <span className="text-muted-foreground font-medium block">Sampling Lead</span>
                                          <span className="text-foreground font-medium">{parsedDetails.samplingLeadTime || "—"}</span>
                                        </div>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground font-medium">MOQ:</span> <span className="text-foreground ml-1">{parsedDetails.moq || "—"}</span>
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground italic">No additional profile details saved.</span>
                                  )}
                                </div>

                                {/* Right: Compliance & Standards */}
                                <div className="space-y-3 border-t sm:border-t-0 sm:border-l border-border/20 pt-4 sm:pt-0 sm:pl-8">
                                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-bold mb-1">Compliance & Standards</span>
                                  {parsedDetails ? (
                                    <div className="space-y-2">
                                      <div>
                                        <span className="text-muted-foreground font-medium block">Quality Control</span>
                                        <span className="text-foreground block mt-0.5 leading-relaxed">{parsedDetails.qualityControl || "—"}</span>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground font-medium">Certifications:</span> <span className="text-foreground ml-1">{parsedDetails.certifications || "—"}</span>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground font-medium block">Sustainability</span>
                                        <span className="text-foreground block mt-0.5 leading-relaxed">{parsedDetails.sustainability || "—"}</span>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground font-medium block">Compliance & Labor</span>
                                        <span className="text-foreground block mt-0.5 leading-relaxed">{parsedDetails.compliance || "—"}</span>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground font-medium">Payment Terms:</span> <span className="text-foreground ml-1">{parsedDetails.paymentTerms || "—"}</span>
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground italic">No compliance data saved.</span>
                                  )}
                                </div>
                              </div>
                            );
                          })()}

                          {/* Admin action buttons */}
                          {(onEdit || onDelete) && (
                            <div className="px-8 pb-6 flex justify-end gap-3 border-t border-border/10 pt-4 bg-white/[0.01]">
                              {onEdit && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(s);
                                  }}
                                  className="px-4 py-2 rounded-xl border border-foreground/15 hover:border-electric/50 hover:bg-electric/5 transition-all text-foreground hover:text-foreground font-semibold text-[11px] cursor-pointer flex items-center gap-1.5 active:scale-95 hover:scale-102"
                                >
                                  <Pencil className="size-3.5 text-muted-foreground group-hover:text-foreground" /> {t("dashboard.editDetails")}
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
                                  <Trash2 className="size-3.5" /> {t("dashboard.delete")}
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
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-2 text-xs">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            {t("dashboard.previous")}
          </button>

          <div className="text-[10px] text-muted-foreground">
            {t("dashboard.page")} <span className="text-foreground font-semibold">{page}</span> {t("dashboard.of")} {totalPages}
          </div>

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            {t("dashboard.next")}
          </button>
        </div>
      )}
    </>
  );
}

export function Shipments({ query, onSelect, data }: { query: string; onSelect?: (shipment: any) => void; data?: any[] }) {
  const { t } = useLanguage();
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
        <Package className="size-3" /> {t("dashboard.status")}:
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
      <div className="w-full overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="rounded-xl bg-card border border-border overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-5 py-2.5 border-b border-border text-[10px] uppercase tracking-widest text-muted-foreground bg-white/[0.01]">
              <span className="col-span-2">ID</span>
              <span className="col-span-4">Route / Cargo</span>
              <span className="col-span-2">ETA</span>
              <span className="col-span-3">Progress</span>
              <span className="col-span-1 text-right">{t("dashboard.status")}</span>
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
                  <span className={`col-span-1 text-right ${s.status === "Delivered" ? "text-emerald-600 dark:text-emerald-400" : s.status === "Customs" ? "text-amber-600 dark:text-amber-400" : "text-electric"}`}>{s.status}</span>
                </div>
              ))}
              {paginated.length === 0 && <div className="px-5 py-8 text-center text-muted-foreground">No shipments match.</div>}
            </div>
          </div>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-2 text-xs">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            {t("dashboard.previous")}
          </button>

          <div className="text-[10px] text-muted-foreground">
            {t("dashboard.page")} <span className="text-foreground font-semibold">{page}</span> {t("dashboard.of")} {totalPages}
          </div>

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            {t("dashboard.next")}
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
  const { t } = useLanguage();
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
      <div className="w-full overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="rounded-xl bg-card border border-border overflow-hidden">
            <div className="px-5 py-3 border-b border-border text-sm font-medium">{t("dashboard.inventoryLevels")}</div>
            <div className="grid grid-cols-12 gap-4 px-5 py-2 border-b border-border bg-white/[0.01] text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
              <div className="col-span-2">SKU</div>
              <div className="col-span-5">{t("dashboard.productName")}</div>
              <div className="col-span-3">{t("dashboard.stockLevel")}</div>
              <div className="col-span-2 text-right">{t("dashboard.status")}</div>
            </div>
            <div className="divide-y divide-border text-xs">
              {paginated.map((i: any) => {
                const low = i.stock < i.reorder;
                return (
                  <div key={i.sku} className="grid grid-cols-12 gap-4 px-5 py-3 items-center">
                    <span className="col-span-2 text-muted-foreground tabular-nums">{i.sku}</span>
                    <span className="col-span-5">{i.name}</span>
                    <span className="col-span-3 tabular-nums">{i.stock.toLocaleString()} u</span>
                    <span className={`col-span-2 text-right text-[11px] ${low ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>{low ? t("dashboard.reorder") : t("dashboard.healthy")}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            {t("dashboard.previous")}
          </button>

          <div className="text-[10px] text-muted-foreground">
            {t("dashboard.page")} <span className="text-foreground font-semibold">{page}</span> {t("dashboard.of")} {totalPages}
          </div>

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            {t("dashboard.next")}
          </button>
        </div>
      )}
    </div>
  );
}

export function Trends() {
  const { t } = useLanguage();
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
          <p className="text-xs text-muted-foreground mb-3">{t("dashboard.demandWeeks")}</p>
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
          <p className="text-[11px] text-emerald-400 mt-2">+{c.v[c.v.length - 1] - c.v[0]}% {t("dashboard.trendText")}</p>
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
