import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Overview } from "@/components/maisone/Dashboard";
import { useLanguage } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/")({
  component: AdminIndexRoute,
});

function AdminIndexRoute() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [metrics, setMetrics] = useState<{
    activeSuppliers: string | number;
    openPos: string | number;
    avgLeadTime: string | number;
    onTimeRate: string | number;
  } | undefined>(undefined);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const { data: suppliers } = await supabase.from("suppliers").select("lead_time, otd");
        const { count: openRequests } = await supabase
          .from("supplier_requests")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending");

        if (suppliers) {
          const activeSuppliers = suppliers.length;
          const avgLeadTime = suppliers.length > 0 
            ? Math.round(suppliers.reduce((acc, s) => acc + (s.lead_time || 0), 0) / suppliers.length) 
            : 0;
          const onTimeRate = suppliers.length > 0 
            ? (suppliers.reduce((acc, s) => acc + (s.otd || 0), 0) / suppliers.length).toFixed(1) 
            : 0;
          
          setMetrics({
            activeSuppliers: activeSuppliers.toLocaleString(),
            openPos: openRequests || 0,
            avgLeadTime: `${avgLeadTime}d`,
            onTimeRate: `${onTimeRate}%`
          });
        }
      } catch (err) {
        console.error("Failed to fetch dashboard metrics:", err);
      }
    }

    fetchMetrics();
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
          className="w-full rounded-xl bg-foreground/[0.03] border border-foreground/10 pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-electric text-foreground"
        />
      </div>
      <Overview query={query} hideShipments={true} metrics={metrics} />
    </div>
  );
}
