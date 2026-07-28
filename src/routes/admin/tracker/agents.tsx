import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Plus, X, Edit, Trash2, PhoneCall } from "lucide-react";
import { toast } from "sonner";
import {
  TrackerAgent
} from "@/lib/tracker-store";
import { useTrackerAgents, useSaveAgentMutation, useDeleteAgentMutation } from "@/hooks/useTrackerData";
import { useRealtimeTracker } from "@/hooks/useRealtimeTracker";

export const Route = createFileRoute("/admin/tracker/agents")({
  component: AgentsRoute,
});

function AgentsRoute() {
  useRealtimeTracker();
  const { data: agents = [], isLoading: loading } = useTrackerAgents();
  const saveAgentMutation = useSaveAgentMutation();
  const deleteAgentMutation = useDeleteAgentMutation();

  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<TrackerAgent | null>(null);

  // Form State
  const [agentName, setAgentName] = useState("");
  const [region, setRegion] = useState("Europe & UK");
  const [clientsManaged, setClientsManaged] = useState("5");
  const [contactDetails, setContactDetails] = useState("");

  const openCreateModal = () => {
    setEditingAgent(null);
    setAgentName("");
    setRegion("Europe & UK");
    setClientsManaged("5");
    setContactDetails("");
    setIsModalOpen(true);
  };

  const openEditModal = (a: TrackerAgent) => {
    setEditingAgent(a);
    setAgentName(a.agent_name);
    setRegion(a.region);
    setClientsManaged(a.clients_managed.toString());
    setContactDetails(a.contact_details);
    setIsModalOpen(true);
  };

  const handleSaveAgent = async () => {
    if (!agentName.trim()) {
      toast.error("Please enter an agent name.");
      return;
    }

    try {
      const agentData: TrackerAgent = {
        id: editingAgent ? editingAgent.id : crypto.randomUUID(),
        created_at: editingAgent ? editingAgent.created_at : new Date().toISOString(),
        agent_name: agentName.trim(),
        region: region.trim() || "Europe & UK",
        clients_managed: parseInt(clientsManaged) || 0,
        contact_details: contactDetails.trim()
      };

      await saveAgentMutation.mutateAsync(agentData);
      setIsModalOpen(false);
      toast.success(`Agent "${agentName}" saved successfully!`);
    } catch (err) {
      console.error("Failed to save agent:", err);
      toast.error("Error saving agent. Please try again.");
    }
  };

  const handleDeleteAgent = async (id: string) => {
    if (confirm("Are you sure you want to delete this agent profile?")) {
      try {
        await deleteAgentMutation.mutateAsync(id);
        toast.success("Agent deleted successfully.");
      } catch (err) {
        console.error("Failed to delete agent:", err);
        toast.error("Error deleting agent. Please try again.");
      }
    }
  };

  const filteredAgents = agents.filter(a =>
    a.agent_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.contact_details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="space-y-2">
            <div className="h-7 w-44 bg-foreground/10 rounded-xl" />
            <div className="h-3 w-60 bg-foreground/10 rounded-full" />
          </div>
          <div className="h-9 w-28 bg-foreground/10 rounded-xl" />
        </div>
        <div className="h-10 w-full bg-foreground/10 rounded-xl" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-5 rounded-2xl border border-border bg-card flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-foreground/10 shrink-0" />
                <div className="space-y-2">
                  <div className="h-4 w-36 bg-foreground/10 rounded-lg" />
                  <div className="h-3 w-24 bg-foreground/10 rounded-full" />
                  <div className="h-3 w-52 bg-foreground/10 rounded-full" />
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="h-6 w-14 bg-foreground/10 rounded-full" />
                <div className="size-8 rounded-lg bg-foreground/10" />
                <div className="size-8 rounded-lg bg-foreground/10" />
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
          <h1 className="font-serif text-2xl font-bold">Sourcing Agents</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Regional buying representatives and agent profiles.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-electric text-background font-bold text-xs shadow-lg hover:brightness-110 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="size-4" />
          Add Agent
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by agent name, region, contact details..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-xs focus:outline-none focus:border-electric transition-colors"
        />
      </div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredAgents.map((a) => (
          <div key={a.id} className="p-5 rounded-2xl border border-border bg-card space-y-4 hover:border-electric/40 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-electric/15 text-electric flex items-center justify-center font-bold text-sm font-serif">
                  {a.agent_name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-foreground">{a.agent_name}</h3>
                  <p className="text-[11px] text-electric font-semibold">{a.region}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-foreground/[0.02] border border-border flex justify-between items-center">
                <span className="text-muted-foreground">Clients Managed:</span>
                <span className="font-bold text-foreground">{a.clients_managed} Brands</span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <PhoneCall className="size-3.5 text-electric shrink-0" />
                <span className="truncate">{a.contact_details}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-border flex justify-end gap-2">
              <button
                onClick={() => openEditModal(a)}
                className="p-1.5 rounded-lg border border-border hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Edit className="size-3.5" />
              </button>
              <button
                onClick={() => handleDeleteAgent(a.id)}
                className="p-1.5 rounded-lg border border-border hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl border border-border bg-card space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold">{editingAgent ? "Edit Agent Profile" : "Add New Agent"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg hover:bg-foreground/10">
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Agent Name</label>
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="Sophie Laurent"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Region Covered</label>
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="Europe & UK"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Active Clients Managed</label>
                <input
                  type="number"
                  value={clientsManaged}
                  onChange={(e) => setClientsManaged(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Contact Details (Email / Phone)</label>
                <input
                  type="text"
                  value={contactDetails}
                  onChange={(e) => setContactDetails(e.target.value)}
                  placeholder="sophie@maisone-agents.com | +33 6 98 76 54 32"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-foreground/[0.02] border border-border"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl border border-border text-xs">
                Cancel
              </button>
              <button onClick={handleSaveAgent} className="px-4 py-2 rounded-xl bg-electric text-background font-bold text-xs shadow-md">
                Save Agent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
