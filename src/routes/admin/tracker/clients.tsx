import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, Plus, X, Edit, Trash2, Globe, Mail, Phone, FileText } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  TrackerClient,
  TrackerEnquiry
} from "@/lib/tracker-store";

export const Route = createFileRoute("/admin/tracker/clients")({
  component: ClientsRoute,
});

function ClientsRoute() {
  const [clients, setClients] = useState<TrackerClient[]>([]);
  const [enquiries, setEnquiries] = useState<TrackerEnquiry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<TrackerClient | null>(null);

  // Form State
  const [companyName, setCompanyName] = useState("");
  const [clientName, setClientName] = useState("");
  const [country, setCountry] = useState("France");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("30% Deposit, 70% Balance");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [{ data: dbEnquiries }, { data: dbClients, error }] = await Promise.all([
        supabase.from("tracker_enquiries").select("*"),
        supabase.from("tracker_clients").select("*").order("created_at", { ascending: false })
      ]);

      if (error) throw error;
      setEnquiries(dbEnquiries ?? []);
      setClients(dbClients ?? []);
    } catch (err) {
      console.error("Failed to load clients:", err);
    }
    setClients([]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingClient(null);
    setCompanyName("");
    setClientName("");
    setCountry("France");
    setContactPerson("");
    setEmail("");
    setWhatsapp("");
    setPaymentTerms("30% Deposit, 70% Balance");
    setNotes("");
    setIsModalOpen(true);
  };

  const openEditModal = (c: TrackerClient) => {
    setEditingClient(c);
    setCompanyName(c.company_name);
    setClientName(c.client_name);
    setCountry(c.country);
    setContactPerson(c.contact_person);
    setEmail(c.email);
    setWhatsapp(c.whatsapp);
    setPaymentTerms(c.payment_terms);
    setNotes(c.notes);
    setIsModalOpen(true);
  };

  const handleSaveClient = async () => {
    if (!companyName.trim() || !email.trim()) return;

    try {
      const payload: any = {
        company_name: companyName,
        client_name: clientName,
        country,
        contact_person: contactPerson,
        email,
        whatsapp,
        payment_terms: paymentTerms,
        notes
      };

      if (editingClient) {
        payload.id = editingClient.id;
      }

      const { error } = await supabase
        .from("tracker_clients")
        .upsert(payload);

      if (error) throw error;

      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error("Failed to save client:", err);
      alert("Error saving client. Please try again.");
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (confirm("Are you sure you want to delete this client record?")) {
      try {
        const { error } = await supabase
          .from("tracker_clients")
          .delete()
          .eq("id", id);

        if (error) throw error;
        loadData();
      } catch (err) {
        console.error("Failed to delete client:", err);
        alert("Error deleting client. Please try again.");
      }
    }
  };

  const filteredClients = clients.filter(c =>
    c.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header skeleton */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-foreground/10 rounded-xl" />
            <div className="h-3 w-72 bg-foreground/10 rounded-full" />
          </div>
          <div className="h-9 w-28 bg-foreground/10 rounded-xl" />
        </div>
        {/* Search bar skeleton */}
        <div className="h-10 w-full bg-foreground/10 rounded-xl" />
        {/* Client card grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-5 rounded-2xl border border-border bg-card space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="h-6 w-40 bg-foreground/10 rounded-lg" />
                  <div className="h-3 w-24 bg-foreground/10 rounded-full" />
                </div>
                <div className="flex gap-2">
                  <div className="size-8 rounded-lg bg-foreground/10" />
                  <div className="size-8 rounded-lg bg-foreground/10" />
                </div>
              </div>
              <div className="space-y-2 pt-1">
                <div className="h-3 w-56 bg-foreground/10 rounded-full" />
                <div className="h-3 w-48 bg-foreground/10 rounded-full" />
                <div className="h-3 w-40 bg-foreground/10 rounded-full" />
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-border">
                <div className="h-3 w-32 bg-foreground/10 rounded-full" />
                <div className="h-5 w-20 bg-foreground/10 rounded-full" />
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
          <h1 className="font-serif text-2xl font-bold">Clients Directory</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage fashion brands, buying houses, and client contact profiles.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-electric text-background font-bold text-xs shadow-lg hover:brightness-110 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="size-4" />
          Add Client
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by company, client name, email, country..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-xs focus:outline-none focus:border-electric transition-colors"
        />
      </div>

      {/* Grid of Client Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredClients.map((c) => {
          const clientEnquiries = enquiries.filter(e => e.client_id === c.id || e.client_name === c.company_name);
          return (
            <div key={c.id} className="p-5 rounded-2xl border border-border bg-card space-y-4 hover:border-electric/40 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-foreground">{c.company_name}</h3>
                  <p className="text-xs text-electric font-semibold">{c.contact_person} ({c.client_name})</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-secondary border border-border">
                  {c.country}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="size-3.5 text-electric shrink-0" />
                  <span>{c.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="size-3.5 text-electric shrink-0" />
                  <span>{c.whatsapp || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="size-3.5 text-electric shrink-0" />
                  <span>Terms: {c.payment_terms}</span>
                </div>
              </div>

              {c.notes && (
                <div className="p-2.5 rounded-lg bg-foreground/[0.02] border border-border text-[11px] text-muted-foreground italic">
                  "{c.notes}"
                </div>
              )}

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">{clientEnquiries.length} Active Enquiries</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(c)}
                    className="p-1.5 rounded-lg border border-border hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Edit className="size-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClient(c.id)}
                    className="p-1.5 rounded-lg border border-border hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 rounded-2xl border border-border bg-card space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold">{editingClient ? "Edit Client" : "Add New Client"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg hover:bg-foreground/10">
                <X className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="col-span-2">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Atelier Saint-Germain"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Client Primary Contact</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Claire Dubois"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="France"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="claire@atelier.fr"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-muted-foreground">WhatsApp / Phone</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+33 6 12 34 56 78"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border"
                />
              </div>

              <div className="col-span-2">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Payment Terms</label>
                <input
                  type="text"
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  placeholder="30% Deposit, 70% Balance"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border"
                />
              </div>

              <div className="col-span-2">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Client preferences, fabric standards..."
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl border border-border text-xs">
                Cancel
              </button>
              <button onClick={handleSaveClient} className="px-4 py-2 rounded-xl bg-electric text-background font-bold text-xs shadow-md">
                Save Client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
