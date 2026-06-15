import { motion } from "framer-motion";
import shashankImg from "@/assets/founder-shashank.jpg";
import subahImg from "@/assets/founder-subah.jpg";

const founders = [
  {
    name: "Shashank Jain",
    role: "Co-Founder · Operations & Strategy",
    bio: "18+ years experience in luxury fashion sourcing, handcrafted textiles, production planning, sustainability, and ethical manufacturing.",
    footerLabel: "Worked With",
    tags: ["Valentino", "Balmain", "Stella McCartney", "Giorgio Armani", "Dolce & Gabbana"],
    initials: "SJ",
    hue: "from-stone-800/50 to-stone-900/80",
    image: shashankImg,
  },
  {
    name: "Subah",
    role: "Co-Founder · Creative & Client Partnerships",
    bio: "Specializes in design coordination, luxury product development, client engagement, and creative collaboration between brands and manufacturers.",
    footerLabel: "Expertise",
    tags: ["Design Coordination", "Luxury Product Dev", "Client Engagement", "Creative Sync"],
    initials: "S",
    hue: "from-zinc-800/50 to-zinc-900/80",
    image: subahImg,
  },
];

export function Founders() {
  return (
    <section id="founders" className="relative pt-32 pb-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6">— Founders</p>
          <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-balance">
            The house behind the <span className="italic gradient-text">house</span>.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {founders.map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group flex flex-col justify-between h-full glass-strong rounded-3xl overflow-hidden border border-white/5 hover:border-electric/30 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
            >
              <div>
                <div className={`relative h-64 sm:h-72 w-full bg-gradient-to-br ${f.hue} overflow-hidden`}>
                  <img
                    src={f.image}
                    alt={`${f.name} — ${f.role}`}
                    className="absolute inset-0 w-full h-full object-cover object-[center_18%] transition-all duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                
                <div className="p-8 pb-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-[10px] font-medium uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-electric/10 text-electric border border-electric/20">
                      {f.role}
                    </span>
                  </div>
                  <h3 className="font-serif text-3xl text-foreground/90">{f.name}</h3>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{f.bio}</p>
                </div>
              </div>

              <div className="p-8 pt-4">
                <div className="pt-6 border-t border-white/5">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60 mb-3">{f.footerLabel}</p>
                  <div className="flex flex-wrap gap-2">
                    {f.tags.map((t) => (
                      <span 
                        key={t} 
                        className="text-xs px-3 py-1.5 rounded-full border border-white/5 bg-white/[0.02] text-muted-foreground hover:bg-white/[0.05] hover:border-white/10 hover:text-foreground transition-all duration-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
