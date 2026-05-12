import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Link } from "@tanstack/react-router";

const tiers = [
  {
    name: "Starter",
    price: "€490",
    period: "/ month",
    desc: "For emerging brands beginning their global sourcing journey.",
    features: ["Up to 50 verified suppliers", "AI matching · 100 queries/mo", "Real-time shipment tracking", "Email support"],
    cta: "Start trial",
    featured: false,
  },
  {
    name: "Growth",
    price: "€1,490",
    period: "/ month",
    desc: "For established houses scaling across multiple regions.",
    features: ["Unlimited suppliers", "Unlimited AI queries", "Procurement automation", "Trend intelligence reports", "Priority support"],
    cta: "Book demo",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Bespoke",
    period: "",
    desc: "For maisons operating at global scale with complex workflows.",
    features: ["Dedicated sourcing agents", "Custom AI models", "SSO & advanced security", "Onboarding & training", "24/7 concierge"],
    cta: "Contact sales",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6">— Pricing</p>
          <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-balance">
            Pricing as refined as the <span className="italic gradient-text">work itself</span>.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-3xl p-8 flex flex-col ${
                t.featured
                  ? "bg-foreground text-background glow-electric"
                  : "glass-strong"
              }`}
            >
              {t.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.25em] px-3 py-1 rounded-full bg-electric text-white">
                  Most chosen
                </span>
              )}
              <p className="text-xs uppercase tracking-[0.25em] opacity-70">{t.name}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-serif text-5xl">{t.price}</span>
                <span className="text-sm opacity-70">{t.period}</span>
              </div>
              <p className={`mt-4 text-sm ${t.featured ? "opacity-70" : "text-muted-foreground"}`}>{t.desc}</p>

              <ul className="mt-8 space-y-3 flex-1">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check className={`size-4 mt-0.5 shrink-0 ${t.featured ? "" : "text-electric"}`} />
                    <span className={t.featured ? "" : "text-foreground/80"}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/book-demo"
                className={`mt-8 inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium transition-opacity ${
                  t.featured
                    ? "bg-background text-foreground hover:opacity-90"
                    : "bg-foreground text-background hover:opacity-90"
                }`}
              >
                {t.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
