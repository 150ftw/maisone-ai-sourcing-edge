import { motion } from "framer-motion";
import {
  Leaf,
  BadgeCheck,
  Building2,
  Users,
  CheckCircle2,
  FileCheck2,
  Zap,
  Award,
  Search,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function ExtraMile() {
  const { t } = useLanguage();

  const COMPLIANCE = [
    { icon: BadgeCheck, label: "BSCI", sub: t("extraMile.socialCompliance") },
    { icon: Leaf, label: "OCS 100", sub: t("extraMile.organicContent") },
    { icon: Leaf, label: "GOTS", sub: t("extraMile.organicTextiles") },
    { icon: Building2, label: "LEED", sub: t("extraMile.environmentalDesign") },
    { icon: Users, label: "Sedex", sub: t("extraMile.ethicalSupplyChain") },
    { icon: CheckCircle2, label: "REACH", sub: t("extraMile.chemicalCompliance") },
    { icon: FileCheck2, label: "Intertek", sub: t("extraMile.qualityAssurance") },
    { icon: Zap, label: "UL Solutions", sub: t("extraMile.safetyCertification") },
    { icon: Award, label: "ISO 9001", sub: t("extraMile.qualityManagement") },
    { icon: Search, label: "SGS", sub: t("extraMile.inspectionTesting") },
  ];

  return (
    <section id="extra-mile" className="relative pt-16 pb-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Compliance */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6">
            — {t("extraMile.label")}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {COMPLIANCE.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="glass rounded-2xl p-4 border border-border hover:border-electric/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full border border-electric/20 bg-electric/10 flex items-center justify-center">
                    <c.icon className="size-4 text-electric" />
                  </div>
                  <div>
                    <p className="text-sm">{c.label}</p>
                    <p className="text-[10px] text-muted-foreground">{c.sub}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
