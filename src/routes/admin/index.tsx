import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Overview } from "@/components/maisone/Dashboard";
import { OverviewSkeleton } from "../admin";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/admin/")({
  component: AdminIndexRoute,
});

function AdminIndexRoute() {
  const { t } = useLanguage();
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
          placeholder={t("admin.searchBy")}
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
