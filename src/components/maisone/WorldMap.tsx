import { motion } from "framer-motion";
import { WORLD_PATH } from "./world-path";

// Equirectangular projection: x = (lon+180)/360, y = (90-lat)/180 (as 0..1)
const toXY = (lat: number, lon: number) => ({
  x: ((lon + 180) / 360) * 100,
  y: ((90 - lat) / 180) * 100,
});

export const HUBS = [
  { name: "United States", region: "United States", lat: 39.09, lon: -98.71, align: "top" },
  { name: "United Kingdom", region: "United Kingdom", lat: 54.0, lon: -2.5, align: "top" },
  { name: "France", region: "France", lat: 46.22, lon: 2.21, align: "left" },
  { name: "Italy", region: "Italy", lat: 42.5, lon: 12.5, align: "right" },
  { name: "India", region: "India", lat: 21.0, lon: 78.0, align: "left" },
  { name: "China", region: "China", lat: 33.0, lon: 104.0, align: "bottom" },
  { name: "Japan", region: "Japan", lat: 36.0, lon: 138.0, align: "right" },
];

const getLabelStyle = (align?: string) => {
  switch (align) {
    case "top":
      return { bottom: "10px", left: "50%", transform: "translateX(-50%)" };
    case "bottom":
      return { top: "10px", left: "50%", transform: "translateX(-50%)" };
    case "left":
      return { right: "10px", top: "50%", transform: "translateY(-50%)" };
    case "top-left":
      return { bottom: "10px", right: "10px" };
    case "top-right":
      return { bottom: "10px", left: "10px" };
    case "bottom-left":
      return { top: "10px", right: "10px" };
    case "bottom-right":
      return { top: "10px", left: "10px" };
    case "right":
    default:
      return { left: "10px", top: "50%", transform: "translateY(-50%)" };
  }
};

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
        {(() => {
          const sortedPoints = [...points].sort((a, b) => a.lon - b.lon);
          return sortedPoints.map((a, i) => {
            if (i === sortedPoints.length - 1) return null;
            const b = sortedPoints[i + 1];
            const ax = a.x, ay = a.y / 2;
            const bx = b.x, by = b.y / 2;
            const mx = (ax + bx) / 2;
            const dx = Math.abs(bx - ax);
            const arcHeight = Math.max(1.2, Math.min(6, dx * 0.15));
            const my = Math.min(ay, by) - arcHeight;
            return (
              <motion.path
                key={i}
                d={`M ${ax} ${ay} Q ${mx} ${my} ${bx} ${by}`}
                stroke="url(#arc-grad)"
                strokeWidth="0.15"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.55 }}
                viewport={{ once: true }}
                transition={{ duration: 2, delay: i * 0.15 }}
              />
            );
          });
        })()}
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
              <div 
                className="absolute whitespace-nowrap"
                style={getLabelStyle(p.align)}
              >
                <span className="text-[10px] tracking-[0.2em] uppercase text-foreground/70">{p.name}</span>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
