import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Quote, Briefcase } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/maisone/Navbar";
import { Footer } from "@/components/maisone/Footer";

// Import local founder images
import shashankImg from "@/assets/founder-shashank.jpg";
import subahImg from "@/assets/founder-subah.jpg";

export const Route = createFileRoute("/founders")({
  head: () => ({
    meta: [
      { title: "Our Leadership & Founders — Maisone Global" },
      { name: "description", content: "Meet Shashank Jain and Subah, the Co-Founders behind Maisone Global's sourcing network." }
    ],
  }),
  component: FoundersPage,
});

function FoundersPage() {
  const bios = [
    {
      name: "Shashank Jain",
      role: "Co-Founder · Operations & Strategy",
      quote: "True sustainability begins by optimizing the first link of the chain. By aligning demand signals with capacity, we can respect both the makers and the earth.",
      bio: "Shashank brings over 18 years of expertise in luxury fashion sourcing, handcrafted textiles, production planning, sustainability, and ethical manufacturing. Throughout his career, he has collaborated with premier global design houses including Valentino, Balmain, Stella McCartney, Giorgio Armani, and Dolce & Gabbana. At Maisone, he directs global operations and maps sustainable supply loops.",
      image: shashankImg
    },
    {
      name: "Subah",
      role: "Co-Founder · Creative & Client Partnerships",
      quote: "Fashion is a dialogue between creative vision and technical execution. Maisone translates that dialogue into transparent, beautifully crafted collections.",
      bio: "Subah specializes in design coordination, luxury product development, client engagement, and creative collaborations. She acts as the bridge connecting international design houses with specialized manufacturers. Her expertise ensures that creative design concepts are executed with absolute technical precision and material integrity.",
      image: subahImg
    }
  ];

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
            <p className="text-[10px] uppercase tracking-[0.3em] text-electric bg-black/50 px-2 py-0.5 rounded w-max">— Leadership & Philosophy</p>
            <h1 className="font-serif text-4xl sm:text-6xl text-white tracking-tight leading-tight">
              The minds behind <span className="italic gradient-text font-serif">Maisone Global</span>.
            </h1>
          </div>

          {/* Bios */}
          <div className="grid md:grid-cols-2 gap-10">
            {bios.map((f, i) => (
              <div key={i} className="glass-strong rounded-3xl p-8 border border-white/5 space-y-6 flex flex-col justify-between">
                <div className="space-y-6">
                  {/* Photo */}
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 relative animate-fade-in">
                    <img src={f.image} alt={f.name} className="w-full h-full object-cover object-[center_20%] transition-all duration-500" />
                    <div className="absolute bottom-4 left-4">
                      <div className="text-[9px] uppercase tracking-widest font-semibold bg-black/85 border border-white/10 px-3 py-1.5 rounded-xl text-electric flex flex-col gap-0.5">
                        <span>Co-Founder</span>
                        <span className="text-white/80 text-[8px] tracking-wider">{f.role.split(" · ")[1]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Name and Quote */}
                  <div className="space-y-3">
                    <h3 className="font-serif text-2xl text-white">{f.name}</h3>
                    <div className="pl-3 border-l-2 border-electric/40 text-muted-foreground italic text-xs leading-relaxed font-serif py-1">
                      "{f.quote}"
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-muted-foreground/80 text-xs leading-relaxed font-normal">
                    {f.bio}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex gap-2 items-center text-electric text-[10px] font-bold uppercase tracking-wider">
                  <Briefcase className="size-3 text-electric/40" /> Vetting the future of apparel
                </div>
              </div>
            ))}
          </div>

          {/* Founders' Manifesto */}
          <section className="glass-strong rounded-3xl p-8 md:p-10 border border-white/5 space-y-6 max-w-3xl">
            <h2 className="text-white font-serif text-2xl tracking-tight flex items-center gap-2">
              <Quote className="size-5 text-electric" /> The Founders' Manifesto
            </h2>
            <div className="space-y-4 text-sm text-muted-foreground/90 leading-relaxed italic font-serif">
              <p>
                "We built Maisone Global because the old sourcing system is broken. Brands shouldn't have to choose between profitability and ethics, and artisans shouldn't have to compromise their craft for low-cost mass production.
              </p>
              <p>
                By digitizing capacity logs and using AI-based trend forecasting, we help brands plan and manufacture exactly what they need. This eliminates excess inventory, reduces waste, and allows us to pay workers living wages. We believe in supply chains that respect both the creator and the environment."
              </p>
            </div>
            <div className="pt-4 border-t border-white/5 flex gap-4 text-xs font-semibold text-muted-foreground">
              <span>— Shashank Jain & Subah</span>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}
