import { motion } from "framer-motion";
import { Leaf, ShieldAlert, Globe2, ShieldCheck, FileCheck2, BadgeCheck, Building2, Users, CheckCircle2, Zap, Award, Search } from "lucide-react";

const cards = [
  {
    icon: Leaf,
    title: "Sustainability Focus",
    text: "Responsible sourcing and ethical manufacturing systems.",
  },
  {
    icon: ShieldAlert,
    title: "Risk Management",
    text: "Reducing delays, operational risks, and production inefficiencies.",
  },
  {
    icon: Globe2,
    title: "Cultural & Market Insight",
    text: "Deep understanding of global fashion markets and sourcing ecosystems.",
  },
];

const COMPLIANCE = [
  { icon: BadgeCheck, label: "BSCI", sub: "Social Compliance" },
  { icon: Leaf, label: "OCS 100", sub: "Organic Content" },
  { icon: Leaf, label: "GOTS", sub: "Organic Textiles" },
  { icon: Building2, label: "LEED", sub: "Environmental Design" },
  { icon: Users, label: "Sedex", sub: "Ethical Supply Chain" },
  { icon: CheckCircle2, label: "REACH", sub: "Chemical Compliance" },
  { icon: FileCheck2, label: "Intertek", sub: "Quality Assurance" },
  { icon: Zap, label: "UL Solutions", sub: "Safety Certification" },
  { icon: Award, label: "ISO 9001", sub: "Quality Management" },
  { icon: Search, label: "SGS", sub: "Inspection & Testing" },
];

export function ExtraMile() {
  return (
    <section id="extra-mile" className="relative pt-16 pb-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6">— The Extra Mile</p>
          <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-balance">
            Beyond sourcing — <span className="italic gradient-text">true stewardship</span>.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {cards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-strong rounded-3xl p-8"
            >
              <div className="size-12 rounded-2xl bg-electric/15 flex items-center justify-center mb-6">
                <c.icon className="size-5 text-electric" />
              </div>
              <h3 className="font-serif text-xl">{c.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{c.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Compliance */}
        <div className="mt-24 pt-16 border-t border-border/50">
          <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6">— Compliance & Certifications</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {COMPLIANCE.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="glass rounded-2xl p-4 border border-border hover:border-electric/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full border border-electric/20 bg-electric/10 flex items-center justify-center">
                    <c.icon className="size-4 text-electric" />
                  </div>
                  <div>
                    <p className="text-sm">{c.label}</p>
                    <p className="text-[10px] text-muted-foreground">{c.sub}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
