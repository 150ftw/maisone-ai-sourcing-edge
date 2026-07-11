import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, Mail, Key, Eye } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/maisone/Navbar";
import { Footer } from "@/components/maisone/Footer";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy & Data Security — Maisone Global" },
      { name: "description", content: "Learn how Maisone Global protects corporate data, manufacturing CAD files, and contact details." }
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <ThemeProvider>
      <div className="relative min-h-screen noise overflow-x-hidden flex flex-col justify-between">
        <Navbar />
        <div className="absolute inset-0 hero-aura pointer-events-none opacity-40" />

        <main className="relative z-10 mx-auto max-w-4xl px-6 pt-32 pb-24 flex-grow w-full space-y-12">
          {/* Header */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-electric transition-colors uppercase tracking-wider mb-6">
              <ArrowLeft className="size-4" /> Back to home
            </Link>
            <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-4">— Legal & Security</p>
            <h1 className="font-serif text-4xl sm:text-5xl text-white tracking-tight leading-tight">
              Privacy & Data <span className="italic gradient-text font-serif">Protection Policy</span>.
            </h1>
            <p className="text-xs text-muted-foreground mt-2">Last Updated: July 11, 2026</p>
          </div>

          {/* Policy Document */}
          <div className="glass-strong rounded-3xl p-8 border border-white/5 space-y-8 text-sm text-muted-foreground/80 leading-relaxed max-w-3xl">
            
            <section className="space-y-3">
              <div className="flex gap-2 items-center text-white font-serif text-lg">
                <Eye className="size-4 text-electric" />
                <h3>1. Scope & Data Controller</h3>
              </div>
              <p>
                This Privacy Policy outlines how Maisone Global ("we", "our", or "us") collects, secures, and processes corporate and personal information. When you use our platform, book inquiries, or submit manufacturing designs, Maisone Global acts as the primary data controller under GDPR and CCPA regulations.
              </p>
            </section>

            <section className="space-y-3">
              <div className="flex gap-2 items-center text-white font-serif text-lg">
                <ShieldCheck className="size-4 text-electric" />
                <h3>2. Information We Collect</h3>
              </div>
              <p>
                To provide sourcing matching and capacity planning, we collect:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li><strong>Corporate Details:</strong> Company name, country of operation, company size, and sourcing category profiles.</li>
                <li><strong>Contact Information:</strong> Full names, work emails, and phone numbers.</li>
                <li><strong>Manufacturing Data:</strong> Tech packs, pattern grading measurements, material specifications, and design assets.</li>
                <li><strong>Technical Logs:</strong> IP address, device telemetry, browser cookies, and platform navigation metrics.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <div className="flex gap-2 items-center text-white font-serif text-lg">
                <Key className="size-4 text-electric" />
                <h3>3. Data Protection & Supabase Security</h3>
              </div>
              <p>
                Sourcing specifications and brand designs represent high-value intellectual property. We secure all data using enterprise-grade Supabase Postgres security configurations. Row Level Security (RLS) policies prevent unauthorized access, and database logs are encrypted using AES-256 protocols both in transit and at rest.
              </p>
            </section>

            <section className="space-y-3">
              <h3>4. Third-Party Sharing</h3>
              <p>
                We do not sell, license, or rent design plans or contact profiles to broker networks or marketing companies. We share information only with:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li><strong>Approved Factories:</strong> Technical specifications are shared with selected ateliers for quoting and sampling.</li>
                <li><strong>Logistics Partners:</strong> Shipping addresses are shared with customs brokers and freight forwarders for delivery.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3>5. Your Rights (GDPR & CCPA)</h3>
              <p>
                Depending on your region, you have the right to request access to your data, request deletion, restrict processing, or request portability. Sourcing managers can request deletion of active tech packs or contact information by emailing our support desk.
              </p>
            </section>

            <section className="space-y-3 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5"><Mail className="size-3.5 text-electric" /> security@maisone.com</span>
              <span>Maisone Security Office, Gurgaon, India</span>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}
