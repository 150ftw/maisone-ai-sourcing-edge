import { motion } from "framer-motion";
import shashankImg from "@/assets/founder-shashank.jpg";
import subahImg from "@/assets/founder-subah.jpg";

const founders = [
  {
    name: "Shashank Jain",
    role: "Co-Founder · Operations & Strategy",
    bio: "18+ years experience in luxury fashion sourcing, handcrafted textiles, production planning, sustainability, and ethical manufacturing.",
    brands: ["Valentino", "Balmain", "Stella McCartney", "Giorgio Armani", "Dolce & Gabbana"],
    initials: "SJ",
    hue: "from-stone-700/40 to-stone-900/60",
    image: shashankImg,
  },
  {
    name: "Subah",
    role: "Co-Founder · Creative & Client Partnerships",
    bio: "Specializes in design coordination, luxury product development, client engagement, and creative collaboration between brands and manufacturers.",
    brands: [],
    initials: "S",
    hue: "from-zinc-700/40 to-zinc-900/60",
    image: subahImg,
  },
];

export function Founders() {
  return (
    <section id="founders" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6">— Founders</p>
          <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-balance">
            The house behind the <span className="italic gradient-text">house</span>.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {founders.map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-strong rounded-3xl overflow-hidden flex flex-col sm:flex-row"
            >
              <div className={`relative w-full sm:w-2/5 aspect-square sm:aspect-auto bg-gradient-to-br ${f.hue} overflow-hidden flex-shrink-0`}>
                <img
                  src={f.image}
                  alt={`${f.name} — ${f.role}`}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              </div>
              <div className="p-7">
                <h3 className="font-serif text-2xl">{f.name}</h3>
                <p className="text-xs uppercase tracking-[0.25em] text-electric mt-1">{f.role}</p>
                <p className="mt-5 text-sm text-muted-foreground leading-relaxed">{f.bio}</p>
                {f.brands.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">Worked with</p>
                    <div className="flex flex-wrap gap-2">
                      {f.brands.map((b) => (
                        <span key={b} className="text-xs px-3 py-1.5 rounded-full glass">{b}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
