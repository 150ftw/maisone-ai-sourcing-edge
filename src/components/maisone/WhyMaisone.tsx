import { motion } from "framer-motion";
import { Layers, ShieldCheck, Handshake, Sparkles } from "lucide-react";
import abstractBg from "@/assets/fashion_startup_studio.png";
import { useLanguage } from "@/lib/i18n";
import { PatternHover } from "@/components/ui/PatternHover";

export function WhyMaisone() {
  const { t } = useLanguage();

  const cards = [
    {
      id: "card1",
      icon: Layers,
      title: t("why.card1Title"),
      text: t("why.card1Text"),
    },
    {
      id: "card2",
      icon: ShieldCheck,
      title: t("why.card2Title"),
      text: t("why.card2Text"),
    },
    {
      id: "card3",
      icon: Handshake,
      title: t("why.card3Title"),
      text: t("why.card3Text"),
    },
    {
      id: "card4",
      icon: Sparkles,
      title: t("why.card4Title"),
      text: t("why.card4Text"),
    },
  ];



  return (
    <section id="why" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl mb-16"
        >
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6"
          >
            {t("why.label")}
          </motion.p>
          <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-balance">
            {t("why.heading")} <span className="italic gradient-text">{t("why.headingHighlight")}</span>{t("why.headingEnd")}
          </h2>

        </motion.div>

        <div className="flex flex-col lg:flex-row gap-5">
          {cards.map((c) => (
            <motion.div
              key={c.id}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="w-full lg:flex-1 group relative glass-strong rounded-3xl p-7 flex flex-col overflow-hidden shadow-xl"
            >
              {/* Stitched Border Animation */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ zIndex: 0 }}>
                <rect x="2" y="2" width="calc(100% - 4px)" height="calc(100% - 4px)" rx="22" ry="22" 
                  fill="none" 
                  stroke="currentColor" 
                  className="text-electric/40 animate-stitch"
                  strokeWidth="1.5" 
                  strokeDasharray="6 6"
                />
              </svg>
              <div className="relative z-10 h-full flex flex-col pointer-events-none">
                <div className="size-12 rounded-2xl bg-gradient-to-br from-electric/20 to-violet-glow/20 flex items-center justify-center mb-6 shadow-glow transition-colors">
                  <c.icon className="size-5 text-electric group-hover:animate-pulse-glow" />
                </div>
                <h3 className="font-serif text-xl leading-snug group-hover:text-electric transition-colors duration-300">{c.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">{c.text}</p>
              </div>
            </motion.div>
          ))}
        </div>




      </div>
    </section>
  );
}
