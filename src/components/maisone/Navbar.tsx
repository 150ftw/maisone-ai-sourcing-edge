import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { useTheme } from "@/components/theme-provider";

const links = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Solutions", href: "#solutions" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
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
          <a href="#home"><Logo /></a>

          <nav className="hidden lg:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="size-10 rounded-full glass flex items-center justify-center hover:scale-105 transition-transform"
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <a
              href="#contact"
              className="hidden md:inline-flex items-center text-sm font-medium px-5 py-2.5 rounded-full bg-foreground text-background hover:opacity-90 transition-opacity"
            >
              Book Demo
            </a>
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
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm text-muted-foreground hover:text-foreground py-2"
              >
                {l.label}
              </a>
            ))}
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
