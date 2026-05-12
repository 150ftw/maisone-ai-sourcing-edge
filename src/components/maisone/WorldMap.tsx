import { motion } from "framer-motion";
import { WORLD_PATH } from "./world-path";

// Equirectangular projection: x = (lon+180)/360, y = (90-lat)/180 (as 0..1)
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
    <div className={`relative w-full ${compact ? "aspect-[2/1]" : "aspect-[2/1]"} overflow-hidden rounded-3xl`}>
      {/* Accurate dotted world silhouette (equirectangular) */}
      <svg viewBox="0 0 2000 1000" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 w-full h-full opacity-50">
        <defs>
          <pattern id="wm-dots" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="2.2" fill="currentColor" />
          </pattern>
          <clipPath id="wm-land">
            <path d={WORLD_PATH} fillRule="evenodd" />
          </clipPath>
        </defs>
        <g className="text-foreground" clipPath="url(#wm-land)">
          <rect width="2000" height="1000" fill="url(#wm-dots)" />
        </g>
      </svg>

      {/* Connection arcs between hubs */}
      <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="arc-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="oklch(0.65 0.22 255)" />
            <stop offset="100%" stopColor="oklch(0.62 0.24 290)" />
          </linearGradient>
        </defs>
        {points.map((a, i) =>
          points.slice(i + 1).map((b, j) => {
            const ax = a.x, ay = a.y / 2;
            const bx = b.x, by = b.y / 2;
            const mx = (ax + bx) / 2;
            const my = Math.min(ay, by) - Math.abs(bx - ax) * 0.18 - 4;
            return (
              <motion.path
                key={`${i}-${j}`}
                d={`M ${ax} ${ay} Q ${mx} ${my} ${bx} ${by}`}
                stroke="url(#arc-grad)"
                strokeWidth="0.15"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.55 }}
                viewport={{ once: true }}
                transition={{ duration: 2, delay: (i + j) * 0.05 }}
              />
            );
          })
        )}
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
