import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Award, Clipboard, ShieldAlert, HeartHandshake } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/maisone/Navbar";
import { Footer } from "@/components/maisone/Footer";

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
  const certifications = [
    { name: "GOTS (Global Organic Textile Standard)", scope: "Guarantees that raw fibers (organic cotton, flax, hemp) are grown organically without harmful chemical pesticides and traced through every production step." },
    { name: "OEKO-TEX Standard 100", scope: "Ensures that finished fabrics are free from harmful chemicals, heavy metals, and dyes that are toxic to skin or the environment." },
    { name: "SA8000 Social Accountability", scope: "Vets factories for fair living wages, safe working environments, reasonable working hours, and the prohibition of forced labor." },
    { name: "GRS (Global Recycled Standard)", scope: "Verifies the recycled composition of materials (like recycled nylon or polyester) and ensures environmental and chemical safety standards are met." },
    { name: "BCI (Better Cotton Initiative)", scope: "Promotes sustainable farming practices, water conservation, and soil health among cotton growers globally." }
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
              <ArrowLeft className="size-4" /> Back to home
            </Link>
            <p className="text-[10px] uppercase tracking-[0.3em] text-electric">— Quality & Ethics</p>
            <h1 className="font-serif text-4xl sm:text-6xl text-white tracking-tight leading-tight">
              Ethical audits and <span className="italic gradient-text font-serif">certified standards</span>.
            </h1>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* Auditing Philosophy */}
            <div className="space-y-8 text-sm text-muted-foreground/80 leading-relaxed">
              <div className="space-y-3">
                <h3 className="font-serif text-2xl text-white flex items-center gap-2">
                  <Clipboard className="size-5 text-electric" /> Our Vetting Protocol
                </h3>
                <p>
                  At Maisone, compliance is not just about check-box lists. Every factory, vertical mill, and packaging workshop in our network must pass unannounced audits conducted by certified inspectors.
                </p>
                <p>
                  We monitor physical working conditions, fire escape routes, ventilation networks, and fair-wage payrolls. We also conduct anonymous worker interviews to ensure standard operating procedures are followed.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-serif text-2xl text-white flex items-center gap-2">
                  <HeartHandshake className="size-5 text-electric" /> Acceptable Quality Level (AQL 2.5)
                </h3>
                <p>
                  To ensure quality matches design, mass production runs are subject to strict AQL 2.5 standards. Inspectors check stitching density, seam tension, zipper runs, and shrinkage tolerances. 
                </p>
                <p>
                  If defect rates exceed AQL limits during in-line audits, production is paused until the root cause is resolved and corrected.
                </p>
              </div>
            </div>

            {/* Certifications Block */}
            <div className="glass-strong rounded-3xl p-8 border border-white/5 space-y-6">
              <div className="flex items-center gap-2 text-white">
                <Award className="size-5 text-electric" />
                <h3 className="font-serif text-xl">Approved Certifications</h3>
              </div>
              <ul className="space-y-4">
                {certifications.map((c, idx) => (
                  <li key={idx} className="space-y-1 text-xs">
                    <h4 className="font-bold text-white flex items-center gap-2">
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
