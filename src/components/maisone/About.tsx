import { motion } from "framer-motion";
import { Target, Eye } from "lucide-react";

export function About() {
  return (
    <section id="about" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6">— About</p>
          <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-balance">
            A next-generation <span className="italic gradient-text">sourcing house</span>.
          </h2>
          <div className="mt-8 space-y-5 text-muted-foreground leading-relaxed">
            <p>
              Maisone Global is built on trust, transparency, and a global perspective connecting fashion brands with exceptional sourcing, craftsmanship, and manufacturing across Asia.
            </p>
            <p>
              More than a supplier, Maisone acts as a strategic partner, bringing together brands, factories, artisans, and innovation to create products with purpose and scale.
            </p>
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


