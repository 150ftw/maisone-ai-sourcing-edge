import { motion } from "framer-motion";

const categories = [
  { name: "Luxury Knitted Garments", hue: "from-rose-500/25 to-amber-700/30" },
  { name: "Fine Woven Apparel", hue: "from-sky-500/25 to-indigo-800/35" },
  { name: "Premium Denim Collections", hue: "from-blue-700/35 to-indigo-900/40" },
  { name: "Embroidered Garments", hue: "from-violet-500/25 to-fuchsia-700/30" },
  { name: "Artisanal Leather Apparel", hue: "from-amber-700/30 to-stone-800/40" },
  { name: "Premium Leather Bags", hue: "from-stone-500/25 to-amber-800/35" },
  { name: "Curated Accessories", hue: "from-emerald-600/25 to-teal-800/30" },
  { name: "Dresses & Knitwear", hue: "from-pink-500/25 to-rose-700/30" },
  { name: "Tailored Shirts & Trousers", hue: "from-slate-500/30 to-zinc-800/40" },
];

export function ProductCategories() {
  return (
    <section id="categories" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6">— Product Categories</p>
          <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-balance">
            A full spectrum of <span className="italic gradient-text">luxury categories</span>.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.08 }}
              className="group relative aspect-[4/5] rounded-3xl overflow-hidden glass-strong"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${c.hue}`} />
              <div className="absolute inset-0 grid-bg opacity-25" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.18),transparent_60%)]" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute inset-x-6 bottom-6">
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                  Category {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="font-serif text-2xl leading-tight text-balance">{c.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
