import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, FileText, GitCommit, Factory, CheckCircle2, Truck, RefreshCcw, HelpCircle } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/maisone/Navbar";
import { Footer } from "@/components/maisone/Footer";

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
  return (
    <ThemeProvider>
      <div className="relative min-h-screen noise overflow-x-hidden flex flex-col justify-between">
        <Navbar />
        <div className="absolute inset-0 hero-aura pointer-events-none opacity-40" />

        <main className="relative z-10 mx-auto max-w-4xl px-6 pt-32 pb-24 flex-grow w-full space-y-16">
          {/* Header */}
          <div className="space-y-6">
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-electric transition-colors uppercase tracking-wider">
              <ArrowLeft className="size-4" /> Back to home
            </Link>
            <p className="text-[10px] uppercase tracking-[0.3em] text-electric">— Inside our Lifecycle</p>
            <h1 className="font-serif text-4xl sm:text-6xl text-white tracking-tight leading-tight">
              Our structured <span className="italic gradient-text font-serif">production system</span>.
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-2xl">
              We have eliminated the intermediaries, brokers, and manual phone trees. Discover how Maisone connects design concepts directly to advanced, audited manufacturing loops.
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
                <h2 className="font-serif text-2xl text-white">1. Design Intake & Digital Tech Packs</h2>
              </div>
              <div className="pl-0 md:pl-16 space-y-3 text-muted-foreground text-sm leading-relaxed">
                <p>
                  Sourcing begins when you upload your designs, CAD drawings, pattern grading rules, and textile requirements to the Maisone Console. Our system parses the files, checking for material specifications, target unit counts, and retail timelines.
                </p>
                <p>
                  If you do not have a finalized tech pack, our designers can help construct digital blueprints. We map target fiber categories, weight parameters (GSM), and detailing requirements to ensure our manufacturer partners have all the specs needed to quote accurately.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="glass-strong rounded-3xl p-8 border border-white/5 space-y-4 hover:border-electric/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-electric/15 border border-electric/25 flex items-center justify-center shrink-0">
                  <GitCommit className="size-5 text-electric" />
                </div>
                <h2 className="font-serif text-2xl text-white">2. AI Matching & Factory Vetting</h2>
              </div>
              <div className="pl-0 md:pl-16 space-y-3 text-muted-foreground text-sm leading-relaxed">
                <p>
                  Once intake is complete, our neural matching algorithm checks your specifications against capacity logs, specialization tags, and certification levels of approved mills in our network.
                </p>
                <p>
                  Instead of calling dozens of factories, our system automatically generates a vetted shortlist based on performance ratings, target delivery dates, and compliance certificates (such as GOTS or SA8000). Sourcing managers then review quotes and lead times, selecting the best partner.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="glass-strong rounded-3xl p-8 border border-white/5 space-y-4 hover:border-electric/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-electric/15 border border-electric/25 flex items-center justify-center shrink-0">
                  <Factory className="size-5 text-electric" />
                </div>
                <h2 className="font-serif text-2xl text-white">3. Fabric Sourcing & Sampling</h2>
              </div>
              <div className="pl-0 md:pl-16 space-y-3 text-muted-foreground text-sm leading-relaxed">
                <p>
                  We coordinate raw material procurement, booking yarn capacities or purchasing raw greige stock. Our partners then weave, dye, and wash test fabrics. 
                </p>
                <p>
                  We coordinate physical pre-production samples (PPS) to verify hand-feel, drape, and color accuracy under standardized lighting. Sourcing teams review samples, adjusting measurements or fit details prior to mass production.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="glass-strong rounded-3xl p-8 border border-white/5 space-y-4 hover:border-electric/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-electric/15 border border-electric/25 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="size-5 text-electric" />
                </div>
                <h2 className="font-serif text-2xl text-white">4. In-Line Quality Checks & Audits</h2>
              </div>
              <div className="pl-0 md:pl-16 space-y-3 text-muted-foreground text-sm leading-relaxed">
                <p>
                  During mass production, we conduct in-line and post-production quality checks based on international Acceptable Quality Level (AQL 2.5) standards. 
                </p>
                <p>
                  Inspectors verify sewing tolerances, seam strength, color continuity, and label placements. Snapshots of audits and progress reports are loaded onto your Console, giving you visibility into the manufacturing line.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="glass-strong rounded-3xl p-8 border border-white/5 space-y-4 hover:border-electric/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-electric/15 border border-electric/25 flex items-center justify-center shrink-0">
                  <Truck className="size-5 text-electric" />
                </div>
                <h2 className="font-serif text-2xl text-white">5. Customs Clearance & Cargo Routing</h2>
              </div>
              <div className="pl-0 md:pl-16 space-y-3 text-muted-foreground text-sm leading-relaxed">
                <p>
                  After final inspection, goods are packed, labeled, and prepared for shipping. We manage ocean and air freight routing, coordinate bill of ladings, and file customs declarations.
                </p>
                <p>
                  Your shipment is tracked in real time on our Console, keeping you updated on port arrivals and transit milestones. We handle the logistical complexities so your collection arrives directly at your warehouse, ready for retail.
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
