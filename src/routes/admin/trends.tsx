import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Activity, Sparkles, TrendingUp, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { generateTrendForecastFn, DEFAULT_DATA } from "@/components/maisone/TrendForecast";
import type { Region } from "@/components/maisone/TrendForecast";
import { TableSkeleton } from "../admin";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/admin/trends")({
  component: TrendsRoute,
});

const REGIONS: Region[] = ["Japan", "United Kingdom", "Europe", "United States", "India", "China"];

function TrendsRoute() {
  const { t } = useLanguage();
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
          <h1 className="font-serif text-3xl tracking-tight">{t("admin.trendsTitle")}</h1>
          <p className="text-xs text-muted-foreground mt-1">{t("admin.trendsDesc")}</p>
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
            {t("admin.generateAI")}
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
              {t("admin.saveForecast")}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
