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

        {/* Partners Marquee */}
        <div className="mt-28 pt-12 border-t border-border/50">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground text-center mb-10">— Trusted by Brands in</p>
          <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] pb-12 pt-4">
            <div className="flex items-center animate-marquee w-max hover:[animation-play-state:paused]">
              {[...Array(3)].map((_, listIdx) => (
                <div key={listIdx} className="flex gap-24 items-center shrink-0 pr-24">
                  {PARTNERS.map((p, idx) => (
                    <div key={`${listIdx}-${idx}`} className="group relative flex flex-col items-center justify-center text-center opacity-60 hover:opacity-100 transition-all duration-500 hover:scale-[1.05] cursor-default select-none">
                      <div className="flex items-center gap-3">
                        {p.hasIcon && (
                          <span className="text-2xl text-muted-foreground group-hover:text-electric transition-colors">✦</span>
                        )}
                        <span className="text-3xl sm:text-5xl tracking-wide text-foreground group-hover:text-electric transition-colors duration-500 drop-shadow-sm whitespace-nowrap" style={p.style}>
                          {p.name}
                        </span>
                      </div>
                      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center w-max opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 pointer-events-none">
                        {p.sub && (
                          <span className="text-[9px] sm:text-[10px] tracking-[0.2em] text-muted-foreground uppercase font-medium mb-1">{p.sub}</span>
                        )}
                        <span className="text-[10px] sm:text-xs tracking-[0.25em] text-electric font-bold uppercase">{p.country}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const PARTNERS = [
  { name: "alice + olivia", sub: "BY STACEY BENDET", country: "USA", style: { fontFamily: "Inter, sans-serif", fontWeight: 300, letterSpacing: "0.05em" } },
  { name: "GIUSEPPE DI MORABITO", sub: "MILANO", country: "ITALY", style: { fontFamily: "Cormorant Garamond, serif", fontWeight: 600, letterSpacing: "0.12em" } },
  { name: "ba&sh", sub: "PARIS", country: "FRANCE", style: { fontFamily: "Inter, sans-serif", fontWeight: 700, letterSpacing: "-0.01em" } },
  { name: "RETROFÊTE", sub: "", country: "USA", style: { fontFamily: "Inter, sans-serif", fontWeight: 800, letterSpacing: "0.15em" } },
  { name: "MONO", sub: "", country: "ARGENTINA", style: { fontFamily: "Inter, sans-serif", fontWeight: 900, letterSpacing: "0.08em" }, hasIcon: true },
  { name: "FAF", sub: "", country: "JAPAN", style: { fontFamily: "Georgia, serif", fontWeight: 700, letterSpacing: "0.05em", fontStyle: "italic" } }
];
