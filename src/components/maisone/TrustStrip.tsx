import { motion } from "framer-motion";
import { ShieldCheck, Leaf, Lock, FileCheck2, BadgeCheck } from "lucide-react";

const PRESS = ["Vogue Business", "Business of Fashion", "WWD", "Nikkei", "Drapers", "TechCrunch"];
const INVESTORS = ["Lumière Capital", "Atelier Ventures", "Sequoia Asia", "LVMH Luxury Ventures", "Index Ventures"];
const COMPLIANCE = [
  { icon: Leaf, label: "GOTS Certified", sub: "Organic textiles" },
  { icon: ShieldCheck, label: "OEKO-TEX®", sub: "Standard 100" },
  { icon: BadgeCheck, label: "BSCI Audited", sub: "Ethical labour" },
  { icon: Lock, label: "GDPR & SOC 2", sub: "Data & privacy" },
  { icon: FileCheck2, label: "ISO 9001", sub: "Quality systems" },
];

export function TrustStrip() {
  return (
    <section className="relative py-24 border-y border-border">
      <div className="mx-auto max-w-7xl px-6 space-y-16">
        {/* Press + Investors */}
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6">— As featured in</p>
            <div className="flex flex-wrap gap-x-8 gap-y-4 items-center">
              {PRESS.map((p, i) => (
                <motion.span
                  key={p}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="font-serif text-lg sm:text-xl text-foreground/70 hover:text-foreground transition-colors"
                >
                  {p}
                </motion.span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6">— Backed by</p>
            <div className="flex flex-wrap gap-x-8 gap-y-4 items-center">
              {INVESTORS.map((p, i) => (
                <motion.span
                  key={p}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="font-serif text-lg sm:text-xl text-foreground/70 hover:text-foreground transition-colors"
                >
                  {p}
                </motion.span>
              ))}
            </div>
          </div>
        </div>

        {/* Compliance */}
        <div>
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
