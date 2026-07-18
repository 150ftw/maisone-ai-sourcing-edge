import { motion } from "framer-motion";
import shashankImg from "@/assets/founder-shashank.jpg";
import subahImg from "@/assets/founder-subah.jpg";
import { useLanguage } from "@/lib/i18n";

// founders list defined dynamically inside Founders component

export function Founders() {
  const { t } = useLanguage();

  const founders = [
    {
      name: "Shashank Jain",
      role: t("founders.coFounder") + " · Operations & Strategy",
      bio: t("founders.shashankBio"),
      footerLabel: t("founders.workedWith"),
      tags: ["Valentino", "Balmain", "Stella McCartney", "Giorgio Armani", "Dolce & Gabbana"],
      initials: "SJ",
      hue: "from-stone-800/50 to-stone-900/80",
      image: shashankImg,
    },
    {
      name: "Subha Arora",
      role: t("founders.coFounder") + " · Creative & Client Partnerships",
      bio: t("founders.subahBio"),
      footerLabel: t("founders.expertise"),
      tags: ["Design Coordination", "Luxury Product Dev", "Client Engagement", "Creative Sync"],
      initials: "S",
      hue: "from-zinc-800/50 to-zinc-900/80",
      image: subahImg,
    },
  ];

  return (
    <section id="founders" className="relative pt-32 pb-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6">{t("founders.label")}</p>
          <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-balance">
            {t("founders.heading")} <span className="italic gradient-text">{t("founders.headingHighlight")}</span>{t("founders.headingEnd")}
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
                <div className={`relative h-64 sm:h-72 w-full overflow-hidden bg-white/5`}>
                  <img
                    src={f.image}
                    alt={`${f.name} — ${f.role}`}
                    className="absolute inset-0 w-full h-full object-cover object-[center_20%] transition-all duration-700 ease-out"
                    loading="lazy"
                  />
                </div>
                
                <div className="p-8 pb-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                  <div className="text-[10px] font-medium uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl bg-electric/10 text-electric border border-electric/20 flex flex-col gap-0.5">
                    <span>{t("founders.coFounder")}</span>
                    <span className="text-[#2C2C2C]/80 dark:text-white/80 text-[8px] tracking-wider">{f.role.split(" · ")[1]}</span>
                  </div>
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
