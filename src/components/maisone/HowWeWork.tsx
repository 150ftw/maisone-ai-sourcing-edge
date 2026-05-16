import { motion } from "framer-motion";

const phases = [
  {
    n: "01",
    title: "Product Strategy & Assortment Planning",
    items: [
      "Market Analysis",
      "Trend Forecasting",
      "Cost & Margin Planning",
      "Assortment Planning",
      "Development Calendars",
      "Fabric Direction",
    ],
  },
  {
    n: "02",
    title: "Design",
    items: [
      "Mood & Concepts",
      "Color Palette",
      "Surface Design",
      "CAD Artwork",
      "Garment Sketches",
      "Material References",
    ],
  },
  {
    n: "03",
    title: "Product Development",
    items: [
      "Tech Packs",
      "CAD Flats",
      "Size Charts",
      "Proto Samples",
      "SMS Fittings",
      "Trim Decisions",
      "Cost Engineering",
    ],
  },
  {
    n: "04",
    title: "Production Planning",
    items: [
      "Merchandising",
      "PO Planning",
      "Factory Allocation",
      "Bulk Fabric Approval",
      "TOP Approval",
      "Shipment Oversight",
    ],
  },
];

export function HowWeWork() {
  return (
    <section id="services" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6">— How We Work</p>
          <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-balance">
            Four disciplined phases, <span className="italic gradient-text">one seamless journey</span>.
          </h2>
          <p className="mt-6 text-muted-foreground max-w-xl">
            From the earliest market signal to the final shipment — every step is orchestrated with precision.
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute left-0 right-0 top-10 h-px bg-gradient-to-r from-transparent via-electric/40 to-transparent" />
          <div className="grid lg:grid-cols-4 gap-5">
            {phases.map((p, i) => (
              <motion.div
                key={p.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="relative z-10 size-12 rounded-full glass-strong border border-electric/40 flex items-center justify-center mx-auto lg:mx-0">
                  <span className="font-serif text-sm gradient-text">{p.n}</span>
                </div>
                <div className="mt-6 glass-strong rounded-3xl p-6 h-full">
                  <h3 className="font-serif text-lg leading-snug min-h-[3.5rem]">{p.title}</h3>
                  <ul className="mt-5 space-y-2.5">
                    {p.items.map((it) => (
                      <li key={it} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1.5 size-1 rounded-full bg-electric flex-shrink-0" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
