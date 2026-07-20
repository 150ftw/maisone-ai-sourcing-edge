import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Custom High-Quality Fashion Icons ---

const Hanger = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M50 45 L15 65 C10 68 15 75 20 75 L80 75 C85 75 90 68 85 65 Z" />
    <path d="M50 45 C50 45 50 25 60 25 C65 25 70 30 65 35 C60 40 50 45 50 45" />
  </svg>
);

const ButtonIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="6">
    <circle cx="50" cy="50" r="40" />
    <circle cx="35" cy="35" r="5" fill="currentColor" />
    <circle cx="65" cy="35" r="5" fill="currentColor" />
    <circle cx="35" cy="65" r="5" fill="currentColor" />
    <circle cx="65" cy="65" r="5" fill="currentColor" />
  </svg>
);

const Needle = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
    <path d="M20 80 L85 15" />
    <ellipse cx="85" cy="15" rx="3" ry="12" transform="rotate(45 85 15)" />
  </svg>
);

const ThreadSpool = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
    <path d="M30 20 L70 20 L65 30 L65 70 L70 80 L30 80 L35 70 L35 30 Z" />
    <line x1="35" y1="40" x2="65" y2="40" />
    <line x1="35" y1="50" x2="65" y2="50" />
    <line x1="35" y1="60" x2="65" y2="60" />
  </svg>
);

const Scissors = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
    <circle cx="25" cy="25" r="15" />
    <circle cx="25" cy="75" r="15" />
    <line x1="38" y1="33" x2="90" y2="75" />
    <line x1="38" y1="67" x2="90" y2="25" />
    <circle cx="55" cy="50" r="3" fill="currentColor" />
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
  Icon: React.ElementType;
  colorClass: string;
}

const icons = [Hanger, ButtonIcon, Needle, ThreadSpool, Scissors];
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
            y: [`50vh`, `${p.y}vh`, `120vh`], // shoot up, then fall down
            x: [`0vw`, `${p.x * 0.5}vw`, `${p.x}vw`], // drift horizontally
            rotate: p.rotation,
            opacity: [0, 1, 1, 0],
            scale: [0, p.scale, p.scale, p.scale * 0.8]
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeInOut",
            times: [0, 0.3, 1] // peak at 30% of the animation
          }}
          className={`absolute ${p.colorClass} drop-shadow-lg`}
        >
          <p.Icon className="size-8 sm:size-10" />
        </motion.div>
      ))}
    </div>
  );
}
