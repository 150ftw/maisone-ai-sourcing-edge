import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";

const PRODUCTS = [
  { cat: "Denim Jackets", supplier: "Osaka Mill #042", country: "Japan", moq: "300", price: "$22–$28", lead: "4 wks", hue: "from-blue-500/30 to-indigo-700/30" },
  { cat: "Hoodies", supplier: "Maison Côté Sud", country: "France", moq: "250", price: "$38–$48", lead: "5 wks", hue: "from-stone-400/30 to-amber-700/20" },
  { cat: "Streetwear", supplier: "LA Knit Studio", country: "United States", moq: "200", price: "$28–$42", lead: "4 wks", hue: "from-rose-500/20 to-violet-700/30" },
  { cat: "Leather Goods", supplier: "Sartoria Veneto", country: "Italy", moq: "150", price: "$58–$120", lead: "6 wks", hue: "from-amber-700/30 to-stone-900/40" },
  { cat: "Knitwear", supplier: "Berlin Loopback Co.", country: "Germany", moq: "300", price: "$32–$54", lead: "5 wks", hue: "from-emerald-600/20 to-cyan-700/20" },
  { cat: "Accessories", supplier: "Atelier Camden", country: "United Kingdom", moq: "500", price: "$8–$24", lead: "3 wks", hue: "from-cyan-500/20 to-blue-700/30" },
];

export function Marketplace() {
  return (
    <section id="marketplace" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6">— Marketplace</p>
          <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-balance">
            A curated <span className="italic gradient-text">sourcing marketplace</span>.
          </h2>
          <p className="mt-6 text-muted-foreground max-w-xl">
            Live catalogs from verified ateliers with transparent MOQs, pricing bands and lead times.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PRODUCTS.map((p, i) => (
            <motion.article
              key={p.cat}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.08 }}
              className="group glass-strong rounded-3xl overflow-hidden hover:-translate-y-1 transition-transform"
            >
              <div className={`relative aspect-[4/3] bg-gradient-to-br ${p.hue} overflow-hidden`}>
                <div className="absolute inset-0 grid-bg opacity-30" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_60%)]" />
                <span className="absolute top-4 left-4 text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full glass">
                  Verified
                </span>
                <span className="absolute top-4 right-4 text-[10px] flex items-center gap-1 px-2.5 py-1 rounded-full glass">
                  <Star className="size-2.5 fill-amber-400 text-amber-400" /> 4.9
                </span>
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <h3 className="font-serif text-2xl">{p.cat}</h3>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{p.supplier}</p>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <MapPin className="size-2.5" /> {p.country}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">MOQ</p>
                    <p className="text-sm tabular-nums mt-0.5">{p.moq}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Unit</p>
                    <p className="text-sm tabular-nums mt-0.5">{p.price}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Lead</p>
                    <p className="text-sm tabular-nums mt-0.5">{p.lead}</p>
                  </div>
                </div>
                <button className="w-full text-xs py-2.5 rounded-full glass border border-border hover:border-electric/50 transition-colors">
                  Request Quote
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
