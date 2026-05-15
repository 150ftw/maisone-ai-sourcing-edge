import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Sparkles, Activity } from "lucide-react";

type Region = "Global" | "Japan" | "United Kingdom" | "Europe" | "United States";

type Forecast = {
  fabrics: { name: string; score: number; signal: string }[];
  colors: { name: string; hex: string; pantone: string; score: number }[];
  silhouettes: { name: string; score: number; note: string }[];
};

const DATA: Record<Region, Forecast> = {
  Global: {
    fabrics: [
      { name: "Recycled Selvedge", score: 94, signal: "Runway · Resort '26" },
      { name: "Brushed Loopback", score: 88, signal: "Retail sell-through" },
      { name: "Tech Wool", score: 81, signal: "Social · +132% MoM" },
      { name: "Organic Pima", score: 76, signal: "Editorial mentions" },
    ],
    colors: [
      { name: "Indigo Noir", hex: "#1c2545", pantone: "19-3933", score: 92 },
      { name: "Atelier Cream", hex: "#ece3d2", pantone: "12-0710", score: 87 },
      { name: "Ember Clay", hex: "#b85c3a", pantone: "17-1456", score: 79 },
      { name: "Verdant Sage", hex: "#7a8f6a", pantone: "16-0421", score: 73 },
    ],
    silhouettes: [
      { name: "Oversized Tailoring", score: 89, note: "Cross-gender" },
      { name: "Cropped Outerwear", score: 84, note: "FW '26" },
      { name: "Fluid Knitwear", score: 78, note: "Resort" },
    ],
  },
  Japan: {
    fabrics: [
      { name: "Natural Indigo", score: 96, signal: "Okayama mills · capacity tight" },
      { name: "Sashiko Cotton", score: 89, signal: "Heritage revival" },
      { name: "Tech Linen", score: 82, signal: "Tokyo runway" },
      { name: "Wagara Jacquard", score: 74, signal: "Editorial" },
    ],
    colors: [
      { name: "Aizome Blue", hex: "#1a3a6b", pantone: "19-3953", score: 95 },
      { name: "Shironeri", hex: "#fbf7ee", pantone: "11-0103", score: 88 },
      { name: "Sumi Black", hex: "#1a1a1a", pantone: "19-4007", score: 82 },
      { name: "Beni Red", hex: "#c4302b", pantone: "18-1664", score: 71 },
    ],
    silhouettes: [
      { name: "Wide-leg Trouser", score: 91, note: "SS '26" },
      { name: "Haori Layer", score: 85, note: "Resort" },
      { name: "Boxy Workwear", score: 79, note: "Cross-season" },
    ],
  },
  "United Kingdom": {
    fabrics: [
      { name: "Heritage Tweed", score: 92, signal: "Savile Row revival" },
      { name: "Waxed Cotton", score: 86, signal: "Outerwear demand" },
      { name: "Fine Merino", score: 80, signal: "Knitwear sell-through" },
      { name: "Liberty Print", score: 72, signal: "Editorial" },
    ],
    colors: [
      { name: "Forest Loden", hex: "#2d4a2b", pantone: "19-0220", score: 90 },
      { name: "Oxblood", hex: "#5c1f1b", pantone: "19-1525", score: 85 },
      { name: "Stone Grey", hex: "#a8a39a", pantone: "16-1305", score: 78 },
      { name: "Royal Mustard", hex: "#c89a3a", pantone: "15-0942", score: 70 },
    ],
    silhouettes: [
      { name: "Tailored Coat", score: 90, note: "FW '26" },
      { name: "Field Jacket", score: 83, note: "Cross-season" },
      { name: "Pleated Skirt", score: 75, note: "Resort" },
    ],
  },
  Europe: {
    fabrics: [
      { name: "Italian Wool", score: 93, signal: "Milan capacity" },
      { name: "French Lace", score: 84, signal: "Couture week" },
      { name: "German Loopback", score: 81, signal: "Retail demand" },
      { name: "Portuguese Knit", score: 77, signal: "Sourcing volume" },
    ],
    colors: [
      { name: "Veneto Cream", hex: "#efe6d2", pantone: "12-0710", score: 91 },
      { name: "Milan Grigio", hex: "#6b6b6b", pantone: "17-4015", score: 85 },
      { name: "Provence Lilac", hex: "#a896c4", pantone: "15-3716", score: 76 },
      { name: "Bordeaux", hex: "#5b1a2a", pantone: "19-1726", score: 72 },
    ],
    silhouettes: [
      { name: "Sculpted Blazer", score: 88, note: "FW '26" },
      { name: "Slip Dress", score: 81, note: "Resort" },
      { name: "Long Trench", score: 77, note: "Cross-season" },
    ],
  },
  "United States": {
    fabrics: [
      { name: "Garment-dyed Fleece", score: 91, signal: "Streetwear demand" },
      { name: "Heavyweight Jersey", score: 87, signal: "DTC sell-through" },
      { name: "Recycled Denim", score: 83, signal: "Sustainability filter" },
      { name: "Tech Nylon", score: 75, signal: "Outerwear pipeline" },
    ],
    colors: [
      { name: "Brooklyn Charcoal", hex: "#2b2b2e", pantone: "19-4006", score: 89 },
      { name: "Sun-faded Coral", hex: "#d97757", pantone: "16-1442", score: 84 },
      { name: "Desert Tan", hex: "#c2a07a", pantone: "15-1314", score: 78 },
      { name: "Court Green", hex: "#3a6b4f", pantone: "18-6024", score: 72 },
    ],
    silhouettes: [
      { name: "Relaxed Hoodie", score: 92, note: "All-season" },
      { name: "Cargo Pant", score: 84, note: "FW '26" },
      { name: "Varsity Jacket", score: 78, note: "Drop culture" },
    ],
  },
};

const REGIONS: Region[] = ["Global", "Japan", "United Kingdom", "Europe", "United States"];

export function TrendForecast() {
  const [region, setRegion] = useState<Region>("Global");
  const data = DATA[region];

  return (
    <section id="trends" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6">— AI Trend Forecast</p>
            <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-balance">
              Signals from the <span className="italic gradient-text">global atelier</span>.
            </h2>
            <p className="mt-6 text-muted-foreground">
              Maisone AI synthesises runway, retail sell-through, social and editorial signals into actionable sourcing forecasts — refreshed every 6 hours.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 p-1 glass rounded-full border border-border">
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`text-xs px-3.5 py-1.5 rounded-full transition-colors ${
                  region === r ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Fabrics */}
          <Panel title="Trending fabrics" icon={Activity}>
            <AnimatePresence mode="wait">
              <motion.div
                key={region + "-fabrics"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="space-y-3"
              >
                {data.fabrics.map((f) => (
                  <div key={f.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span>{f.name}</span>
                      <span className="text-xs text-electric tabular-nums">{f.score}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${f.score}%` }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-electric to-violet-glow"
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground">{f.signal}</p>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </Panel>

          {/* Colors */}
          <Panel title="Color forecast" icon={Sparkles}>
            <AnimatePresence mode="wait">
              <motion.div
                key={region + "-colors"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="space-y-3"
              >
                {data.colors.map((c) => (
                  <div key={c.name} className="flex items-center gap-3 rounded-xl p-2.5 glass border border-border">
                    <div
                      className="size-10 rounded-lg shrink-0 ring-1 ring-foreground/10"
                      style={{ backgroundColor: c.hex }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm truncate">{c.name}</p>
                        <span className="text-xs text-electric tabular-nums">{c.score}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Pantone {c.pantone} · {c.hex.toUpperCase()}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </Panel>

          {/* Silhouettes */}
          <Panel title="Silhouettes" icon={TrendingUp}>
            <AnimatePresence mode="wait">
              <motion.div
                key={region + "-silhouettes"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="space-y-3"
              >
                {data.silhouettes.map((s) => (
                  <div key={s.name} className="rounded-xl p-3 glass border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm">{s.name}</p>
                      <span className="text-xs text-electric tabular-nums">{s.score}</span>
                    </div>
                    <div className="h-1 rounded-full bg-secondary overflow-hidden mb-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${s.score}%` }}
                        transition={{ duration: 0.7 }}
                        className="h-full rounded-full bg-gradient-to-r from-cyan-glow to-electric"
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground">{s.note}</p>
                  </div>
                ))}

                <div className="mt-4 pt-4 border-t border-border text-[10px] text-muted-foreground flex items-center justify-between">
                  <span>Signals analysed</span>
                  <span className="tabular-nums text-foreground/80">2.4M / 6h</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </Panel>
        </div>
      </div>
    </section>
  );
}

function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-strong rounded-3xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-full border border-electric/20 bg-electric/10 flex items-center justify-center">
            <Icon className="size-3.5 text-electric" />
          </div>
          <p className="text-sm">{title}</p>
        </div>
        <span className="text-[9px] uppercase tracking-widest text-muted-foreground">Live</span>
      </div>
      {children}
    </div>
  );
}
