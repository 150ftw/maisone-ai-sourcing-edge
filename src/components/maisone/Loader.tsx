import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./Logo";

// Minimalist Sewing Machine SVG
const SewingMachine = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Machine Body */}
    <path d="M16 8 L56 8 C58.2 8 60 9.8 60 12 L60 28 L28 28 L28 44 L20 44 L20 56 L12 56 L12 12 C12 9.8 13.8 8 16 8 Z" fill="currentColor" className="text-foreground" opacity="0.1" />
    <path d="M16 8 L56 8 C58.2 8 60 9.8 60 12 L60 28 L28 28 L28 44 L20 44 L20 56 L12 56 L12 12 C12 9.8 13.8 8 16 8 Z" className="text-foreground" />
    {/* Needle Bar */}
    <line x1="24" y1="44" x2="24" y2="52" className="text-foreground" />
    {/* Needle */}
    <path d="M24 52 L24 62 L22 56" className="text-foreground" />
    {/* Thread */}
    <path d="M28 20 C34 20 38 24 38 30 C38 36 24 36 24 44" strokeDasharray="2 2" className="text-electric" />
    {/* Spool */}
    <circle cx="20" cy="16" r="3" className="text-electric" fill="currentColor" />
    <circle cx="54" cy="18" r="4" fill="currentColor" className="text-foreground" opacity="0.3" />
  </svg>
);

export function Loader() {
  const [phase, setPhase] = useState<"loading" | "sewing" | "done">(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("maisone_has_loaded") ? "done" : "loading";
    }
    return "loading";
  });
  
  useEffect(() => {
    // If it's already done from session storage, do nothing
    if (phase === "done") return;
    
    // 4.5s for loading bar
    const t1 = setTimeout(() => {
      setPhase("sewing");
    }, 4500);

    // 4.5s + 3.0s (sewing animation) = 7.5s total before exiting
    const t2 = setTimeout(() => {
      setPhase("done");
      try {
        sessionStorage.setItem("maisone_has_loaded", "true");
      } catch (e) {
        console.error(e);
      }
    }, 7500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden pointer-events-none">
      <AnimatePresence>
        {/* Top Fabric Panel */}
        {phase !== "done" && (
          <motion.div
            key="top-panel"
            initial={{ y: 0 }}
            exit={{ 
              y: "-100%", 
              transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } 
            }}
            className="absolute top-0 w-full h-1/2 bg-background pointer-events-auto overflow-hidden"
          />
        )}

        {/* Bottom Fabric Panel */}
        {phase !== "done" && (
          <motion.div
            key="bottom-panel"
            initial={{ y: 0 }}
            exit={{ 
              y: "100%", 
              transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } 
            }}
            className="absolute bottom-0 w-full h-1/2 bg-background pointer-events-auto overflow-hidden"
          />
        )}

        {/* Stitched Seam */}
        {phase === "sewing" && (
          <motion.div
            key="seam"
            initial={{ width: "0%", opacity: 1 }}
            animate={{ width: "100%" }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 3.0, ease: "linear" }}
            className="absolute top-1/2 left-0 h-[10px] -translate-y-1/2 overflow-hidden z-[103]"
          >
             <div className="w-[100vw] absolute left-0 top-[4px] h-[2px] border-t-2 border-dashed border-electric/80 shadow-[0_0_10px_var(--electric)]" />
          </motion.div>
        )}

        {/* Sewing Machine Animation */}
        {phase === "sewing" && (
          <motion.div
            key="machine"
            initial={{ left: "0%", x: "-50%", y: "-50%" }}
            animate={{ left: "100%" }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
            transition={{ left: { duration: 3.0, ease: "linear" } }}
            className="absolute top-1/2 z-[105] origin-center"
          >
            <motion.div
              animate={{ y: [-4, 6, -4] }}
              transition={{ duration: 0.1, repeat: Infinity, ease: "linear" }}
            >
              <SewingMachine className="w-16 h-16 drop-shadow-[0_10px_20px_rgba(255,255,255,0.2)]" />
            </motion.div>
          </motion.div>
        )}

        {/* Center Loading Content */}
        {phase === "loading" && (
          <motion.div
            key="loading-content"
            exit={{ 
              opacity: 0, 
              scale: 0.95, 
              filter: "blur(5px)", 
              transition: { duration: 0.3, ease: "easeOut" } 
            }}
            className="absolute inset-0 flex flex-col items-center justify-center z-[102] pointer-events-none"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.0, ease: "easeOut" }}
              className="flex flex-col items-center relative"
            >
              <Logo className="h-72 w-72 relative z-10" showText={false} />
              
              <div className="mt-8 overflow-hidden">
                <motion.p 
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.0, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
                  className="text-sm sm:text-base uppercase tracking-[0.8em] text-foreground font-medium relative z-10"
                >
                  Maisone Global
                </motion.p>
              </div>

              {/* Tape Measure Loading Bar */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="relative mt-12 w-96 h-[12px] bg-foreground/5 border border-border rounded-full overflow-hidden flex items-center"
              >
                 {/* Tape measure ticks */}
                 <div className="absolute inset-0 flex items-center justify-between px-2 opacity-40 z-10">
                   {Array.from({length: 30}).map((_, i) => (
                      <div key={i} className={`w-[1px] bg-foreground ${i % 5 === 0 ? 'h-[10px]' : 'h-[5px]'}`} />
                   ))}
                 </div>
                 
                 <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "0%" }}
                    transition={{ duration: 4, ease: "linear" }}
                    className="h-full w-full bg-gradient-to-r from-electric/40 to-electric relative z-0"
                 />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
