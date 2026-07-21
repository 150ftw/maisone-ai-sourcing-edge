import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Menu, X, ChevronDown, Info, Scissors } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { useTheme } from "@/components/theme-provider";
import { LanguageToggle } from "./LanguageToggle";
import { useLanguage } from "@/lib/i18n";

export function Navbar() {
  const { theme, toggle } = useTheme();
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    let hintTimeout: NodeJS.Timeout;

    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      // Trigger hint when scrolling past Hero section (approx 1 screen height)
      if (typeof window !== "undefined" && window.location.pathname === "/") {
        const hasShown = localStorage.getItem("maisone_settings_hint_v7");
        const loaderDone = sessionStorage.getItem("maisone_has_loaded");
        
        // Only trigger if they haven't seen it, AND the loader is finished
        if (!hasShown && loaderDone) {
          // Trigger when scrolling down approx 80% of the screen
          if (window.scrollY > window.innerHeight * 0.8) {
            localStorage.setItem("maisone_settings_hint_v7", "true");
            setShowHint(true);
              
              // Subtle pop sound via Web Audio API
              try {
                const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                if (AudioContext) {
                  const ctx = new AudioContext();
                  const osc = ctx.createOscillator();
                  const gain = ctx.createGain();
                  osc.connect(gain);
                  gain.connect(ctx.destination);
                  
                  osc.type = "sine";
                  osc.frequency.setValueAtTime(800, ctx.currentTime);
                  osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
                  
                  gain.gain.setValueAtTime(0, ctx.currentTime);
                  gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.02);
                  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
                  
                  osc.start(ctx.currentTime);
                  osc.stop(ctx.currentTime + 0.3);
                }
              } catch (e) {
                console.error("Audio play failed", e);
              }

              // Hide after 6 seconds
              hintTimeout = setTimeout(() => setShowHint(false), 6000);
            }
          }
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(hintTimeout);
    };
  }, []);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className={`mx-auto max-w-7xl px-6 ${scrolled ? "" : ""}`}>
          <div className={`flex items-center justify-between rounded-2xl px-5 py-3 transition-all ${
            scrolled ? "glass-strong" : ""
          }`}>
            <Logo />

            <nav className="hidden lg:flex items-center gap-8">
              <a href="/#home" className="text-sm font-medium text-[#2C2C2C]/80 dark:text-muted-foreground hover:text-black dark:hover:text-foreground transition-colors">{t("nav.home")}</a>
              <a href="/#about" className="text-sm font-medium text-[#2C2C2C]/80 dark:text-muted-foreground hover:text-black dark:hover:text-foreground transition-colors">{t("nav.about")}</a>
              <a href="/#services" className="text-sm font-medium text-[#2C2C2C]/80 dark:text-muted-foreground hover:text-black dark:hover:text-foreground transition-colors">{t("nav.services")}</a>
              <a href="/#categories" className="text-sm font-medium text-[#2C2C2C]/80 dark:text-muted-foreground hover:text-black dark:hover:text-foreground transition-colors">{t("nav.categories")}</a>

              {/* Platform Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm font-medium text-[#2C2C2C]/80 dark:text-muted-foreground group-hover:text-black dark:group-hover:text-foreground transition-colors py-2 cursor-pointer">
                  <span>{t("nav.platform")}</span>
                  <ChevronDown className="size-3.5 transition-transform duration-300 group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-48 rounded-xl glass-strong border border-border p-2 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-300 origin-top shadow-xl">
                  <a
                    href="/#dashboard"
                    className="block text-xs font-medium text-[#2C2C2C]/80 dark:text-muted-foreground hover:text-black dark:hover:text-foreground hover:bg-secondary/40 rounded-lg px-3 py-2.5 transition-all"
                  >
                    {t("nav.console")}
                  </a>
                  <a
                    href="/#trends"
                    className="block text-xs font-medium text-[#2C2C2C]/80 dark:text-muted-foreground hover:text-black dark:hover:text-foreground hover:bg-secondary/40 rounded-lg px-3 py-2.5 transition-all"
                  >
                    {t("nav.aiTrendForecast")}
                  </a>
                </div>
              </div>

              <a href="/#founders" className="text-sm font-medium text-[#2C2C2C]/80 dark:text-muted-foreground hover:text-black dark:hover:text-foreground transition-colors">{t("nav.founders")}</a>
              <a href="/#blog" className="text-sm font-medium text-[#2C2C2C]/80 dark:text-muted-foreground hover:text-black dark:hover:text-foreground transition-colors">{t("nav.blog")}</a>
            </nav>

            <div className="flex items-center gap-2">
              <Link
                to="/supplier-request"
                className="hidden md:inline-flex items-center text-sm font-medium px-5 py-2.5 rounded-full border border-border bg-background/50 text-foreground hover:bg-secondary/50 transition-colors"
              >
                {t("nav.joinAsSupplier")}
              </Link>
              <Link
                to="/book-demo"
                className="hidden md:inline-flex items-center text-sm font-medium px-5 py-2.5 rounded-full bg-foreground text-background hover:opacity-90 transition-opacity"
              >
                {t("nav.inquireAboutUs")}
              </Link>

              {/* Utility Button */}
              <div className="relative">
                <button
                  onClick={() => setSettingsOpen(!settingsOpen)}
                  aria-label="Preferences"
                  className={`size-10 rounded-full flex items-center justify-center transition-all shadow-sm ${
                    settingsOpen ? "bg-electric text-black scale-105" : "glass text-foreground hover:bg-white/10"
                  }`}
                >
                  <Info className="size-4" />
                </button>

                <AnimatePresence>
                  {showHint && !settingsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      className="absolute left-0 top-full mt-3 w-60 bg-card rounded-xl border-2 border-dashed border-electric/40 shadow-[0_10px_40px_-10px_rgba(194,164,109,0.4)] z-50 pointer-events-none"
                    >
                      {/* Background ambient glow */}
                      <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                        <div className="absolute -top-10 -right-10 size-32 bg-electric/15 rounded-full blur-2xl" />
                        <div className="absolute -bottom-10 -left-10 size-32 bg-electric/10 rounded-full blur-2xl" />
                      </div>
                      
                      {/* Arrow */}
                      <div className="absolute -top-[10px] left-[12px] w-4 h-4 bg-card border-l-2 border-t-2 border-dashed border-electric/40 rotate-45" />
                      
                      <div className="relative z-10 p-3 flex flex-col gap-1.5 items-center">
                        <div className="flex items-center gap-2 text-electric bg-electric/10 px-3 py-1 rounded-full border border-electric/20 mb-1">
                          <Scissors className="size-3.5 stroke-[2.5]" />
                          <span className="text-[10px] uppercase tracking-widest font-bold">Tailor Your View</span>
                        </div>
                        <p className="text-xs text-foreground font-medium text-center leading-relaxed px-1">
                          Personalize your <span className="text-electric italic font-serif text-sm">fabric</span> of choice—theme & language settings await here!
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {settingsOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="absolute left-0 top-full mt-2 glass-strong rounded-2xl p-4 border border-white/5 shadow-2xl flex flex-col gap-4 min-w-[200px]"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs text-muted-foreground font-medium">{t("nav.theme") || "Theme"}</span>
                      <button
                        onClick={toggle}
                        aria-label="Toggle theme"
                        className="size-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center hover:scale-105 transition-all border border-white/10"
                      >
                        {theme === "dark" ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
                      </button>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs text-muted-foreground font-medium">{t("nav.language") || "Language"}</span>
                      <LanguageToggle />
                    </div>
                  </motion.div>
                )}
              </div>

              <button
                onClick={() => setOpen(!open)}
                className="lg:hidden size-10 rounded-full glass flex items-center justify-center"
              >
                {open ? <X className="size-4" /> : <Menu className="size-4" />}
              </button>
            </div>
          </div>

        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden mt-2 glass-strong rounded-2xl p-4 flex flex-col gap-3"
          >
            <a href="/#home" onClick={() => setOpen(false)} className="text-sm font-medium text-[#2C2C2C]/80 dark:text-muted-foreground hover:text-black dark:hover:text-foreground py-2">{t("nav.home")}</a>
            <a href="/#about" onClick={() => setOpen(false)} className="text-sm font-medium text-[#2C2C2C]/80 dark:text-muted-foreground hover:text-black dark:hover:text-foreground py-2">{t("nav.about")}</a>
            <a href="/#services" onClick={() => setOpen(false)} className="text-sm font-medium text-[#2C2C2C]/80 dark:text-muted-foreground hover:text-black dark:hover:text-foreground py-2">{t("nav.services")}</a>
            <a href="/#categories" onClick={() => setOpen(false)} className="text-sm font-medium text-[#2C2C2C]/80 dark:text-muted-foreground hover:text-black dark:hover:text-foreground py-2">{t("nav.categories")}</a>

            {/* Mobile Platform Links */}
            <div className="flex flex-col gap-1.5 pl-3 border-l border-border/50 my-1">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 px-2 py-1">{t("nav.platform")}</p>
              <a
                href="/#dashboard"
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-[#2C2C2C]/80 dark:text-muted-foreground hover:text-black dark:hover:text-foreground px-2 py-1.5"
              >
                {t("nav.console")}
              </a>
              <a
                href="/#trends"
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-[#2C2C2C]/80 dark:text-muted-foreground hover:text-black dark:hover:text-foreground px-2 py-1.5"
              >
                {t("nav.aiTrendForecast")}
              </a>
            </div>

            <a href="/#founders" onClick={() => setOpen(false)} className="text-sm font-medium text-[#2C2C2C]/80 dark:text-muted-foreground hover:text-black dark:hover:text-foreground py-2">{t("nav.founders")}</a>
            <a href="/#blog" onClick={() => setOpen(false)} className="text-sm font-medium text-[#2C2C2C]/80 dark:text-muted-foreground hover:text-black dark:hover:text-foreground py-2">{t("nav.blog")}</a>
            
            {/* Mobile language & action buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-border/50">
              <Link
                to="/supplier-request"
                onClick={() => setOpen(false)}
                className="flex-1 text-center text-sm font-medium px-4 py-2.5 rounded-full border border-border bg-background/50 text-foreground hover:bg-secondary/50 transition-colors"
              >
                {t("nav.joinAsSupplier")}
              </Link>
              <Link
                to="/book-demo"
                onClick={() => setOpen(false)}
                className="flex-1 text-center text-sm font-medium px-4 py-2.5 rounded-full bg-foreground text-background hover:opacity-90 transition-opacity"
              >
                {t("nav.inquireAboutUs")}
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}

