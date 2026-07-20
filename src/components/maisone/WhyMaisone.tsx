import { useState, useEffect } from "react";
import { motion, Reorder } from "framer-motion";
import { Scissors, Shirt, Handshake, Sparkles, Check } from "lucide-react";
import abstractBg from "@/assets/fashion_startup_studio.png";
import { useLanguage } from "@/lib/i18n";
import { PatternHover } from "@/components/ui/PatternHover";
import { FashionConfetti } from "@/components/ui/FashionConfetti";

export function WhyMaisone() {
  const { t } = useLanguage();

  const cards = [
    {
      id: "card1",
      icon: Scissors,
      title: t("why.card1Title"),
      text: t("why.card1Text"),
    },
    {
      id: "card2",
      icon: Shirt,
      title: t("why.card2Title"),
      text: t("why.card2Text"),
    },
    {
      id: "card3",
      icon: Handshake,
      title: t("why.card3Title"),
      text: t("why.card3Text"),
    },
    {
      id: "card4",
      icon: Sparkles,
      title: t("why.card4Title"),
      text: t("why.card4Text"),
    },
  ];

  // Use primitive string IDs for Reorder to prevent reference recreation bugs during render
  const [order, setOrder] = useState(["card1", "card2", "card3", "card4"]);
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  // The perfect sequence: Shirt (card2), Scissors (card1), Sparkles (card4), Handshake (card3)
  const perfectAnswer = ["card2", "card1", "card4", "card3"];

  const checkAnswer = () => {
    const currentOrder = order.join(",");
    const targetOrder = perfectAnswer.join(",");
    
    if (currentOrder === targetOrder) {
      setIsSuccess(true);
      setIsError(false);
    } else {
      setIsError(true);
      setIsSuccess(false);
      setTimeout(() => setIsError(false), 2000);
    }
  };
  
  // Track window width for reorder axis
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section id="why" className="relative py-32">
      {/* Background glow orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-electric/20 rounded-full blur-[120px] pointer-events-none animate-float" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-violet-glow/15 rounded-full blur-[150px] pointer-events-none animate-pulse-glow" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl mb-16"
        >
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6"
          >
            {t("why.label")}
          </motion.p>
          <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-balance">
            {t("why.heading")} <span className="italic gradient-text">{t("why.headingHighlight")}</span>{t("why.headingEnd")}
          </h2>
          <p className="mt-4 text-sm text-muted-foreground animate-pulse">
            (Drag the cards below to reorder them)
          </p>
        </motion.div>

        <Reorder.Group
          axis={isMobile ? "y" : "x"}
          values={order}
          onReorder={setOrder}
          className="flex flex-col lg:flex-row gap-5"
        >
          {order.map((id) => {
            const c = cards.find(card => card.id === id)!;
            return (
              <Reorder.Item
                key={id}
                value={id}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="w-full lg:flex-1 group relative glass-strong rounded-3xl p-7 flex flex-col cursor-grab active:cursor-grabbing overflow-hidden shadow-xl"
              >
                {/* Stitched Border Animation */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ zIndex: 0 }}>
                  <rect x="2" y="2" width="calc(100% - 4px)" height="calc(100% - 4px)" rx="22" ry="22" 
                    fill="none" 
                    stroke="currentColor" 
                    className="text-electric/40 animate-stitch"
                    strokeWidth="1.5" 
                    strokeDasharray="6 6"
                  />
                </svg>
                <div className="relative z-10 h-full flex flex-col pointer-events-none">
                  <div className="size-12 rounded-2xl bg-gradient-to-br from-electric/20 to-violet-glow/20 flex items-center justify-center mb-6 shadow-glow transition-colors">
                    <c.icon className="size-5 text-electric group-hover:animate-pulse-glow" />
                  </div>
                  <h3 className="font-serif text-xl leading-snug group-hover:text-electric transition-colors duration-300">{c.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">{c.text}</p>
                </div>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>

        <div className="flex flex-col items-center mt-10">
          <motion.button
            onClick={checkAnswer}
            animate={isError ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            className={`px-8 py-3 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              isSuccess 
                ? "bg-electric text-white scale-105 shadow-glow" 
                : isError
                ? "bg-destructive/10 text-destructive border border-destructive/50"
                : "bg-background/50 border border-border text-foreground hover:bg-secondary/50 glass-strong"
            }`}
          >
            {isSuccess ? (
              <>
                <Check className="size-4" />
                Perfect Sequence!
              </>
            ) : isError ? (
              "Not quite right, try again"
            ) : (
              "Verify Sequence"
            )}
          </motion.button>
        </div>
        
        {isSuccess && <FashionConfetti duration={6000} />}

        {/* Startup & Low MOQ Callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-16 group glass rounded-3xl overflow-hidden border border-electric/20 bg-electric/[0.02] flex flex-col md:flex-row items-stretch justify-between gap-0"
        >
          <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric/10 border border-electric/30 w-fit text-[9px] tracking-[0.2em] uppercase text-electric font-semibold mb-6 shadow-[0_0_15px_rgba(194,164,109,0.2)]">
              <span className="size-1.5 rounded-full bg-electric animate-pulse" />
              {t("why.startupFriendly")}
            </span>
            <h3 className="font-serif text-3xl mb-4 text-foreground">{t("why.startupTitle")}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8">
              {t("why.startupText")}
            </p>
            <PatternHover rx={24} className="w-fit">
              <a
                href="/book-demo"
                className="px-6 py-3 w-fit rounded-full bg-foreground text-background text-sm font-medium hover:scale-[1.02] transition-transform whitespace-nowrap relative overflow-hidden group/btn flex items-center justify-center"
              >
                <span className="relative z-10 transition-colors">{t("why.launchYourBrand")}</span>
              </a>
            </PatternHover>
          </div>
          <div className="md:w-1/2 relative min-h-[300px] overflow-hidden [transform:translateZ(0)]">
            <img 
              src={abstractBg} 
              alt="Fashion Startup Studio" 
              className="absolute inset-0 w-full h-full object-cover origin-center animate-slow-zoom" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent md:block hidden w-1/4 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent md:hidden block h-1/4 bottom-0 pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
