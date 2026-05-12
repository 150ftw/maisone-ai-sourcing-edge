import { motion } from "framer-motion";
import { WORLD_PATH } from "./world-path";

const HUBS = [
  { name: "Tokyo", lat: 35.68, lon: 139.69 },
  { name: "Osaka", lat: 34.69, lon: 135.5 },
  { name: "London", lat: 51.5, lon: -0.12 },
  { name: "Paris", lat: 48.85, lon: 2.35 },
  { name: "Milan", lat: 45.46, lon: 9.19 },
  { name: "Berlin", lat: 52.52, lon: 13.4 },
  { name: "New York", lat: 40.71, lon: -74.0 },
  { name: "Los Angeles", lat: 34.05, lon: -118.24 },
].map((h) => ({
  ...h,
  x: ((h.lon + 180) / 360) * 100,
  y: ((90 - h.lat) / 180) * 100,
}));

export function SourcingNetwork() {
  return (
    <section id="network" className="relative py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6">— Global Network</p>
          <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-balance">
            A living <span className="italic gradient-text">sourcing constellation</span>.
          </h2>
          <p className="mt-6 text-muted-foreground">
            Eight luxury hubs across four continents — synchronised in real time.
          </p>
        </div>

        <div className="relative glass-strong rounded-[2rem] p-6 sm:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.65_0.22_255/0.08),transparent_60%)] rounded-[2rem] pointer-events-none" />

          <div className="relative aspect-[2/1] w-full">
            {/* accurate dotted continents */}
            <svg viewBox="0 0 2000 1000" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 w-full h-full opacity-55">
              <defs>
                <pattern id="net-dots" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
                  <circle cx="3" cy="3" r="2.2" fill="currentColor" />
                </pattern>
                <clipPath id="net-land">
                  <path d={WORLD_PATH} fillRule="evenodd" />
                </clipPath>
              </defs>
              <g className="text-foreground" clipPath="url(#net-land)">
                <rect width="2000" height="1000" fill="url(#net-dots)" />
              </g>
            </svg>

            {/* arcs */}
            <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="net-arc" x1="0" x2="1">
                  <stop offset="0%" stopColor="oklch(0.65 0.22 255)" />
                  <stop offset="100%" stopColor="oklch(0.62 0.24 290)" />
                </linearGradient>
                <filter id="net-glow">
                  <feGaussianBlur stdDeviation="0.4" />
                </filter>
              </defs>
              {HUBS.map((a, i) =>
                HUBS.slice(i + 1).map((b, j) => {
                  const ax = a.x, ay = a.y / 2;
                  const bx = b.x, by = b.y / 2;
                  const mx = (ax + bx) / 2;
                  const my = Math.min(ay, by) - Math.abs(bx - ax) * 0.18 - 4;
                  return (
                    <motion.path
                      key={`${i}-${j}`}
                      d={`M ${ax} ${ay} Q ${mx} ${my} ${bx} ${by}`}
                      stroke="url(#net-arc)"
                      strokeWidth="0.18"
                      fill="none"
                      filter="url(#net-glow)"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 0.7 }}
                      viewport={{ once: true }}
                      transition={{ duration: 2, delay: (i + j) * 0.04 }}
                    />
                  );
                })
              )}
            </svg>

            {/* pulses */}
            {HUBS.map((p, i) => (
              <motion.div
                key={p.name}
                className="absolute"
                style={{ left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%, -50%)" }}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.08, type: "spring" }}
              >
                <div className="relative">
                  <div className="absolute -inset-2 rounded-full bg-electric/40 blur-md animate-pulse-glow" />
                  <div className="relative size-2.5 rounded-full bg-electric ring-2 ring-background shadow-[0_0_12px_oklch(0.65_0.22_255)]" />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 whitespace-nowrap">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-foreground/80">{p.name}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-border">
            {[
              { v: "Japan", h: "Tokyo · Osaka" },
              { v: "United Kingdom", h: "London" },
              { v: "Europe", h: "Paris · Milan · Berlin" },
              { v: "United States", h: "New York · Los Angeles" },
            ].map((r) => (
              <div key={r.v}>
                <p className="font-serif text-xl">{r.v}</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{r.h}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
