import { motion } from "framer-motion";
import { Star, MapPin, ShieldCheck, Clock, Package, Leaf, BadgeCheck, Calendar } from "lucide-react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const CAPACITY = [82, 88, 95, 76, 64, 70, 85, 92, 78, 60, 55, 72];
const CERTS = [
  { icon: Leaf, label: "GOTS" },
  { icon: ShieldCheck, label: "OEKO-TEX®" },
  { icon: BadgeCheck, label: "BSCI" },
];
const CLIENTS = ["Indigo & Oak", "House of Camden", "Maison Noir", "Atelier Côté"];

export function SupplierProfile() {
  return (
    <section id="supplier-profile" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6">— Supplier Intelligence</p>
          <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-balance">
            Every atelier, <span className="italic gradient-text">fully transparent</span>.
          </h2>
          <p className="mt-6 text-muted-foreground max-w-xl">
            One unified profile per supplier — capacity, certifications, response times, sample history and risk score, scored in real time by Maisone AI.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-strong rounded-3xl overflow-hidden"
        >
          {/* Header */}
          <div className="relative p-6 sm:p-8 border-b border-border bg-gradient-to-br from-blue-600/10 via-violet-700/10 to-transparent">
            <div className="absolute inset-0 grid-bg opacity-20" />
            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="size-14 rounded-2xl bg-gradient-to-br from-electric to-violet-glow flex items-center justify-center shrink-0">
                  <span className="font-serif text-xl text-white">O</span>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-400/20">
                      Verified
                    </span>
                    <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full glass border border-border">
                      Premium · Tier 1
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl tracking-tight">Osaka Mill #042</h3>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-3">
                    <span className="flex items-center gap-1"><MapPin className="size-3" /> Osaka, Japan</span>
                    <span className="flex items-center gap-1"><Star className="size-3 fill-amber-400 text-amber-400" /> 4.9 · 184 reviews</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 lg:gap-5">
                <Stat label="Risk score" value="A+" sub="Low risk" tone="good" />
                <Stat label="Response" value="1.2h" sub="Avg" tone="good" />
                <Stat label="On-time" value="97%" sub="L12M" tone="good" />
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="grid lg:grid-cols-3 gap-px bg-border">
            {/* Capacity calendar */}
            <div className="bg-card p-6">
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm flex items-center gap-2">
                  <Calendar className="size-3.5 text-electric" /> Capacity calendar
                </p>
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground">2026</span>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {CAPACITY.map((c, i) => (
                  <div key={MONTHS[i]} className="space-y-1.5">
                    <div className="h-16 flex items-end rounded-md bg-secondary overflow-hidden">
                      <motion.div
                        initial={{ height: 0 }}
                        whileInView={{ height: `${c}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.04, duration: 0.6 }}
                        className={`w-full ${
                          c >= 85 ? "bg-rose-500/70" : c >= 70 ? "bg-amber-400/70" : "bg-emerald-400/70"
                        }`}
                      />
                    </div>
                    <p className="text-[9px] text-center text-muted-foreground">{MONTHS[i]}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-emerald-400/70" /> Open</span>
                <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-amber-400/70" /> Limited</span>
                <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-rose-500/70" /> Booked</span>
              </div>
            </div>

            {/* Specs + certs */}
            <div className="bg-card p-6 space-y-5">
              <div>
                <p className="text-sm mb-3">Production specs</p>
                <div className="grid grid-cols-2 gap-3">
                  <Spec label="MOQ" value="300 units" />
                  <Spec label="Lead time" value="4 weeks" />
                  <Spec label="Specialty" value="Selvedge denim" />
                  <Spec label="Capacity" value="42k / mo" />
                </div>
              </div>
              <div>
                <p className="text-sm mb-3">Certifications</p>
                <div className="flex flex-wrap gap-2">
                  {CERTS.map((c) => (
                    <span key={c.label} className="text-xs px-2.5 py-1.5 rounded-full glass border border-border flex items-center gap-1.5">
                      <c.icon className="size-3 text-electric" />
                      {c.label}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm mb-3">Past clients</p>
                <div className="flex flex-wrap gap-2">
                  {CLIENTS.map((c) => (
                    <span key={c} className="text-xs px-2.5 py-1 rounded-full bg-secondary text-foreground/80">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sample gallery + activity */}
            <div className="bg-card p-6 space-y-5">
              <div>
                <p className="text-sm mb-3">Sample gallery</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    "from-blue-600/40 to-indigo-900/50",
                    "from-stone-400/30 to-amber-700/30",
                    "from-zinc-600/40 to-zinc-900/50",
                    "from-cyan-500/30 to-blue-700/40",
                    "from-rose-400/30 to-violet-700/40",
                    "from-emerald-500/30 to-cyan-800/40",
                  ].map((h, i) => (
                    <div key={i} className={`aspect-square rounded-lg bg-gradient-to-br ${h} relative overflow-hidden ring-1 ring-border`}>
                      <div className="absolute inset-0 grid-bg opacity-30" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl glass border border-border p-4">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Live activity</p>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-start gap-2">
                    <Package className="size-3 text-electric mt-0.5 shrink-0" />
                    <span>Accepted RFQ <span className="text-foreground/60">#4821</span> · 2m ago</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="size-3 text-electric mt-0.5 shrink-0" />
                    <span>Sample shipped to <span className="text-foreground/60">Maison Noir</span> · 1h ago</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BadgeCheck className="size-3 text-electric mt-0.5 shrink-0" />
                    <span>Re-certified OEKO-TEX® · 3d ago</span>
                  </li>
                </ul>
              </div>
              <button className="w-full text-xs py-2.5 rounded-full bg-foreground text-background hover:opacity-90 transition-opacity">
                Request quote from Osaka Mill #042
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string; tone?: "good" }) {
  return (
    <div className="rounded-2xl glass border border-border px-4 py-3 min-w-[88px]">
      <p className="text-[9px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="font-serif text-xl mt-0.5 text-emerald-400">{value}</p>
      <p className="text-[10px] text-muted-foreground">{sub}</p>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-secondary px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="text-sm mt-0.5">{value}</p>
    </div>
  );
}
