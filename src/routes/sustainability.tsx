import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Leaf, Recycle, Droplet, Wind, Sparkles, HelpCircle } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/maisone/Navbar";
import { Footer } from "@/components/maisone/Footer";

export const Route = createFileRoute("/sustainability")({
  head: () => ({
    meta: [
      { title: "Sustainability & Circularity Policy — Maisone Global" },
      { name: "description", content: "Discover Maisone Global's commitment to water-less dyeing, GOTS organic cotton, and zero-waste pattern design." }
    ],
  }),
  component: SustainabilityPage,
});

function SustainabilityPage() {
  const pillars = [
    {
      icon: Recycle,
      title: "Circular & Organic Raw Materials",
      desc: "We prioritize GOTS organic cotton, mechanically recycled wool, and chemically recycled nylon (like Econyl) to keep garments in a closed cycle and prevent landfill waste."
    },
    {
      icon: Droplet,
      title: "Water Conservation & Dyeing Technology",
      desc: "Our partner factories use supercritical CO2 and digital spray-dyeing systems, reducing freshwater consumption by up to 95% and eliminating toxic chemical runoff."
    },
    {
      icon: Wind,
      title: "Logistics Carbon Mitigation",
      desc: "By consolidating shipments and utilizing vertical regional clusters (where spinning, weaving, and sewing occur nearby), we minimize global shipping emissions."
    }
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
            <p className="text-[10px] uppercase tracking-[0.3em] text-electric">— Eco-Design Blueprint</p>
            <h1 className="font-serif text-4xl sm:text-6xl text-white tracking-tight leading-tight">
              Regenerative and <span className="italic gradient-text font-serif">circular sourcing blueprints</span>.
            </h1>
          </div>

          {/* Sourcing Pillars Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <div key={i} className="glass-strong rounded-3xl p-6 border border-white/5 space-y-4 hover:border-electric/25 transition-all flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="size-10 rounded-xl bg-electric/15 border border-electric/25 flex items-center justify-center">
                      <Icon className="size-4.5 text-electric" />
                    </div>
                    <h3 className="font-serif text-xl text-white">{p.title}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed font-normal">{p.desc}</p>
                  </div>
                  <div className="pt-2 text-[10px] text-electric font-semibold uppercase tracking-wider">
                    Zero Waste Goal
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sustainability Framework Details */}
          <section className="glass-strong rounded-3xl p-8 border border-white/5 space-y-6 max-w-3xl">
            <h2 className="text-white font-serif text-2xl tracking-tight flex items-center gap-2">
              <Sparkles className="size-5 text-electric" /> Sustainable Sourcing Goals
            </h2>
            <div className="space-y-4 text-sm text-muted-foreground/80 leading-relaxed">
              <p>
                Our sustainability model is built on resource conservation and waste reduction. Traditional manufacturing creates a massive environmental footprint, from toxic chemical runoff during dyeing to emissions from global transport legs.
              </p>
              <p>
                By helping brands pre-order materials based on AI-driven capacity logs and demand predictions, we prevent overproduction and deadstock. We are committed to working exclusively with factories that use renewable energy and water filtration systems by 2028, ensuring fashion supply chains respect local environments.
              </p>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}
