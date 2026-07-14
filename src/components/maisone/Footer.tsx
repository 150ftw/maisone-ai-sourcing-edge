import { Logo } from "./Logo";
import { ArrowUpRight, Mail, MessageCircle, MapPin } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/lib/i18n";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer id="contact" className="relative pt-12 pb-10 border-t border-border mt-12">
      <div className="mx-auto max-w-7xl px-6">

        <div className="grid grid-cols-1 md:grid-cols-6 gap-10 py-16">
          <div className="col-span-2">
            <Logo />
            <p className="mt-5 text-sm text-muted-foreground max-w-xs">
              {t("footer.tagline")}
            </p>
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">{t("footer.headOffice")}</p>
                <p className="text-xs text-foreground/80 leading-relaxed">
                  {t("footer.addressLine1")}<br />
                  {t("footer.addressLine2")}
                </p>
              </div>
              <div className="text-xs text-muted-foreground">
                <p>info@maisone.com</p>
              </div>
            </div>
          </div>

          {[
            {
              title: t("footer.company"),
              links: [
                { name: t("footer.aboutLink"), to: "/about" },
                { name: t("footer.howWeWorkLink"), to: "/how-we-work" },
                { name: t("footer.foundersLink"), to: "/founders" },
                { name: t("footer.blogLink"), to: "/#blog" },
              ],
            },
            {
              title: t("footer.suppliers"),
              links: [{ name: t("footer.joinNetwork"), to: "/supplier-request" }],
            },
            {
              title: t("footer.legal"),
              links: [
                { name: t("footer.privacy"), to: "/privacy" },
                { name: t("footer.terms"), to: "/terms" },
                { name: t("footer.compliance"), to: "/compliance" },
                { name: t("footer.sustainability"), to: "/sustainability" },
              ],
            },
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
          <p>© {new Date().getFullYear()} Maisone Global. {t("footer.allRightsReserved")}</p>
          <div className="flex gap-5">
            {[
              { name: "Instagram", url: "https://www.instagram.com/maisone.global?igsh=MTN0d3Q4dzZrcHZlcg%3D%3D&utm_source=qr" },
              { name: "LinkedIn", url: "https://www.linkedin.com/company/maisonè-global/?viewAsMember=true" },
              { name: "Email", url: "mailto:info@maisone.com" }
            ].map((s) => {
              const isMailto = s.url.startsWith("mailto:");
              return (
                <a 
                  key={s.name} 
                  href={s.url} 
                  target={isMailto ? undefined : "_blank"} 
                  rel={isMailto ? undefined : "noopener noreferrer"} 
                  className="hover:text-foreground transition-colors"
                >
                  {s.name}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
