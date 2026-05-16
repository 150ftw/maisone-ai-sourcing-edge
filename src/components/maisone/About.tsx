import { motion } from "framer-motion";
import { Target, Eye } from "lucide-react";

const specialties = [
  "Premium apparel sourcing",
  "Product development",
  "Production strategy",
  "Ethical manufacturing",
  "Quality assurance",
  "Artisanal craftsmanship",
];

export function About() {
  return (
    <section id="about" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6">— About</p>
            <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-balance">
              A next-generation <span className="italic gradient-text">sourcing house</span>.
            </h2>
            <div className="mt-8 space-y-5 text-muted-foreground leading-relaxed max-w-xl">
              <p>
                Maisone Global is a next-generation sourcing and solutions agency built on
                trust, transparency, and global vision.
              </p>
              <p>
                Inspired by the legacy of luxury fashion houses, Maisone redefines what a
                sourcing "house" means today — not just a supplier, but a strategic partner
                connecting brands, factories, artisans, and innovation across borders.
              </p>
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6">— We specialize in</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {specialties.map((s, i) => (
                <motion.div
                  key={s}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="glass rounded-2xl px-5 py-4 text-sm"
                >
                  {s}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mt-20">
          {[
            {
              icon: Target,
              label: "Mission",
              text: "To simplify the fashion manufacturing journey for global brands through sourcing, development, compliance, and quality systems.",
            },
            {
              icon: Eye,
              label: "Vision",
              text: "To become the world's most trusted fashion sourcing partner by building transparent, ethical, and intelligently structured supply chains.",
            },
          ].map((b) => (
            <div key={b.label} className="glass-strong rounded-3xl p-8">
              <div className="size-11 rounded-2xl bg-electric/15 flex items-center justify-center mb-5">
                <b.icon className="size-5 text-electric" />
              </div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-3">{b.label}</p>
              <p className="font-serif text-2xl leading-snug text-balance">{b.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
