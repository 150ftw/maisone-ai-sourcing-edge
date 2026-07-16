import { createFileRoute, Link, useNavigate, Outlet, redirect, useLocation } from "@tanstack/react-router";
import { useState, useEffect, createContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, LogOut, Loader2, Search, Filter,
  Trash2, Mail, Building2, User, Globe, Layers,
  Calendar, MessageSquare, ShieldAlert, Sparkles, Check, RefreshCw,
  ChevronLeft, ChevronRight, X, Plus, ChevronDown, TrendingUp, Activity,
  BookOpen
} from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { Logo } from "@/components/maisone/Logo";
import { supabase } from "@/lib/supabase";
import { Overview, Suppliers, Shipments, Inventory, SUPPLIERS, DEFAULT_INVENTORY, SHIPMENTS } from "@/components/maisone/Dashboard";
import { toast } from "sonner";
import { generateTrendForecastFn, DEFAULT_DATA } from "@/components/maisone/TrendForecast";
import type { Region, Forecast } from "@/components/maisone/TrendForecast";

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

const REGIONS: Region[] = ["Japan", "United Kingdom", "Europe", "United States", "India", "China"];

export function SuppliersWrapper() {
  const [region, setRegion] = useState("All");
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [suppliersList, setSuppliersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Sub-tab State
  const [modalTab, setModalTab] = useState<"basic" | "caps" | "compliance">("basic");

  // Editing state
  const [editingSupplier, setEditingSupplier] = useState<any | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [regionVal, setRegionVal] = useState("Japan");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [lead, setLead] = useState("");
  const [otd, setOtd] = useState("");
  const [rating, setRating] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [ownerDetails, setOwnerDetails] = useState("");
  const [emailId, setEmailId] = useState("");

  // Rich supplier details
  const [clientele, setClientele] = useState("");
  const [fabrics, setFabrics] = useState("");
  const [capabilities, setCapabilities] = useState("");
  const [productionCapacity, setProductionCapacity] = useState("");
  const [moq, setMoq] = useState("100–500 units");
  const [samplingLeadTime, setSamplingLeadTime] = useState("");
  const [qualityControl, setQualityControl] = useState("");
  const [certifications, setCertifications] = useState("");
  const [sustainability, setSustainability] = useState("");
  const [compliance, setCompliance] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("30% Deposit, 70% Balance");

  const [categoriesList, setCategoriesList] = useState([
    "Denim", "Silk", "Wool", "Tailoring", "Leather",
    "Knitwear", "Accessories", "Cap", "Circular Knits",
    "Contemporary Ready to Wear", "Couture"
  ]);
  const [newCategoryName, setNewCategoryName] = useState("");

  const fetchSuppliers = async () => {
    try {
      const { data, error } = await supabase
        .from("suppliers")
        .select("id:supplier_id, name, region, city, category, lead:lead_time, rating, otd, contact_no, owner_details, email_id")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setSuppliersList(data || []);
    } catch (err) {
      console.error("Failed to fetch suppliers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const openAddModal = () => {
    setEditingSupplier(null);
    setName("");
    setCity("");
    setRegionVal("Japan");
    setSelectedCategories([]);
    setLead("");
    setOtd("");
    setRating("");
    setContactNo("");
    setOwnerDetails("");
    setEmailId("");

    // Rich details reset
    setClientele("");
    setFabrics("");
    setCapabilities("");
    setProductionCapacity("");
    setMoq("100–500 units");
    setSamplingLeadTime("");
    setQualityControl("");
    setCertifications("");
    setSustainability("");
    setCompliance("");
    setPaymentTerms("30% Deposit, 70% Balance");

    setModalTab("basic");
    setIsModalOpen(true);
  };

  const openEditModal = (supplier: any) => {
    setEditingSupplier(supplier);
    setName(supplier.name);
    setCity(supplier.city);
    setRegionVal(supplier.region);
    const categoriesFromSupplier = supplier.category ? supplier.category.split(", ") : [];
    setSelectedCategories(categoriesFromSupplier);
    categoriesFromSupplier.forEach((cat: string) => {
      if (cat && !categoriesList.includes(cat)) {
        setCategoriesList(prev => [...prev, cat]);
      }
    });
    setLead(String(supplier.lead));
    setOtd(String(supplier.otd));
    setRating(String(supplier.rating));
    setContactNo(supplier.contact_no || "");
    setEmailId(supplier.email_id || "");

    // Parse ownerDetails JSON if valid
    const detailsRaw = supplier.owner_details || "";
    if (detailsRaw.startsWith("{")) {
      try {
        const parsed = JSON.parse(detailsRaw);
        setOwnerDetails(parsed.owner || "");
        setClientele(parsed.clientele || "");
        setFabrics(parsed.fabrics || "");
        setCapabilities(parsed.capabilities || "");
        setProductionCapacity(parsed.productionCapacity || "");
        setMoq(parsed.moq || "100–500 units");
        setSamplingLeadTime(parsed.samplingLeadTime || "");
        setQualityControl(parsed.qualityControl || "");
        setCertifications(parsed.certifications || "");
        setSustainability(parsed.sustainability || "");
        setCompliance(parsed.compliance || "");
        setPaymentTerms(parsed.paymentTerms || "30% Deposit, 70% Balance");
      } catch (e) {
        setOwnerDetails(detailsRaw);
        setClientele("");
        setFabrics("");
        setCapabilities("");
        setProductionCapacity("");
        setMoq("100–500 units");
        setSamplingLeadTime("");
        setQualityControl("");
        setCertifications("");
        setSustainability("");
        setCompliance("");
        setPaymentTerms("30% Deposit, 70% Balance");
      }
    } else {
      setOwnerDetails(detailsRaw);
      setClientele("");
      setFabrics("");
      setCapabilities("");
      setProductionCapacity("");
      setMoq("100–500 units");
      setSamplingLeadTime("");
      setQualityControl("");
      setCertifications("");
      setSustainability("");
      setCompliance("");
      setPaymentTerms("30% Deposit, 70% Balance");
    }

    setModalTab("basic");
    setIsModalOpen(true);
  };

  const handleDeleteSupplier = async (supplierId: string) => {
    if (!confirm("Are you sure you want to delete this supplier permanently?")) return;
    try {
      const { error } = await supabase
        .from("suppliers")
        .delete()
        .eq("supplier_id", supplierId);
      if (error) throw error;
      await fetchSuppliers();
    } catch (err: any) {
      console.error("Failed to delete supplier:", err);
      alert("Error deleting supplier: " + err.message);
    }
  };

  const handleSaveSupplier = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCategories.length === 0) {
      alert("Please select at least one category.");
      return;
    }

    const serializedDetails = JSON.stringify({
      owner: ownerDetails.trim(),
      clientele: clientele.trim(),
      fabrics: fabrics.trim(),
      capabilities: capabilities.trim(),
      productionCapacity: productionCapacity.trim(),
      moq: moq,
      samplingLeadTime: samplingLeadTime.trim(),
      qualityControl: qualityControl.trim(),
      certifications: certifications.trim(),
      sustainability: sustainability.trim(),
      compliance: compliance.trim(),
      paymentTerms: paymentTerms
    });

    const payload = {
      name: name.trim(),
      region: regionVal,
      city: city.trim(),
      category: selectedCategories.join(", "),
      lead_time: Number(lead) || 14,
      otd: Number(otd) || 95,
      rating: Number(rating) || 4.5,
      contact_no: contactNo.trim() || null,
      owner_details: serializedDetails,
      email_id: emailId.trim() || null
    };

    try {
      if (editingSupplier) {
        // Update existing supplier
        const { error } = await supabase
          .from("suppliers")
          .update(payload)
          .eq("supplier_id", editingSupplier.id);
        if (error) throw error;
      } else {
        // Calculate sequential supplier_id
        let maxNum = 0;
        suppliersList.forEach(s => {
          const idStr = s.id || s.supplier_id;
          if (idStr && typeof idStr === "string" && idStr.startsWith("SUP-")) {
            const num = parseInt(idStr.replace("SUP-", ""), 10);
            if (!isNaN(num) && num > maxNum) {
              maxNum = num;
            }
          }
        });
        const nextNum = maxNum + 1;
        const nextId = `SUP-${String(nextNum).padStart(3, "0")}`;

        const newSupplier = {
          supplier_id: nextId,
          ...payload
        };

        const { error } = await supabase.from("suppliers").insert([newSupplier]);
        if (error) throw error;
      }

      await fetchSuppliers();
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Failed to save supplier:", err);
      alert("Error saving supplier: " + err.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search suppliers, categories..."
            className="w-full rounded-xl bg-black/30 border border-white/10 pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-electric text-white"
          />
        </div>
        <button
          onClick={openAddModal}
          className="bg-white text-black font-semibold text-xs py-2.5 px-4 rounded-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <Plus className="size-4" /> Add Supplier
        </button>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : (
        <Suppliers
          query={query}
          region={region}
          setRegion={setRegion}
          data={suppliersList}
          onEdit={openEditModal}
          onDelete={handleDeleteSupplier}
        />
      )}

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 glass-strong border border-white/10 rounded-3xl max-w-xl w-full p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-6 top-6 p-2 rounded-full hover:bg-white/5 border border-white/5 transition-colors cursor-pointer text-muted-foreground hover:text-white"
              >
                <X className="size-4" />
              </button>

              <h2 className="font-serif text-2xl mb-6 text-white tracking-tight">
                {editingSupplier ? "Edit Supplier" : "Add Supplier"}
              </h2>

              {/* Tab Selector */}
              <div className="flex border-b border-white/10 mb-6 gap-4 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setModalTab("basic")}
                  className={`pb-2 border-b-2 transition-all cursor-pointer ${modalTab === "basic" ? "border-electric text-white" : "border-transparent text-muted-foreground hover:text-white"
                    }`}
                >
                  Basic Info
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab("caps")}
                  className={`pb-2 border-b-2 transition-all cursor-pointer ${modalTab === "caps" ? "border-electric text-white" : "border-transparent text-muted-foreground hover:text-white"
                    }`}
                >
                  Capabilities & Production
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab("compliance")}
                  className={`pb-2 border-b-2 transition-all cursor-pointer ${modalTab === "compliance" ? "border-electric text-white" : "border-transparent text-muted-foreground hover:text-white"
                    }`}
                >
                  Compliance & Standards
                </button>
              </div>

              <form onSubmit={handleSaveSupplier} className="space-y-5">
                {modalTab === "basic" && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Supplier Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Kyoto Atelier"
                        className="w-full rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.04] transition-all px-4 py-2.5 text-xs text-white placeholder:text-muted-foreground/30 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">City</label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={e => setCity(e.target.value)}
                          placeholder="e.g. Kyoto"
                          className="w-full rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.04] transition-all px-4 py-2.5 text-xs text-white placeholder:text-muted-foreground/30 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Region</label>
                        <CustomSelect value={regionVal} onChange={setRegionVal} options={["Japan", "United Kingdom", "Europe", "United States", "India", "China", "Other"]} />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Production Lead Time (Days)</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          required
                          value={lead}
                          onChange={e => setLead(e.target.value)}
                          placeholder="e.g. 21"
                          className="w-full rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.04] transition-all px-4 py-2.5 text-xs text-white placeholder:text-muted-foreground/30 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">OTD Rate (%)</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          required
                          value={otd}
                          onChange={e => setOtd(e.target.value)}
                          placeholder="e.g. 96"
                          className="w-full rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.04] transition-all px-4 py-2.5 text-xs text-white placeholder:text-muted-foreground/30 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Rating (1-5)</label>
                        <input
                          type="text"
                          required
                          value={rating}
                          onChange={e => setRating(e.target.value)}
                          placeholder="e.g. 4.9"
                          className="w-full rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.04] transition-all px-4 py-2.5 text-xs text-white placeholder:text-muted-foreground/30 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Contact Person / Owner</label>
                        <input
                          type="text"
                          value={ownerDetails}
                          onChange={e => setOwnerDetails(e.target.value)}
                          placeholder="e.g. Kenji Tanaka (Founder)"
                          className="w-full rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.04] transition-all px-4 py-2.5 text-xs text-white placeholder:text-muted-foreground/30 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Contact No</label>
                        <input
                          type="text"
                          value={contactNo}
                          onChange={e => setContactNo(e.target.value)}
                          placeholder="e.g. +81 90-1234-5678"
                          className="w-full rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.04] transition-all px-4 py-2.5 text-xs text-white placeholder:text-muted-foreground/30 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Email ID</label>
                        <input
                          type="email"
                          value={emailId}
                          onChange={e => setEmailId(e.target.value)}
                          placeholder="e.g. tanaka@kyotoatelier.jp"
                          className="w-full rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.04] transition-all px-4 py-2.5 text-xs text-white placeholder:text-muted-foreground/30 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Clientele (Brands they work with)</label>
                        <input
                          type="text"
                          value={clientele}
                          onChange={e => setClientele(e.target.value)}
                          placeholder="e.g. Acne Studios, A.P.C."
                          className="w-full rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.04] transition-all px-4 py-2.5 text-xs text-white placeholder:text-muted-foreground/30 focus:outline-none"
                        />
                      </div>
                    </div>
                  </>
                )}

                {modalTab === "caps" && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium block">Categories (Select Multiple)</label>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {categoriesList.map((cat) => {
                          const isSelected = selectedCategories.includes(cat);
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => {
                                setSelectedCategories(prev =>
                                  prev.includes(cat)
                                    ? prev.filter(c => c !== cat)
                                    : [...prev, cat]
                                );
                              }}
                              className={`px-3 py-1.5 rounded-full text-[10px] border font-medium transition-all duration-200 cursor-pointer ${isSelected
                                  ? "bg-electric border-electric text-background shadow-md shadow-electric/25 font-bold"
                                  : "bg-white/[0.02] border-white/10 text-muted-foreground hover:text-white hover:border-white/20"
                                }`}
                            >
                              {cat}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/5">
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="Add custom category..."
                          className="rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.04] transition-all px-3 py-1.5 text-[11px] text-white placeholder:text-muted-foreground/30 focus:outline-none w-48"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const trimmed = newCategoryName.trim();
                            if (trimmed && !categoriesList.includes(trimmed)) {
                              setCategoriesList(prev => [...prev, trimmed]);
                              setSelectedCategories(prev => [...prev, trimmed]);
                              setNewCategoryName("");
                            }
                          }}
                          className="bg-white/10 hover:bg-white/20 text-white rounded-xl px-3 py-1.5 text-[11px] font-semibold transition-all cursor-pointer"
                        >
                          + Add Category
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Fabrics They Work With</label>
                      <input
                        type="text"
                        value={fabrics}
                        onChange={e => setFabrics(e.target.value)}
                        placeholder="e.g. Organic Cotton, Selvedge Denim, Silk"
                        className="w-full rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.04] transition-all px-4 py-2.5 text-xs text-white placeholder:text-muted-foreground/30 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Manufacturing Capabilities</label>
                      <textarea
                        value={capabilities}
                        onChange={e => setCapabilities(e.target.value)}
                        rows={3}
                        placeholder="Special machinery, hand-embroidery, wash treatments..."
                        className="w-full rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.04] transition-all px-4 py-2.5 text-xs text-white placeholder:text-muted-foreground/30 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Production Capacity (Monthly)</label>
                        <input
                          type="text"
                          value={productionCapacity}
                          onChange={e => setProductionCapacity(e.target.value)}
                          placeholder="e.g. 50,000 units"
                          className="w-full rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.04] transition-all px-4 py-2.5 text-xs text-white placeholder:text-muted-foreground/30 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Sampling Lead Time</label>
                        <input
                          type="text"
                          value={samplingLeadTime}
                          onChange={e => setSamplingLeadTime(e.target.value)}
                          placeholder="e.g. 7-14 days"
                          className="w-full rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.04] transition-all px-4 py-2.5 text-xs text-white placeholder:text-muted-foreground/30 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium block">MOQ (Minimum Order Quantity)</label>
                      <CustomSelect value={moq} onChange={setMoq} options={["< 100 units", "100–500 units", "500–1000 units", "1000+ units"]} />
                    </div>
                  </>
                )}

                {modalTab === "compliance" && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Quality Control</label>
                      <textarea
                        value={qualityControl}
                        onChange={e => setQualityControl(e.target.value)}
                        rows={2}
                        placeholder="Inspection processes, AQL 2.5 standards..."
                        className="w-full rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.04] transition-all px-4 py-2.5 text-xs text-white placeholder:text-muted-foreground/30 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Certifications</label>
                      <input
                        type="text"
                        value={certifications}
                        onChange={e => setCertifications(e.target.value)}
                        placeholder="e.g. GOTS, OEKO-TEX, BSCI, WRAP"
                        className="w-full rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.04] transition-all px-4 py-2.5 text-xs text-white placeholder:text-muted-foreground/30 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Sustainability Practices</label>
                      <textarea
                        value={sustainability}
                        onChange={e => setSustainability(e.target.value)}
                        rows={2}
                        placeholder="Recycling, zero waste, energy mitigations..."
                        className="w-full rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.04] transition-all px-4 py-2.5 text-xs text-white placeholder:text-muted-foreground/30 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Compliance & Labor Standards</label>
                      <textarea
                        value={compliance}
                        onChange={e => setCompliance(e.target.value)}
                        rows={2}
                        placeholder="Audited labor standards, safety guidelines..."
                        className="w-full rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.04] transition-all px-4 py-2.5 text-xs text-white placeholder:text-muted-foreground/30 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium block">Payment Terms</label>
                      <input
                        type="text"
                        value={paymentTerms}
                        onChange={e => setPaymentTerms(e.target.value)}
                        placeholder="e.g. 30% Deposit, 70% Balance"
                        className="w-full rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.04] transition-all px-4 py-2.5 text-xs text-white placeholder:text-muted-foreground/30 focus:outline-none"
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full mt-4 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-white/90 text-black font-semibold text-xs transition-all active:scale-[0.98] cursor-pointer"
                >
                  {editingSupplier ? "Update Supplier" : "Save Supplier"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function InventoryWrapper() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inventoryList, setInventoryList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [reorder, setReorder] = useState("");

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase
        .from("inventory")
        .select("sku, name, stock, reorder")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setInventoryList(data || []);
    } catch (err) {
      console.error("Failed to fetch inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = {
      sku: sku.trim() || `SKU-${Math.floor(100 + Math.random() * 900)}`,
      name: name.trim() || "New Item",
      stock: Number(stock) || 0,
      reorder: Number(reorder) || 0
    };

    try {
      const { error } = await supabase.from("inventory").insert([newItem]);
      if (error) throw error;
      await fetchInventory();

      // Reset and close
      setSku("");
      setName("");
      setStock("");
      setReorder("");
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Failed to add inventory item:", err);
      alert("Error adding item: " + err.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl tracking-tight">Inventory Portal</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Manage stock levels, reorder limits, and add item logs.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-white text-black font-semibold text-xs py-2.5 px-4 rounded-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Plus className="size-4" /> Add Item
        </button>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : (
        <Inventory data={inventoryList} />
      )}

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 glass-strong border border-white/10 rounded-3xl max-w-xl w-full p-8 shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-6 top-6 p-2 rounded-full hover:bg-white/5 border border-white/5 transition-colors cursor-pointer text-muted-foreground hover:text-white"
              >
                <X className="size-4" />
              </button>

              <h2 className="font-serif text-2xl mb-6 text-white tracking-tight">Add Inventory Item</h2>

              <form onSubmit={handleAddItem} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">SKU / Code</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={e => setSku(e.target.value)}
                    placeholder="e.g. COT-412"
                    className="w-full rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.04] transition-all px-4 py-2.5 text-xs text-white placeholder:text-muted-foreground/30 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Item Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Organic Pima Cotton"
                    className="w-full rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.04] transition-all px-4 py-2.5 text-xs text-white placeholder:text-muted-foreground/30 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Current Stock</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      required
                      value={stock}
                      onChange={e => setStock(e.target.value)}
                      placeholder="e.g. 2500"
                      className="w-full rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.04] transition-all px-4 py-2.5 text-xs text-white placeholder:text-muted-foreground/30 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Reorder Level</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      required
                      value={reorder}
                      onChange={e => setReorder(e.target.value)}
                      placeholder="e.g. 1000"
                      className="w-full rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.04] transition-all px-4 py-2.5 text-xs text-white placeholder:text-muted-foreground/30 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-white/90 text-black font-semibold text-xs transition-all active:scale-[0.98] cursor-pointer"
                >
                  Save Item
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ShipmentsWrapper() {
  const [query, setQuery] = useState("");
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [shipmentsList, setShipmentsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [eta, setEta] = useState("");
  const [statusVal, setStatusVal] = useState("In transit");

  const fetchShipments = async () => {
    try {
      const { data, error } = await supabase
        .from("shipments")
        .select("id:shipment_id, route, eta, status, prog:progress")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setShipmentsList(data || []);
    } catch (err) {
      console.error("Failed to fetch shipments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const handleAddShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    const calculatedProgress = statusVal === "Delivered" ? 100 : statusVal === "Customs" ? 80 : 30;
    const newShipment = {
      shipment_id: `MS-${Math.floor(10000 + Math.random() * 90000)}`,
      route: `${origin.trim()} → ${destination.trim()}`,
      eta: eta.trim() || "Mar 20",
      status: statusVal,
      progress: calculatedProgress
    };

    try {
      const { error } = await supabase.from("shipments").insert([newShipment]);
      if (error) throw error;
      await fetchShipments();

      // Reset and close
      setOrigin("");
      setDestination("");
      setEta("");
      setStatusVal("In transit");
      setIsAddModalOpen(false);
    } catch (err: any) {
      console.error("Failed to add shipment:", err);
      alert("Error adding shipment: " + err.message);
    }
  };

  const handleUpdateShipmentStatus = async (id: string, newStatus: string) => {
    const nextProg = newStatus === "Delivered" ? 100 : newStatus === "Customs" ? 80 : 30;

    try {
      const { error } = await supabase
        .from("shipments")
        .update({ status: newStatus, progress: nextProg })
        .eq("shipment_id", id);
      if (error) throw error;

      await fetchShipments();

      // Update selectedShipment to reflect changes in details modal
      setSelectedShipment((prev: any) => prev ? { ...prev, status: newStatus, prog: nextProg } : null);
    } catch (err: any) {
      console.error("Failed to update shipment status:", err);
      alert("Error updating status: " + err.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl tracking-tight">Shipments Portal</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Track cargo, routes, estimated arrival times, and customs clearance status.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:max-w-xs">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search shipments, routes..."
              className="w-full rounded-xl bg-black/30 border border-white/10 pl-11 pr-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-electric text-white"
            />
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-white text-black font-semibold text-xs py-2.5 px-4 rounded-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Plus className="size-4" /> Add Shipment
          </button>
        </div>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : (
        <Shipments query={query} onSelect={setSelectedShipment} data={shipmentsList} />
      )}

      <AnimatePresence>
        {selectedShipment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedShipment(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 glass-strong border border-white/10 rounded-3xl max-w-xl w-full p-8 shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setSelectedShipment(null)}
                className="absolute right-6 top-6 p-2 rounded-full hover:bg-white/5 border border-white/5 transition-colors cursor-pointer text-muted-foreground hover:text-white"
              >
                <X className="size-4" />
              </button>

              <div className="space-y-6">
                <div>
                  <span className="text-[10px] tracking-[0.2em] bg-electric/15 text-electric px-2.5 py-0.5 rounded-full uppercase font-semibold">Shipment Tracker</span>
                  <h2 className="font-serif text-3xl mt-3 text-white">{selectedShipment.id}</h2>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                    <Globe className="size-3.5 text-muted-foreground" />
                    {selectedShipment.route}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-b border-white/5 py-4">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground block">ETA</span>
                    <span className="text-sm font-medium text-white mt-1 block">{selectedShipment.eta}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground block mb-1">Status</span>
                    <div className="mt-1">
                      <ShipmentStatusDropdown
                        currentStatus={selectedShipment.status}
                        onChange={(status) => handleUpdateShipmentStatus(selectedShipment.id, status)}
                      />
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground block">Progress</span>
                    <span className="text-sm font-medium text-white mt-1 block">{selectedShipment.prog}%</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground block">Transit Code</span>
                    <span className="text-sm font-medium text-muted-foreground mt-1 block">TRK-{selectedShipment.id.split('-')[1] || selectedShipment.id}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Live Progress Bar</h4>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-electric to-cyan-glow transition-all duration-500"
                      style={{ width: `${selectedShipment.prog}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 glass-strong border border-white/10 rounded-3xl max-w-xl w-full p-8 shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute right-6 top-6 p-2 rounded-full hover:bg-white/5 border border-white/5 transition-colors cursor-pointer text-muted-foreground hover:text-white"
              >
                <X className="size-4" />
              </button>

              <h2 className="font-serif text-2xl mb-6 text-white tracking-tight">Add Shipment</h2>

              <form onSubmit={handleAddShipment} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Origin City</label>
                    <input
                      type="text"
                      required
                      value={origin}
                      onChange={e => setOrigin(e.target.value)}
                      placeholder="e.g. Tokyo"
                      className="w-full rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.04] transition-all px-4 py-2.5 text-xs text-white placeholder:text-muted-foreground/30 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Destination City</label>
                    <input
                      type="text"
                      required
                      value={destination}
                      onChange={e => setDestination(e.target.value)}
                      placeholder="e.g. London"
                      className="w-full rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.04] transition-all px-4 py-2.5 text-xs text-white placeholder:text-muted-foreground/30 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">ETA</label>
                    <input
                      type="text"
                      required
                      value={eta}
                      onChange={e => setEta(e.target.value)}
                      placeholder="e.g. Mar 24"
                      className="w-full rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.04] transition-all px-4 py-2.5 text-xs text-white placeholder:text-muted-foreground/30 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Status</label>
                    <CustomSelect value={statusVal} onChange={setStatusVal} options={["In transit", "Customs", "Delivered"]} />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-white/90 text-black font-semibold text-xs transition-all active:scale-[0.98] cursor-pointer"
                >
                  Save Shipment
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function OverviewWrapper() {
  const [query, setQuery] = useState("");
  const [shipmentsList, setShipmentsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchShipments = async () => {
    try {
      const { data, error } = await supabase
        .from("shipments")
        .select("id:shipment_id, route, eta, status, prog:progress")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setShipmentsList(data || []);
    } catch (err) {
      console.error("Failed to fetch overview shipments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search active shipments..."
          className="w-full rounded-xl bg-black/30 border border-white/10 pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-electric text-white"
        />
      </div>
      {loading ? (
        <OverviewSkeleton />
      ) : (
        <Overview query={query} data={shipmentsList} />
      )}
    </div>
  );
}

export function TrendsWrapper() {
  const [region, setRegion] = useState<Region>("Japan");
  const season = (() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const shortYear = year % 100;
    return month <= 5 ? `S/S ${shortYear}` : `F/W ${shortYear}`;
  })();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [fabrics, setFabrics] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [silhouettes, setSilhouettes] = useState<any[]>([]);

  const fetchForecast = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("trends")
        .select("*")
        .eq("region", region)
        .eq("season", season)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        setFabrics(typeof data.fabrics === "string" ? JSON.parse(data.fabrics) : data.fabrics);
        setColors(typeof data.colors === "string" ? JSON.parse(data.colors) : data.colors);
        setSilhouettes(typeof data.silhouettes === "string" ? JSON.parse(data.silhouettes) : data.silhouettes);
      } else {
        const defaults = DEFAULT_DATA[region] || { fabrics: [], colors: [], silhouettes: [] };
        setFabrics(JSON.parse(JSON.stringify(defaults.fabrics)));
        setColors(JSON.parse(JSON.stringify(defaults.colors)));
        setSilhouettes(JSON.parse(JSON.stringify(defaults.silhouettes)));
      }
    } catch (err: any) {
      console.warn("Error loading forecast:", err);
      const defaults = DEFAULT_DATA[region] || { fabrics: [], colors: [], silhouettes: [] };
      setFabrics(JSON.parse(JSON.stringify(defaults.fabrics)));
      setColors(JSON.parse(JSON.stringify(defaults.colors)));
      setSilhouettes(JSON.parse(JSON.stringify(defaults.silhouettes)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, [region, season]);

  const handleGenerateAI = async () => {
    setGenerating(true);
    try {
      const result = await generateTrendForecastFn({ data: { region, season } });
      setFabrics(result.fabrics);
      setColors(result.colors);
      setSilhouettes(result.silhouettes);
      toast.success("AI Trend forecast generated successfully! Make sure to review and save.");
    } catch (err: any) {
      console.error("AI Generation failed:", err);
      toast.error(err.message || "Failed to generate trends using AI. Please check environment variables.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from("trends")
        .upsert(
          {
            region,
            season,
            fabrics,
            colors,
            silhouettes,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "region,season" }
        );

      if (error) throw error;
      toast.success(`Trend forecast for ${region} (${season}) saved successfully!`);
    } catch (err: any) {
      console.error("Failed to save forecast:", err);
      toast.error("Failed to save forecast: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateFabric = (index: number, field: string, val: any) => {
    const next = [...fabrics];
    next[index] = { ...next[index], [field]: val };
    setFabrics(next);
  };

  const updateColor = (index: number, field: string, val: any) => {
    const next = [...colors];
    next[index] = { ...next[index], [field]: val };
    setColors(next);
  };
  const updateSilhouette = (index: number, field: string, val: any) => {
    const next = [...silhouettes];
    next[index] = { ...next[index], [field]: val };
    setSilhouettes(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div>
          <h1 className="font-serif text-3xl tracking-tight">Trend Forecasting</h1>
          <p className="text-xs text-muted-foreground mt-1">Manage season-wise regional forecasts. Generate using AI or input manually.</p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          {/* Generate Button on top without sparkles icon */}
          <button
            type="button"
            onClick={handleGenerateAI}
            disabled={generating || loading}
            className="bg-gradient-to-r from-electric to-violet-glow hover:opacity-95 text-white font-semibold text-xs py-2.5 px-5 rounded-xl transition-all active:scale-[0.98] cursor-pointer flex items-center gap-2 shadow-lg shadow-electric/15 disabled:opacity-50 disabled:pointer-events-none"
          >
            {generating && <Loader2 className="size-4 animate-spin" />}
            Generate with AI
          </button>



          {/* Region Selector */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-white/[0.02] border border-white/5 rounded-xl">
            {REGIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRegion(r)}
                className={`text-[10px] font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${region === r ? "bg-white text-black shadow-md" : "text-muted-foreground hover:text-white"
                  }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Fabrics Editor */}
            <div className="glass-strong rounded-3xl p-5 border border-white/5 space-y-5">
              <div className="flex items-center gap-2.5 border-b border-white/5 pb-3">
                <div className="size-7 rounded-full border border-electric/25 bg-electric/10 flex items-center justify-center">
                  <Activity className="size-3.5 text-electric" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Trending Fabrics</h3>
                  <p className="text-[10px] text-muted-foreground">List up to 4 materials and signals</p>
                </div>
              </div>
              {fabrics.map((f, i) => (
                <div key={i} className="space-y-3 p-4 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-colors">
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">Fabric Name</label>
                    <input
                      type="text"
                      required
                      value={f.name || ""}
                      onChange={(e) => updateFabric(i, "name", e.target.value)}
                      placeholder="e.g. Sashiko Cotton"
                      className="w-full rounded-xl bg-black/40 border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.04] transition-all px-3 py-2 text-xs text-white placeholder:text-muted-foreground/20 focus:outline-none focus:ring-1 focus:ring-electric"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-1 space-y-1.5">
                      <label className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">Score</label>
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          max="100"
                          required
                          value={f.score || ""}
                          onChange={(e) => updateFabric(i, "score", parseInt(e.target.value) || 0)}
                          className="w-full rounded-xl bg-black/40 border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.04] transition-all pl-3 pr-6 py-2 text-xs text-white placeholder:text-muted-foreground/20 focus:outline-none focus:ring-1 focus:ring-electric [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground font-semibold">%</span>
                      </div>
                    </div>
                    <div className="col-span-2 space-y-1.5">
                      <label className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">Signal</label>
                      <input
                        type="text"
                        required
                        value={f.signal || ""}
                        onChange={(e) => updateFabric(i, "signal", e.target.value)}
                        placeholder="e.g. Sourcing volume up"
                        className="w-full rounded-xl bg-black/40 border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.04] transition-all px-3 py-2 text-xs text-white placeholder:text-muted-foreground/20 focus:outline-none focus:ring-1 focus:ring-electric"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Colors Editor */}
            <div className="glass-strong rounded-3xl p-5 border border-white/5 space-y-5">
              <div className="flex items-center gap-2.5 border-b border-white/5 pb-3">
                <div className="size-7 rounded-full border border-electric/25 bg-electric/10 flex items-center justify-center">
                  <Sparkles className="size-3.5 text-electric" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Color Forecast</h3>
                  <p className="text-[10px] text-muted-foreground">Pioneering hues and Pantone codes</p>
                </div>
              </div>
              {colors.map((c, i) => (
                <div key={i} className="space-y-3 p-4 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-colors">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2 space-y-1.5">
                      <label className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">Color Name</label>
                      <input
                        type="text"
                        required
                        value={c.name || ""}
                        onChange={(e) => updateColor(i, "name", e.target.value)}
                        placeholder="e.g. Aizome Blue"
                        className="w-full rounded-xl bg-black/40 border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.04] transition-all px-3 py-2 text-xs text-white placeholder:text-muted-foreground/20 focus:outline-none focus:ring-1 focus:ring-electric"
                      />
                    </div>
                    <div className="col-span-1 space-y-1.5">
                      <label className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">Score</label>
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          max="100"
                          required
                          value={c.score || ""}
                          onChange={(e) => updateColor(i, "score", parseInt(e.target.value) || 0)}
                          className="w-full rounded-xl bg-black/40 border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.04] transition-all pl-3 pr-6 py-2 text-xs text-white placeholder:text-muted-foreground/20 focus:outline-none focus:ring-1 focus:ring-electric [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground font-semibold">%</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">Hex Code</label>
                      <div className="relative flex items-center">
                        <div className="absolute left-2.5 size-5 rounded-md overflow-hidden border border-white/20 flex items-center justify-center">
                          <input
                            type="color"
                            value={c.hex || "#ffffff"}
                            onChange={(e) => updateColor(i, "hex", e.target.value)}
                            className="absolute inset-0 size-full cursor-pointer scale-150 border-0 p-0"
                          />
                        </div>
                        <input
                          type="text"
                          required
                          value={c.hex || ""}
                          onChange={(e) => updateColor(i, "hex", e.target.value)}
                          placeholder="#1A3A6B"
                          className="w-full rounded-xl bg-black/40 border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.04] transition-all pl-10 pr-3 py-2 text-xs text-white uppercase placeholder:text-muted-foreground/20 focus:outline-none focus:ring-1 focus:ring-electric"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">Pantone</label>
                      <input
                        type="text"
                        required
                        value={c.pantone || ""}
                        onChange={(e) => updateColor(i, "pantone", e.target.value)}
                        placeholder="e.g. 19-3953"
                        className="w-full rounded-xl bg-black/40 border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.04] transition-all px-3 py-2 text-xs text-white placeholder:text-muted-foreground/20 focus:outline-none focus:ring-1 focus:ring-electric"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Silhouettes Editor */}
            <div className="glass-strong rounded-3xl p-5 border border-white/5 space-y-5">
              <div className="flex items-center gap-2.5 border-b border-white/5 pb-3">
                <div className="size-7 rounded-full border border-electric/25 bg-electric/10 flex items-center justify-center">
                  <TrendingUp className="size-3.5 text-electric" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Silhouettes</h3>
                  <p className="text-[10px] text-muted-foreground">Popular structural designs</p>
                </div>
              </div>
              {silhouettes.map((s, i) => (
                <div key={i} className="space-y-3 p-4 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-colors">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2 space-y-1.5">
                      <label className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">Name</label>
                      <input
                        type="text"
                        required
                        value={s.name || ""}
                        onChange={(e) => updateSilhouette(i, "name", e.target.value)}
                        placeholder="e.g. Wide-leg Trouser"
                        className="w-full rounded-xl bg-black/40 border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.04] transition-all px-3 py-2 text-xs text-white placeholder:text-muted-foreground/20 focus:outline-none focus:ring-1 focus:ring-electric"
                      />
                    </div>
                    <div className="col-span-1 space-y-1.5">
                      <label className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">Score</label>
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          max="100"
                          required
                          value={s.score || ""}
                          onChange={(e) => updateSilhouette(i, "score", parseInt(e.target.value) || 0)}
                          className="w-full rounded-xl bg-black/40 border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.04] transition-all pl-3 pr-6 py-2 text-xs text-white placeholder:text-muted-foreground/20 focus:outline-none focus:ring-1 focus:ring-electric [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground font-semibold">%</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">Note</label>
                    <input
                      type="text"
                      required
                      value={s.note || ""}
                      onChange={(e) => updateSilhouette(i, "note", e.target.value)}
                      placeholder="e.g. SS '26 collections"
                      className="w-full rounded-xl bg-black/40 border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.04] transition-all px-3 py-2 text-xs text-white placeholder:text-muted-foreground/20 focus:outline-none focus:ring-1 focus:ring-electric"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-white text-black font-semibold text-xs py-3 px-8 rounded-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-white/5"
            >
              Save Forecast
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function AdminPage() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // State hooks (placed at the top to satisfy rules of hooks)
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
              <span className="text-[10px] tracking-[0.2em] bg-electric/15 text-electric px-2.5 py-0.5 rounded-full uppercase font-medium font-semibold">Admin</span>
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
