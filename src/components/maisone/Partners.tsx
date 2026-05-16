const countries = ["USA", "ITALY", "PARIS", "ARGENTINA", "JAPAN", "UK", "INDIA"];

export function Partners() {
  const loop = [...countries, ...countries, ...countries];
  return (
    <section id="partners" className="relative py-24 border-y border-border">
      <div className="mx-auto max-w-7xl px-6 mb-10">
        <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-4 text-center">— Trusted by Global Fashion Networks</p>
        <h2 className="font-serif text-3xl sm:text-5xl tracking-tight text-center text-balance">
          A network that <span className="italic gradient-text">spans continents</span>.
        </h2>
      </div>

      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex gap-16 animate-marquee whitespace-nowrap">
          {loop.map((c, i) => (
            <span key={i} className="font-serif text-3xl sm:text-4xl tracking-[0.3em] text-foreground/60">
              {c}
              <span className="mx-16 text-electric/40">◆</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
