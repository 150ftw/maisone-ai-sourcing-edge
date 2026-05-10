import { createFileRoute } from "@tanstack/react-router";
import { ThemeProvider } from "@/components/theme-provider";
import { Loader } from "@/components/maisone/Loader";
import { Navbar } from "@/components/maisone/Navbar";
import { Hero } from "@/components/maisone/Hero";
import { Features } from "@/components/maisone/Features";
import { Dashboard } from "@/components/maisone/Dashboard";
import { GlobalPresence } from "@/components/maisone/GlobalPresence";
import { Automation } from "@/components/maisone/Automation";
import { HowItWorks } from "@/components/maisone/HowItWorks";
import { Testimonials } from "@/components/maisone/Testimonials";
import { Pricing } from "@/components/maisone/Pricing";
import { Footer } from "@/components/maisone/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maisone — AI-Powered Fashion Sourcing" },
      {
        name: "description",
        content:
          "Maisone connects fashion brands with intelligent sourcing networks across Japan, the United Kingdom, Europe, and the United States.",
      },
      { property: "og:title", content: "Maisone — AI-Powered Fashion Sourcing" },
      {
        property: "og:description",
        content:
          "Luxury AI-powered fashion sourcing & supplier intelligence platform for global brands.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <ThemeProvider>
      <Loader />
      <div className="relative min-h-screen noise overflow-x-hidden">
        <Navbar />
        <main>
          <Hero />
          <Features />
          <Dashboard />
          <GlobalPresence />
          <Automation />
          <HowItWorks />
          <Testimonials />
          <Pricing />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
