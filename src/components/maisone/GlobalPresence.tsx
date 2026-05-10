import { WorldMap, HUBS } from "./WorldMap";

export function GlobalPresence() {
  const regions = ["Japan", "United Kingdom", "Europe", "United States"];
  return (
    <section id="solutions" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6">— Global Presence</p>
            <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-balance">
              Four continents. <span className="italic gradient-text">One network.</span>
            </h2>
            <p className="mt-6 text-muted-foreground max-w-md">
              Maisone operates curated sourcing hubs in the world's most influential
              fashion capitals — verified, compliant, and continuously benchmarked.
            </p>

            <div className="mt-10 space-y-4">
              {regions.map((r) => {
                const hubs = HUBS.filter((h) => h.region === r).map((h) => h.name);
                return (
                  <div key={r} className="flex items-baseline justify-between border-b border-border pb-4">
                    <span className="font-serif text-2xl">{r}</span>
                    <span className="text-xs text-muted-foreground tracking-wider">{hubs.join(" · ")}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-strong rounded-3xl p-6 text-foreground/80">
            <WorldMap compact />
            <div className="grid grid-cols-3 gap-4 mt-6 text-center">
              {[
                { v: "8", l: "Hubs" },
                { v: "2.4K+", l: "Vendors" },
                { v: "94%", l: "On-time" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="font-serif text-3xl">{s.v}</p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
