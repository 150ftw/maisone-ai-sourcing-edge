import { motion, useSpring } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { WorldMap } from "./WorldMap";
import { useRef, useEffect, useState } from "react";
import heroBg from "@/assets/hero_fashion_bg_1783761896741.png";
import { useLanguage } from "@/lib/i18n";

const LUXURY_YARNS = [
  "var(--electric)",
  "var(--violet-glow)",
  "#FF4B4B", // Ruby Red
  "#00D2FF", // Cyan
  "#8A2BE2", // Purple
  "#FF1493", // Deep Pink
  "#00FA9A", // Emerald
  "#FFB6C1", // Light Pink
  "#FFD700", // Gold
];

const THREAD_PATHS = [
  "M5,15 Q10,-5 20,15 T35,5",
  "M15,5 Q35,15 15,35 T5,25",
  "M5,20 C15,0 35,40 25,10",
  "M20,5 C0,15 40,25 20,35",
  "M10,10 Q-5,25 15,30 T25,-10",
  "M15,25 C-5,0 45,0 15,-10"
];

const HoverThreadText = ({ text, className = "" }: { text: string; className?: string }) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: Event) => {
      if (!containerRef.current) return;
      const customEvent = e as CustomEvent;
      const { x, y } = customEvent.detail;
      const radius = 55; // Reduced radius for smaller blob
      
      const spans = containerRef.current.children;
      for (let i = 0; i < spans.length; i++) {
        const span = spans[i] as HTMLSpanElement;
        // Skip spaces
        if (span.innerHTML === "&nbsp;") continue;
        
        const rect = span.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        
        const dist = Math.hypot(x - cx, y - cy);
        if (dist < radius) {
          span.classList.add("fabric-text-active");
          span.classList.add("thread-active");
        } else {
          span.classList.remove("fabric-text-active");
          span.classList.remove("thread-active");
        }
      }
    };

    const handleMouseLeave = () => {
      if (!containerRef.current) return;
      const spans = containerRef.current.children;
      for (let i = 0; i < spans.length; i++) {
        const span = spans[i] as HTMLSpanElement;
        span.classList.remove("fabric-text-active");
        span.classList.remove("thread-active");
      }
    };

    window.addEventListener("hero-mousemove", handleMouseMove);
    window.addEventListener("hero-mouseleave", handleMouseLeave);
    
    return () => {
      window.removeEventListener("hero-mousemove", handleMouseMove);
      window.removeEventListener("hero-mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <span className="inline-block relative" ref={containerRef}>
      {text.split("").map((char, i) => {
        const isSpace = char === " ";
        // Deterministic randomness
        const c1 = LUXURY_YARNS[(i * 3 + 1) % LUXURY_YARNS.length];
        const c2 = LUXURY_YARNS[(i * 7 + 5) % LUXURY_YARNS.length];
        const p1 = THREAD_PATHS[(i * 2 + 1) % THREAD_PATHS.length];
        const p2 = THREAD_PATHS[(i * 5 + 3) % THREAD_PATHS.length];

        return (
          <span
            key={i}
            className={`group inline-block relative cursor-none py-2 -my-2 px-1 -mx-1 ${!isSpace ? "fabric-text-hover" : ""} ${className}`}
            style={{
              "--yarn-1": c1,
              "--yarn-2": c2,
            } as React.CSSProperties}
          >
            {isSpace ? "\u00A0" : char}
            {!isSpace && (
              <>
                <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 opacity-0 transition-opacity duration-300 pointer-events-none z-[-1]" viewBox="0 0 40 40" fill="none" stroke={c1} strokeWidth="2" strokeLinecap="round">
                  <path d={p1} className="[stroke-dasharray:100] [stroke-dashoffset:100] transition-all duration-700 ease-out" />
                </svg>
                <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 opacity-0 transition-opacity duration-300 pointer-events-none z-[-1]" viewBox="0 0 40 40" fill="none" stroke={c2} strokeWidth="1" strokeLinecap="round">
                  <path d={p2} className="[stroke-dasharray:100] [stroke-dashoffset:100] transition-all duration-1000 ease-out delay-75" />
                </svg>
              </>
            )}
          </span>
        );
      })}
    </span>
  );
};

export function Hero() {
  const [isHoveringHero, setIsHoveringHero] = useState(false);
  const cursorX = useSpring(0, { stiffness: 400, damping: 40 });
  const cursorY = useSpring(0, { stiffness: 400, damping: 40 });
  const { t } = useLanguage();

  return (
    <section id="home" className="relative min-h-screen pt-32 pb-20 flex flex-col justify-center overflow-hidden">
      {/* Creative Parallax Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity transition-transform duration-[20s] ease-linear scale-110"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
      </div>

      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs tracking-[0.25em] uppercase text-muted-foreground mb-8">
            <Sparkles className="size-3 text-electric" />
            {t("hero.badge")}
          </div>

          <h1 
            className={`font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[1.02] tracking-tight text-balance relative ${isHoveringHero ? 'cursor-none' : ''}`}
            onMouseMove={(e) => {
              cursorX.set(e.clientX);
              cursorY.set(e.clientY);
              window.dispatchEvent(new CustomEvent("hero-mousemove", { detail: { x: e.clientX, y: e.clientY } }));
            }}
            onMouseEnter={() => setIsHoveringHero(true)}
            onMouseLeave={() => {
              setIsHoveringHero(false);
              window.dispatchEvent(new CustomEvent("hero-mouseleave"));
            }}
          >
            {/* Custom Blob Cursor - localized to the text */}
            {isHoveringHero && (
              <motion.div
                className="fixed top-0 left-0 w-24 h-24 rounded-full border border-electric/30 bg-electric/10 pointer-events-none z-50 flex items-center justify-center shadow-[0_0_20px_rgba(194,164,109,0.3)]"
                style={{
                  x: cursorX,
                  y: cursorY,
                  translateX: "-50%",
                  translateY: "-50%"
                }}
              />
            )}

            <HoverThreadText text={t("hero.headingLine1")} />
            <br />
            <HoverThreadText text={t("hero.headingLine2")} className="gradient-text italic hover:[-webkit-text-stroke:1px_var(--violet-glow)]" />
            <HoverThreadText text={t("hero.headingLine3")} />
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
            {t("hero.subtitle")}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/book-demo"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-foreground text-background text-sm font-medium hover:scale-[1.02] transition-transform"
            >
              {t("hero.bookConsultation")}
              <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#services"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full glass text-sm font-medium hover:bg-accent transition-colors"
            >
              {t("hero.exploreServices")}
            </a>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {[
              { v: t("hero.stat1Value"), l: t("hero.stat1Label") },
              { v: t("hero.stat2Value"), l: t("hero.stat2Label") },
              { v: t("hero.stat3Value"), l: t("hero.stat3Label") },
              { v: t("hero.stat4Value"), l: t("hero.stat4Label") },
            ].map((s) => (
              <div key={s.l} className="glass rounded-2xl px-4 py-3 text-left">
                <p className="font-serif text-lg">{s.v}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative mt-20"
        >
          <div className="flex flex-col items-center justify-center gap-2 mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-electric/10 border border-electric/30 text-[10px] tracking-[0.25em] uppercase text-electric font-semibold">
              <span className="relative size-1.5 flex shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-electric opacity-75" />
                <span className="relative inline-flex rounded-full size-1.5 bg-electric" />
              </span>
              {t("hero.liveSourcingNetwork")}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl tracking-tight text-center text-foreground mt-2">
              {t("hero.weCurrentlySource")} <span className="italic gradient-text font-serif">{t("hero.countries")}</span>
            </h3>
          </div>
          <div className="glass-strong rounded-3xl p-2 sm:p-6 text-foreground/80 overflow-hidden w-full">
            <WorldMap />
          </div>

          {/* Floating analytics */}
          <motion.div
            className="hidden md:block absolute -left-4 top-12 glass-strong rounded-2xl p-4 w-56 animate-float"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="size-9 rounded-xl bg-electric/15 flex items-center justify-center">
                <TrendingUp className="size-4 text-electric" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{t("hero.sourcingScore")}</p>
                <p className="text-lg font-semibold">98.4</p>
              </div>
            </div>
            <div className="h-1 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-electric to-violet-glow"
                initial={{ width: 0 }}
                animate={{ width: "92%" }}
                transition={{ delay: 1.4, duration: 1.2 }}
              />
            </div>
          </motion.div>

          <motion.div
            className="hidden md:block absolute -right-4 bottom-16 glass-strong rounded-2xl p-4 w-60 animate-float"
            style={{ animationDelay: "1.5s" }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{t("hero.activeSuppliers")}</p>
              <span className="text-[10px] text-emerald-400">+12.6%</span>
            </div>
            <p className="text-2xl font-semibold">2,418</p>
            <div className="mt-3 flex items-end gap-1 h-8">
              {[40, 65, 50, 78, 60, 88, 72, 95].map((h, i) => (
                <motion.div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-electric/30 to-violet-glow rounded-sm"
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 1.5 + i * 0.05 }}
                />
              ))}
            </div>
          </motion.div>


        </motion.div>


      </div>
    </section>
  );
}
