import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";

export interface Testimonial {
  id: string;
  created_at?: string;
  quote: string;
  name: string;
  role: string;
}

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: "mock-t1",
    quote: "Maisone's AI insights helped us predict the linen trend six months before our competitors. We secured capacity at the best mills and launched perfectly on time.",
    name: "Aiko Tanaka",
    role: "Head of Production · Maison Kyō",
  },
  {
    id: "mock-t2",
    quote: "The transparency is unmatched. I can track my entire cashmere order from the raw fiber in Mongolia to the spun yarn in Italy, all on one dashboard.",
    name: "Oliver Hartwell",
    role: "Founder · Atelier LDN",
  },
  {
    id: "mock-t3",
    quote: "We used to spend weeks auditing factories. Maisone's pre-vetted network of compliant manufacturers allowed us to scale our organic cotton line overnight.",
    name: "Camille Laurent",
    role: "COO · North/Paris",
  },
];

export function Testimonials() {
  const { t } = useLanguage();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const query = supabase
          .from("testimonials")
          .select("*")
          .order("created_at", { ascending: false });

        const timeout = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 2000)
        );

        const { data, error } = await (Promise.race([query, timeout]) as Promise<any>);

        if (error) throw error;
        setItems(data || []);
      } catch (err) {
        console.warn("Supabase testimonials fetch failed, loading from LocalStorage:", err);
        const local = localStorage.getItem("maisone_testimonials_v1");
        if (local) {
          setItems(JSON.parse(local));
        } else {
          setItems(MOCK_TESTIMONIALS);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6">{t("testimonials.label")}</p>
          <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-balance">
            {t("testimonials.heading")} <span className="italic gradient-text">{t("testimonials.headingHighlight")}</span>{t("testimonials.headingEnd")}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((tItem, i) => (
            <motion.figure
              key={tItem.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-strong rounded-3xl p-8 flex flex-col justify-between min-h-[280px]"
            >
              <blockquote className="font-serif text-xl leading-snug text-balance">
                "{tItem.quote}"
              </blockquote>
              <figcaption className="mt-8">
                <p className="text-sm font-medium">{tItem.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{tItem.role}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
