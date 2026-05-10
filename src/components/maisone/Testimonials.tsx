import { motion } from "framer-motion";

const items = [
  {
    quote:
      "Maisone replaced six tools and an entire sourcing team's manual workflow. We cut development cycles in half within a single season.",
    name: "Aiko Tanaka",
    role: "Head of Production · Maison Kyō",
  },
  {
    quote:
      "The AI matching is uncanny. It surfaced a Milanese mill we'd been searching for over two years — within twelve seconds.",
    name: "Oliver Hartwell",
    role: "Founder · Atelier LDN",
  },
  {
    quote:
      "From RFQ to first sample in 9 days, across three countries. Maisone is the operating system fashion has been waiting for.",
    name: "Camille Laurent",
    role: "COO · North/Paris",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6">— Testimonials</p>
          <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-balance">
            Trusted by the houses defining <span className="italic gradient-text">tomorrow's fashion</span>.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-strong rounded-3xl p-8 flex flex-col justify-between min-h-[280px]"
            >
              <blockquote className="font-serif text-xl leading-snug text-balance">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-8">
                <p className="text-sm font-medium">{t.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t.role}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
