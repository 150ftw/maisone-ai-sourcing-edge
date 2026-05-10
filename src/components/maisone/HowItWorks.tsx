import { motion } from "framer-motion";
import textiles from "@/assets/textiles.jpg";
import manufacturing from "@/assets/manufacturing.jpg";
import logistics from "@/assets/logistics.jpg";

const steps = [
  {
    n: "01",
    title: "Discover Suppliers",
    desc: "Brief Maisone in plain language. Our agents surface the most aligned ateliers across four continents within minutes.",
    img: textiles,
  },
  {
    n: "02",
    title: "Automate Sourcing",
    desc: "RFQs, samples, negotiations and POs orchestrated end-to-end with full audit trail and human checkpoints.",
    img: manufacturing,
  },
  {
    n: "03",
    title: "Scale Operations",
    desc: "Real-time tracking, demand forecasting and supplier risk monitoring keep every collection on time.",
    img: logistics,
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-20">
          <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6">— How Maisone Works</p>
          <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-balance">
            From brief to <span className="italic gradient-text">delivery</span>, in three movements.
          </h2>
        </div>

        <div className="space-y-24">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
            >
              <div>
                <span className="font-serif text-7xl gradient-text">{s.n}</span>
                <h3 className="font-serif text-3xl sm:text-5xl mt-4 tracking-tight">{s.title}</h3>
                <p className="mt-6 text-lg text-muted-foreground max-w-md leading-relaxed">{s.desc}</p>
              </div>
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden glass-strong">
                <img src={s.img} alt={s.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
