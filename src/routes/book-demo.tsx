import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Sparkles, Loader2 } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { Logo } from "@/components/maisone/Logo";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/book-demo")({
  head: () => ({
    meta: [
      { title: "Book a Demo — Maisone" },
      { name: "description", content: "Schedule a private demo of Maisone's AI fashion sourcing platform." },
      { property: "og:title", content: "Book a Demo — Maisone" },
      { property: "og:description", content: "Schedule a private demo of Maisone's AI fashion sourcing platform." },
    ],
  }),
  component: BookDemoPage,
});

type Form = {
  fullName: string;
  workEmail: string;
  company: string;
  role: string;
  companySize: string;
  region: string;
  category: string;
  monthlyVolume: string;
  timeline: string;
  message: string;
};

const STEPS = ["Your details", "Sourcing needs"];

function BookDemoPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Form>({
    fullName: "",
    workEmail: "",
    company: "",
    role: "",
    companySize: "11–50",
    region: "Europe",
    category: "Apparel",
    monthlyVolume: "1k–10k units",
    timeline: "1–3 months",
    message: "",
  });

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const canNext =
    (step === 0 && form.fullName.trim() && form.workEmail.includes("@") && form.company.trim()) ||
    step === 1;

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error: insertError } = await supabase
        .from("demo_requests")
        .insert([
          {
            full_name: form.fullName,
            work_email: form.workEmail,
            company: form.company,
            role: form.role,
            company_size: form.companySize,
            region: form.region,
            category: form.category,
            monthly_volume: form.monthlyVolume,
            timeline: form.timeline,
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
              <Sparkles className="size-3 text-electric" /> Request
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl tracking-tight text-balance">
              Meet the team behind <span className="italic gradient-text">Maisone</span>.
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              A 30-minute walkthrough tailored to your sourcing roadmap — covering supplier
              intelligence, real-time logistics, and the AI sourcing console.
            </p>
            <ul className="space-y-3 text-sm">
              {[
                "Live walkthrough of the sourcing console",
                "Personalised supplier shortlist for your category",
                "Q&A with a senior sourcing strategist",
                "No commitment — your data stays private",
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
                  <h2 className="font-serif text-3xl mb-3">Request received</h2>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    Thank you, {form.fullName.split(" ")[0] || "there"}. A Maisone strategist
                    will reach out at <span className="text-foreground">{form.workEmail}</span> within one business day.
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
                          <Field label="Full name" value={form.fullName} onChange={(v) => set("fullName", v)} placeholder="Yuki Tanaka" />
                          <Field label="Work email" type="email" value={form.workEmail} onChange={(v) => set("workEmail", v)} placeholder="you@brand.com" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Field label="Company" value={form.company} onChange={(v) => set("company", v)} placeholder="Maison Kyō" />
                          <Field label="Your role" value={form.role} onChange={(v) => set("role", v)} placeholder="Head of Sourcing" />
                        </div>
                        <Select label="Company size" value={form.companySize} onChange={(v) => set("companySize", v)}
                          options={["1–10", "11–50", "51–200", "201–1000", "1000+"]} />
                        <Select label="Primary region" value={form.region} onChange={(v) => set("region", v)}
                          options={["Japan", "United Kingdom", "Europe", "United States", "India", "China", "Global"]} />
                      </>
                    )}
                    {step === 1 && (
                      <>
                        <Select label="Category" value={form.category} onChange={(v) => set("category", v)}
                          options={["Apparel", "Denim", "Knitwear", "Leather Goods", "Footwear", "Accessories", "Textiles"]} />
                        <Select label="Monthly volume" value={form.monthlyVolume} onChange={(v) => set("monthlyVolume", v)}
                          options={["< 1k units", "1k–10k units", "10k–50k units", "50k–250k units", "250k+ units"]} />
                        <Select label="Sourcing timeline" value={form.timeline} onChange={(v) => set("timeline", v)}
                          options={["Immediate", "< 1 month", "1–3 months", "3–6 months", "Exploring"]} />
                        <div>
                          <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Anything else?</label>
                          <textarea
                            value={form.message}
                            onChange={(e) => set("message", e.target.value)}
                            rows={3}
                            placeholder="Tell us about your sourcing priorities…"
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
                            Submit request <ArrowRight className="size-4" />
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

function ReviewRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-6 py-2 border-b border-border last:border-0">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</span>
      <span className="text-right text-foreground/90 max-w-[60%]">{v}</span>
    </div>
  );
}
