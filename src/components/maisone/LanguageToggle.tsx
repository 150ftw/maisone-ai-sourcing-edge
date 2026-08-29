import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { useLanguage, LOCALE_LABELS, LOCALE_FLAGS } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

const LOCALES: Locale[] = ["en", "ja", "it", "fr"];

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-full glass hover:bg-accent/40 transition-colors cursor-pointer"
        aria-label="Change language"
      >
        <Globe className="size-3.5" />
        <span className="hidden sm:inline">{LOCALE_FLAGS[locale]}</span>
        <span className="text-xs uppercase tracking-wider">{locale}</span>
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-44 rounded-xl glass-strong border border-border p-1.5 shadow-xl z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
          {LOCALES.map((l) => (
            <button
              key={l}
              onClick={() => {
                setLocale(l);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 text-left text-sm px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                l === locale
                  ? "bg-electric/15 text-electric font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
              }`}
            >
              <span className="text-base">{LOCALE_FLAGS[l]}</span>
              <span>{LOCALE_LABELS[l]}</span>
              {l === locale && <span className="ml-auto size-1.5 rounded-full bg-electric" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
