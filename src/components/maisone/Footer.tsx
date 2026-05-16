import { Logo } from "./Logo";
import { ArrowUpRight, Mail, MessageCircle, MapPin } from "lucide-react";

const offices = [
  { city: "New York", region: "United States" },
  { city: "London", region: "United Kingdom" },
  { city: "Milan", region: "Italy" },
  { city: "Paris", region: "France" },
  { city: "Mumbai", region: "India" },
  { city: "Tokyo", region: "Japan" },
  { city: "Buenos Aires", region: "Argentina" },
];

export function Footer() {
  return (
    <footer id="contact" className="relative pt-24 pb-10 border-t border-border mt-12">
      <div className="mx-auto max-w-7xl px-6">
        {/* CTA */}
        <div className="grid lg:grid-cols-2 gap-10 items-end pb-20 border-b border-border">
          <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-balance max-w-xl">
            Build the next chapter of your <span className="italic gradient-text">house</span>.
          </h2>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-3 max-w-md w-full lg:justify-self-end"
          >
            <input
              type="text"
              placeholder="Your name"
              className="w-full glass rounded-2xl px-5 py-3.5 text-sm outline-none placeholder:text-muted-foreground"
            />
            <input
              type="email"
              placeholder="your@maison.com"
              className="w-full glass rounded-2xl px-5 py-3.5 text-sm outline-none placeholder:text-muted-foreground"
            />
            <textarea
              placeholder="Tell us about your brand and sourcing needs…"
              rows={3}
              className="w-full glass rounded-2xl px-5 py-3.5 text-sm outline-none placeholder:text-muted-foreground resize-none"
            />
            <button className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90">
              Send inquiry <ArrowUpRight className="size-3.5" />
            </button>
          </form>
        </div>

        {/* Contact strip */}
        <div className="grid md:grid-cols-3 gap-4 py-12 border-b border-border">
          <a href="mailto:hello@maisone.global" className="glass-strong rounded-2xl p-5 flex items-center gap-4 hover:border-electric/40 transition-colors">
            <div className="size-10 rounded-xl bg-electric/15 flex items-center justify-center"><Mail className="size-4 text-electric" /></div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Email</p>
              <p className="text-sm mt-0.5">hello@maisone.global</p>
            </div>
          </a>
          <a href="https://wa.me/000000000" className="glass-strong rounded-2xl p-5 flex items-center gap-4 hover:border-electric/40 transition-colors">
            <div className="size-10 rounded-xl bg-emerald-500/15 flex items-center justify-center"><MessageCircle className="size-4 text-emerald-400" /></div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">WhatsApp</p>
              <p className="text-sm mt-0.5">Chat with our team</p>
            </div>
          </a>
          <a href="#contact" className="glass-strong rounded-2xl p-5 flex items-center gap-4 hover:border-electric/40 transition-colors">
            <div className="size-10 rounded-xl bg-violet-500/15 flex items-center justify-center"><MapPin className="size-4 text-violet-300" /></div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Global Offices</p>
              <p className="text-sm mt-0.5">7 cities · 4 continents</p>
            </div>
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 py-16">
          <div className="col-span-2">
            <Logo />
            <p className="mt-5 text-sm text-muted-foreground max-w-xs">
              Built on trust, transparency, and craftsmanship.
            </p>
            <div className="mt-6 text-xs text-muted-foreground space-y-1">
              <p>hello@maisone.global</p>
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-5">Offices</p>
            <ul className="space-y-3">
              {offices.map((o) => (
                <li key={o.city} className="text-sm">
                  <span className="text-foreground">{o.city}</span>
                  <span className="text-muted-foreground"> · {o.region}</span>
                </li>
              ))}
            </ul>
          </div>

          {[
            { title: "Company", links: ["About", "How We Work", "Founders", "Case Studies"] },
            { title: "Legal", links: ["Privacy", "Terms", "Compliance", "Sustainability"] },
          ].map((c) => (
            <div key={c.title}>
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-5">{c.title}</p>
              <ul className="space-y-3">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm hover:text-electric transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-border text-xs text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} Maisone Global. All rights reserved.</p>
          <div className="flex gap-5">
            {["Instagram", "LinkedIn", "X", "Vimeo"].map((s) => (
              <a key={s} href="#" className="hover:text-foreground transition-colors">{s}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
