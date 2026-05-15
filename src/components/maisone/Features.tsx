import { motion } from "framer-motion";
import {
  Network, Search, Globe2, Workflow, Truck, TrendingUp,
  PackageSearch, Bot, ShieldAlert, Zap,
} from "lucide-react";

const features = [
  { icon: Network, title: "AI Supplier Matching", desc: "Semantic vector matching across 50K+ verified vendors by capability, MOQ, lead time and ethics score." },
  { icon: Search, title: "Smart Product Discovery", desc: "Image-to-supplier search powered by multimodal models trained on textile, trim and silhouette taxonomies." },
  { icon: Globe2, title: "Global Vendor Network", desc: "Curated mills and ateliers in Tokyo, London, Paris, Milan, Berlin, New York and Los Angeles." },
  { icon: Workflow, title: "Procurement Automation", desc: "From RFQ to PO in minutes. Auto-route quotes, negotiate terms and trigger contract workflows." },
  { icon: Truck, title: "Real-Time Shipment Tracking", desc: "Container-level visibility across air, sea and rail with predictive ETAs and customs alerts." },
  { icon: TrendingUp, title: "Fashion Trend Intelligence", desc: "Runway, social and retail signals condensed into actionable colour, fabric and silhouette forecasts." },
  { icon: PackageSearch, title: "Inventory Forecasting", desc: "Demand models trained on your sell-through data anticipate stock-outs eight weeks ahead." },
  { icon: Bot, title: "AI Chat Assistant", desc: "A sourcing copilot that drafts briefs, summarises quotes and answers supplier questions, 24/7." },
  { icon: ShieldAlert, title: "Supplier Risk Analysis", desc: "Continuous monitoring of compliance, financial health and geopolitical exposure." },
  { icon: Zap, title: "Workflow Automation", desc: "Connect Notion, Zoho, WhatsApp and email to orchestrate every step of your supply chain." },
];

export function Features() {
  return (
    <section id="features" className="relative py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-20">
          <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6">— Capabilities</p>
          <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-balance">
            An intelligence layer for <span className="italic gradient-text">global fashion</span> operations.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            Ten modules engineered to compress months of sourcing work into a single afternoon.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-border rounded-3xl overflow-hidden">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: (i % 5) * 0.08 }}
              className="group relative bg-background p-8 hover:bg-accent/40 transition-colors"
            >
              <div className="size-11 rounded-xl glass flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <f.icon className="size-5 text-electric" />
              </div>
              <h3 className="text-base font-medium mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              <div className="absolute top-6 right-6 text-[10px] text-muted-foreground/50 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
