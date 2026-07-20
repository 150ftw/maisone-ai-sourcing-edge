import { motion } from "framer-motion";
import { Target, Eye } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function About() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLHeadingElement>(null);
  const bgImagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (sectionRef.current) {
      if (bgTextRef.current) {
        gsap.to(bgTextRef.current, {
          xPercent: -20,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          }
        });
      }
      
      if (bgImagesRef.current) {
        gsap.to(bgImagesRef.current, {
          xPercent: -15, // slightly slower for parallax depth
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          }
        });
      }
    }
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative py-32 flex flex-col justify-center min-h-[90vh]">
      {/* Background Images Layer (Faint) */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[250%] h-[70vh] pointer-events-none z-0 overflow-hidden opacity-20">
        <div ref={bgImagesRef} className="w-full h-full flex items-center justify-around gap-8 px-8">
          <img src="/Collection/Contemporary Ready to wear/a8bd5aab-32c3-41b9-aa9e-3069ce14c649.JPG" alt="" className="w-48 md:w-80 aspect-[3/4] object-cover rounded-2xl shadow-xl shadow-black/20" />
          <img src="/Collection/Couture/image.png" alt="" className="w-48 md:w-80 aspect-square object-cover rounded-2xl mt-32 shadow-xl shadow-black/20" />
          <img src="/Collection/Contemporary Ready to wear/e68f411a-661f-4aa7-994c-a0e1862d2849 3.jpg" alt="" className="w-48 md:w-80 aspect-[4/5] object-cover rounded-2xl mb-20 shadow-xl shadow-black/20" />
          <img src="/Collection/Denim/8a7d1d6b-9b2d-4f30-bc67-9a13ec8ed07a.png" alt="" className="w-48 md:w-80 aspect-[3/4] object-cover rounded-2xl mt-12 shadow-xl shadow-black/20" />
          <img src="/Collection/Contemporary Ready to wear/d39b0b24-051a-4216-8007-0ff7dae8c983 2.jpg" alt="" className="w-48 md:w-80 aspect-[3/4] object-cover rounded-2xl hidden lg:block shadow-xl shadow-black/20" />
          <img src="/Collection/Couture/image copy.png" alt="" className="w-48 md:w-80 aspect-square object-cover rounded-2xl mb-32 hidden xl:block shadow-xl shadow-black/20" />
        </div>
      </div>

      {/* Editorial Background Text */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[200%] pointer-events-none z-0 overflow-hidden opacity-[0.03] flex items-center">
        <h1 ref={bgTextRef} className="font-serif text-[18vw] leading-none whitespace-nowrap text-transparent font-bold" style={{ WebkitTextStroke: "2px var(--foreground)" }}>
          MAISONE GLOBAL SOURCING
        </h1>
      </div>

      <div className="mx-auto max-w-7xl px-6 relative z-10 w-full">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-8">{t("about.label")} —</p>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
            className="font-serif text-5xl sm:text-7xl tracking-tight text-balance leading-[1.1]"
          >
            {t("about.heading")} <span className="italic gradient-text">{t("about.headingHighlight")}</span>{t("about.headingEnd")}
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.4, ease: [0.76, 0, 0.24, 1] }}
            className="mt-10 space-y-6 text-muted-foreground leading-relaxed text-lg sm:text-xl max-w-2xl text-center"
          >
            <p>
              {t("about.p1")}
            </p>
            <p>
              {t("about.p2")}
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-32 max-w-5xl mx-auto">
          {[
            {
              icon: Target,
              label: t("about.missionLabel"),
              text: t("about.missionText"),
              delay: 0.2
            },
            {
              icon: Eye,
              label: t("about.visionLabel"),
              text: t("about.visionText"),
              delay: 0.4
            },
          ].map((b) => (
            <motion.div 
              key={b.label} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: b.delay, ease: [0.76, 0, 0.24, 1] }}
              className="glass-strong rounded-3xl p-10 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-electric/5 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700" />
              <div className="size-12 rounded-2xl bg-electric/10 flex items-center justify-center mb-8 relative z-10 group-hover:bg-electric/20 transition-colors duration-500 border border-electric/10">
                <b.icon className="size-6 text-electric" />
              </div>
              <p className="text-xs uppercase tracking-[0.3em] text-electric mb-4 relative z-10 font-medium">— {b.label}</p>
              <p className="font-serif text-2xl sm:text-3xl leading-snug text-balance relative z-10">{b.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
