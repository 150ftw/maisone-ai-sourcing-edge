import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Award, Clipboard, HeartHandshake } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/maisone/Navbar";
import { Footer } from "@/components/maisone/Footer";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/compliance")({
  head: () => ({
    meta: [
      { title: "Compliance, Certifications & Vetting — Maisone Global" },
      { name: "description", content: "Learn about Maisone Global's factory auditing procedures, AQL 2.5 standards, and certifications." }
    ],
  }),
  component: CompliancePage,
});

function CompliancePage() {
  const { t } = useLanguage();

  const certifications = [
    { name: t("compliancePage.cert1Name"), scope: t("compliancePage.cert1Desc") },
    { name: t("compliancePage.cert2Name"), scope: t("compliancePage.cert2Desc") },
    { name: t("compliancePage.cert3Name"), scope: t("compliancePage.cert3Desc") },
    { name: t("compliancePage.cert4Name"), scope: t("compliancePage.cert4Desc") },
    { name: t("compliancePage.cert5Name"), scope: t("compliancePage.cert5Desc") }
  ];

  return (
    <ThemeProvider>
      <div className="relative min-h-screen noise overflow-x-hidden flex flex-col justify-between">
        <Navbar />
        <div className="absolute inset-0 hero-aura pointer-events-none opacity-40" />

        <main className="relative z-10 mx-auto max-w-5xl px-6 pt-32 pb-24 flex-grow w-full space-y-16">
          {/* Header */}
          <div className="space-y-6">
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-electric transition-colors uppercase tracking-wider">
              <ArrowLeft className="size-4" /> {t("nav.backToHome")}
            </Link>
            <p className="text-[10px] uppercase tracking-[0.3em] text-electric">{t("compliancePage.label")}</p>
            <h1 className="font-serif text-4xl sm:text-6xl text-foreground tracking-tight leading-tight">
              {t("compliancePage.heading")} <span className="italic gradient-text font-serif">{t("compliancePage.headingHighlight")}</span>{t("compliancePage.headingEnd")}
            </h1>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* Auditing Philosophy */}
            <div className="space-y-8 text-sm text-muted-foreground/80 leading-relaxed">
              <div className="space-y-3">
                <h3 className="font-serif text-2xl text-foreground flex items-center gap-2">
                  <Clipboard className="size-5 text-electric" /> {t("compliancePage.vettingTitle")}
                </h3>
                <p>
                  {t("compliancePage.vettingP1")}
                </p>
                <p>
                  {t("compliancePage.vettingP2")}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-serif text-2xl text-foreground flex items-center gap-2">
                  <HeartHandshake className="size-5 text-electric" /> {t("compliancePage.aqlTitle")}
                </h3>
                <p>
                  {t("compliancePage.aqlP1")}
                </p>
                <p>
                  {t("compliancePage.aqlP2")}
                </p>
              </div>
            </div>

            {/* Certifications Block */}
            <div className="glass-strong rounded-3xl p-8 border border-white/5 space-y-6">
              <div className="flex items-center gap-2 text-foreground">
                <Award className="size-5 text-electric" />
                <h3 className="font-serif text-xl">{t("compliancePage.approvedCerts")}</h3>
              </div>
              <ul className="space-y-4">
                {certifications.map((c, idx) => (
                  <li key={idx} className="space-y-1 text-xs">
                    <h4 className="font-bold text-foreground flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-electric shrink-0" />
                      {c.name}
                    </h4>
                    <p className="text-muted-foreground/80 pl-5 leading-relaxed">{c.scope}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}
