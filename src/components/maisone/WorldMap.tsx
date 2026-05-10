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
            <rect width="200" height="100" fill="black" />
            {/* North America */}
            <path d="M 12,28 Q 20,22 32,24 L 42,30 L 44,42 L 36,52 L 24,54 L 14,46 Z" fill="white" />
            {/* South America */}
            <path d="M 38,56 Q 44,58 46,68 L 42,82 L 36,84 L 32,72 Z" fill="white" />
            {/* Europe */}
            <path d="M 92,26 Q 100,22 110,26 L 112,36 L 104,40 L 94,38 Z" fill="white" />
            {/* UK */}
            <ellipse cx="92" cy="28" rx="3" ry="3" fill="white" />
            {/* Africa */}
            <path d="M 96,42 Q 108,40 114,48 L 116,64 L 110,76 L 102,74 L 96,60 Z" fill="white" />
            {/* Asia */}
            <path d="M 112,22 Q 130,18 152,22 L 168,30 L 170,42 L 158,46 L 142,42 L 122,40 L 114,32 Z" fill="white" />
            {/* SE Asia */}
            <path d="M 152,52 Q 162,50 168,54 L 166,60 L 156,60 Z" fill="white" />
            {/* Australia */}
            <path d="M 158,68 Q 168,66 176,70 L 174,78 L 162,78 Z" fill="white" />
            {/* Japan */}
            <path d="M 166,32 Q 170,30 172,34 L 168,40 Z" fill="white" />
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
