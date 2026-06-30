import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";

const PRODUCTS = [
  { cat: "Premium T-Shirts", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80", supplier: "Cotton Basics Ltd.", country: "Vietnam", moq: "500", price: "$2.50–$4.00", lead: "3 wks", hue: "from-blue-500/30 to-indigo-700/30" },
  { cat: "Embroidered Caps", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80", supplier: "Headwear Global", country: "Bangladesh", moq: "300", price: "$1.80–$3.50", lead: "4 wks", hue: "from-stone-400/30 to-amber-700/20" },
  { cat: "Summer Dresses", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80", supplier: "Luxe Apparel Co.", country: "India", moq: "100", price: "$9.00–$14.50", lead: "4 wks", hue: "from-rose-500/20 to-violet-700/30" },
  { cat: "Heavyweight Hoodies", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80", supplier: "Urban Fleece", country: "Turkey", moq: "250", price: "$6.50–$9.50", lead: "3 wks", hue: "from-emerald-600/20 to-cyan-700/20" },
];

export function Catalog() {
  return (
    <section id="catalog" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6">— Catalog</p>
          <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-balance">
            A curated <span className="italic gradient-text">sourcing catalog</span>.
          </h2>
          <p className="mt-6 text-muted-foreground max-w-xl">
            Live catalogs from verified ateliers with transparent MOQs, pricing bands and lead times.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Min MOQ</p>
                    <p className="text-sm font-medium mt-0.5">{p.moq} pcs</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Est Price</p>
                    <p className="text-sm font-medium mt-0.5">{p.price}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Lead Time</p>
                    <p className="text-sm font-medium mt-0.5">{p.lead}</p>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
