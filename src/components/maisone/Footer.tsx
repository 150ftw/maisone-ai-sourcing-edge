import { Logo } from "./Logo";
import { ArrowUpRight, Mail, MessageCircle, MapPin } from "lucide-react";
import { Link } from "@tanstack/react-router";



export function Footer() {
  return (
    <footer id="contact" className="relative pt-12 pb-10 border-t border-border mt-12">
      <div className="mx-auto max-w-7xl px-6">

        <div className="grid grid-cols-1 md:grid-cols-6 gap-10 py-16">
          <div className="col-span-2">
            <Logo />
            <p className="mt-5 text-sm text-muted-foreground max-w-xs">
              Built on trust, transparency, and craftsmanship.
            </p>
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">Head Office</p>
                <p className="text-xs text-foreground/80 leading-relaxed">
                  Plot 140, Udyog Vihar Industrial Area,<br />
                  Phase VI, Sector 37, Gurgaon - 122001
                </p>
              </div>
              <div className="text-xs text-muted-foreground">
                <p>info@maisone.com</p>
              </div>
            </div>
          </div>



          {[
            { title: "Company", links: [{name: "About", to: "/about"}, {name: "How We Work", to: "/how-we-work"}, {name: "Founders", to: "/founders"}, {name: "Blog", to: "/#blog"}] },
            { title: "Suppliers", links: [{name: "Join Network", to: "/supplier-request"}] },
            { title: "Legal", links: [{name: "Privacy", to: "/privacy"}, {name: "Terms", to: "/terms"}, {name: "Compliance", to: "/compliance"}, {name: "Sustainability", to: "/sustainability"}] },
          ].map((c) => (
            <div key={c.title} className="col-span-1">
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-5">{c.title}</p>
              <ul className="space-y-3">
                {c.links.map((l) => {
                  const hasHash = l.to.includes("#");
                  const [path, hash] = l.to.split("#");
                  return (
                    <li key={l.name}>
                      {hasHash ? (
                        <Link to={path as any} hash={hash} className="text-sm hover:text-electric transition-colors">{l.name}</Link>
                      ) : l.to.startsWith("/") ? (
                        <Link to={l.to as any} className="text-sm hover:text-electric transition-colors">{l.name}</Link>
                      ) : (
                        <a href={l.to} className="text-sm hover:text-electric transition-colors">{l.name}</a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-border text-xs text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} Maisone Global. All rights reserved.</p>
          <div className="flex gap-5">
            {["Instagram", "LinkedIn", "Facebook"].map((s) => (
              <a key={s} href="#" className="hover:text-foreground transition-colors">{s}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
