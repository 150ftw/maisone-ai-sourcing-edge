import { motion } from "framer-motion";
import { Layers, ShieldCheck, Handshake, Sparkles } from "lucide-react";

const cards = [
  {
    icon: Layers,
    title: "Clarity in Complexity",
    text: "We simplify complex global supply chains through transparency and structure.",
  },
  {
    icon: ShieldCheck,
    title: "Integrity at the Core",
    text: "Every process is guided by ethical practices and responsible sourcing.",
  },
  {
    icon: Handshake,
    title: "True Partnership",
    text: "We work as collaborators, building long-term value with brands.",
  },
  {
    icon: Sparkles,
    title: "Craftsmanship with Conscience",
    text: "Luxury craftsmanship delivered responsibly and sustainably.",
  },
];

export function WhyMaisone() {
  return (
    <section id="why" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6">— Why Maisone</p>
          <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-balance">
            Built on principles, not <span className="italic gradient-text">promises</span>.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-strong rounded-3xl p-7 hover:-translate-y-1 transition-transform"
            >
              <div className="size-12 rounded-2xl bg-gradient-to-br from-electric/20 to-violet-glow/20 flex items-center justify-center mb-6">
                <c.icon className="size-5 text-electric" />
              </div>
              <h3 className="font-serif text-xl leading-snug">{c.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{c.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
