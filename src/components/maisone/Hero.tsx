import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp, Package } from "lucide-react";
import { WorldMap } from "./WorldMap";

export function Hero() {
  return (
    <section id="home" className="relative pt-36 pb-24 overflow-hidden">
      <div className="absolute inset-0 hero-aura pointer-events-none" />
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs tracking-[0.25em] uppercase text-muted-foreground mb-8">
            <Sparkles className="size-3 text-electric" />
            AI Fashion Sourcing Intelligence
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl leading-[1.02] tracking-tight text-balance">
            Maisone — <span className="gradient-text italic">AI-Powered</span>
            <br />
            Fashion Sourcing
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
            Connecting fashion brands with intelligent sourcing networks across
            Japan, the United Kingdom, Europe, and the United States.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-foreground text-background text-sm font-medium hover:scale-[1.02] transition-transform"
            >
              Book Demo
              <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="#dashboard"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full glass text-sm font-medium hover:bg-accent transition-colors"
            >
              Explore Platform
            </a>
          </div>
        </motion.div>

        {/* Map + floating cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative mt-20"
        >
          <div className="glass-strong rounded-3xl p-6 sm:p-10 text-foreground/80">
            <WorldMap />
          </div>

          {/* Floating analytics */}
          <motion.div
            className="hidden md:block absolute -left-4 top-12 glass-strong rounded-2xl p-4 w-56 animate-float"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="size-9 rounded-xl bg-electric/15 flex items-center justify-center">
                <TrendingUp className="size-4 text-electric" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Sourcing Score</p>
                <p className="text-lg font-semibold">98.4</p>
              </div>
            </div>
            <div className="h-1 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-electric to-violet-glow"
                initial={{ width: 0 }}
                animate={{ width: "92%" }}
                transition={{ delay: 1.4, duration: 1.2 }}
              />
            </div>
          </motion.div>

          <motion.div
            className="hidden md:block absolute -right-4 bottom-16 glass-strong rounded-2xl p-4 w-60 animate-float"
            style={{ animationDelay: "1.5s" }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Active Suppliers</p>
              <span className="text-[10px] text-emerald-400">+12.6%</span>
            </div>
            <p className="text-2xl font-semibold">2,418</p>
            <div className="mt-3 flex items-end gap-1 h-8">
              {[40, 65, 50, 78, 60, 88, 72, 95].map((h, i) => (
                <motion.div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-electric/30 to-violet-glow rounded-sm"
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 1.5 + i * 0.05 }}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            className="hidden lg:flex absolute left-1/2 -translate-x-1/2 -bottom-6 glass-strong rounded-full px-5 py-2.5 items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
          >
            <Package className="size-3.5 text-cyan-glow" />
            <span className="text-xs text-muted-foreground">Live shipment from</span>
            <span className="text-xs font-medium">Osaka → London</span>
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </motion.div>
        </motion.div>

        {/* Trust strip */}
        <div className="mt-24 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6">
            Trusted by fashion houses across four continents
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-60">
            {["MAISON KYŌ", "ATELIER LDN", "STUDIO MILANO", "NORTH/PARIS", "HOUSE OF NY"].map((b) => (
              <span key={b} className="font-serif text-lg tracking-[0.2em]">{b}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
