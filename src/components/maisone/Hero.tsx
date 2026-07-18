import { motion, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";


import { Link } from "@tanstack/react-router";
import { WorldMap } from "./WorldMap";
import { useRef, useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";
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

const MotionLink = motion.create(Link);

const WovenBackdrop = ({ cursorX, cursorY }: { cursorX: any; cursorY: any }) => {
  const xTransform = useTransform(cursorX, [0, 2000], [-10, 10]);
  const yTransform = useTransform(cursorY, [0, 1000], [-10, 10]);

  const springX = useSpring(xTransform, { stiffness: 50, damping: 20 });
  const springY = useSpring(yTransform, { stiffness: 50, damping: 20 });

  return (
    <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none opacity-5 dark:opacity-10 mix-blend-overlay">
      <motion.div
        className="w-full h-full"
        style={{ x: springX, y: springY }}
      >
        <svg className="w-[110%] h-[110%] -left-[5%] -top-[5%] absolute" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="weavePattern" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M0,15 L30,15 M15,0 L15,30" stroke="var(--foreground)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#weavePattern)" />
        </svg>
      </motion.div>
    </div>
  );
};

export function Hero() {
  const [isHoveringHero, setIsHoveringHero] = useState(false);
  const cursorX = useSpring(0, { stiffness: 400, damping: 40 });
  const cursorY = useSpring(0, { stiffness: 400, damping: 40 });
  const { t } = useLanguage();
  const { theme } = useTheme();

  // Mouse move parallax for background image
  const bgX = useTransform(cursorX, [0, 2000], [-12, 12]);
  const bgY = useTransform(cursorY, [0, 1000], [-12, 12]);
  const springBgX = useSpring(bgX, { stiffness: 40, damping: 22 });
  const springBgY = useSpring(bgY, { stiffness: 40, damping: 22 });

  // Resolve theme dynamically to swap background image
  const isDark = theme === "dark";
  const bgImage = isDark ? "/images/Background.png" : "/images/WhiteBg.png";

  return (
    <section
      id="home"
      className="relative min-h-screen pt-32 pb-20 flex flex-col justify-center overflow-hidden"
      onMouseMove={(e) => {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
      }}
    >
      {/* Creative Parallax Background */}
      <div className={`absolute inset-0 z-0 overflow-hidden transition-opacity duration-300 ${isDark ? "opacity-80" : "opacity-90"}`}>
        <motion.img
          key={bgImage} // Re-mount when image source changes for smooth loading animation
          src={bgImage}
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1.05, opacity: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          style={{
            x: springBgX,
            y: springBgY,
          }}
        />
        {/* Vignette & Gradients Overlay */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${isDark ? "opacity-100" : "opacity-75"}`}
          style={{
            backgroundImage: "radial-gradient(circle at center, transparent 10%, var(--background) 90%)"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/40 to-background pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40 pointer-events-none" />
      </div>

      <WovenBackdrop cursorX={cursorX} cursorY={cursorY} />

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
            <MotionLink
              to="/book-demo"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-foreground text-background text-sm font-medium transition-transform"
            >
              {t("hero.bookConsultation")}
              <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
            </MotionLink>
            <motion.a
              href="#services"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full glass text-sm font-medium hover:bg-accent transition-colors"
            >
              {t("hero.exploreServices")}
            </motion.a>
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




        </motion.div>


      </div>
    </section>
  );
}
