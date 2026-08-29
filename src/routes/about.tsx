import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Compass, Shield, Heart, Target } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/maisone/Navbar";
import { Footer } from "@/components/maisone/Footer";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Maisone Global — Core Values & Sourcing Philosophy" },
      {
        name: "description",
        content:
          "Learn how Maisone Global is building transparent, ethical and sustainable fashion supply chains across Asia and Europe.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t } = useLanguage();

  return (
    <ThemeProvider>
      <div className="relative min-h-screen noise overflow-x-hidden">
        <Navbar />

        <main className="mx-auto max-w-4xl px-6 pt-32 pb-24 space-y-16">
          {/* Back button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-3" /> {t("aboutPage.backToHome")}
          </Link>

          {/* Heading */}
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-[0.3em] text-electric">
              {t("aboutPage.executiveOverview")}
            </p>
            <h1 className="font-serif text-4xl sm:text-6xl tracking-tight text-foreground leading-tight">
              {t("aboutPage.heading")}{" "}
              <span className="italic gradient-text">{t("aboutPage.headingHighlight")}</span>
              {t("aboutPage.headingEnd")}
            </h1>
          </div>

          {/* Introduction Narrative */}
          <section className="space-y-6 text-muted-foreground/90 leading-relaxed text-sm sm:text-base">
            <h2 className="text-foreground font-serif text-xl sm:text-2xl tracking-tight">
              {t("aboutPage.paradigmShift")}
            </h2>
            <p>{t("aboutPage.paradigmP1")}</p>
            <p>{t("aboutPage.paradigmP2")}</p>
          </section>

          {/* History Timeline */}
          <section className="space-y-8">
            <h2 className="text-foreground font-serif text-xl sm:text-2xl tracking-tight">
              {t("aboutPage.heritageTitle")}
            </h2>
            <div className="space-y-8 pl-4 border-l border-white/5">
              <div className="space-y-2 relative">
                <span className="absolute -left-[21px] top-1.5 size-2.5 rounded-full bg-electric" />
                <span className="text-xs font-semibold text-electric uppercase tracking-wider block">
                  {t("aboutPage.heritage2020Title")}
                </span>
                <p className="text-sm text-muted-foreground">{t("aboutPage.heritage2020Text")}</p>
              </div>
              <div className="space-y-2 relative">
                <span className="absolute -left-[21px] top-1.5 size-2.5 rounded-full bg-electric" />
                <span className="text-xs font-semibold text-electric uppercase tracking-wider block">
                  {t("aboutPage.heritage2022Title")}
                </span>
                <p className="text-sm text-muted-foreground">{t("aboutPage.heritage2022Text")}</p>
              </div>
              <div className="space-y-2 relative">
                <span className="absolute -left-[21px] top-1.5 size-2.5 rounded-full bg-electric" />
                <span className="text-xs font-semibold text-electric uppercase tracking-wider block">
                  {t("aboutPage.heritage2024Title")}
                </span>
                <p className="text-sm text-muted-foreground">{t("aboutPage.heritage2024Text")}</p>
              </div>
            </div>
          </section>

          {/* Core Values Detail */}
          <section className="grid sm:grid-cols-3 gap-6 pt-6">
            <div className="glass-strong rounded-3xl p-6 border border-white/5 space-y-4">
              <div className="size-10 rounded-xl bg-electric/15 border border-electric/25 flex items-center justify-center">
                <Compass className="size-4.5 text-electric" />
              </div>
              <h3 className="font-serif text-lg text-foreground">{t("aboutPage.value1Title")}</h3>
              <p className="text-muted-foreground/80 text-xs leading-relaxed">
                {t("aboutPage.value1Text")}
              </p>
            </div>
            <div className="glass-strong rounded-3xl p-6 border border-white/5 space-y-4">
              <div className="size-10 rounded-xl bg-electric/15 border border-electric/25 flex items-center justify-center">
                <Shield className="size-4.5 text-electric" />
              </div>
              <h3 className="font-serif text-lg text-foreground">{t("aboutPage.value2Title")}</h3>
              <p className="text-muted-foreground/80 text-xs leading-relaxed">
                {t("aboutPage.value2Text")}
              </p>
            </div>
            <div className="glass-strong rounded-3xl p-6 border border-white/5 space-y-4">
              <div className="size-10 rounded-xl bg-electric/15 border border-electric/25 flex items-center justify-center">
                <Heart className="size-4.5 text-electric" />
              </div>
              <h3 className="font-serif text-lg text-foreground">{t("aboutPage.value3Title")}</h3>
              <p className="text-muted-foreground/80 text-xs leading-relaxed">
                {t("aboutPage.value3Text")}
              </p>
            </div>
          </section>

          {/* Strategic Framework */}
          <section className="space-y-6 text-muted-foreground/90 leading-relaxed text-sm sm:text-base max-w-3xl">
            <h2 className="text-foreground font-serif text-2xl tracking-tight flex items-center gap-2">
              <Target className="size-5 text-electric" /> {t("aboutPage.frameworkTitle")}
            </h2>
            <p>{t("aboutPage.frameworkP1")}</p>
            <p>{t("aboutPage.frameworkP2")}</p>
          </section>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}
