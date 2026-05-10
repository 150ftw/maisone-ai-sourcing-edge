import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./Logo";

export function Loader() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-6"
          >
            <Logo className="h-16 w-16" showText={false} />
            <div className="w-32 h-px bg-border overflow-hidden">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="h-full w-full bg-gradient-to-r from-transparent via-electric to-transparent"
              />
            </div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Maisone Global</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
