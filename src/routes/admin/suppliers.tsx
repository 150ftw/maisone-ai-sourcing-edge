import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Suppliers } from "@/components/maisone/Dashboard";
import { TableSkeleton, CustomSelect } from "../admin";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/admin/suppliers")({
  component: SuppliersRoute,
});

function SuppliersRoute() {
  const { t } = useLanguage();
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
            placeholder={t("admin.searchBy")}
            className="w-full rounded-xl bg-foreground/[0.03] border border-foreground/10 pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-electric text-foreground"
          />
        </div>
        <button
          onClick={openAddModal}
          className="bg-foreground text-black font-semibold text-xs py-2.5 px-4 rounded-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <Plus className="size-4" /> {t("admin.addSupplier")}
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
              className="relative z-10 glass-strong border border-foreground/10 rounded-3xl max-w-xl w-full p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-6 top-6 p-2 rounded-full hover:bg-foreground/5 border border-foreground/5 transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>

              <h2 className="font-serif text-2xl mb-6 text-foreground tracking-tight">
                {editingSupplier ? t("admin.editSupplier") : t("admin.addSupplier")}
              </h2>

              {/* Tab Selector */}
              <div className="flex border-b border-foreground/10 mb-6 gap-4 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setModalTab("basic")}
                  className={`pb-2 border-b-2 transition-all cursor-pointer ${modalTab === "basic" ? "border-electric text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                >
                  Basic Info
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab("caps")}
                  className={`pb-2 border-b-2 transition-all cursor-pointer ${modalTab === "caps" ? "border-electric text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                >
                  Capabilities & Production
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab("compliance")}
                  className={`pb-2 border-b-2 transition-all cursor-pointer ${modalTab === "compliance" ? "border-electric text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
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
                        className="w-full rounded-xl bg-foreground/[0.02] border border-foreground/10 hover:border-foreground/20 focus:border-foreground/40 focus:bg-foreground/[0.04] transition-all px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
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
                          className="w-full rounded-xl bg-foreground/[0.02] border border-foreground/10 hover:border-foreground/20 focus:border-foreground/40 focus:bg-foreground/[0.04] transition-all px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
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
                          className="w-full rounded-xl bg-foreground/[0.02] border border-foreground/10 hover:border-foreground/20 focus:border-foreground/40 focus:bg-foreground/[0.04] transition-all px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
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
                          className="w-full rounded-xl bg-foreground/[0.02] border border-foreground/10 hover:border-foreground/20 focus:border-foreground/40 focus:bg-foreground/[0.04] transition-all px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
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
                          className="w-full rounded-xl bg-foreground/[0.02] border border-foreground/10 hover:border-foreground/20 focus:border-foreground/40 focus:bg-foreground/[0.04] transition-all px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
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
                          className="w-full rounded-xl bg-foreground/[0.02] border border-foreground/10 hover:border-foreground/20 focus:border-foreground/40 focus:bg-foreground/[0.04] transition-all px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Contact No</label>
                        <input
                          type="text"
                          value={contactNo}
                          onChange={e => setContactNo(e.target.value)}
                          placeholder="e.g. +81 90-1234-5678"
                          className="w-full rounded-xl bg-foreground/[0.02] border border-foreground/10 hover:border-foreground/20 focus:border-foreground/40 focus:bg-foreground/[0.04] transition-all px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
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
                          className="w-full rounded-xl bg-foreground/[0.02] border border-foreground/10 hover:border-foreground/20 focus:border-foreground/40 focus:bg-foreground/[0.04] transition-all px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Clientele (Brands they work with)</label>
                        <input
                          type="text"
                          value={clientele}
                          onChange={e => setClientele(e.target.value)}
                          placeholder="e.g. Acne Studios, A.P.C."
                          className="w-full rounded-xl bg-foreground/[0.02] border border-foreground/10 hover:border-foreground/20 focus:border-foreground/40 focus:bg-foreground/[0.04] transition-all px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
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
                                : "bg-foreground/[0.02] border-foreground/10 text-muted-foreground hover:text-foreground hover:border-foreground/20"
                                }`}
                            >
                              {cat}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-foreground/5">
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="Add custom category..."
                          className="rounded-xl bg-foreground/[0.02] border border-foreground/10 hover:border-foreground/20 focus:border-foreground/40 focus:bg-foreground/[0.04] transition-all px-3 py-1.5 text-[11px] text-foreground placeholder:text-muted-foreground/30 focus:outline-none w-48"
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
                          className="bg-foreground/10 hover:bg-foreground/20 text-foreground rounded-xl px-3 py-1.5 text-[11px] font-semibold transition-all cursor-pointer"
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
                        className="w-full rounded-xl bg-foreground/[0.02] border border-foreground/10 hover:border-foreground/20 focus:border-foreground/40 focus:bg-foreground/[0.04] transition-all px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Manufacturing Capabilities</label>
                      <textarea
                        value={capabilities}
                        onChange={e => setCapabilities(e.target.value)}
                        rows={3}
                        placeholder="Special machinery, hand-embroidery, wash treatments..."
                        className="w-full rounded-xl bg-foreground/[0.02] border border-foreground/10 hover:border-foreground/20 focus:border-foreground/40 focus:bg-foreground/[0.04] transition-all px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
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
                          className="w-full rounded-xl bg-foreground/[0.02] border border-foreground/10 hover:border-foreground/20 focus:border-foreground/40 focus:bg-foreground/[0.04] transition-all px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Sampling Lead Time</label>
                        <input
                          type="text"
                          value={samplingLeadTime}
                          onChange={e => setSamplingLeadTime(e.target.value)}
                          placeholder="e.g. 7-14 days"
                          className="w-full rounded-xl bg-foreground/[0.02] border border-foreground/10 hover:border-foreground/20 focus:border-foreground/40 focus:bg-foreground/[0.04] transition-all px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
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
                        className="w-full rounded-xl bg-foreground/[0.02] border border-foreground/10 hover:border-foreground/20 focus:border-foreground/40 focus:bg-foreground/[0.04] transition-all px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Certifications</label>
                      <input
                        type="text"
                        value={certifications}
                        onChange={e => setCertifications(e.target.value)}
                        placeholder="e.g. GOTS, OEKO-TEX, BSCI, WRAP"
                        className="w-full rounded-xl bg-foreground/[0.02] border border-foreground/10 hover:border-foreground/20 focus:border-foreground/40 focus:bg-foreground/[0.04] transition-all px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Sustainability Practices</label>
                      <textarea
                        value={sustainability}
                        onChange={e => setSustainability(e.target.value)}
                        rows={2}
                        placeholder="Recycling, zero waste, energy mitigations..."
                        className="w-full rounded-xl bg-foreground/[0.02] border border-foreground/10 hover:border-foreground/20 focus:border-foreground/40 focus:bg-foreground/[0.04] transition-all px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Compliance & Labor Standards</label>
                      <textarea
                        value={compliance}
                        onChange={e => setCompliance(e.target.value)}
                        rows={2}
                        placeholder="Audited labor standards, safety guidelines..."
                        className="w-full rounded-xl bg-foreground/[0.02] border border-foreground/10 hover:border-foreground/20 focus:border-foreground/40 focus:bg-foreground/[0.04] transition-all px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium block">Payment Terms</label>
                      <input
                        type="text"
                        value={paymentTerms}
                        onChange={e => setPaymentTerms(e.target.value)}
                        placeholder="e.g. 30% Deposit, 70% Balance"
                        className="w-full rounded-xl bg-foreground/[0.02] border border-foreground/10 hover:border-foreground/20 focus:border-foreground/40 focus:bg-foreground/[0.04] transition-all px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full mt-4 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-foreground hover:bg-foreground/90 text-black font-semibold text-xs transition-all active:scale-[0.98] cursor-pointer"
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
