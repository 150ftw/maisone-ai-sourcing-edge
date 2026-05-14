import { motion } from "framer-motion";
import { Database, FileText, Mail, MessageCircle, Boxes, Bot, ShoppingCart } from "lucide-react";

const nodes = [
  { icon: Database, label: "Zoho CRM", sub: "Buyer records", x: 22, y: 24 },
  { icon: FileText, label: "Notion", sub: "Tech packs", x: 50, y: 15 },
  { icon: Mail, label: "AI Email", sub: "Supplier follow-ups", x: 78, y: 24 },
  { icon: MessageCircle, label: "WhatsApp", sub: "Factory updates", x: 83, y: 52 },
  { icon: ShoppingCart, label: "Orders", sub: "PO approvals", x: 70, y: 79 },
  { icon: Boxes, label: "Inventory Sync", sub: "Stock movement", x: 42, y: 85 },
  { icon: Bot, label: "Sourcing Agents", sub: "Autonomous tasks", x: 17, y: 62 },
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

        <div className="relative glass-strong rounded-3xl overflow-hidden p-6 sm:p-10 lg:p-12">
          <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
          <div className="pointer-events-none absolute inset-x-10 top-1/2 h-px bg-gradient-to-r from-transparent via-electric/25 to-transparent" />

          <div className="relative hidden min-h-[560px] md:block">
            <svg className="absolute inset-0 size-full overflow-visible" viewBox="0 0 1000 560" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <radialGradient id="automationPulse" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="var(--electric)" stopOpacity="0.24" />
                  <stop offset="100%" stopColor="var(--electric)" stopOpacity="0" />
                </radialGradient>
              </defs>
              <ellipse cx="500" cy="300" rx="270" ry="190" fill="none" stroke="var(--electric)" strokeOpacity="0.12" strokeDasharray="6 14" />
              <ellipse cx="500" cy="300" rx="360" ry="240" fill="none" stroke="var(--violet-glow)" strokeOpacity="0.1" strokeDasharray="3 18" />
              <circle cx="500" cy="300" r="180" fill="url(#automationPulse)" />
              {nodes.map((node, i) => (
                <motion.line
                  key={node.label}
                  x1="500"
                  y1="300"
                  x2={node.x * 10}
                  y2={node.y * 5.6}
                  stroke="var(--electric)"
                  strokeOpacity="0.22"
                  strokeWidth="1"
                  strokeDasharray="4 8"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.8 }}
                />
              ))}
            </svg>

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", duration: 1 }}
              className="absolute left-1/2 top-[54%] z-10 flex size-40 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full glass-strong glow-electric"
            >
              <motion.div
                className="absolute -inset-8 rounded-full border border-dashed border-electric/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute -inset-16 rounded-full border border-electric/10" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-electric/35 to-violet-glow/35 blur-2xl" />
              <div className="relative flex size-28 items-center justify-center rounded-full border border-border bg-gradient-to-br from-background to-card">
                <span className="font-serif text-4xl tracking-widest gradient-text">M</span>
              </div>
            </motion.div>

            {nodes.map((node, i) => (
              <motion.div
                key={node.label}
                initial={{ opacity: 0, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.06, duration: 0.45 }}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              >
                <div className="group w-48 rounded-2xl glass px-4 py-3 shadow-[var(--shadow-soft)] transition-transform duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-electric/20 bg-electric/10">
                      <node.icon className="size-4 text-electric" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-tight text-foreground">{node.label}</p>
                      <p className="mt-1 text-[11px] leading-tight text-muted-foreground">{node.sub}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="relative grid gap-3 md:hidden">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", duration: 1 }}
              className="relative mx-auto mb-5 flex size-32 items-center justify-center rounded-full glass-strong glow-electric"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-electric/40 to-violet-glow/40 blur-2xl" />
              <div className="relative flex size-24 items-center justify-center rounded-full border border-border bg-gradient-to-br from-background to-card">
                <span className="font-serif text-3xl tracking-widest gradient-text">M</span>
              </div>
            </motion.div>
            {nodes.map((node, i) => (
              <motion.div
                key={node.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass flex items-center gap-3 rounded-2xl px-4 py-3"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-electric/20 bg-electric/10">
                  <node.icon className="size-4 text-electric" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-tight">{node.label}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{node.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
