const countries = [
  { name: "United States", code: "USA", cities: ["New York", "Los Angeles"] },
  { name: "United Kingdom", code: "UK", cities: ["London"] },
  { name: "France", code: "FRANCE", cities: ["Paris"] },
  { name: "Italy", code: "ITALY", cities: ["Milan", "Florence"] },
  { name: "India", code: "INDIA", cities: ["New Delhi"] },
  { name: "China", code: "CHINA", cities: ["Shanghai"] },
  { name: "Japan", code: "JAPAN", cities: ["Tokyo"] },
];

export function Partners() {
  return (
    <section id="partners" className="relative py-24 border-y border-border">
      <div className="mx-auto max-w-7xl px-6 mb-10">
        <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-4 text-center">— Trusted by Global Fashion Networks</p>
        <h2 className="font-serif text-3xl sm:text-5xl tracking-tight text-center text-balance">
          A network that <span className="italic gradient-text">spans continents</span>.
        </h2>
      </div>

      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] pb-36 pt-4">
        <div className="flex items-center animate-marquee w-max hover:[animation-play-state:paused]">
          {[...Array(3)].map((_, listIdx) => (
            <div key={listIdx} className="flex items-center shrink-0">
              {countries.map((c, idx) => (
                <div key={`${listIdx}-${idx}`} className="group flex items-center gap-16 pr-16 cursor-default select-none transition-all duration-500 hover:scale-[1.05]">
                  <div className="relative flex flex-col items-center">
                    <span className="font-serif text-4xl sm:text-6xl tracking-[0.3em] text-foreground/60 group-hover:text-electric transition-colors duration-500 drop-shadow-sm whitespace-nowrap">
                      {c.code}
                    </span>
                    <div className="absolute top-full mt-3 flex flex-col items-center opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none">
                      {c.cities.map((city, cIdx) => (
                        <span key={cIdx} className="text-lg sm:text-xl tracking-wider text-electric/90 whitespace-nowrap font-serif italic">
                          {city}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-2xl text-electric/40 group-hover:text-electric transition-colors duration-500 drop-shadow-sm">◆</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
