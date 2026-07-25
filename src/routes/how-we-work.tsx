import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, FileText, GitCommit, Factory, CheckCircle2, Truck } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/maisone/Navbar";
import { Footer } from "@/components/maisone/Footer";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/how-we-work")({
  head: () => ({
    meta: [
      { title: "Production Lifecycle & Sourcing Loop — Maisone Global" },
      { name: "description", content: "A deep dive into Maisone's digital sourcing lifecycle: matching, sampling, auditing, and delivery." }
    ],
  }),
  component: HowWeWorkPage,
});

function HowWeWorkPage() {
  const { t } = useLanguage();

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
            <p className="text-[10px] uppercase tracking-[0.3em] text-electric">{t("howWeWorkPage.label")}</p>
            <h1 className="font-serif text-4xl sm:text-6xl text-foreground tracking-tight leading-tight">
              {t("howWeWorkPage.heading")} <span className="italic gradient-text font-serif">{t("howWeWorkPage.headingHighlight")}</span>{t("howWeWorkPage.headingEnd")}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-2xl">
              {t("howWeWorkPage.subtitle")}
            </p>
          </div>

          {/* Detailed Steps Loop */}
          <div className="space-y-12">
            
            {/* Step 1 */}
            <div className="glass-strong rounded-3xl p-8 border border-white/5 space-y-4 hover:border-electric/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-electric/15 border border-electric/25 flex items-center justify-center shrink-0">
                  <FileText className="size-5 text-electric" />
                </div>
                <h2 className="font-serif text-2xl text-foreground">{t("howWeWorkPage.step1Title")}</h2>
              </div>
              <div className="pl-0 md:pl-16 space-y-3 text-muted-foreground text-sm leading-relaxed">
                <p>
                  {t("howWeWorkPage.step1P1")}
                </p>
                <p>
                  {t("howWeWorkPage.step1P2")}
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="glass-strong rounded-3xl p-8 border border-white/5 space-y-4 hover:border-electric/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-electric/15 border border-electric/25 flex items-center justify-center shrink-0">
                  <GitCommit className="size-5 text-electric" />
                </div>
                <h2 className="font-serif text-2xl text-foreground">{t("howWeWorkPage.step2Title")}</h2>
              </div>
              <div className="pl-0 md:pl-16 space-y-3 text-muted-foreground text-sm leading-relaxed">
                <p>
                  {t("howWeWorkPage.step2P1")}
                </p>
                <p>
                  {t("howWeWorkPage.step2P2")}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="glass-strong rounded-3xl p-8 border border-white/5 space-y-4 hover:border-electric/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-electric/15 border border-electric/25 flex items-center justify-center shrink-0">
                  <Factory className="size-5 text-electric" />
                </div>
                <h2 className="font-serif text-2xl text-foreground">{t("howWeWorkPage.step3Title")}</h2>
              </div>
              <div className="pl-0 md:pl-16 space-y-3 text-muted-foreground text-sm leading-relaxed">
                <p>
                  {t("howWeWorkPage.step3P1")}
                </p>
                <p>
                  {t("howWeWorkPage.step3P2")}
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="glass-strong rounded-3xl p-8 border border-white/5 space-y-4 hover:border-electric/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-electric/15 border border-electric/25 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="size-5 text-electric" />
                </div>
                <h2 className="font-serif text-2xl text-foreground">{t("howWeWorkPage.step4Title")}</h2>
              </div>
              <div className="pl-0 md:pl-16 space-y-3 text-muted-foreground text-sm leading-relaxed">
                <p>
                  {t("howWeWorkPage.step4P1")}
                </p>
                <p>
                  {t("howWeWorkPage.step4P2")}
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="glass-strong rounded-3xl p-8 border border-white/5 space-y-4 hover:border-electric/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-electric/15 border border-electric/25 flex items-center justify-center shrink-0">
                  <Truck className="size-5 text-electric" />
                </div>
                <h2 className="font-serif text-2xl text-foreground">{t("howWeWorkPage.step5Title")}</h2>
              </div>
              <div className="pl-0 md:pl-16 space-y-3 text-muted-foreground text-sm leading-relaxed">
                <p>
                  {t("howWeWorkPage.step5P1")}
                </p>
                <p>
                  {t("howWeWorkPage.step5P2")}
                </p>
              </div>
            </div>

          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}
