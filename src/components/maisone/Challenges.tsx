import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const pairs = [
  {
    problem: "Struggling to find reliable factories?",
    solution: "We connect brands with trusted manufacturing partners.",
  },
  {
    problem: "Need tighter quality control?",
    solution: "Our rigorous inspection systems ensure premium quality.",
  },
  {
    problem: "Need compliance-ready factories?",
    solution: "We help establish ethically responsible production ecosystems.",
  },
  {
    problem: "Looking for innovative materials?",
    solution: "Access cutting-edge fabrics and sustainable sourcing solutions.",
  },
  {
    problem: "Want to focus on growth?",
    solution: "We handle sourcing and operations while you focus on creativity.",
  },
];

export function Challenges() {
  return (
    <section id="challenges" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6">— Challenges We Solve</p>
          <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-balance">
            Every bottleneck, <span className="italic gradient-text">resolved</span>.
          </h2>
        </div>

        <div className="space-y-4">
          {pairs.map((p, i) => (
            <motion.div
              key={p.problem}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="grid md:grid-cols-[1fr_auto_1fr] items-center gap-5 glass-strong rounded-3xl p-6 md:p-8"
            >
              <p className="font-serif text-xl md:text-2xl text-balance">{p.problem}</p>
              <ArrowRight className="size-5 text-electric mx-auto rotate-90 md:rotate-0" />
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{p.solution}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
