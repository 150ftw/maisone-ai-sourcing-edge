import { Logo } from "./Logo";
import { ArrowUpRight } from "lucide-react";

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
            className="flex items-center gap-2 glass-strong rounded-full p-2 max-w-md w-full lg:justify-self-end"
          >
            <input
              type="email"
              placeholder="your@maison.com"
              className="flex-1 bg-transparent outline-none px-4 text-sm placeholder:text-muted-foreground"
            />
            <button className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90">
              Request access <ArrowUpRight className="size-3.5" />
            </button>
          </form>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 py-16">
          <div className="col-span-2">
            <Logo />
            <p className="mt-5 text-sm text-muted-foreground max-w-xs">
              AI-powered fashion sourcing across Japan, the United Kingdom, Europe and the United States.
            </p>
            <div className="mt-6 text-xs text-muted-foreground space-y-1">
              <p>hello@maisone.global</p>
              <p>Tokyo · London · Paris · New York</p>
            </div>
          </div>

          {[
            { title: "Platform", links: ["Features", "Dashboard", "Automation", "Integrations"] },
            { title: "Company", links: ["About", "Careers", "Press", "Contact"] },
            { title: "Legal", links: ["Privacy", "Terms", "Security", "Compliance"] },
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
