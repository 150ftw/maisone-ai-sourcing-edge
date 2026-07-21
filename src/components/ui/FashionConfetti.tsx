import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scissors } from "lucide-react";

// --- Custom High-Quality Fashion Icons ---

const Dress = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M35 15 L45 25 L55 25 L65 15 L75 35 C75 35 65 50 65 55 L75 85 L25 85 L35 55 C35 50 25 35 25 35 Z" />
    <path d="M40 55 L60 55" />
    <path d="M45 25 C45 35 55 35 55 25" />
  </svg>
);

const ShirtIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M25 30 L45 20 L50 25 L55 20 L75 30 L80 50 L65 55 L65 85 L35 85 L35 55 L20 50 Z" />
    <path d="M50 25 L50 85" />
  </svg>
);

const Pants = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M30 20 L70 20 L75 85 L55 85 L50 45 L45 85 L25 85 Z" />
    <path d="M30 30 L70 30" />
    <path d="M50 20 L50 45" />
  </svg>
);

const Handbag = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 45 L80 45 L75 85 L25 85 Z" />
    <path d="M35 45 C35 25 65 25 65 45" />
    <circle cx="50" cy="55" r="4" fill="currentColor" />
  </svg>
);

const HighHeel = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M75 85 L70 45 C65 35 50 45 40 50 L20 60 C15 65 20 85 30 85 L60 85" />
    <path d="M70 45 C80 45 85 55 75 85" />
  </svg>
);

interface ConfettiPiece {
  id: number;
  x: number;          // Target X offset in vw
  y: number;          // Target Y offset in vh (how high it shoots before falling)
  delay: number;
  duration: number;
  rotation: number;
  scale: number;
  Icon: React.ElementType<{ className?: string }>;
  colorClass: string;
}

const icons = [Dress, ShirtIcon, Pants, Handbag, HighHeel];
const colors = [
  "text-electric",
  "text-electric", // Weighted more towards the golden electric color
  "text-foreground",
  "text-violet-glow",
  "text-cyan-glow",
];

export function FashionConfetti({ duration = 7000 }: { duration?: number }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    // Generate an explosive "fountain" of fashion elements
    const generated: ConfettiPiece[] = Array.from({ length: 80 }).map((_, i) => {
      // Create a fountain effect spreading outwards and upwards from center-bottom
      const angle = (Math.random() * Math.PI) - (Math.PI / 2); // -90 to 90 degrees
      const velocity = 30 + Math.random() * 50; 
      
      return {
        id: i,
        x: Math.sin(angle) * velocity, // horizontal spread
        y: -40 - (Math.random() * 60), // vertical height (negative is up)
        delay: Math.random() * 0.4, // explode almost all at once
        duration: 3 + Math.random() * 2,
        rotation: Math.random() * 720 - 360,
        scale: 0.6 + Math.random() * 0.8,
        Icon: icons[Math.floor(Math.random() * icons.length)],
        colorClass: colors[Math.floor(Math.random() * colors.length)],
      };
    });

    setPieces(generated);

    const timer = setTimeout(() => {
      setPieces([]);
      setShowBanner(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center overflow-hidden">
      
      {/* Dark overlay for contrast */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
      />

      {/* Central "Perfect Fit" Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.3 }}
            className="relative z-20 flex flex-col items-center"
          >
            <div className="relative px-12 py-8 glass-strong rounded-3xl overflow-hidden shadow-2xl border border-electric/40 bg-card/50">
              
              {/* Stitched Border */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none rounded-3xl" style={{ zIndex: 0 }}>
                <rect x="6" y="6" width="calc(100% - 12px)" height="calc(100% - 12px)" rx="18" ry="18" 
                  fill="none" 
                  stroke="var(--color-electric)" 
                  className="animate-stitch opacity-60"
                  strokeWidth="2" 
                  strokeDasharray="8 8"
                />
              </svg>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="relative z-10 flex flex-col items-center text-center gap-3"
              >
                <Scissors className="size-8 text-electric mb-2" />
                <p className="text-[10px] uppercase tracking-[0.4em] text-electric font-semibold">Sequence Verified</p>
                <h2 className="font-serif text-4xl sm:text-5xl text-foreground">The Perfect Fit</h2>
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-electric to-transparent mt-2" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti Particles */}
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ 
            y: "50vh", // start from bottom center
            x: "0vw", 
            rotate: 0,
            opacity: 1,
            scale: 0
          }}
          animate={{ 
            y: [`50vh`, `${p.y}vh`, `${p.y * 1.1}vh`, `120vh`], // shoot up, hang a bit, fall down
            x: [`0vw`, `${p.x * 0.6}vw`, `${p.x * 0.8}vw`, `${p.x}vw`], // drift horizontally
            rotate: [0, p.rotation * 0.5, p.rotation, p.rotation * 1.5],
            opacity: [0, 1, 1, 0],
            scale: [0, p.scale, p.scale, p.scale * 0.8]
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeInOut",
            times: [0, 0.3, 0.7, 1] // peak at 30%, start fading/falling at 70%
          }}
          className={`absolute ${p.colorClass} drop-shadow-lg`}
        >
          <p.Icon className="size-8 sm:size-10" />
        </motion.div>
      ))}
    </div>
  );
}
