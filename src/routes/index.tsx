import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare, X } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { Loader } from "@/components/maisone/Loader";
import { Navbar } from "@/components/maisone/Navbar";
import { Hero } from "@/components/maisone/Hero";
import { useLanguage } from "@/lib/i18n";
import { About } from "@/components/maisone/About";
import { WhyMaisone } from "@/components/maisone/WhyMaisone";
import { HowWeWork } from "@/components/maisone/HowWeWork";
import { ProductCategories } from "@/components/maisone/ProductCategories";
import { Dashboard } from "@/components/maisone/Dashboard";
import { Founders } from "@/components/maisone/Founders";
import { ExtraMile } from "@/components/maisone/ExtraMile";
import { Partners } from "@/components/maisone/Partners";
import { Testimonials } from "@/components/maisone/Testimonials";
import { Blogs } from "@/components/maisone/Blogs";
import { TrendForecast } from "@/components/maisone/TrendForecast";

import { Footer } from "@/components/maisone/Footer";
import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maisone Global — Fashion Sourcing & Manufacturing Partner" },
      {
        name: "description",
        content:
          "Maisone Global connects international fashion brands with premium apparel development, ethical sourcing, artisanal craftsmanship, and scalable manufacturing solutions across Asia.",
      },
      { property: "og:title", content: "Maisone Global — Fashion Sourcing & Manufacturing Partner" },
      {
        property: "og:description",
        content:
          "Premium apparel sourcing, ethical manufacturing, artisanal craftsmanship and global supply chain expertise.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

const playNotificationSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    const playTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);
      
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.08, start + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(start);
      osc.stop(start + duration);
    };

    // Gentle two-tone notification chime
    playTone(830.61, ctx.currentTime, 0.45); // Ab5
    playTone(1046.50, ctx.currentTime + 0.12, 0.55); // C6
  } catch (e) {
    console.error("Audio playback error:", e);
  }
};

function Index() {
  const { t } = useLanguage();
  const [showAIPopup, setShowAIPopup] = useState(false);

  useEffect(() => {
    let timeoutId: any;
    const handleGlobalClick = () => {
      timeoutId = setTimeout(() => {
        setShowAIPopup(true);
        playNotificationSound();
      }, 5000);
    };
    window.addEventListener("click", handleGlobalClick, { once: true });
    return () => {
      window.removeEventListener("click", handleGlobalClick);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Smooth reveal animation for landing page elements
    const sections = document.querySelectorAll("main > section, main > div:not(.fixed)");
    sections.forEach((section) => {
      // Avoid conflict with Hero's custom loaders
      if (section.id === "home") return;

      // Select high-impact elements inside the section for staggered reveal
      const targets = section.querySelectorAll(
        "h2, h3, p:not(.absolute), .grid > div, .glass, .glass-strong, form, label"
      );

      if (targets.length > 0) {
        gsap.fromTo(
          targets,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      } else {
        // Fallback for simple structural containers
        gsap.fromTo(
          section,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    });

    // Clean up ScrollTrigger instances on component unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <ThemeProvider>
      <Loader />
      <div className="relative min-h-screen noise overflow-x-hidden">
        <Navbar />
        <main>
          <Hero />
          <About />
          <WhyMaisone />
          <HowWeWork />
          <ProductCategories />
          <Dashboard />
          <TrendForecast />

          <Blogs />

          <Founders />
          <ExtraMile />
          <Partners />
          <Testimonials />
          
          {/* Floating AI Assistant Button */}
          <div className="fixed bottom-8 right-8 z-50 flex items-center gap-4">
            <span className={`bg-card/95 text-foreground border border-electric/40 pl-6 pr-10 py-3.5 rounded-2xl text-sm font-semibold shadow-[0_10px_30px_-5px_rgba(0,0,0,0.3),0_0_20px_rgba(194,164,109,0.15)] backdrop-blur-md relative animate-float flex flex-col items-start transition-all duration-500 origin-right ${
              showAIPopup ? "scale-100 opacity-100 translate-x-0" : "scale-0 opacity-0 translate-x-8 pointer-events-none"
            }`}>
              {/* Close Button */}
              <button
                onClick={() => setShowAIPopup(false)}
                className="absolute top-2 right-2.5 size-4 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/90 transition-colors cursor-pointer flex items-center justify-center text-white"
                title="Close"
                aria-label="Close popup"
              >
                <X className="size-2.5 stroke-[3]" />
              </button>
              <span className="text-xs text-muted-foreground font-normal leading-tight">{t("index.gotDoubts")}</span>
              <span className="flex items-center mt-1 whitespace-nowrap">
                {t("index.talkWith")} <span className="font-serif italic text-electric ml-2 tracking-wide text-base">Maisone AI</span>
              </span>
              <span className="absolute top-1/2 -translate-y-1/2 -right-1.5 size-3 rotate-45 bg-card/95 border-r border-t border-electric/40" />
            </span>
            <a
              href="/assistant"
              className="size-16 rounded-full bg-electric text-background flex items-center justify-center shadow-[0_0_35px_rgba(194,164,109,0.4)] hover:scale-105 transition-transform hover:shadow-[0_0_45px_rgba(194,164,109,0.6)] shrink-0 animate-float"
              style={{ animationDelay: '0.5s' }}
            >
              <MessageSquare className="size-7" />
            </a>
          </div>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
