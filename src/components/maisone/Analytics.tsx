import { motion } from "framer-motion";
import { TrendingUp, Activity, Gauge, LineChart } from "lucide-react";

const series = [12, 18, 15, 26, 22, 34, 28, 42, 36, 50, 44, 58, 52, 68, 60, 78];
const series2 = [22, 28, 24, 36, 30, 44, 38, 52, 46, 60, 54, 68, 62, 78, 70, 88];

function Sparkline({ data, color, fill }: { data: number[]; color: string; fill: string }) {
  const path = data.map((v, i) => `${(i / (data.length - 1)) * 300} ${100 - v}`).join(" L ");
  return (
    <svg viewBox="0 0 300 100" className="w-full h-28">
      <defs>
        <linearGradient id={fill} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4 }}
        d={`M ${path}`}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      />
      <path d={`M 0 100 L ${path} L 300 100 Z`} fill={`url(#${fill})`} />
    </svg>
  );
}

export function Analytics() {
  return (
    <section id="analytics" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6">— Intelligence</p>
          <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-balance">
            Decision-grade <span className="italic gradient-text">analytics</span>.
          </h2>
          <p className="mt-6 text-muted-foreground max-w-xl">
            Sourcing metrics, supplier performance and trend forecasting — distilled into investor-grade visuals.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* big chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 glass-strong rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-medium flex items-center gap-2"><LineChart className="size-3.5 text-electric" /> Sourcing Volume vs Forecast</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">16-week rolling · 4 regions</p>
              </div>
              <div className="flex gap-2 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-electric" /> Actual</span>
                <span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-violet-glow" /> Forecast</span>
              </div>
            </div>
            <div className="relative">
              <Sparkline data={series} color="oklch(0.65 0.22 255)" fill="grad-a" />
              <div className="absolute inset-0">
                <Sparkline data={series2} color="oklch(0.62 0.24 290)" fill="grad-b" />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3 mt-4">
              {[
                { l: "Q1 Volume", v: "+34%" },
                { l: "Avg Cost", v: "−12%" },
                { l: "On-time", v: "94.7%" },
                { l: "NPS", v: "72" },
              ].map((k) => (
                <div key={k.l} className="rounded-xl bg-background border border-border p-3">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{k.l}</p>
                  <p className="text-base font-semibold tabular-nums mt-0.5">{k.v}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* gauge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass-strong rounded-3xl p-6 flex flex-col"
          >
            <p className="text-xs font-medium flex items-center gap-2 mb-1"><Gauge className="size-3.5 text-electric" /> Supplier Health</p>
            <p className="text-[10px] text-muted-foreground">Aggregate index · live</p>

            <div className="relative flex-1 flex items-center justify-center my-4">
              <svg viewBox="0 0 120 120" className="size-44 -rotate-90">
                <circle cx="60" cy="60" r="52" stroke="oklch(0.97 0.005 260 / 0.08)" strokeWidth="8" fill="none" />
                <motion.circle
                  cx="60" cy="60" r="52"
                  stroke="url(#gauge)" strokeWidth="8" fill="none"
                  strokeLinecap="round"
                  strokeDasharray="326"
                  initial={{ strokeDashoffset: 326 }}
                  whileInView={{ strokeDashoffset: 326 - (326 * 0.92) }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.4 }}
                  style={{ filter: "drop-shadow(0 0 8px oklch(0.65 0.22 255))" }}
                />
                <defs>
                  <linearGradient id="gauge" x1="0" x2="1">
                    <stop offset="0%" stopColor="oklch(0.65 0.22 255)" />
                    <stop offset="100%" stopColor="oklch(0.62 0.24 290)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute text-center">
                <p className="font-serif text-4xl">92</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Index</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { l: "Compliance", v: "98%" },
                { l: "Quality", v: "94%" },
                { l: "Delivery", v: "91%" },
              ].map((k) => (
                <div key={k.l}>
                  <p className="text-sm tabular-nums">{k.v}</p>
                  <p className="text-[9px] uppercase tracking-widest text-muted-foreground">{k.l}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* trend forecasting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-strong rounded-3xl p-6"
          >
            <p className="text-xs font-medium flex items-center gap-2 mb-4"><TrendingUp className="size-3.5 text-electric" /> Trend Forecast · S/S 26</p>
            <div className="space-y-3">
              {[
                { t: "Washed Indigo", c: 92 },
                { t: "Heavyweight Loopback", c: 84 },
                { t: "Italian Linen", c: 76 },
                { t: "Technical Nylon", c: 64 },
              ].map((t) => (
                <div key={t.t}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{t.t}</span>
                    <span className="text-muted-foreground tabular-nums">{t.c}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${t.c}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                      className="h-full bg-gradient-to-r from-electric to-violet-glow"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* heatmap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 glass-strong rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-medium flex items-center gap-2"><Activity className="size-3.5 text-electric" /> Quotation Activity · by region</p>
              <span className="text-[10px] text-muted-foreground">Last 12 weeks</span>
            </div>
            <div className="space-y-2">
              {["Japan", "United Kingdom", "Europe", "United States"].map((r) => (
                <div key={r} className="grid grid-cols-[120px_1fr] items-center gap-3">
                  <span className="text-xs text-muted-foreground">{r}</span>
                  <div className="grid grid-cols-12 gap-1">
                    {Array.from({ length: 12 }).map((_, i) => {
                      const intensity = Math.random() * 0.9 + 0.1;
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.02 }}
                          className="aspect-square rounded-sm"
                          style={{ background: `oklch(0.65 0.22 255 / ${intensity})` }}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
