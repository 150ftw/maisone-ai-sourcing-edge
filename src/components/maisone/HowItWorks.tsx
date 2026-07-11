import { motion } from "framer-motion";
import { ArrowRight, Bot, CheckCircle2, FileText, Factory, PackageCheck } from "lucide-react";
import textiles from "@/assets/textiles.jpg";
import factoryImg from "@/assets/sourcing_factory_1783761919092.png";

const steps = [
  {
    n: "01",
    title: "Discover Suppliers",
    desc: "Brief Maisone in plain language. Our agents surface the most aligned ateliers across four continents within minutes.",
    img: textiles,
  },
  {
    n: "02",
    title: "Automate Sourcing",
    desc: "RFQs, samples, negotiations and POs orchestrated end-to-end with full audit trail and human checkpoints.",
    img: "",
  },
  {
    n: "03",
    title: "Scale Operations",
    desc: "Real-time tracking, demand forecasting and supplier risk monitoring keep every collection on time.",
    img: factoryImg,
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-20">
          <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6">— How Maisone Works</p>
          <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-balance">
            From brief to <span className="italic gradient-text">delivery</span>, in three movements.
          </h2>
        </div>

        <div className="space-y-24">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
            >
              <div>
                <span className="font-serif text-7xl gradient-text">{s.n}</span>
                <h3 className="font-serif text-3xl sm:text-5xl mt-4 tracking-tight">{s.title}</h3>
                <p className="mt-6 text-lg text-muted-foreground max-w-md leading-relaxed">{s.desc}</p>
              </div>
              {s.n === "02" ? <AutomationWorkflowVisual /> : <StepImage src={s.img} title={s.title} />}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepImage({ src, title }: { src: string; title: string }) {
  return (
    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden glass-strong">
      <img src={src} alt={title} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
    </div>
  );
}

function AutomationWorkflowVisual() {
  const stages = [
    { icon: FileText, title: "RFQ Intake", meta: "48 briefs parsed", progress: "92%" },
    { icon: Factory, title: "Supplier Match", meta: "12 ateliers ranked", progress: "88%" },
    { icon: PackageCheck, title: "Sample Review", meta: "4 approvals queued", progress: "76%" },
  ];

  return (
    <div className="relative min-h-[360px] overflow-hidden rounded-3xl glass-strong p-5 sm:p-7">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-25" />
      <div className="pointer-events-none absolute inset-x-8 top-24 h-px bg-gradient-to-r from-transparent via-electric/30 to-transparent" />
      <div className="relative flex h-full min-h-[320px] flex-col justify-between gap-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-electric">AI Orchestration</p>
            <h4 className="mt-3 font-serif text-2xl tracking-tight">Sourcing command flow</h4>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-electric/20 bg-electric/10 px-3 py-1.5 text-xs text-electric">
            <Bot className="size-3.5" />
            Live mockup
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {stages.map((stage, index) => (
            <motion.div
              key={stage.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
              className="relative rounded-2xl glass p-4"
            >
              {index < stages.length - 1 && (
                <ArrowRight className="absolute -right-5 top-1/2 hidden size-5 -translate-y-1/2 text-electric/60 lg:block" />
              )}
              <div className="flex items-center justify-between gap-3">
                <div className="flex size-10 items-center justify-center rounded-full border border-electric/20 bg-electric/10">
                  <stage.icon className="size-4 text-electric" />
                </div>
                <span className="text-xs text-muted-foreground">{stage.progress}</span>
              </div>
              <h5 className="mt-5 text-sm font-medium">{stage.title}</h5>
              <p className="mt-1 text-xs text-muted-foreground">{stage.meta}</p>
              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-secondary">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-electric to-violet-glow"
                  initial={{ width: 0 }}
                  whileInView={{ width: stage.progress }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25 + index * 0.08, duration: 0.8 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Next action</p>
            <div className="mt-3 flex items-center gap-2 text-sm">
              <CheckCircle2 className="size-4 text-electric" />
              Generate supplier quote comparison
            </div>
          </div>
          <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Human checkpoint</p>
            <div className="mt-3 text-sm">Creative Director approval pending</div>
          </div>
        </div>
      </div>
    </div>
  );
}
