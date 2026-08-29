import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Menu, X, Info, Scissors } from "lucide-react";
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
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
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

              <a href="/#trends" className="text-sm font-medium text-[#2C2C2C]/80 dark:text-muted-foreground hover:text-black dark:hover:text-foreground transition-colors">{t("nav.platform")}</a>

              <a href="/#founders" className="text-sm font-medium text-[#2C2C2C]/80 dark:text-muted-foreground hover:text-black dark:hover:text-foreground transition-colors">{t("nav.founders")}</a>
              <a href="/#blog" className="text-sm font-medium text-[#2C2C2C]/80 dark:text-muted-foreground hover:text-black dark:hover:text-foreground transition-colors">{t("nav.blog")}</a>
            </nav>

            <div className="flex items-center gap-2">
              {/* Utility Button */}
              <div className="relative">
                <button
                  onClick={() => setSettingsOpen(!settingsOpen)}
                  aria-label="Preferences"
                  className={`size-10 rounded-full flex items-center justify-center transition-all shadow-sm ${
                    settingsOpen ? "bg-foreground text-background dark:bg-electric dark:text-black scale-105" : "glass text-foreground hover:bg-white/10"
                  }`}
                >
                  <Info className="size-4" />
                </button>

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

            <a href="/#trends" onClick={() => setOpen(false)} className="text-sm font-medium text-[#2C2C2C]/80 dark:text-muted-foreground hover:text-black dark:hover:text-foreground py-2">{t("nav.platform")}</a>

            <a href="/#founders" onClick={() => setOpen(false)} className="text-sm font-medium text-[#2C2C2C]/80 dark:text-muted-foreground hover:text-black dark:hover:text-foreground py-2">{t("nav.founders")}</a>
            <a href="/#blog" onClick={() => setOpen(false)} className="text-sm font-medium text-[#2C2C2C]/80 dark:text-muted-foreground hover:text-black dark:hover:text-foreground py-2">{t("nav.blog")}</a>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}

