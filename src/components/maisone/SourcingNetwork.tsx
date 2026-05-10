import { motion } from "framer-motion";

// More accurate-looking dotted continents (procedural via mask)
const HUBS = [
  { name: "Tokyo", region: "Japan", x: 84, y: 38 },
  { name: "Osaka", region: "Japan", x: 82, y: 40 },
  { name: "London", region: "United Kingdom", x: 47, y: 32 },
  { name: "Paris", region: "Europe", x: 48, y: 35 },
  { name: "Milan", region: "Europe", x: 50, y: 37 },
  { name: "Berlin", region: "Europe", x: 51, y: 32 },
  { name: "New York", region: "United States", x: 27, y: 40 },
  { name: "Los Angeles", region: "United States", x: 16, y: 44 },
];

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
            {/* dotted continents */}
            <svg viewBox="0 0 200 100" className="absolute inset-0 w-full h-full opacity-50">
              <defs>
                <pattern id="net-dots" x="0" y="0" width="1.6" height="1.6" patternUnits="userSpaceOnUse">
                  <circle cx="0.4" cy="0.4" r="0.32" fill="currentColor" />
                </pattern>
                <mask id="net-mask">
                  <rect width="200" height="100" fill="black" />
                  {/* North America */}
                  <path d="M 12,28 Q 20,22 32,24 L 42,30 L 44,42 L 36,52 L 24,54 L 14,46 Z" fill="white" />
                  {/* South America */}
                  <path d="M 38,56 Q 44,58 46,68 L 42,82 L 36,84 L 32,72 Z" fill="white" />
                  {/* Europe */}
                  <path d="M 92,26 Q 100,22 110,26 L 112,36 L 104,40 L 94,38 Z" fill="white" />
                  {/* Africa */}
                  <path d="M 96,42 Q 108,40 114,48 L 116,64 L 110,76 L 102,74 L 96,60 Z" fill="white" />
                  {/* Asia */}
                  <path d="M 112,22 Q 130,18 152,22 L 168,30 L 170,42 L 158,46 L 142,42 L 122,40 L 114,32 Z" fill="white" />
                  {/* SE Asia / Indonesia */}
                  <path d="M 152,52 Q 162,50 168,54 L 166,60 L 156,60 Z" fill="white" />
                  {/* Australia */}
                  <path d="M 158,68 Q 168,66 176,70 L 174,78 L 162,78 Z" fill="white" />
                  {/* Japan */}
                  <path d="M 166,32 Q 170,30 172,34 L 168,40 Z" fill="white" />
                  {/* UK */}
                  <ellipse cx="92" cy="28" rx="3" ry="3" fill="white" />
                </mask>
              </defs>
              <rect width="200" height="100" fill="url(#net-dots)" mask="url(#net-mask)" className="text-foreground" />
            </svg>

            {/* arcs */}
            <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
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
                  const ax = a.x / 2, ay = a.y / 2;
                  const bx = b.x / 2, by = b.y / 2;
                  const mx = (ax + bx) / 2;
                  const my = Math.min(ay, by) - Math.abs(bx - ax) * 0.25;
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
