import { motion } from "framer-motion";
import { Target, Eye } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="relative py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          <div className="max-w-xl">
            <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6">{t("about.label")}</p>
            <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-balance">
              {t("about.heading")} <span className="italic gradient-text">{t("about.headingHighlight")}</span>{t("about.headingEnd")}
            </h2>
            <div className="mt-8 space-y-5 text-muted-foreground leading-relaxed">
              <p>
                {t("about.p1")}
              </p>
              <p>
                {t("about.p2")}
              </p>
            </div>
          </div>
          
          <div className="relative w-full h-[600px] hidden lg:block">
            {/* Main Image */}
            <div className="absolute top-0 right-0 w-[80%] h-[90%] rounded-3xl overflow-hidden shadow-2xl glass-strong">
              <img src="/Collection/Couture/db93e3bb-ff5c-4138-8d35-350e20b2ee21.jpg" alt="Couture Fashion" className="object-cover w-full h-full hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent pointer-events-none" />
            </div>
            
            {/* Floating Image */}
            <div className="absolute bottom-0 left-0 w-[55%] h-[60%] rounded-3xl overflow-hidden border-[6px] border-background shadow-2xl z-10 glass">
              <img src="/Collection/Contemporary Ready to wear/1399681e-c6eb-40fb-9159-77081a1a4713.jpg" alt="Contemporary Fashion" className="object-cover w-full h-full hover:scale-105 transition-transform duration-700" />
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-1/4 -left-4 w-24 h-24 bg-electric/20 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-1/4 -right-4 w-32 h-32 bg-violet-glow/20 rounded-full blur-3xl -z-10" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mt-20 lg:mt-32">
          {[
            {
              icon: Target,
              label: t("about.missionLabel"),
              text: t("about.missionText"),
            },
            {
              icon: Eye,
              label: t("about.visionLabel"),
              text: t("about.visionText"),
            },
          ].map((b) => (
            <div key={b.label} className="glass-strong rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-electric/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500" />
              <div className="size-11 rounded-2xl bg-electric/15 flex items-center justify-center mb-5 relative z-10 group-hover:bg-electric/25 transition-colors duration-300">
                <b.icon className="size-5 text-electric" />
              </div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-3 relative z-10">— {b.label}</p>
              <p className="font-serif text-2xl leading-snug text-balance relative z-10">{b.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
