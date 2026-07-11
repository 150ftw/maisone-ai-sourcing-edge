import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Scale, ShieldAlert, Gavel, HelpCircle } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/maisone/Navbar";
import { Footer } from "@/components/maisone/Footer";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Maisone Global" },
      { name: "description", content: "Explore the terms, licensing, and usage policies governing the Maisone Sourcing Network." }
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <ThemeProvider>
      <div className="relative min-h-screen noise overflow-x-hidden flex flex-col justify-between">
        <Navbar />
        <div className="absolute inset-0 hero-aura pointer-events-none opacity-40" />

        <main className="relative z-10 mx-auto max-w-4xl px-6 pt-32 pb-24 flex-grow w-full space-y-12">
          {/* Header */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-electric transition-colors uppercase tracking-wider mb-6">
              <ArrowLeft className="size-4" /> Back to home
            </Link>
            <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-4">— Legal Framework</p>
            <h1 className="font-serif text-4xl sm:text-5xl text-white tracking-tight leading-tight">
              Terms of <span className="italic gradient-text font-serif">Service</span>.
            </h1>
            <p className="text-xs text-muted-foreground mt-2">Effective Date: July 11, 2026</p>
          </div>

          {/* Terms Document */}
          <div className="glass-strong rounded-3xl p-8 border border-white/5 space-y-8 text-sm text-muted-foreground/80 leading-relaxed max-w-3xl">
            
            <section className="space-y-3">
              <div className="flex gap-2 items-center text-white font-serif text-lg">
                <Scale className="size-4 text-electric" />
                <h3>1. Acceptance of Terms</h3>
              </div>
              <p>
                By accessing the Maisone Sourcing Console, submitting inquiry forms, or using our AI trend engines, you agree to comply with and be bound by these Terms of Service. If you are entering into this agreement on behalf of a brand or corporate entity, you warrant that you have the legal authority to bind that entity.
              </p>
            </section>

            <section className="space-y-3">
              <div className="flex gap-2 items-center text-white font-serif text-lg">
                <ShieldAlert className="size-4 text-electric" />
                <h3>2. Platform Registration & Console Security</h3>
              </div>
              <p>
                Access to tracking boards, capacity logs, and shipment statuses is limited to authorized client logins. You are responsible for safeguarding login credentials and for all actions taken under your account. Any unauthorized access must be reported immediately.
              </p>
            </section>

            <section className="space-y-3">
              <div className="flex gap-2 items-center text-white font-serif text-lg">
                <Gavel className="size-4 text-electric" />
                <h3>3. Intellectual Property Rights</h3>
              </div>
              <p>
                All drawings, CAD plans, grading assets, and custom design guidelines uploaded to our platform remain your intellectual property. Maisone Global does not claim ownership or rights over these designs, using them only to facilitate manufacturing matches.
              </p>
            </section>

            <section className="space-y-3">
              <h3>4. Lead Times & Shipping Estimates</h3>
              <p>
                Manufacturing timeframes and shipment estimates are projections based on factory capacities and global shipping metrics. While we guarantee factory compliance audits, final delivery timelines are subject to shipping customs and port clearances.
              </p>
            </section>

            <section className="space-y-3">
              <h3>5. Governing Law</h3>
              <p>
                These Terms of Service and any agreements related to sourcing facilitation shall be governed by and construed in accordance with the laws of India, without regard to conflicts of law principles.
              </p>
            </section>

            <section className="space-y-3 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5"><HelpCircle className="size-3.5 text-electric" /> legal@maisone.com</span>
              <span>Corporate Legal Affairs, Gurgaon Office</span>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}
