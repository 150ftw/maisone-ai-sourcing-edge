import { motion } from "framer-motion";

// Approximate equirectangular coords (longitude → x %, latitude → y %)
const toXY = (lat: number, lon: number) => ({
  x: ((lon + 180) / 360) * 100,
  y: ((90 - lat) / 180) * 100,
});

export const HUBS = [
  { name: "Tokyo", region: "Japan", lat: 35.68, lon: 139.69 },
  { name: "Osaka", region: "Japan", lat: 34.69, lon: 135.5 },
  { name: "London", region: "United Kingdom", lat: 51.5, lon: -0.12 },
  { name: "Paris", region: "Europe", lat: 48.85, lon: 2.35 },
  { name: "Milan", region: "Europe", lat: 45.46, lon: 9.19 },
  { name: "Berlin", region: "Europe", lat: 52.52, lon: 13.4 },
  { name: "New York", region: "United States", lat: 40.71, lon: -74.0 },
  { name: "Los Angeles", region: "United States", lat: 34.05, lon: -118.24 },
];

export function WorldMap({ compact = false }: { compact?: boolean }) {
  const points = HUBS.map((h) => ({ ...h, ...toXY(h.lat, h.lon) }));

  return (
    <div className={`relative w-full ${compact ? "aspect-[2/1]" : "aspect-[16/9]"} overflow-hidden rounded-3xl`}>
      {/* Dot-grid world silhouette */}
      <svg viewBox="0 0 200 100" className="absolute inset-0 w-full h-full opacity-40">
        <defs>
          <pattern id="dots" x="0" y="0" width="2" height="2" patternUnits="userSpaceOnUse">
            <circle cx="0.5" cy="0.5" r="0.35" fill="currentColor" />
          </pattern>
          <mask id="continents">
            {/* simplified continent blobs */}
            <rect width="200" height="100" fill="black" />
            <ellipse cx="40" cy="42" rx="22" ry="14" fill="white" />
            <ellipse cx="55" cy="60" rx="10" ry="18" fill="white" />
            <ellipse cx="100" cy="38" rx="18" ry="10" fill="white" />
            <ellipse cx="110" cy="55" rx="14" ry="20" fill="white" />
            <ellipse cx="150" cy="40" rx="22" ry="14" fill="white" />
            <ellipse cx="160" cy="65" rx="8" ry="10" fill="white" />
            <ellipse cx="175" cy="55" rx="6" ry="6" fill="white" />
          </mask>
        </defs>
        <rect width="200" height="100" fill="url(#dots)" mask="url(#continents)" className="text-foreground" />
      </svg>

      {/* Connection arcs between hubs */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
        {points.map((a, i) =>
          points.slice(i + 1).map((b, j) => {
            const mx = (a.x + b.x) / 2;
            const my = Math.min(a.y, b.y) - 8;
            return (
              <motion.path
                key={`${i}-${j}`}
                d={`M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`}
                stroke="url(#arc-grad)"
                strokeWidth="0.15"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.5 }}
                viewport={{ once: true }}
                transition={{ duration: 2, delay: (i + j) * 0.05 }}
              />
            );
          })
        )}
        <defs>
          <linearGradient id="arc-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="oklch(0.65 0.22 255)" />
            <stop offset="100%" stopColor="oklch(0.62 0.24 290)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Hub markers */}
      {points.map((p, i) => (
        <motion.div
          key={p.name}
          className="absolute"
          style={{ left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%, -50%)" }}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + i * 0.08, type: "spring" }}
        >
          <div className="relative">
            <div className="absolute inset-0 size-3 rounded-full bg-electric animate-pulse-glow" />
            <div className="relative size-2 rounded-full bg-electric ring-2 ring-background" />
            {!compact && (
              <div className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap">
                <span className="text-[10px] tracking-[0.2em] uppercase text-foreground/70">{p.name}</span>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
