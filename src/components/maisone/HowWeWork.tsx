import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function HowWeWork() {
  const { t } = useLanguage();

  const phases = [
    {
      n: "01",
      title: t("howWeWork.phase1Title"),
      desc: t("howWeWork.phase1Desc"),
    },
    {
      n: "02",
      title: t("howWeWork.phase2Title"),
      desc: t("howWeWork.phase2Desc"),
    },
    {
      n: "03",
      title: t("howWeWork.phase3Title"),
      desc: t("howWeWork.phase3Desc"),
    },
    {
      n: "04",
      title: t("howWeWork.phase4Title"),
      desc: t("howWeWork.phase4Desc"),
    },
  ];

  const pairs = [
    {
      problem: t("howWeWork.q1"),
      solution: t("howWeWork.a1"),
    },
    {
      problem: t("howWeWork.q2"),
      solution: t("howWeWork.a2"),
    },
    {
      problem: t("howWeWork.q3"),
      solution: t("howWeWork.a3"),
    },
    {
      problem: t("howWeWork.q4"),
      solution: t("howWeWork.a4"),
    },
    {
      problem: t("howWeWork.q5"),
      solution: t("howWeWork.a5"),
    },
  ];

  return (
    <section id="services" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-20">
          <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6">{t("howWeWork.label")}</p>
          <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-balance">
            {t("howWeWork.heading")}{" "}
            <span className="italic gradient-text">{t("howWeWork.headingHighlight")}</span>{t("howWeWork.headingEnd")}
          </h2>
          <p className="mt-6 text-muted-foreground max-w-xl">
            {t("howWeWork.subtitle")}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative mb-32">
          {/* Connector line */}
          <div className="hidden lg:block absolute left-0 right-0 top-5 h-px bg-gradient-to-r from-transparent via-electric/30 to-transparent" />

          <div className="grid lg:grid-cols-4 gap-6">
            {phases.map((p, i) => (
              <motion.div
                key={p.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="relative group"
              >
                {/* Step number bubble */}
                <div className="relative z-10 size-12 rounded-full glass border border-border flex items-center justify-center mb-6 mx-auto lg:mx-0 transition-colors duration-300">
                  <span className="font-serif text-sm text-foreground">{p.n}</span>
                </div>

                {/* Card */}
                <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 h-full transition-all duration-300 group-hover:border-electric/30 shadow-sm group-hover:shadow-md">
                  {/* Subtle top-left glow on hover */}
                  <div className="absolute -top-10 -left-10 size-32 rounded-full bg-electric/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <h3 className="font-serif text-lg leading-snug text-foreground mb-3">{p.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-electric/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Challenges We Solve Sub-section */}
        <div>
          <div className="mb-10 border-b border-border/40 pb-4">
            <h3 className="font-serif text-2xl tracking-wide">{t("howWeWork.challengesTitle")}</h3>
            <p className="text-sm text-muted-foreground mt-1">{t("howWeWork.challengesSubtitle")}</p>
          </div>
          <div className="space-y-4">
            {pairs.map((p, i) => (
              <motion.div
                key={p.problem}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="grid md:grid-cols-[1fr_auto_1fr] items-center gap-5 glass-strong rounded-3xl p-6 md:p-8"
              >
                <p className="font-serif text-xl md:text-2xl text-balance">{p.problem}</p>
                <ArrowRight className="size-5 text-electric mx-auto rotate-90 md:rotate-0" />
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{p.solution}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
