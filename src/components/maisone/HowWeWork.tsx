import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import React from "react";

function SpotlightTimelineCard({ p, i }: { p: { n: string; title: string; desc: string }; i: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative group"
    >
      {/* Step number bubble */}
      <div className="relative z-10 size-10 lg:size-12 rounded-full glass-strong border border-border flex items-center justify-center mb-6 mx-auto lg:mx-0 transition-colors duration-500 group-hover:bg-electric/10 group-hover:border-electric/30">
        <span className="font-serif text-sm text-foreground transition-colors duration-300 group-hover:text-electric">{p.n}</span>
      </div>

      {/* Card with Flashlight Hover */}
      <div 
        onMouseMove={handleMouseMove}
        className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 h-full transition-all duration-500 group-hover:border-electric/40 group-hover:-translate-y-2 group-hover:shadow-[0_15px_40px_-10px_rgba(194,164,109,0.15)]"
      >
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-500 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                400px circle at ${mouseX}px ${mouseY}px,
                rgba(194,164,109,0.15),
                transparent 80%
              )
            `,
          }}
        />

        <h3 className="font-serif text-lg leading-snug text-foreground mb-3 relative z-10">{p.title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed relative z-10">{p.desc}</p>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-electric to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 transform scale-x-0 group-hover:scale-x-100" />
      </div>
    </motion.div>
  );
}

export function HowWeWork() {
  const { t } = useLanguage();

  const phases = [
    { n: "01", title: t("howWeWork.phase1Title"), desc: t("howWeWork.phase1Desc") },
    { n: "02", title: t("howWeWork.phase2Title"), desc: t("howWeWork.phase2Desc") },
    { n: "03", title: t("howWeWork.phase3Title"), desc: t("howWeWork.phase3Desc") },
    { n: "04", title: t("howWeWork.phase4Title"), desc: t("howWeWork.phase4Desc") },
  ];

  const pairs = [
    { problem: t("howWeWork.q1"), solution: t("howWeWork.a1") },
    { problem: t("howWeWork.q2"), solution: t("howWeWork.a2") },
    { problem: t("howWeWork.q3"), solution: t("howWeWork.a3") },
    { problem: t("howWeWork.q4"), solution: t("howWeWork.a4") },
    { problem: t("howWeWork.q5"), solution: t("howWeWork.a5") },
  ];

  return (
    <section id="services" className="relative py-32 overflow-visible">
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6">{t("howWeWork.label")}</p>
            <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-balance">
              {t("howWeWork.heading")}{" "}
              <span className="italic gradient-text">{t("howWeWork.headingHighlight")}</span>{t("howWeWork.headingEnd")}
            </h2>
            <p className="mt-6 text-muted-foreground max-w-xl">
              {t("howWeWork.subtitle")}
            </p>
          </motion.div>
        </div>

        {/* Timeline */}
        <div className="relative mb-40">
          {/* Base Connector line */}
          <div className="hidden lg:block absolute left-0 right-0 top-5 h-px bg-electric/10" />
          
          {/* Animated fill line */}
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="hidden lg:block absolute left-0 right-0 top-[19px] h-[2px] bg-gradient-to-r from-electric/20 via-electric to-electric/20 origin-left" 
          />
          
          {/* Traveling Glowing Dot */}
          <motion.div
            initial={{ left: "0%", opacity: 0 }}
            whileInView={{ left: "100%", opacity: [0, 1, 1, 0] }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="hidden lg:block absolute top-[15px] size-2.5 rounded-full bg-electric shadow-[0_0_15px_3px_rgba(194,164,109,0.8)]"
          />

          <div className="grid lg:grid-cols-4 gap-6">
            {phases.map((p, i) => (
              <SpotlightTimelineCard key={p.n} p={p} i={i} />
            ))}
          </div>
        </div>

        {/* Challenges We Solve Sub-section */}
        <div className="pb-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 border-b border-border/40 pb-4"
          >
            <h3 className="font-serif text-2xl tracking-wide">{t("howWeWork.challengesTitle")}</h3>
            <p className="text-sm text-muted-foreground mt-1">{t("howWeWork.challengesSubtitle")}</p>
          </motion.div>
          <div className="space-y-8 md:space-y-24 relative">
            {pairs.map((p, i) => (
              <motion.div
                key={p.problem}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                whileHover="hover"
                style={{ 
                  top: `calc(120px + ${i * 20}px)`, 
                  zIndex: i 
                }}
                className="sticky group grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-5 glass-strong bg-background/95 backdrop-blur-2xl rounded-3xl p-6 md:p-8 overflow-hidden transition-all duration-500 hover:shadow-[0_10px_30px_-5px_rgba(194,164,109,0.15)] hover:border-electric/50"
              >
                {/* Sweep Gradient Background on Hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-electric/5 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out pointer-events-none" />

                <p className="font-serif text-xl md:text-2xl text-balance relative z-10 transition-colors duration-300 group-hover:text-foreground">{p.problem}</p>
                
                <div className="relative z-10 size-12 rounded-full bg-electric/5 border border-electric/10 flex items-center justify-center mx-auto overflow-hidden group-hover:bg-electric/20 transition-all duration-500 group-hover:scale-110 shadow-inner">
                  <motion.div
                    className="flex items-center justify-center"
                    variants={{
                      initial: { x: 0 },
                      hover: { x: [0, 40, -40, 0], transition: { duration: 0.6, times: [0, 0.4, 0.41, 1], ease: "easeInOut" } }
                    }}
                  >
                    <ArrowRight className="size-5 text-electric rotate-90 md:rotate-0" />
                  </motion.div>
                </div>

                <p className="text-sm md:text-base text-muted-foreground leading-relaxed relative z-10 transition-colors duration-300 group-hover:text-foreground/90">{p.solution}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
