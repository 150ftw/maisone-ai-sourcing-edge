import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { Loader } from "@/components/maisone/Loader";
import { Navbar } from "@/components/maisone/Navbar";
import { Hero } from "@/components/maisone/Hero";
import { About } from "@/components/maisone/About";
import { WhyMaisone } from "@/components/maisone/WhyMaisone";
import { HowWeWork } from "@/components/maisone/HowWeWork";
import { ProductCategories } from "@/components/maisone/ProductCategories";
import { Dashboard } from "@/components/maisone/Dashboard";
import { Founders } from "@/components/maisone/Founders";
import { ExtraMile } from "@/components/maisone/ExtraMile";
import { Partners } from "@/components/maisone/Partners";
import { Testimonials } from "@/components/maisone/Testimonials";
import { AIAssistant } from "@/components/maisone/AIAssistant";
import { Blogs } from "@/components/maisone/Blogs";
import { TrendForecast } from "@/components/maisone/TrendForecast";

import { Footer } from "@/components/maisone/Footer";
import { useEffect } from "react";
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

function Index() {
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
          <AIAssistant />
          <TrendForecast />

          <Blogs />

          <Founders />
          <ExtraMile />
          <Partners />
          <Testimonials />
          
          {/* Floating AI Assistant Button */}
          <div className="fixed bottom-8 right-8 z-50 flex items-center gap-4">
            <span className="bg-card/95 text-foreground border border-electric/40 px-6 py-3 rounded-2xl text-sm font-semibold shadow-[0_10px_30px_-5px_rgba(0,0,0,0.3),0_0_20px_rgba(194,164,109,0.15)] backdrop-blur-md whitespace-nowrap relative animate-float flex items-center">
              Talk with our <span className="font-serif italic text-electric ml-2 tracking-wide text-base">Maisone AI</span>
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
