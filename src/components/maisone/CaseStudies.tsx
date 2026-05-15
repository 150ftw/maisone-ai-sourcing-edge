import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X, MapPin, TrendingDown, TrendingUp, Clock } from "lucide-react";

type Study = {
  id: string;
  brand: string;
  region: string;
  tag: string;
  headline: string;
  summary: string;
  hue: string;
  metrics: { label: string; value: string; dir: "down" | "up" }[];
  story: string[];
  quote: { text: string; author: string; role: string };
};

const STUDIES: Study[] = [
  {
    id: "indigo",
    brand: "Indigo & Oak",
    region: "Tokyo, JP",
    tag: "Premium Denim",
    headline: "How a Tokyo denim label scaled to 14 markets in 90 days.",
    summary:
      "Maisone matched Indigo & Oak with three Okayama mills, compressing sample cycles from 8 weeks to 11 days.",
    hue: "from-blue-600/30 to-indigo-900/40",
    metrics: [
      { label: "Lead time", value: "−42%", dir: "down" },
      { label: "MOQ", value: "−60%", dir: "down" },
      { label: "Margin", value: "+18%", dir: "up" },
    ],
    story: [
      "Indigo & Oak operated with a single legacy mill in Okayama and 12-week sample cycles that throttled their seasonal drops.",
      "Within 48 hours of briefing Maisone, the AI surfaced 9 selvedge-grade mills across Japan with verified capacity windows and natural-indigo certification.",
      "Three mills were onboarded inside two weeks. Sample cycles collapsed to 11 days, freeing the creative team to ship four micro-collections in a single quarter.",
    ],
    quote: {
      text: "Maisone gave us the supply chain of a maison ten times our size — without losing the soul of our craft.",
      author: "Hana Mori",
      role: "Founder, Indigo & Oak",
    },
  },
  {
    id: "camden",
    brand: "House of Camden",
    region: "London, UK",
    tag: "Heritage Outerwear",
    headline: "Re-shoring 70% of production while cutting unit cost by a third.",
    summary:
      "A fragmented European supplier base was unified into a single orchestrated network across the UK, Portugal and Italy.",
    hue: "from-stone-500/25 to-amber-800/30",
    metrics: [
      { label: "Unit cost", value: "−31%", dir: "down" },
      { label: "Suppliers", value: "−48%", dir: "down" },
      { label: "On-time", value: "+27%", dir: "up" },
    ],
    story: [
      "House of Camden was juggling 23 suppliers across five countries with no shared language for quality, lead time or compliance.",
      "Maisone consolidated the network to 12 verified ateliers, with risk scoring, capacity calendars and a single unified PO flow.",
      "Within a quarter, on-time delivery climbed 27% and unit cost fell 31% — without compromising the brand's heritage standards.",
    ],
    quote: {
      text: "We finally have one operating system for sourcing. The clarity is unreal.",
      author: "James Whitfield",
      role: "COO, House of Camden",
    },
  },
  {
    id: "noir",
    brand: "Maison Noir NYC",
    region: "New York, US",
    tag: "Streetwear",
    headline: "From DTC drop to global wholesale in a single season.",
    summary:
      "Maisone unlocked European fulfillment, ethical certifications and trend-forecasted assortments for a NYC streetwear label.",
    hue: "from-rose-500/25 to-violet-800/35",
    metrics: [
      { label: "Sell-through", value: "+44%", dir: "up" },
      { label: "Returns", value: "−22%", dir: "down" },
      { label: "Markets", value: "+9", dir: "up" },
    ],
    story: [
      "Maison Noir's first wholesale push stalled on certifications, fragmented logistics and a US-only supplier base.",
      "Maisone routed production across LA, Berlin and Porto, layered in OEKO-TEX and BSCI compliance, and forecasted assortments per market.",
      "The collection sold through 44% faster than prior drops and unlocked nine new markets in a single season.",
    ],
    quote: {
      text: "Maisone made global feel like our home turf.",
      author: "Devon Ray",
      role: "Creative Director, Maison Noir NYC",
    },
  },
];

export function CaseStudies() {
  const [open, setOpen] = useState<Study | null>(null);

  return (
    <section id="case-studies" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6">— Case Studies</p>
          <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-balance">
            Quietly powering the next generation of <span className="italic gradient-text">maisons</span>.
          </h2>
          <p className="mt-6 text-muted-foreground max-w-xl">
            From heritage ateliers to digital-native labels, Maisone is the sourcing layer behind some of the most ambitious collections shipping today.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {STUDIES.map((s, i) => (
            <motion.button
              key={s.id}
              onClick={() => setOpen(s)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group text-left glass-strong rounded-3xl overflow-hidden hover:-translate-y-1 transition-transform"
            >
              <div className={`relative aspect-[5/3] bg-gradient-to-br ${s.hue} overflow-hidden`}>
                <div className="absolute inset-0 grid-bg opacity-30" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_60%)]" />
                <span className="absolute top-4 left-4 text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full glass">
                  {s.tag}
                </span>
                <span className="absolute top-4 right-4 text-[10px] flex items-center gap-1 px-2.5 py-1 rounded-full glass">
                  <MapPin className="size-2.5" /> {s.region}
                </span>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="font-serif text-2xl">{s.brand}</p>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <h3 className="font-serif text-lg leading-snug text-balance">{s.headline}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{s.summary}</p>
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
                  {s.metrics.map((m) => (
                    <div key={m.label}>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{m.label}</p>
                      <p className={`text-sm tabular-nums mt-0.5 flex items-center gap-1 ${m.dir === "up" ? "text-emerald-400" : "text-electric"}`}>
                        {m.dir === "up" ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                        {m.value}
                      </p>
                    </div>
                  ))}
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs text-electric group-hover:gap-2 transition-all">
                  Read story <ArrowUpRight className="size-3.5" />
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.97 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto glass-strong rounded-3xl"
            >
              <button
                onClick={() => setOpen(null)}
                className="absolute top-4 right-4 size-9 rounded-full glass border border-border flex items-center justify-center hover:border-electric/50 transition-colors z-10"
              >
                <X className="size-4" />
              </button>
              <div className={`relative aspect-[5/2] bg-gradient-to-br ${open.hue}`}>
                <div className="absolute inset-0 grid-bg opacity-30" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-[10px] uppercase tracking-widest text-electric mb-2">{open.tag} · {open.region}</p>
                  <p className="font-serif text-3xl sm:text-4xl">{open.brand}</p>
                </div>
              </div>
              <div className="p-6 sm:p-8 space-y-6">
                <h3 className="font-serif text-2xl sm:text-3xl tracking-tight text-balance">{open.headline}</h3>
                <div className="grid grid-cols-3 gap-3">
                  {open.metrics.map((m) => (
                    <div key={m.label} className="rounded-2xl p-4 glass border border-border">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{m.label}</p>
                      <p className={`text-xl tabular-nums mt-1 flex items-center gap-1.5 ${m.dir === "up" ? "text-emerald-400" : "text-electric"}`}>
                        {m.dir === "up" ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
                        {m.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                  {open.story.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                <blockquote className="border-l-2 border-electric pl-5 py-2">
                  <p className="font-serif text-lg italic text-balance">"{open.quote.text}"</p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    — {open.quote.author}, <span className="text-foreground/80">{open.quote.role}</span>
                  </p>
                </blockquote>
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4 border-t border-border">
                  <Clock className="size-3" /> Engagement: 90 days · Status: live partnership
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
