import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./Logo";
import { SewingMachine } from "./SewingMachineIcon";

export function Loader() {
  const [phase, setPhase] = useState<"loading" | "sewing" | "done">(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("maisone_has_loaded") ? "done" : "loading";
    }
    return "loading";
  });
  
  useEffect(() => {
    // If it's already done from session storage, do nothing
    if (phase === "done") {
      document.body.style.overflow = "";
      return;
    }
    
    document.body.style.overflow = "hidden";
    
    // 4.5s for loading bar
    const t1 = setTimeout(() => {
      setPhase("sewing");
    }, 4500);

    const t2 = setTimeout(() => {
      setPhase("done");
      document.body.style.overflow = "";
      try {
        sessionStorage.setItem("maisone_has_loaded", "true");
      } catch (e) {
        console.error(e);
      }
    }, 8550);

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

        {/* Sewing Phase Container */}
        {phase === "sewing" && (
          <motion.div 
            key="sewing-phase"
            className="absolute inset-0 z-[105] pointer-events-none overflow-hidden"
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            {/* Left Machine */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute left-0 top-1/2 -translate-y-[69%] z-30"
            >
              <motion.div animate={{ x: [-2, 2, -2] }} transition={{ duration: 0.15, repeat: Infinity, ease: "linear" }}>
                <img src="/sewing-machine.png" alt="Sewing Machine" className="w-32 md:w-48 lg:w-56 h-auto drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] dark:invert" />
              </motion.div>
            </motion.div>

            {/* Right Machine */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute right-0 top-1/2 -translate-y-[69%] z-30"
            >
              <motion.div animate={{ x: [-2, 2, -2] }} transition={{ duration: 0.15, repeat: Infinity, ease: "linear" }}>
                <img src="/sewing-machine.png" alt="Sewing Machine" className="w-32 md:w-48 lg:w-56 h-auto drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] dark:invert" style={{ transform: 'scaleX(-1)' }} />
              </motion.div>
            </motion.div>

            {/* Sewing flex row for perfect alignment */}
            <div className="absolute w-full top-1/2 -translate-y-1/2 flex items-center px-[5%] sm:px-[10%] z-40">
              
              {/* Left Thread Container */}
              <div className="flex-grow flex items-center justify-start h-full">
                 <motion.div
                    className="h-[2.5px] bg-foreground origin-left"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.0, ease: "linear" }}
                 />
              </div>

              {/* Text */}
              <div className="relative flex-shrink-0 flex items-center px-1 overflow-hidden">
                  <motion.div
                    initial={{ clipPath: "inset(0 100% 0 0)" }}
                    animate={{ clipPath: "inset(0 0% 0 0)" }}
                    transition={{ duration: 1.8, delay: 1.0, ease: "linear" }}
                  >
                    <h2 className="text-4xl sm:text-6xl font-serif italic text-foreground whitespace-nowrap">
                      Maisone&nbsp;
                    </h2>
                  </motion.div>
                  <motion.div
                    initial={{ clipPath: "inset(0 0 0 100%)" }}
                    animate={{ clipPath: "inset(0 0 0 0%)" }}
                    transition={{ duration: 1.8, delay: 1.0, ease: "linear" }}
                  >
                    <h2 className="text-4xl sm:text-6xl font-serif italic text-foreground whitespace-nowrap">
                      Global
                    </h2>
                  </motion.div>

                  {/* Diagonal Shine Sweep (Bottom-Left to Top-Right) */}
                  <motion.div 
                    className="absolute w-[80px] sm:w-[150px] h-[800px] bg-gradient-to-r from-transparent via-white/80 to-transparent z-50 pointer-events-none"
                    style={{ marginTop: "-400px", marginLeft: "-40px" }}
                    initial={{ left: "-150%", top: "250%", rotate: 45, opacity: 0 }}
                    animate={{ left: "250%", top: "-150%", rotate: 45, opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 1.0, delay: 2.8, ease: "linear" }}
                  />
              </div>

              {/* Right Thread Container */}
              <div className="flex-grow flex items-center justify-end h-full">
                 <motion.div
                    className="h-[2.5px] bg-foreground origin-right"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.0, ease: "linear" }}
                 />
              </div>
            </div>
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
