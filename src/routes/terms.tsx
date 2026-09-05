import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Scale, ShieldAlert, Gavel, HelpCircle } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/maisone/Navbar";
import { Footer } from "@/components/maisone/Footer";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Maisone Global" },
      {
        name: "description",
        content:
          "Explore the terms, licensing, and usage policies governing the Maisone Sourcing Network.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  const { t } = useLanguage();

  return (
    <ThemeProvider>
      <div className="relative min-h-screen noise overflow-x-hidden flex flex-col justify-between">
        <Navbar />
        <div className="absolute inset-0 hero-aura pointer-events-none opacity-40" />

        <main className="relative z-10 mx-auto max-w-4xl px-6 pt-32 pb-24 flex-grow w-full space-y-12">
          {/* Header */}
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-electric transition-colors uppercase tracking-wider mb-6"
            >
              <ArrowLeft className="size-4" /> {t("nav.backToHome")}
            </Link>
            <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-4">
              {t("termsPage.label")}
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl text-foreground tracking-tight leading-tight">
              {t("termsPage.heading")}{" "}
              <span className="italic gradient-text font-serif">
                {t("termsPage.headingHighlight")}
              </span>
              {t("termsPage.headingEnd")}
            </h1>
            <p className="text-xs text-muted-foreground mt-2">{t("termsPage.effectiveDate")}</p>
          </div>

          {/* Terms Document */}
          <div className="glass-strong rounded-3xl p-8 border border-white/5 space-y-8 text-sm text-muted-foreground/80 leading-relaxed max-w-3xl">
            <section className="space-y-3">
              <div className="flex gap-2 items-center text-foreground font-serif text-lg">
                <Scale className="size-4 text-electric" />
                <h3>{t("termsPage.sec1Title")}</h3>
              </div>
              <p>{t("termsPage.sec1Text")}</p>
            </section>

            <section className="space-y-3">
              <div className="flex gap-2 items-center text-foreground font-serif text-lg">
                <ShieldAlert className="size-4 text-electric" />
                <h3>{t("termsPage.sec2Title")}</h3>
              </div>
              <p>{t("termsPage.sec2Text")}</p>
            </section>

            <section className="space-y-3">
              <div className="flex gap-2 items-center text-foreground font-serif text-lg">
                <Gavel className="size-4 text-electric" />
                <h3>{t("termsPage.sec3Title")}</h3>
              </div>
              <p>{t("termsPage.sec3Text")}</p>
            </section>

            <section className="space-y-3">
              <h3>{t("termsPage.sec4Title")}</h3>
              <p>{t("termsPage.sec4Text")}</p>
            </section>

            <section className="space-y-3">
              <h3>{t("termsPage.sec5Title")}</h3>
              <p>{t("termsPage.sec5Text")}</p>
            </section>

            <section className="space-y-3 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5">
                <HelpCircle className="size-3.5 text-electric" /> info@maisone.in
              </span>
              <span>{t("termsPage.corporateLegal")}</span>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}
