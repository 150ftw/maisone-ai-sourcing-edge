import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";

const PRODUCTS = [
  { cat: "Denim Jackets", image: "https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?auto=format&fit=crop&w=800&q=80", supplier: "Osaka Mill #042", country: "Japan", moq: "300", price: "$22–$28", lead: "4 wks", hue: "from-blue-500/30 to-indigo-700/30" },
  { cat: "Hoodies", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80", supplier: "Maison Côté Sud", country: "France", moq: "250", price: "$38–$48", lead: "5 wks", hue: "from-stone-400/30 to-amber-700/20" },
  { cat: "Streetwear", image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80", supplier: "LA Knit Studio", country: "United States", moq: "200", price: "$28–$42", lead: "4 wks", hue: "from-rose-500/20 to-violet-700/30" },
  { cat: "Leather Goods", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80", supplier: "Sartoria Veneto", country: "Italy", moq: "150", price: "$58–$120", lead: "6 wks", hue: "from-amber-700/30 to-stone-900/40" },
  { cat: "Knitwear", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80", supplier: "Berlin Loopback Co.", country: "Germany", moq: "300", price: "$32–$54", lead: "5 wks", hue: "from-emerald-600/20 to-cyan-700/20" },
  { cat: "Accessories", image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=800&q=80", supplier: "Atelier Camden", country: "United Kingdom", moq: "500", price: "$8–$24", lead: "3 wks", hue: "from-cyan-500/20 to-blue-700/30" },
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
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={p.image} alt={p.cat} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className={`absolute inset-0 bg-gradient-to-br ${p.hue} mix-blend-overlay opacity-80 group-hover:opacity-100 transition-opacity duration-700`} />
                <div className="absolute inset-0 grid-bg opacity-30" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_60%)]" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full glass z-10">
                  Verified
                </span>
                <span className="absolute top-4 right-4 text-[10px] flex items-center gap-1 px-2.5 py-1 rounded-full glass z-10">
                  <Star className="size-2.5 fill-amber-400 text-amber-400" /> 4.9
                </span>
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10">
                  <h3 className="font-serif text-2xl drop-shadow-md">{p.cat}</h3>
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
