import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Factory, Loader2 } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { Logo } from "@/components/maisone/Logo";
import { supabase } from "@/lib/supabase";

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
  categories: string[];
  moq: string;
  leadTime: string;
  message: string;
};

const STEPS = ["Factory details", "Capabilities"];

function SupplierRequestPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Form>({
    fullName: "",
    workEmail: "",
    factoryName: "",
    region: "India",
    categories: ["Apparel"],
    moq: "100–500 units",
    leadTime: "4–6 weeks",
    message: "",
  });

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const canNext =
    (step === 0 && form.fullName.trim() && form.workEmail.includes("@") && form.factoryName.trim()) ||
    step === 1;

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
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
            lead_time: form.leadTime,
            message: form.message,
            status: "Pending",
          },
        ]);

      if (insertError) {
        throw new Error(insertError.message);
      }
      setSubmitted(true);
    } catch (err: any) {
      console.error("Failed to submit request:", err);
      setError(err.message || "Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider>
      <div className="relative min-h-screen noise overflow-x-hidden">
        <div className="absolute inset-0 hero-aura pointer-events-none" />
        <header className="relative z-10 mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
          <Link to="/"><Logo /></Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Back to site
          </Link>
        </header>

        <main className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-6 grid lg:grid-cols-5 gap-10">
          {/* Left intro */}
          <aside className="lg:col-span-2 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
              <Factory className="size-3 text-electric" /> Partner Network
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl tracking-tight text-balance">
              Join the <span className="italic gradient-text">Maisone</span> global supply network.
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Connect directly with premium fashion brands and designers looking for verified, high-quality manufacturers.
            </p>
            <ul className="space-y-3 text-sm">
              {[
                "Direct access to pre-vetted fashion brands",
                "Streamlined communication and project management",
                "Guaranteed secure payments",
                "Showcase your capabilities globally",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="mt-1 size-4 rounded-full bg-electric/15 flex items-center justify-center">
                    <Check className="size-2.5 text-electric" />
                  </span>
                  <span className="text-muted-foreground">{b}</span>
                </li>
              ))}
            </ul>
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
                  <h2 className="font-serif text-3xl mb-3">Application Received</h2>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    Thank you, {form.fullName.split(" ")[0] || "there"}. Our sourcing team will review your application and contact you at <span className="text-foreground">{form.workEmail}</span> shortly.
                  </p>
                  <button
                    onClick={() => navigate({ to: "/" })}
                    className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background text-sm font-medium hover:scale-[1.02] transition-transform"
                  >
                    Return home <ArrowRight className="size-4" />
                  </button>
                </motion.div>
              ) : (
                <>
                  {/* steps */}
                  <div className="flex items-center justify-between mb-8">
                    {STEPS.map((s, i) => (
                      <div key={s} className="flex-1 flex items-center">
                        <div className={`size-7 rounded-full flex items-center justify-center text-[11px] tabular-nums border ${
                          i <= step ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground"
                        }`}>{i + 1}</div>
                        {i < STEPS.length - 1 && (
                          <div className={`flex-1 h-px mx-2 ${i < step ? "bg-foreground" : "bg-border"}`} />
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">— Step {step + 1} of {STEPS.length}</p>
                  <h2 className="font-serif text-2xl mb-6">{STEPS[step]}</h2>

                  <div className="space-y-4">
                    {step === 0 && (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Field label="Contact name" value={form.fullName} onChange={(v) => set("fullName", v)} placeholder="Takeshi Kaneshiro" />
                          <Field label="Work email" type="email" value={form.workEmail} onChange={(v) => set("workEmail", v)} placeholder="contact@factory.com" />
                        </div>
                        <Field label="Factory name" value={form.factoryName} onChange={(v) => set("factoryName", v)} placeholder="Osaka Denim Mill" />
                        <Select label="Region" value={form.region} onChange={(v) => set("region", v)}
                          options={["India", "China", "Vietnam", "Japan", "Portugal", "Italy", "Turkey", "Other"]} />
                      </>
                    )}
                    {step === 1 && (
                      <>
                        <MultiSelect label="Primary Category" value={form.categories} onChange={(v) => set("categories", v)}
                          options={["Apparel", "Denim", "Knitwear", "Leather Goods", "Footwear", "Accessories", "Textiles"]} />
                        <Select label="Minimum Order Quantity (MOQ)" value={form.moq} onChange={(v) => set("moq", v)}
                          options={["< 100 units", "100–500 units", "500–1000 units", "1000+ units"]} />
                        <Select label="Average Lead Time" value={form.leadTime} onChange={(v) => set("leadTime", v)}
                          options={["2–4 weeks", "4–6 weeks", "6–8 weeks", "8+ weeks"]} />
                        <div>
                          <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Additional Capabilities</label>
                          <textarea
                            value={form.message}
                            onChange={(e) => set("message", e.target.value)}
                            rows={3}
                            placeholder="Tell us about your certifications, special techniques, or machinery..."
                            className="mt-2 w-full rounded-xl bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-electric"
                          />
                        </div>
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
                      <ArrowLeft className="size-4" /> Back
                    </button>
                    {step < STEPS.length - 1 ? (
                      <button
                        onClick={() => canNext && setStep((s) => s + 1)}
                        disabled={!canNext}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background text-sm font-medium disabled:opacity-40 hover:scale-[1.02] transition-transform"
                      >
                        Continue <ArrowRight className="size-4" />
                      </button>
                    ) : (
                      <button
                        onClick={submit}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background text-sm font-medium hover:scale-[1.02] transition-transform disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            Submitting... <Loader2 className="size-4 animate-spin" />
                          </>
                        ) : (
                          <>
                            Submit application <ArrowRight className="size-4" />
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
            className={`px-3.5 py-2 rounded-full text-xs border transition-colors ${
              value === o ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground"
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
              className={`px-3.5 py-2 rounded-full text-xs border transition-colors ${
                isSelected ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground"
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
