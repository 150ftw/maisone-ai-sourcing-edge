import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Factory, Loader2 } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { Logo } from "@/components/maisone/Logo";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/lib/i18n";
import { SettingsMenu } from "@/components/maisone/SettingsMenu";

export const Route = createFileRoute("/supplier-request")({
  head: () => ({
    meta: [
      { title: "Join as a Supplier — Maisone" },
      { name: "description", content: "Apply to become a verified manufacturing partner on Maisone." },
    ],
  }),
  component: SupplierRequestPage,
});

type Form = {
  fullName: string;
  workEmail: string;
  factoryName: string;
  region: string;
  clientele: string;

  categories: string[];
  capabilities: string;
  fabrics: string;
  productionCapacity: string;
  moq: string;
  samplingLeadTime: string;
  productionLeadTime: string;

  qualityControl: string;
  certifications: string;
  sustainability: string;
  compliance: string;
  paymentTerms: string;
};

function SupplierRequestPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [categoriesList, setCategoriesList] = useState([
    "Apparel", "Denim", "Knitwear", "Leather Goods", "Footwear", "Accessories", "Textiles"
  ]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Form>({
    fullName: "",
    workEmail: "",
    factoryName: "",
    region: "India",
    clientele: "",
    categories: ["Apparel"],
    capabilities: "",
    fabrics: "",
    productionCapacity: "",
    moq: "100–500 units",
    samplingLeadTime: "",
    productionLeadTime: "",
    qualityControl: "",
    certifications: "",
    sustainability: "",
    compliance: "",
    paymentTerms: "30% Deposit, 70% Balance",
  });

  const STEPS = ["Company Profile", "Capabilities & Production", "Standards & Terms"];

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const canNext =
    (step === 0 && form.fullName.trim() && form.workEmail.includes("@") && form.factoryName.trim()) ||
    (step === 1 && form.categories.length > 0 && form.fabrics.trim() && form.productionLeadTime.trim()) ||
    step === 2;

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const formattedMessage = `
--- Company Profile & Clientele ---
Clientele: ${form.clientele || "Not specified"}

--- Capabilities & Production ---
Fabrics we work with: ${form.fabrics}
Manufacturing capabilities: ${form.capabilities || "Not specified"}
Production capacity: ${form.productionCapacity || "Not specified"}
Sampling lead time: ${form.samplingLeadTime || "Not specified"}

--- Standards, Compliance & Terms ---
Quality control: ${form.qualityControl || "Not specified"}
Certifications: ${form.certifications || "Not specified"}
Sustainability: ${form.sustainability || "Not specified"}
Compliance: ${form.compliance || "Not specified"}
Payment terms: ${form.paymentTerms}
`.trim();

      const { error: insertError } = await supabase
        .from("supplier_requests")
        .insert([
          {
            full_name: form.fullName,
            work_email: form.workEmail,
            factory_name: form.factoryName,
            region: form.region,
            categories: form.categories,
            moq: form.moq,
            lead_time: form.productionLeadTime,
            message: formattedMessage,
            status: "Pending",
          },
        ]);

      if (insertError) {
        throw new Error(insertError.message);
      }
      setSubmitted(true);
    } catch (err: any) {
      console.error("Failed to submit request:", err);
      setError(err.message || t("bookDemo.errorGeneric"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider>
      <div className="relative min-h-screen noise overflow-x-hidden">
        <div className="absolute inset-0 hero-aura pointer-events-none" />

        <div className="fixed right-6 top-6 z-50">
          <SettingsMenu />
        </div>

        <header className="relative z-10 mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
          <Link to="/"><Logo /></Link>
          <div className="flex items-center gap-6">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="size-4" /> {t("nav.backToHome")}
            </Link>
          </div>
        </header>

        <main className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-6 grid lg:grid-cols-5 gap-10">
          {/* Left intro */}
          <aside className="lg:col-span-2 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
              <Factory className="size-3 text-electric" /> Supplier Request
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl tracking-tight text-balance">
              Partner with <span className="italic gradient-text">Maisone</span>.
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Submit your manufacturing profile to join our global network of verified suppliers and luxury fashion ateliers.
            </p>
          </aside>

          {/* Right form */}
          <section className="lg:col-span-3">
            <div className="glass-strong rounded-3xl p-6 sm:p-8">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-12 text-center"
                >
                  <div className="mx-auto size-14 rounded-full bg-electric/15 flex items-center justify-center mb-6">
                    <Check className="size-6 text-electric" />
                  </div>
                  <h2 className="font-serif text-3xl mb-3">{t("supplierRequest.thankYou")}</h2>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    {t("supplierRequest.thankYouText")}
                  </p>
                  <button
                    onClick={() => navigate({ to: "/" })}
                    className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background text-sm font-medium hover:scale-[1.02] transition-transform"
                  >
                    {t("supplierRequest.returnHome")} <ArrowRight className="size-4" />
                  </button>
                </motion.div>
              ) : (
                <>
                  {/* steps */}
                  <div className="flex items-center justify-between mb-8">
                    {STEPS.map((s, i) => (
                      <div key={s} className="flex-1 flex items-center">
                        <div className={`size-7 rounded-full flex items-center justify-center text-[11px] tabular-nums border ${i <= step ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground"
                          }`}>{i + 1}</div>
                        {i < STEPS.length - 1 && (
                          <div className={`flex-1 h-px mx-2 ${i < step ? "bg-foreground" : "bg-border"}`} />
                        )}
                      </div>
                    ))}
                  </div>

                  <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">— Step {step + 1} of {STEPS.length}</p>
                  <h2 className="font-serif text-2xl mb-6">{STEPS[step]}</h2>

                  <div className="space-y-6">
                    {step === 0 && (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Field label={t("supplierRequest.contactPerson")} value={form.fullName} onChange={(v) => set("fullName", v)} placeholder="Takeshi Kaneshiro" />
                          <Field label={t("supplierRequest.email")} type="email" value={form.workEmail} onChange={(v) => set("workEmail", v)} placeholder="contact@factory.com" />
                        </div>
                        <Field label="Company / Factory Name" value={form.factoryName} onChange={(v) => set("factoryName", v)} placeholder="Osaka Denim Mill" />
                        <Select label="Country of Operation" value={form.region} onChange={(v) => set("region", v)}
                          options={["Japan", "United Kingdom", "Europe", "United States", "India", "China", "Other"]} />
                        <Field label="Clientele (Brands you work with)" value={form.clientele} onChange={(v) => set("clientele", v)} placeholder="e.g., Acne Studios, APC, Jacquemus" />
                      </>
                    )}
                    {step === 1 && (
                      <>
                        <MultiSelect label="Product Categories" value={form.categories} onChange={(v) => set("categories", v)}
                          options={categoriesList} />

                        <div className="flex items-center gap-2 mt-2">
                          <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Add custom category..."
                            className="rounded-xl bg-background border border-border px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-electric w-48"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const trimmed = newCategoryName.trim();
                              if (trimmed && !categoriesList.includes(trimmed)) {
                                setCategoriesList(prev => [...prev, trimmed]);
                                set("categories", [...form.categories, trimmed]);
                                setNewCategoryName("");
                              }
                            }}
                            className="bg-foreground text-background rounded-full px-4 py-2 text-xs font-semibold hover:scale-102 transition-transform cursor-pointer"
                          >
                            + Add Category
                          </button>
                        </div>

                        <Field label="Fabrics You Work With" value={form.fabrics} onChange={(v) => set("fabrics", v)} placeholder="e.g., Organic Cotton, Linen, Selvedge Denim, Silk" />

                        <div>
                          <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Manufacturing Capabilities</label>
                          <textarea
                            value={form.capabilities}
                            onChange={(e) => set("capabilities", e.target.value)}
                            rows={3}
                            placeholder="Tell us about your special machinery, techniques, washings, embroidery..."
                            className="mt-2 w-full rounded-xl bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-electric"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Field label="Production Capacity (Monthly)" value={form.productionCapacity} onChange={(v) => set("productionCapacity", v)} placeholder="e.g., 50,000 units" />
                          <Select label="MOQ (Minimum Order Quantity)" value={form.moq} onChange={(v) => set("moq", v)}
                            options={["< 100 units", "100–500 units", "500–1000 units", "1000+ units"]} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Field label="Sampling Lead Time" value={form.samplingLeadTime} onChange={(v) => set("samplingLeadTime", v)} placeholder="e.g., 7–14 days" />
                          <Field label="Production Lead Time" value={form.productionLeadTime} onChange={(v) => set("productionLeadTime", v)} placeholder="e.g., 4–6 weeks" />
                        </div>
                      </>
                    )}
                    {step === 2 && (
                      <>
                        <div>
                          <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Quality Control</label>
                          <textarea
                            value={form.qualityControl}
                            onChange={(e) => set("qualityControl", e.target.value)}
                            rows={2}
                            placeholder="Describe your quality check process or standards (e.g. AQL 2.5)..."
                            className="mt-2 w-full rounded-xl bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-electric"
                          />
                        </div>

                        <Field label="Certifications" value={form.certifications} onChange={(v) => set("certifications", v)} placeholder="e.g., GOTS, OEKO-TEX, GRS, BSCI" />

                        <div>
                          <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Sustainability Practices</label>
                          <textarea
                            value={form.sustainability}
                            onChange={(e) => set("sustainability", e.target.value)}
                            rows={2}
                            placeholder="Eco-friendly raw materials, energy saving, zero water waste..."
                            className="mt-2 w-full rounded-xl bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-electric"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Compliance & Labor Standards</label>
                          <textarea
                            value={form.compliance}
                            onChange={(e) => set("compliance", e.target.value)}
                            rows={2}
                            placeholder="Working hours, safety conditions, audit logs..."
                            className="mt-2 w-full rounded-xl bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-electric"
                          />
                        </div>

                        <Field label="Payment Terms" value={form.paymentTerms} onChange={(v) => set("paymentTerms", v)} placeholder="e.g., 30% Deposit, 70% Balance" />
                      </>
                    )}
                  </div>

                  {error && (
                    <div className="mb-6 rounded-xl bg-destructive/15 border border-destructive/30 p-4 text-xs text-destructive flex items-center justify-between">
                      <span>{error}</span>
                      <button onClick={() => setError(null)} className="hover:opacity-75">✕</button>
                    </div>
                  )}

                  <div className="mt-8 flex items-center justify-between">
                    <button
                      onClick={() => setStep((s) => Math.max(0, s - 1))}
                      disabled={step === 0 || loading}
                      className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 inline-flex items-center gap-2"
                    >
                      <ArrowLeft className="size-4" /> {t("bookDemo.back")}
                    </button>
                    {step < STEPS.length - 1 ? (
                      <button
                        onClick={() => canNext && setStep((s) => s + 1)}
                        disabled={!canNext}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background text-sm font-medium disabled:opacity-40 hover:scale-[1.02] transition-transform"
                      >
                        {t("bookDemo.next")} <ArrowRight className="size-4" />
                      </button>
                    ) : (
                      <button
                        onClick={submit}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background text-sm font-medium hover:scale-[1.02] transition-transform disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            {t("bookDemo.submitting")} <Loader2 className="size-4 animate-spin" />
                          </>
                        ) : (
                          <>
                            {t("supplierRequest.submit")} <ArrowRight className="size-4" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </section>
        </main>
      </div>
    </ThemeProvider>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-electric"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</label>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={`px-3.5 py-2 rounded-full text-xs border transition-colors ${value === o ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground"
              }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function MultiSelect({ label, value, onChange, options }: { label: string; value: string[]; onChange: (v: string[]) => void; options: string[] }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</label>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => {
          const isSelected = value.includes(o);
          return (
            <button
              key={o}
              type="button"
              onClick={() => {
                if (isSelected) {
                  onChange(value.filter((v) => v !== o));
                } else {
                  onChange([...value, o]);
                }
              }}
              className={`px-3.5 py-2 rounded-full text-xs border transition-colors ${isSelected ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground"
                }`}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}
