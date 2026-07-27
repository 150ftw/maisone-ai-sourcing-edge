import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, Plus, X, Edit, Trash2, Factory as FactoryIcon, MapPin, Mail, Phone, Star, Clock, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  TrackerFactory
} from "@/lib/tracker-store";

export const Route = createFileRoute("/admin/tracker/factories")({
  component: FactoriesRoute,
});

function FactoriesRoute() {
  const [factories, setFactories] = useState<TrackerFactory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFactory, setEditingFactory] = useState<TrackerFactory | null>(null);

  // Form State
  const [factoryName, setFactoryName] = useState("");
  const [category, setCategory] = useState("Tailoring & Wool");
  const [location, setLocation] = useState("Milan, Italy");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [leadTime, setLeadTime] = useState("25-30 Days");
  const [qualityRating, setQualityRating] = useState("4.8");

  const loadFactories = async () => {
    setLoading(true);
    try {
      const { data: dbFactories, error } = await supabase
        .from("suppliers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Map Supabase suppliers to TrackerFactory format
      const mapped = (dbFactories || []).map((db: any) => {
        let contactPersonStr = db.owner_details || db.contact_person || "Unknown";
        if (typeof contactPersonStr === "string" && contactPersonStr.startsWith("{")) {
          try {
            const parsed = JSON.parse(contactPersonStr);
            contactPersonStr = parsed.owner || "Unknown";
          } catch (e) {}
        }
        
        return {
          id: db.id,
          created_at: db.created_at,
          factory_name: db.name || "Unknown Factory",
          category: db.category || "General",
          location: `${db.city || ""}, ${db.region || ""}`.replace(/^, |^,/g, ''),
          contact_person: contactPersonStr,
          email: db.email_id || db.email || "",
          whatsapp: db.contact_no || "",
          lead_time: db.lead_time?.toString() || "30-45 Days",
          quality_rating: parseFloat(db.rating) || 4.5
        };
      });

      setFactories(mapped);
    } catch (err) {
      console.error("Error fetching factories from Supabase:", err);
      setFactories([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadFactories();
  }, []);

  const openCreateModal = () => {
    setEditingFactory(null);
    setFactoryName("");
    setCategory("Tailoring & Wool");
    setLocation("Milan, Italy");
    setContactPerson("");
    setEmail("");
    setWhatsapp("");
    setLeadTime("25-30 Days");
    setQualityRating("4.8");
    setIsModalOpen(true);
  };

  const openEditModal = (f: TrackerFactory) => {
    setEditingFactory(f);
    setFactoryName(f.factory_name);
    setCategory(f.category);
    setLocation(f.location);
    setContactPerson(f.contact_person);
    setEmail(f.email);
    setWhatsapp(f.whatsapp);
    setLeadTime(f.lead_time);
    setQualityRating(f.quality_rating.toString());
    setIsModalOpen(true);
  };

  const handleSaveFactory = async () => {
    if (!factoryName.trim() || !email.trim()) return;

    try {
      // Map back to suppliers table schema
      const payload: any = {
        name: factoryName,
        category,
        region: location.split(", ")[1] || "Unknown",
        city: location.split(", ")[0] || location,
        owner_details: contactPerson,
        email_id: email,
        contact_no: whatsapp,
        lead_time: leadTime,
        rating: parseFloat(qualityRating) || 4.5,
        supplier_id: editingFactory ? undefined : `SUP-TR-${Date.now().toString().slice(-4)}`
      };

      if (editingFactory) {
        payload.id = editingFactory.id;
      }

      const { error } = await supabase
        .from("suppliers")
        .upsert(payload);

      if (error) throw error;
      
      setIsModalOpen(false);
      loadFactories();
    } catch (err) {
      console.error("Failed to sync factory to Supabase:", err);
      alert("Error saving factory. Please try again.");
    }
  };

  const handleDeleteFactory = async (id: string) => {
    if (confirm("Are you sure you want to delete this factory?")) {
      try {
        const { error } = await supabase
          .from("suppliers")
          .delete()
          .eq("id", id);

        if (error) throw error;
        loadFactories();
      } catch (err) {
        console.error("Failed to delete factory from Supabase:", err);
        alert("Error deleting factory. Please try again.");
      }
    }
  };

  const filteredFactories = factories.filter(f =>
    f.factory_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.contact_person.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="space-y-2">
            <div className="h-7 w-44 bg-foreground/10 rounded-xl" />
            <div className="h-3 w-64 bg-foreground/10 rounded-full" />
          </div>
          <div className="h-9 w-32 bg-foreground/10 rounded-xl" />
        </div>
        <div className="h-10 w-full bg-foreground/10 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-5 rounded-2xl border border-border bg-card space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="h-5 w-36 bg-foreground/10 rounded-lg" />
                  <div className="h-5 w-24 bg-foreground/10 rounded-full" />
                </div>
                <div className="flex gap-2">
                  <div className="size-8 rounded-lg bg-foreground/10" />
                  <div className="size-8 rounded-lg bg-foreground/10" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-48 bg-foreground/10 rounded-full" />
                <div className="h-3 w-40 bg-foreground/10 rounded-full" />
                <div className="h-3 w-44 bg-foreground/10 rounded-full" />
              </div>
              <div className="flex items-center gap-3 pt-1 border-t border-border">
                <div className="h-3 w-24 bg-foreground/10 rounded-full" />
                <div className="h-3 w-20 bg-foreground/10 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="font-serif text-2xl font-bold">Factory Directory</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage manufacturing partners, capacities, and quality ratings.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-electric text-background font-bold text-xs shadow-lg hover:brightness-110 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="size-4" />
          Add Factory
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by factory name, category, location..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-xs focus:outline-none focus:border-electric transition-colors"
        />
      </div>

      {/* Factory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFactories.map((f) => (
          <div key={f.id} className="p-5 rounded-2xl border border-border bg-card space-y-4 hover:border-electric/40 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-foreground">{f.factory_name}</h3>
                <p className="text-xs text-electric font-semibold">{f.category}</p>
              </div>

              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-xs">
                <Star className="size-3 fill-amber-400" />
                <span>{f.quality_rating}</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="size-3.5 text-electric shrink-0" />
                <span>{f.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-3.5 text-electric shrink-0" />
                <span>{f.email} ({f.contact_person})</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-3.5 text-electric shrink-0" />
                <span>Lead Time: {f.lead_time}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{f.whatsapp || "No phone listed"}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(f)}
                  className="p-1.5 rounded-lg border border-border hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Edit className="size-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteFactory(f.id)}
                  className="p-1.5 rounded-lg border border-border hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 rounded-2xl border border-border bg-card space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold">{editingFactory ? "Edit Factory" : "Add New Factory"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg hover:bg-foreground/10">
                <X className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="col-span-2">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Factory Name</label>
                <input
                  type="text"
                  value={factoryName}
                  onChange={(e) => setFactoryName(e.target.value)}
                  placeholder="Milano Tex Craft"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Tailoring & Wool"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Milan, Italy"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Contact Person</label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="Gianni Rossi"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="gianni@milanotex.it"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-muted-foreground">WhatsApp / Phone</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+39 02 5555 019"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Lead Time</label>
                <input
                  type="text"
                  value={leadTime}
                  onChange={(e) => setLeadTime(e.target.value)}
                  placeholder="25-30 Days"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Quality Rating (1-5)</label>
                <input
                  type="number"
                  step="0.1"
                  max="5.0"
                  min="1.0"
                  value={qualityRating}
                  onChange={(e) => setQualityRating(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl border border-border text-xs">
                Cancel
              </button>
              <button onClick={handleSaveFactory} className="px-4 py-2 rounded-xl bg-electric text-background font-bold text-xs shadow-md">
                Save Factory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
