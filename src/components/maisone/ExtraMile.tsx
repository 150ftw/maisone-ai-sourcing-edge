import { motion } from "framer-motion";
import { Leaf, ShieldAlert, Globe2 } from "lucide-react";

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
      </div>
    </section>
  );
}
