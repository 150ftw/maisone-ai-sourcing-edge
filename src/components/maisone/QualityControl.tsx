import { motion } from "framer-motion";

const steps = [
  "Supplier Selection & Evaluation",
  "Define Quality Standards",
  "Pre-Production QC",
  "In-Process QC",
  "Packaging & Label Checks",
  "Shipping Checks",
  "Post-Delivery Analysis",
  "Documentation & Reporting",
];

export function QualityControl() {
  return (
    <section id="quality" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6">— Quality Control</p>
          <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-balance">
            Eight checkpoints. <span className="italic gradient-text">Zero compromises</span>.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s, i) => (
            <motion.div
              key={s}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.06 }}
              className="relative glass-strong rounded-3xl p-6"
            >
              <p className="font-serif text-3xl gradient-text mb-4">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="text-sm leading-snug">{s}</p>
              <div className="mt-5 h-px bg-gradient-to-r from-electric/40 to-transparent" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
