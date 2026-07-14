import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, Info } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { LanguageToggle } from "./LanguageToggle";
import { useLanguage } from "@/lib/i18n";

export function SettingsMenu() {
  const { theme, toggle } = useTheme();
  const { t } = useLanguage();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setSettingsOpen(!settingsOpen)}
        aria-label="Preferences"
        className={`size-11 rounded-full flex items-center justify-center transition-all border border-white/10 shadow-lg ${
          settingsOpen ? "bg-electric text-black scale-105" : "glass-strong text-white hover:bg-white/10"
        }`}
      >
        <Info className="size-5" />
      </button>

      {settingsOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="absolute right-0 top-full mt-2 glass-strong rounded-2xl p-4 border border-white/5 shadow-2xl flex flex-col gap-4 min-w-[200px] z-50"
        >
          {/* Theme section */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground font-medium">{t("nav.theme") || "Theme"}</span>
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="size-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center hover:scale-105 transition-all border border-white/10"
            >
              {theme === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
            </button>
          </div>

          {/* Language section */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground font-medium">{t("nav.language") || "Language"}</span>
            <LanguageToggle />
          </div>
        </motion.div>
      )}
    </div>
  );
}
