import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Star, MapPin, Clock, Package } from "lucide-react";

type Supplier = {
  name: string;
  city: string;
  rating: number;
  moq: string;
  price: string;
  lead: string;
  tag: string;
};

type Bubble =
  | { role: "user"; text: string }
  | { role: "ai"; text: string; suppliers?: Supplier[]; steps?: string[] };

const PROMPTS: { q: string; a: Bubble }[] = [
  {
    q: "Find 500 Denim Jackets",
    a: {
      role: "ai",
      text: "12 matching suppliers found across Japan, London and Italy. MOQ 300–1000 units · $18–$42/unit · 3–6 weeks production.",
      suppliers: [
        { name: "Osaka Mill #042", city: "Osaka, JP", rating: 4.9, moq: "300", price: "$22", lead: "4 wks", tag: "Selvedge" },
        { name: "Atelier Camden", city: "London, UK", rating: 4.7, moq: "500", price: "$31", lead: "5 wks", tag: "Heritage" },
        { name: "Sartoria Veneto", city: "Milan, IT", rating: 4.8, moq: "400", price: "$38", lead: "6 wks", tag: "Premium" },
      ],
    },
  },
  {
    q: "Show Japanese denim manufacturers",
    a: {
      role: "ai",
      text: "Curated Tokyo & Osaka mills with verified production capacity and lead time benchmarks.",
      suppliers: [
        { name: "Kojima Denim Works", city: "Okayama, JP", rating: 5.0, moq: "200", price: "$34", lead: "5 wks", tag: "Selvedge · 14oz" },
        { name: "Tokyo Indigo Atelier", city: "Tokyo, JP", rating: 4.8, moq: "300", price: "$28", lead: "4 wks", tag: "Natural Indigo" },
        { name: "Osaka Mill #042", city: "Osaka, JP", rating: 4.9, moq: "300", price: "$22", lead: "4 wks", tag: "Stretch Denim" },
      ],
    },
  },
  {
    q: "Need luxury hoodie suppliers",
    a: {
      role: "ai",
      text: "European & US ateliers specialising in heavyweight loopback and brushed cotton.",
      suppliers: [
        { name: "Maison Côté Sud", city: "Paris, FR", rating: 4.9, moq: "250", price: "$48", lead: "5 wks", tag: "Pima Cotton" },
        { name: "LA Knit Studio", city: "Los Angeles, US", rating: 4.7, moq: "200", price: "$42", lead: "4 wks", tag: "Garment-Dyed" },
        { name: "Berlin Loopback Co.", city: "Berlin, DE", rating: 4.8, moq: "300", price: "$45", lead: "5 wks", tag: "500gsm" },
      ],
    },
  },
  {
    q: "What regions does Maisone source from?",
    a: {
      role: "ai",
      text: "Maisone Global currently sources across Japan, the United Kingdom, Europe, and the United States — with curated hubs in Tokyo, Osaka, London, Paris, Milan, Berlin, New York and Los Angeles.",
    },
  },
  {
    q: "How does the AI sourcing process work?",
    a: {
      role: "ai",
      text: "Four orchestrated movements, fully audited:",
      steps: [
        "Submit a sourcing request in plain language",
        "AI analyses our verified supplier network",
        "Best-fit suppliers are matched and ranked",
        "Compare quotations, samples & timelines",
      ],
    },
  },
];

export function AIAssistant() {
  const [thread, setThread] = useState<Bubble[]>([
    { role: "ai", text: "Maisone AI · sourcing copilot ready. Ask anything, or try a prompt below." },
  ]);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [thread, typing]);

  const ask = (q: string) => {
    const found = PROMPTS.find((p) => p.q === q);
    if (!found) return;
    setThread((t) => [...t, { role: "user", text: q }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setThread((t) => [...t, found.a]);
    }, 1100);
  };

  return (
    <section id="maisone-ai" className="relative py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6">— Maisone AI</p>
          <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-balance">
            A sourcing copilot that <span className="italic gradient-text">thinks in fabric</span>.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Conversational intelligence trained on global supplier networks, MOQs, lead times and trend signals.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/assistant" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-foreground text-background text-sm font-medium hover:scale-105 transition-transform shadow-xl shadow-electric/20">
              Try the AI Assistant <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-10 bg-gradient-to-br from-electric/10 via-violet-glow/10 to-cyan-glow/5 blur-3xl pointer-events-none" />
          <div className="relative glass-strong rounded-3xl overflow-hidden shadow-2xl">
            {/* window chrome */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-red-500/70" />
                <span className="size-2.5 rounded-full bg-yellow-500/70" />
                <span className="size-2.5 rounded-full bg-emerald-500/70" />
                <span className="ml-4 text-xs text-muted-foreground flex items-center gap-2">
                  <Sparkles className="size-3 text-electric" /> maisone.ai · live
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">v1.0 · preview</span>
            </div>

            <div className="grid lg:grid-cols-[1fr_280px]">
              {/* conversation */}
              <div className="relative">
                <div ref={scrollRef} className="h-[520px] overflow-y-auto p-6 space-y-4">
                  <AnimatePresence initial={false}>
                    {thread.map((m, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-[88%] ${m.role === "user" ? "" : "w-full"}`}>
                          {m.role === "ai" && (
                            <div className="flex items-center gap-2 mb-2">
                              <div className="size-6 rounded-full bg-gradient-to-br from-electric to-violet-glow flex items-center justify-center">
                                <span className="font-serif text-[11px] text-white">M</span>
                              </div>
                              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Maisone AI</span>
                            </div>
                          )}
                          <div
                            className={`text-sm leading-relaxed rounded-2xl px-4 py-3 ${
                              m.role === "user"
                                ? "bg-foreground text-background"
                                : "glass border border-border"
                            }`}
                          >
                            {m.text}
                          </div>

                          {m.role === "ai" && m.suppliers && (
                            <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                              {m.suppliers.map((s) => (
                                <div key={s.name} className="rounded-xl p-3 bg-background border border-border">
                                  <div className="flex items-start justify-between mb-2">
                                    <div>
                                      <p className="text-xs font-medium">{s.name}</p>
                                      <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                        <MapPin className="size-2.5" /> {s.city}
                                      </p>
                                    </div>
                                    <span className="text-[10px] flex items-center gap-0.5 text-amber-400">
                                      <Star className="size-2.5 fill-amber-400" /> {s.rating}
                                    </span>
                                  </div>
                                  <span className="inline-block text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-electric/10 text-electric mb-2">
                                    {s.tag}
                                  </span>
                                  <div className="grid grid-cols-3 gap-1 text-[10px] text-muted-foreground">
                                    <div><p className="text-foreground tabular-nums">{s.moq}</p>MOQ</div>
                                    <div><p className="text-foreground tabular-nums">{s.price}</p>Unit</div>
                                    <div><p className="text-foreground tabular-nums">{s.lead}</p>Lead</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {m.role === "ai" && m.steps && (
                            <div className="mt-3 space-y-2">
                              {m.steps.map((s, idx) => (
                                <div key={s} className="flex items-start gap-3 rounded-xl px-3 py-2 bg-background border border-border">
                                  <span className="size-5 rounded-full bg-electric/15 text-electric text-[10px] flex items-center justify-center tabular-nums">{idx + 1}</span>
                                  <span className="text-xs">{s}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {typing && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-gradient-to-br from-electric to-violet-glow" />
                      <div className="glass border border-border rounded-2xl px-4 py-3 flex items-center gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="size-1.5 rounded-full bg-foreground/60"
                            animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* input */}
                <div className="border-t border-border p-4">
                  <div className="relative glass rounded-full px-5 py-3 flex items-center gap-3 ring-1 ring-electric/20 shadow-[0_0_30px_-10px_var(--electric)]">
                    <Sparkles className="size-4 text-electric shrink-0" />
                    <input
                      readOnly
                      placeholder="Ask Maisone AI — try a prompt on the right →"
                      className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                    />
                    <button className="size-8 rounded-full bg-foreground text-background flex items-center justify-center">
                      <Send className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* prompts sidebar */}
              <div className="border-t lg:border-t-0 lg:border-l border-border p-5 bg-background/40">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Sample prompts</p>
                <div className="space-y-2">
                  {PROMPTS.map((p) => (
                    <button
                      key={p.q}
                      onClick={() => ask(p.q)}
                      className="w-full text-left text-xs rounded-xl px-3 py-2.5 glass border border-border hover:border-electric/50 hover:bg-accent/40 transition-all"
                    >
                      {p.q}
                    </button>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Live signals</p>
                  <div className="space-y-1.5 text-[11px] text-muted-foreground">
                    <p className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" /> 2,418 vendors online</p>
                    <p className="flex items-center gap-2"><Package className="size-3" /> 184 active RFQs</p>
                    <p className="flex items-center gap-2"><Clock className="size-3" /> Avg response · 1.4s</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
