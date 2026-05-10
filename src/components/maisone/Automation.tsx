import { motion } from "framer-motion";
import { Database, FileText, Mail, MessageCircle, Boxes, Bot, ShoppingCart } from "lucide-react";

const nodes = [
  { icon: Database, label: "Zoho CRM" },
  { icon: FileText, label: "Notion" },
  { icon: Mail, label: "AI Email" },
  { icon: MessageCircle, label: "WhatsApp" },
  { icon: Boxes, label: "Inventory Sync" },
  { icon: Bot, label: "Sourcing Agents" },
  { icon: ShoppingCart, label: "Orders" },
];

export function Automation() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6">— Automation</p>
          <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-balance">
            Workflows that run <span className="italic gradient-text">themselves</span>.
          </h2>
          <p className="mt-6 text-muted-foreground max-w-xl">
            Connect Maisone to the tools you already trust. AI agents handle the
            handoffs while your team focuses on craft.
          </p>
        </div>

        <div className="relative glass-strong rounded-3xl p-10 lg:p-16">
          {/* Central core */}
          <div className="relative flex items-center justify-center min-h-[420px]">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", duration: 1 }}
              className="relative size-32 rounded-full glass-strong flex items-center justify-center glow-electric z-10"
            >
              <div className="absolute -inset-8 rounded-full border border-electric/15" />
              <div className="absolute -inset-16 rounded-full border border-electric/10" />
              <motion.div
                className="absolute -inset-24 rounded-full border border-dashed border-electric/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-electric/40 to-violet-glow/40 blur-2xl" />
              <div className="relative size-24 rounded-full bg-gradient-to-br from-background to-card border border-border flex items-center justify-center">
                <span className="font-serif text-3xl tracking-widest gradient-text">M</span>
              </div>
            </motion.div>

            {/* Orbit */}
            {nodes.map((n, i) => {
              const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
              const r = 200;
              const x = Math.cos(angle) * r;
              const y = Math.sin(angle) * r;
              return (
                <motion.div
                  key={n.label}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="absolute"
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                >
                  <div className="glass rounded-2xl px-4 py-3 flex items-center gap-2.5 hover:scale-105 transition-transform">
                    <n.icon className="size-4 text-electric" />
                    <span className="text-xs font-medium whitespace-nowrap">{n.label}</span>
                  </div>
                </motion.div>
              );
            })}

            {/* connection lines (decorative) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="-300 -250 600 500">
              {nodes.map((_, i) => {
                const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
                const x = Math.cos(angle) * 200;
                const y = Math.sin(angle) * 200;
                return (
                  <motion.line
                    key={i}
                    x1={0} y1={0} x2={x} y2={y}
                    stroke="oklch(0.65 0.22 255)"
                    strokeOpacity="0.3"
                    strokeDasharray="2 4"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.05, duration: 1 }}
                  />
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
