import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, Mail, Key, Eye } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/maisone/Navbar";
import { Footer } from "@/components/maisone/Footer";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy & Data Security — Maisone Global" },
      {
        name: "description",
        content:
          "Learn how Maisone Global protects corporate data, manufacturing CAD files, and contact details.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
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
              {t("privacyPage.label")}
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl text-foreground tracking-tight leading-tight">
              {t("privacyPage.heading")}{" "}
              <span className="italic gradient-text font-serif">
                {t("privacyPage.headingHighlight")}
              </span>
              {t("privacyPage.headingEnd")}
            </h1>
            <p className="text-xs text-muted-foreground mt-2">{t("privacyPage.lastUpdated")}</p>
          </div>

          {/* Policy Document */}
          <div className="glass-strong rounded-3xl p-8 border border-white/5 space-y-8 text-sm text-muted-foreground/80 leading-relaxed max-w-3xl">
            <section className="space-y-3">
              <div className="flex gap-2 items-center text-foreground font-serif text-lg">
                <Eye className="size-4 text-electric" />
                <h3>{t("privacyPage.sec1Title")}</h3>
              </div>
              <p>{t("privacyPage.sec1Text")}</p>
            </section>

            <section className="space-y-3">
              <div className="flex gap-2 items-center text-foreground font-serif text-lg">
                <ShieldCheck className="size-4 text-electric" />
                <h3>{t("privacyPage.sec2Title")}</h3>
              </div>
              <p>{t("privacyPage.sec2Text")}</p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>{t("privacyPage.sec2Bullet1")}</li>
                <li>{t("privacyPage.sec2Bullet2")}</li>
                <li>{t("privacyPage.sec2Bullet3")}</li>
                <li>{t("privacyPage.sec2Bullet4")}</li>
              </ul>
            </section>

            <section className="space-y-3">
              <div className="flex gap-2 items-center text-foreground font-serif text-lg">
                <Key className="size-4 text-electric" />
                <h3>{t("privacyPage.sec3Title")}</h3>
              </div>
              <p>{t("privacyPage.sec3Text")}</p>
            </section>

            <section className="space-y-3">
              <h3>{t("privacyPage.sec4Title")}</h3>
              <p>{t("privacyPage.sec4Text")}</p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>{t("privacyPage.sec4Bullet1")}</li>
                <li>{t("privacyPage.sec4Bullet2")}</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3>{t("privacyPage.sec5Title")}</h3>
              <p>{t("privacyPage.sec5Text")}</p>
            </section>

            <section className="space-y-3 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5">
                <Mail className="size-3.5 text-electric" /> security@maisone.com
              </span>
              <span>{t("privacyPage.securityOffice")}</span>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}
