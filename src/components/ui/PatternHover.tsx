import React, { useState } from "react";
import { motion } from "framer-motion";
import { Scissors } from "lucide-react";

interface PatternHoverProps {
  children: React.ReactNode;
  className?: string;
  rx?: number; // Border radius
}

export function PatternHover({ children, className = "", rx = 12 }: PatternHoverProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dashed Border that animates on hover */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none" 
        style={{ zIndex: 10 }}
      >
        <motion.rect
          x="1" y="1" 
          width="calc(100% - 2px)" height="calc(100% - 2px)" 
          rx={rx} ry={rx}
          fill="none"
          stroke="#C2A46D"
          strokeWidth="2"
          strokeDasharray="6 6"
          initial={{ strokeDashoffset: 0, opacity: 0 }}
          animate={{ 
            strokeDashoffset: isHovered ? -100 : 0,
            opacity: isHovered ? 1 : 0
          }}
          transition={{ 
            strokeDashoffset: { duration: 2, repeat: Infinity, ease: "linear" },
            opacity: { duration: 0.3 }
          }}
        />
      </svg>

      {/* Scissors Icon moving around the border */}
      <motion.div
        className="absolute w-5 h-5 text-electric pointer-events-none drop-shadow-md flex items-center justify-center"
        style={{ zIndex: 20, marginTop: -10, marginLeft: -10 }}
        initial={{ top: "0%", left: "0%", opacity: 0, rotate: 90 }}
        animate={isHovered ? {
          top: ["0%", "0%", "100%", "100%", "0%"],
          left: ["0%", "100%", "100%", "0%", "0%"],
          rotate: [90, 90, 180, 180, 270, 270, 360, 360, 450],
          opacity: 1
        } : { opacity: 0 }}
        transition={isHovered ? {
          top: { duration: 4, repeat: Infinity, ease: "linear" },
          left: { duration: 4, repeat: Infinity, ease: "linear" },
          rotate: { duration: 4, repeat: Infinity, ease: "linear" },
          opacity: { duration: 0.3 }
        } : { opacity: { duration: 0.3 } }}
      >
        <Scissors size={14} className={isHovered ? "animate-pulse" : ""} />
      </motion.div>

      {/* Actual Content */}
      <div className="relative z-0 h-full w-full">
        {children}
      </div>
    </div>
  );
}
