import { motion } from "framer-motion";

const categories = [
  { name: "Luxury Knitted Garments", image: "/images/categories/1.png", hue: "from-rose-500/30 to-amber-700/40" },
  { name: "Fine Woven Apparel", image: "/images/categories/2.png", hue: "from-sky-500/30 to-indigo-800/40" },
  { name: "Premium Denim Collections", image: "/images/categories/3.png", hue: "from-blue-700/40 to-indigo-900/50" },
  { name: "Embroidered Garments", image: "/images/categories/4.png", hue: "from-violet-500/30 to-fuchsia-700/40" },
  { name: "Artisanal Leather Apparel", image: "/images/categories/5.png", hue: "from-amber-700/40 to-stone-800/50" },
  { name: "Premium Leather Bags", image: "/images/categories/6.png", hue: "from-stone-500/30 to-amber-800/40" },
  { name: "Curated Accessories", image: "/images/categories/7.png", hue: "from-emerald-600/30 to-teal-800/40" },
  { name: "Dresses & Knitwear", image: "/images/categories/8.png", hue: "from-pink-500/30 to-rose-700/40" },
  { name: "Tailored Shirts & Trousers", image: "/images/categories/9.png", hue: "from-slate-500/40 to-zinc-800/50" },
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
              <img src={c.image} alt={c.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className={`absolute inset-0 bg-gradient-to-br ${c.hue} mix-blend-overlay opacity-60 group-hover:opacity-100 transition-opacity duration-700`} />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
              <div className="absolute inset-x-6 bottom-6 z-10 transform transition-transform duration-500 group-hover:-translate-y-2">
                <p className="text-[10px] uppercase tracking-[0.25em] text-electric mb-2 opacity-80">
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
