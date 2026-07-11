import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./Logo";

// Animated Clothing Icons & SVG Elements
const ZipperPull = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 40" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <rect x="8" y="2" width="8" height="10" rx="3" />
    <path d="M6 12 L18 12 L20 30 L12 38 L4 30 Z" fill="currentColor" className="text-electric" opacity="0.8" />
    <path d="M6 12 L18 12 L20 30 L12 38 L4 30 Z" />
    <circle cx="12" cy="7" r="2" />
  </svg>
);



export function Loader() {
  const [show, setShow] = useState(true);
  
  useEffect(() => {
    // 5 seconds loading time
    const t = setTimeout(() => setShow(false), 5000);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex overflow-hidden pointer-events-none"
        >
          {/* Animated Fabric Grid Background inside Panels */}
          
          {/* Left Fabric Panel */}
          <motion.div
            initial={{ x: 0 }}
            exit={{ 
              x: "-100%", 
              transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.6 } 
            }}
            className="w-1/2 h-full bg-[#080808] pointer-events-auto relative overflow-hidden flex justify-end"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
          >
            {/* Zipper Teeth Left */}
            <motion.div 
              initial={{ opacity: 0 }}
              exit={{ opacity: 1, transition: { duration: 0.3 } }}
              className="w-1.5 h-full flex flex-col justify-around py-2 border-r border-white/5"
            >
               {Array.from({length: 60}).map((_, i) => (
                  <div key={i} className="w-full h-[4px] bg-white/20 rounded-l-sm" />
               ))}
            </motion.div>
          </motion.div>

          {/* Right Fabric Panel */}
          <motion.div
            initial={{ x: 0 }}
            exit={{ 
              x: "100%", 
              transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.6 } 
            }}
            className="w-1/2 h-full bg-[#080808] pointer-events-auto relative overflow-hidden flex justify-start"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '24px 24px', backgroundPosition: '-12px 0' }}
          >
            {/* Zipper Teeth Right */}
            <motion.div 
              initial={{ opacity: 0 }}
              exit={{ opacity: 1, transition: { duration: 0.3 } }}
              className="w-1.5 h-full flex flex-col justify-around py-2 border-l border-white/5 mt-[6px]"
            >
               {Array.from({length: 60}).map((_, i) => (
                  <div key={i} className="w-full h-[4px] bg-white/20 rounded-r-sm" />
               ))}
            </motion.div>
          </motion.div>

          {/* The Unzipping Action */}
          <motion.div
            initial={{ top: "-15%", opacity: 0 }}
            exit={{
              top: ["-15%", "150%"],
              opacity: [0, 1, 1, 0],
              transition: { duration: 0.9, ease: "easeIn", times: [0, 0.1, 0.9, 1] }
            }}
            className="absolute left-1/2 -translate-x-1/2 z-[105]"
          >
            <ZipperPull className="w-10 h-16 text-white drop-shadow-[0_10px_20px_rgba(255,255,255,0.2)]" />
          </motion.div>

          {/* Central Seam glow as zipper unzips */}
          <motion.div
            initial={{ height: "0vh", opacity: 0, top: "0%" }}
            exit={{ 
              height: ["0vh", "150vh", "150vh"], 
              opacity: [0, 1, 0],
              transition: { duration: 1.0, times: [0, 0.8, 1], ease: "easeIn" } 
            }}
            className="absolute left-1/2 w-[4px] -translate-x-1/2 bg-gradient-to-b from-transparent via-electric/50 to-electric z-[104] blur-[2px]"
          />

          {/* Floating animated sewing elements */}
          <motion.div
             exit={{ opacity: 0, transition: { duration: 0.3 } }}
             className="absolute inset-0 pointer-events-none z-[101]"
          >

          </motion.div>

          {/* Center Loading Content */}
          <motion.div
            exit={{ 
              opacity: 0, 
              scale: 0.9, 
              filter: "blur(10px)", 
              transition: { duration: 0.4, ease: "easeOut" } 
            }}
            className="absolute inset-0 flex flex-col items-center justify-center z-[102] pointer-events-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="flex flex-col items-center relative"
            >
              <Logo className="h-56 w-56 relative z-10" showText={false} />
              
              <div className="mt-10 overflow-hidden">
                <motion.p 
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.2, delay: 0.4, ease: [0.76, 0, 0.24, 1] }}
                  className="text-sm sm:text-base uppercase tracking-[0.8em] text-white/90 font-medium relative z-10"
                >
                  Maisone Global
                </motion.p>
              </div>

              {/* Tape Measure Loading Bar */}
              <div className="relative mt-12 w-96 h-[12px] bg-white/5 border border-white/10 rounded-full overflow-hidden flex items-center">
                 {/* Tape measure ticks */}
                 <div className="absolute inset-0 flex items-center justify-between px-2 opacity-40 z-10">
                   {Array.from({length: 30}).map((_, i) => (
                      <div key={i} className={`w-[1px] bg-white ${i % 5 === 0 ? 'h-[10px]' : 'h-[5px]'}`} />
                   ))}
                 </div>
                 
                 <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "0%" }}
                    transition={{ duration: 5, ease: "linear" }}
                    className="h-full w-full bg-gradient-to-r from-electric/40 to-electric relative z-0"
                 />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
