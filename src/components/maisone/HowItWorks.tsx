import { motion } from "framer-motion";
import { ArrowRight, Bot, CheckCircle2, FileText, Factory, PackageCheck } from "lucide-react";
import textiles from "@/assets/textiles.jpg";
import factoryImg from "@/assets/sourcing_factory_1783761919092.png";
import { useLanguage } from "@/lib/i18n";

export function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      n: "01",
      title: t("howItWorks.step1Title"),
      desc: t("howItWorks.step1Desc"),
      img: textiles,
    },
    {
      n: "02",
      title: t("howItWorks.step2Title"),
      desc: t("howItWorks.step2Desc"),
      img: "",
    },
    {
      n: "03",
      title: t("howItWorks.step3Title"),
      desc: t("howItWorks.step3Desc"),
      img: factoryImg,
    },
  ];

  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-20">
          <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6">
            {t("howItWorks.label")}
          </p>
          <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-balance">
            {t("howItWorks.heading")}{" "}
            <span className="italic gradient-text">{t("howItWorks.headingHighlight")}</span>
            {t("howItWorks.headingEnd")}
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
                <p className="mt-6 text-lg text-muted-foreground max-w-md leading-relaxed">
                  {s.desc}
                </p>
              </div>
              {s.n === "02" ? (
                <AutomationWorkflowVisual />
              ) : (
                <StepImage src={s.img} title={s.title} />
              )}
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
      <img
        src={src}
        alt={title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
    </div>
  );
}

function AutomationWorkflowVisual() {
  const { t } = useLanguage();

  const stages = [
    {
      icon: FileText,
      title: t("howItWorks.rfqIntake"),
      meta: t("howItWorks.briefsParsed"),
      progress: "92%",
    },
    {
      icon: Factory,
      title: t("howItWorks.supplierMatch"),
      meta: t("howItWorks.ateliersRanked"),
      progress: "88%",
    },
    {
      icon: PackageCheck,
      title: t("howItWorks.sampleReview"),
      meta: t("howItWorks.approvalsQueued"),
      progress: "76%",
    },
  ];

  return (
    <div className="relative min-h-[360px] overflow-hidden rounded-3xl glass-strong p-5 sm:p-7">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-25" />
      <div className="pointer-events-none absolute inset-x-8 top-24 h-px bg-gradient-to-r from-transparent via-electric/30 to-transparent" />
      <div className="relative flex h-full min-h-[320px] flex-col justify-between gap-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-electric">
              {t("howItWorks.orchestration")}
            </p>
            <h4 className="mt-3 font-serif text-2xl tracking-tight">
              {t("howItWorks.commandFlow")}
            </h4>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-electric/20 bg-electric/10 px-3 py-1.5 text-xs text-electric">
            <Bot className="size-3.5" />
            {t("howItWorks.liveMockup")}
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
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              {t("howItWorks.nextAction")}
            </p>
            <div className="mt-3 flex items-center gap-2 text-sm">
              <CheckCircle2 className="size-4 text-electric" />
              {t("howItWorks.generateQuote")}
            </div>
          </div>
          <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              {t("howItWorks.humanCheckpoint")}
            </p>
            <div className="mt-3 text-sm">{t("howItWorks.directorApproval")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
