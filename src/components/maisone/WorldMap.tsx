import { motion } from "framer-motion";
import { WORLD_PATH } from "./world-path";

const TShirt = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" {...props}>
    <path d="M4 3 L7 3 C7 4.5 9 4.5 9 3 L12 3 L15 6 L13 8 L13 15 L3 15 L3 8 L1 6 Z" fill="currentColor" />
  </svg>
);

const Pants = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" {...props}>
    <path d="M4 2 L12 2 L14 14 L9.5 14 L8 7 L6.5 14 L2 14 Z" fill="currentColor" />
  </svg>
);

const Jacket = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" {...props}>
    <path d="M7 2 L9 2 L13 4 L15 8 L12 8 L12 15 L4 15 L4 8 L1 8 L3 4 Z" fill="currentColor" />
  </svg>
);

const Shoe = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" {...props}>
    <path d="M 12 14 L 2 14 C 1 14 1 13 1 12 C 1 10 3 9 4 9 L 5 6 L 8 6 L 10 9 L 12 10 C 14 10 15 11 15 13 C 15 14 14 14 12 14 Z" fill="currentColor" />
  </svg>
);

const Cap = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" {...props}>
    <path d="M 3 10 C 3 5 6 3 9 3 C 12 3 13 6 13 9 L 16 9 C 16 10 14 10 13 10 L 3 10 Z" fill="currentColor" />
  </svg>
);

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
          
          let pathD = "";
          let forwardArcs = "";
          let backwardArcs = "";

          if (sortedPoints.length > 0) {
            pathD = `M ${sortedPoints[0].x} ${sortedPoints[0].y / 2}`;
          }

          const distances = [0];
          let totalDist = 0;
          for(let i = 0; i < sortedPoints.length - 1; i++) {
            const p1 = sortedPoints[i];
            const p2 = sortedPoints[i + 1];
            const dist = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y / 2 - p1.y / 2, 2));
            totalDist += dist;
            distances.push(totalDist);
          }

          const drops = [
            ['tshirt', 'pants', 'shoe'],
            ['jacket', 'cap'],
            ['jacket', 'tshirt', 'shoe'],
            ['tshirt', 'pants', 'jacket', 'cap'],
            ['tshirt', 'pants', 'shoe'],
            ['jacket', 'tshirt', 'pants', 'shoe'],
            ['tshirt', 'cap']
          ];

          const arcs = sortedPoints.map((a, i) => {
            if (i === sortedPoints.length - 1) return null;
            const b = sortedPoints[i + 1];
            const ax = a.x, ay = a.y / 2;
            const bx = b.x, by = b.y / 2;
            const mx = (ax + bx) / 2;
            const dx = Math.abs(bx - ax);
            const arcHeight = Math.max(1.2, Math.min(6, dx * 0.15));
            const my = Math.min(ay, by) - arcHeight;
            
            forwardArcs += ` Q ${mx} ${my} ${bx} ${by}`;
            
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

          // Generate backward arcs so the plane actually turns around and follows the exact same curve back
          for (let i = sortedPoints.length - 1; i > 0; i--) {
            const a = sortedPoints[i];
            const b = sortedPoints[i - 1];
            const ax = a.x, ay = a.y / 2;
            const bx = b.x, by = b.y / 2;
            const mx = (ax + bx) / 2;
            const dx = Math.abs(bx - ax);
            const arcHeight = Math.max(1.2, Math.min(6, dx * 0.15));
            const my = Math.min(ay, by) - arcHeight;
            backwardArcs += ` Q ${mx} ${my} ${bx} ${by}`;
          }

          pathD += forwardArcs + backwardArcs;

          const droppedClothes = sortedPoints.map((a, i) => {
            const delay = totalDist === 0 ? 0 : (distances[i] / totalDist) * 15;
            const t1 = delay / 30; // forward pass time fraction (0 to 0.5)
            const items = drops[i % drops.length];
            
            return items.map((item, j) => {
              const offsetX = (j - (items.length - 1) / 2) * 1.5;
              const x = a.x + offsetX - 0.75;
              const y = a.y / 2 - 0.75; // center exactly on the hub/plane
              
              const stagger = j * 0.005; // slight delay for multiple items
              
              const k1 = Math.max(0.001, t1 + stagger);
              const k2 = k1 + 0.01;
              const k3 = k1 + 0.04;
              const k4 = k1 + 0.06;
              
              const keyTimes = `0; ${k1.toFixed(3)}; ${k2.toFixed(3)}; ${k3.toFixed(3)}; ${k4.toFixed(3)}; 1`;
              const opacityValues = `0; 0; 0.9; 0.9; 0; 0`;
              const translateValues = `0,0; 0,0; 0,1.5; 0,3; 0,4; 0,4`;
              
              const ItemSVG = 
                item === 'tshirt' ? TShirt : 
                item === 'pants' ? Pants : 
                item === 'jacket' ? Jacket : 
                item === 'shoe' ? Shoe : 
                Cap;
              
              return (
                <g key={`drop-${i}-${j}`} className="text-electric drop-shadow-md" opacity="0">
                  <ItemSVG x={x} y={y} width="1.5" height="1.5" />
                  <animate
                    attributeName="opacity"
                    values={opacityValues}
                    keyTimes={keyTimes}
                    dur="30s"
                    repeatCount="indefinite"
                  />
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values={translateValues}
                    keyTimes={keyTimes}
                    dur="30s"
                    repeatCount="indefinite"
                  />
                </g>
              );
            });
          });

          return (
            <>
              {arcs}
              {droppedClothes}
              {pathD && (
                <g>
                  {/* Center, rotate 90deg to face right, and scale down the airplane */}
                  <g transform="scale(0.08)">
                    <path
                      d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5L21 16z"
                      fill="oklch(0.65 0.22 255)"
                      transform="rotate(90) translate(-12, -12)"
                    />
                  </g>
                  <animateMotion
                    path={pathD}
                    dur="30s"
                    repeatCount="indefinite"
                    rotate="auto"
                    calcMode="linear"
                  />
                </g>
              )}
            </>
          );
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
                className="absolute whitespace-nowrap z-10"
                style={getLabelStyle(p.align)}
              >
                <span className="text-xs font-semibold tracking-widest uppercase text-foreground bg-background/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 shadow-lg">
                  {p.name}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
