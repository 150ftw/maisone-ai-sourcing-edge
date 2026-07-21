import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Quote, Briefcase } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/maisone/Navbar";
import { Footer } from "@/components/maisone/Footer";
import { useLanguage } from "@/lib/i18n";

// Import local founder images
import shashankImg from "@/assets/founder-shashank.jpg";
import subahImg from "@/assets/founder-subah.jpg";

export const Route = createFileRoute("/founders")({
  head: () => ({
    meta: [
      { title: "Our Leadership & Founders — Maisone Global" },
      { name: "description", content: "Meet Shashank Jain and Subha Arora, the Co-Founders behind Maisone Global's sourcing network." }
    ],
  }),
  component: FoundersPage,
});

function FoundersPage() {
  const { t } = useLanguage();

  const bios = [
    {
      name: "Shashank Jain",
      role: t("founders.coFounder"),
      roleDetail: t("foundersPageRoute.shashankRoleDetail"),
      quote: t("foundersPageRoute.shashankQuote"),
      bio: t("foundersPageRoute.shashankBio"),
      image: shashankImg
    },
    {
      name: "Subha Arora",
      role: t("founders.coFounder"),
      roleDetail: t("foundersPageRoute.subahRoleDetail"),
      quote: t("foundersPageRoute.subahQuote"),
      bio: t("foundersPageRoute.subahBio"),
      image: subahImg
    }
  ];

  return (
    <ThemeProvider>
      <div className="relative min-h-screen noise overflow-x-hidden flex flex-col justify-between">
        <Navbar />
        <div className="absolute inset-0 hero-aura pointer-events-none opacity-40" />

        <main className="relative z-10 mx-auto max-w-4xl px-6 pt-32 pb-24 flex-grow w-full space-y-16">
          {/* Header */}
          <div className="space-y-6">
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-electric transition-colors uppercase tracking-wider">
              <ArrowLeft className="size-4" /> {t("aboutPage.backToHome")}
            </Link>
            <p className="text-[10px] uppercase tracking-[0.3em] text-electric bg-black/50 px-2 py-0.5 rounded w-max">{t("foundersPageRoute.label")}</p>
            <h1 className="font-serif text-4xl sm:text-6xl text-white tracking-tight leading-tight">
              {t("foundersPageRoute.heading")} <span className="italic gradient-text font-serif">{t("foundersPageRoute.headingHighlight")}</span>{t("foundersPageRoute.headingEnd")}
            </h1>
          </div>

          {/* Bios */}
          <div className="grid md:grid-cols-2 gap-10">
            {bios.map((f, i) => (
              <div key={i} className="glass-strong rounded-3xl p-8 border border-white/5 space-y-6 flex flex-col justify-between">
                <div className="space-y-6">
                  {/* Photo */}
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 relative animate-fade-in">
                    <img src={f.image} alt={f.name} className="w-full h-full object-cover object-[center_20%] transition-all duration-500" />
                    <div className="absolute bottom-4 left-4">
                      <div className="text-[9px] uppercase tracking-widest font-semibold bg-black/85 border border-white/10 px-3 py-1.5 rounded-xl text-electric flex flex-col gap-0.5">
                        <span>{f.role}</span>
                        <span className="text-white/80 text-[8px] tracking-wider">{f.roleDetail}</span>
                      </div>
                    </div>
                  </div>

                  {/* Name and Quote */}
                  <div className="space-y-3">
                    <h3 className="font-serif text-2xl text-white">{f.name}</h3>
                    <div className="pl-3 border-l-2 border-electric/40 text-muted-foreground italic text-xs leading-relaxed font-serif py-1">
                      "{f.quote}"
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-muted-foreground/80 text-xs leading-relaxed font-normal">
                    {f.bio}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex gap-2 items-center text-electric text-[10px] font-bold uppercase tracking-wider">
                  <Briefcase className="size-3 text-electric/40" /> {t("foundersPageRoute.vettingApparel")}
                </div>
              </div>
            ))}
          </div>

          {/* Founders' Manifesto */}
          <section className="glass-strong rounded-3xl p-8 md:p-10 border border-white/5 space-y-6 max-w-3xl">
            <h2 className="text-white font-serif text-2xl tracking-tight flex items-center gap-2">
              <Quote className="size-5 text-electric" /> {t("foundersPageRoute.manifestoTitle")}
            </h2>
            <div className="space-y-4 text-sm text-muted-foreground/90 leading-relaxed italic font-serif">
              <p>
                "{t("foundersPageRoute.manifestoP1")}"
              </p>
              <p>
                {t("foundersPageRoute.manifestoP2")}
              </p>
            </div>
            <div className="pt-4 border-t border-white/5 flex gap-4 text-xs font-semibold text-muted-foreground">
              <span>— Shashank Jain & Subha Arora</span>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}
