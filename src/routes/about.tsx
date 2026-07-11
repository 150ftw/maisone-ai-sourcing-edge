import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Compass, Shield, Heart, Sparkles, Target, History, Globe } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/maisone/Navbar";
import { Footer } from "@/components/maisone/Footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Our House — Maisone Global" },
      { name: "description", content: "Discover the heritage, structural vision, and technological framework behind Maisone Global's premium sourcing network." }
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
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
            <p className="text-[10px] uppercase tracking-[0.3em] text-electric">— Executive Overview</p>
            <h1 className="font-serif text-4xl sm:text-6xl text-white tracking-tight leading-tight">
              Reimagining the thread of <span className="italic gradient-text font-serif">global craftsmanship</span>.
            </h1>
          </div>

          {/* Intro Section */}
          <section className="space-y-6 text-muted-foreground/90 leading-relaxed text-sm sm:text-base max-w-3xl">
            <h2 className="text-white font-serif text-2xl tracking-tight flex items-center gap-2">
              <Sparkles className="size-5 text-electric" /> The Sourcing Paradigm Shift
            </h2>
            <p>
              For decades, the global apparel sourcing model has operated on a dynamic of extraction—squeezing margins from raw manufacturers, hiding supply chain steps behind brokers, and creating excessive surplus stock that ends up in landfills. Maisone Global was founded to challenge this practice. We believe that luxury and high-quality ready-to-wear fashion must be built on trust, transparency, and sustainable relationships.
            </p>
            <p>
              By combining AI-driven capacity tracking with generations-old artisanal craftsmanship, Maisone provides international brands with direct, audited access to premium apparel mills and tailoring ateliers in Japan, Italy, India, and the UK.
            </p>
          </section>

          {/* Timeline & Heritage */}
          <section className="space-y-6 max-w-3xl">
            <h2 className="text-white font-serif text-2xl tracking-tight flex items-center gap-2">
              <History className="size-5 text-electric" /> Our Heritage & Growth
            </h2>
            <div className="space-y-8 pl-4 border-l border-white/5">
              <div className="space-y-2 relative">
                <span className="absolute -left-[21px] top-1.5 size-2.5 rounded-full bg-electric" />
                <span className="text-xs font-semibold text-electric uppercase tracking-wider block">2020: The Foundation</span>
                <p className="text-sm text-muted-foreground">
                  Maisone was founded in Gurgaon, India, where our core operations and foundation reside. Our mission is to connect traditional Indian craft and high-quality manufacturing capacity with emerging independent luxury labels and global design houses.
                </p>
              </div>
              <div className="space-y-2 relative">
                <span className="absolute -left-[21px] top-1.5 size-2.5 rounded-full bg-electric" />
                <span className="text-xs font-semibold text-electric uppercase tracking-wider block">2022: Vertical Expansion</span>
                <p className="text-sm text-muted-foreground">
                  Recognizing the demand for structured production transparency, we expanded our network to include vertical cotton mills in India and premium tailoring workshops in Italy, establishing a comprehensive compliance auditing system.
                </p>
              </div>
              <div className="space-y-2 relative">
                <span className="absolute -left-[21px] top-1.5 size-2.5 rounded-full bg-electric" />
                <span className="text-xs font-semibold text-electric uppercase tracking-wider block">2024: Digital Integration</span>
                <p className="text-sm text-muted-foreground">
                  We launched the first version of the Maisone Console and AI Trend Forecasting engine, enabling brands to check factory capacity, trace shipment milestones, and plan collections using predictive analytics.
                </p>
              </div>
            </div>
          </section>

          {/* Core Values Detail */}
          <section className="grid sm:grid-cols-3 gap-6 pt-6">
            <div className="glass-strong rounded-3xl p-6 border border-white/5 space-y-4">
              <div className="size-10 rounded-xl bg-electric/15 border border-electric/25 flex items-center justify-center">
                <Compass className="size-4.5 text-electric" />
              </div>
              <h3 className="font-serif text-lg text-white">Artisanal Mastery</h3>
              <p className="text-muted-foreground/80 text-xs leading-relaxed">
                We support family-owned mills and weaving communities, keeping traditional techniques alive through global distribution.
              </p>
            </div>
            <div className="glass-strong rounded-3xl p-6 border border-white/5 space-y-4">
              <div className="size-10 rounded-xl bg-electric/15 border border-electric/25 flex items-center justify-center">
                <Shield className="size-4.5 text-electric" />
              </div>
              <h3 className="font-serif text-lg text-white">100% Transparency</h3>
              <p className="text-muted-foreground/80 text-xs leading-relaxed">
                Our digital logs map every milestone, from raw material procurement to custom shipping clearance.
              </p>
            </div>
            <div className="glass-strong rounded-3xl p-6 border border-white/5 space-y-4">
              <div className="size-10 rounded-xl bg-electric/15 border border-electric/25 flex items-center justify-center">
                <Heart className="size-4.5 text-electric" />
              </div>
              <h3 className="font-serif text-lg text-white">Ethical Standards</h3>
              <p className="text-muted-foreground/80 text-xs leading-relaxed">
                All manufacturing partners adhere strictly to SA8000 social accountability audits and living wage codes.
              </p>
            </div>
          </section>

          {/* Strategic Framework */}
          <section className="space-y-6 text-muted-foreground/90 leading-relaxed text-sm sm:text-base max-w-3xl">
            <h2 className="text-white font-serif text-2xl tracking-tight flex items-center gap-2">
              <Target className="size-5 text-electric" /> Sourcing for the Next Century
            </h2>
            <p>
              Looking forward, Maisone is committed to developing zero-waste supply chain loops. We are collaborating with research institutes to introduce fully biodegradable threads and circular recycling systems. Our network is designed to remain agile, allowing brands to respond dynamically to consumer demand without generating overstock.
            </p>
            <p>
              By aligning design requirements with verified capacity logs and GOTS certification standards, we help fashion brands build collections that stand the test of time, both aesthetically and ecologically.
            </p>
          </section>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}
