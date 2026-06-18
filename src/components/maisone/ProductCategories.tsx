import { motion } from "framer-motion";

const categories = [
  { name: "A-Line Dresses", image: "/collection/A-Line Dresses/1.png", hue: "from-rose-500/30 to-amber-700/40" },
  { name: "Biker & Moto Jackets", image: "/collection/Biker & Moto Jackets/1.jpg", hue: "from-sky-500/30 to-indigo-800/40" },
  { name: "Denim Apparel  Bottoms", image: "/collection/Denim Apparel  Bottoms/1.png", hue: "from-blue-700/40 to-indigo-900/50" },
  { name: "Dresses", image: "/collection/Dresses/2.jpg", hue: "from-violet-500/30 to-fuchsia-700/40" },
  { name: "Graphic Tees", image: "/collection/Graphic Tees/1.jpg", hue: "from-amber-700/40 to-stone-800/50" },
  { name: "Headwear & Caps", image: "/collection/Headwear & Caps/1.png", hue: "from-stone-500/30 to-amber-800/40" },
  { name: "Hoodies", image: "/collection/Hoodies/1.jpg", hue: "from-emerald-600/30 to-teal-800/40" },
  { name: "Leather Trench Coats & Tailoring", image: "/collection/Leather Trench Coats & Tailoring/1.jpg", hue: "from-pink-500/30 to-rose-700/40" },
  { name: "Maxi Dresses", image: "/collection/Maxi Dresses/1.png", hue: "from-slate-500/40 to-zinc-800/50" },
  { name: "Men's Knit Polo Shirts", image: "/collection/Men's Knit Polo Shirts/1.png", hue: "from-rose-500/30 to-amber-700/40" },
  { name: "Mini Dresses", image: "/collection/Mini Dresses/1.png", hue: "from-sky-500/30 to-indigo-800/40" },
  { name: "Skirts", image: "/collection/Skirts/1.png", hue: "from-blue-700/40 to-indigo-900/50" },
  { name: "Statement & Novelty Bags", image: "/collection/Statement & Novelty Bags/1.jpg", hue: "from-violet-500/30 to-fuchsia-700/40" },
  { name: "Sweatshirts & Crewnecks", image: "/collection/Sweatshirts & Crewnecks/2.jpg", hue: "from-amber-700/40 to-stone-800/50" },
  { name: "T-Shirts", image: "/collection/T-Shirts/1.jpg", hue: "from-stone-500/30 to-amber-800/40" },
  { name: "Totes & Top-Handle Bags", image: "/collection/Totes & Top-Handle Bags/1.jpg", hue: "from-emerald-600/30 to-teal-800/40" },
  { name: "Two-Piece Sets  Co-ords", image: "/collection/Two-Piece Sets  Co-ords/1.png", hue: "from-pink-500/30 to-rose-700/40" },
  { name: "Women's Knit Dresses", image: "/collection/Women's Knit Dresses/1.png", hue: "from-slate-500/40 to-zinc-800/50" },
  { name: "Women's Novelty Knit Tops & Cardigans", image: "/collection/Women's Novelty Knit Tops & Cardigans/1.png", hue: "from-rose-500/30 to-amber-700/40" },
  { name: "Women's Patterned & Textured Sweaters", image: "/collection/Women's Patterned & Textured Sweaters/2.png", hue: "from-sky-500/30 to-indigo-800/40" },
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.08 }}
              className="group relative aspect-[4/5] rounded-3xl overflow-hidden glass-strong"
            >
              <img src={c.image} alt={c.name} className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-110" />
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




