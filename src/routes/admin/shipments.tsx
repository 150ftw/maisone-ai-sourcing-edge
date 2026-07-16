import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, X, Globe } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Shipments } from "@/components/maisone/Dashboard";
import { TableSkeleton, ShipmentStatusDropdown, CustomSelect } from "../admin";

export const Route = createFileRoute("/admin/shipments")({
  component: ShipmentsRoute,
});

function ShipmentsRoute() {
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
