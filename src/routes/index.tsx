import { createFileRoute } from "@tanstack/react-router";
import { ThemeProvider } from "@/components/theme-provider";
import { Loader } from "@/components/maisone/Loader";
import { Navbar } from "@/components/maisone/Navbar";
import { Hero } from "@/components/maisone/Hero";
import { About } from "@/components/maisone/About";
import { WhyMaisone } from "@/components/maisone/WhyMaisone";
import { HowWeWork } from "@/components/maisone/HowWeWork";
import { Features } from "@/components/maisone/Features";
import { ProductCategories } from "@/components/maisone/ProductCategories";
import { Challenges } from "@/components/maisone/Challenges";
import { QualityControl } from "@/components/maisone/QualityControl";
import { Dashboard } from "@/components/maisone/Dashboard";
import { GlobalPresence } from "@/components/maisone/GlobalPresence";
import { Automation } from "@/components/maisone/Automation";
import { AIAssistant } from "@/components/maisone/AIAssistant";
import { Marketplace } from "@/components/maisone/Marketplace";
import { SupplierProfile } from "@/components/maisone/SupplierProfile";
import { Portals } from "@/components/maisone/Portals";
import { Analytics } from "@/components/maisone/Analytics";
import { TrendForecast } from "@/components/maisone/TrendForecast";
import { SourcingNetwork } from "@/components/maisone/SourcingNetwork";
import { HowItWorks } from "@/components/maisone/HowItWorks";
import { CaseStudies } from "@/components/maisone/CaseStudies";
import { TrustStrip } from "@/components/maisone/TrustStrip";
import { Founders } from "@/components/maisone/Founders";
import { ExtraMile } from "@/components/maisone/ExtraMile";
import { Partners } from "@/components/maisone/Partners";
import { Testimonials } from "@/components/maisone/Testimonials";
import { Pricing } from "@/components/maisone/Pricing";
import { Footer } from "@/components/maisone/Footer";

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
          <Challenges />
          <QualityControl />
          <Features />
          <Dashboard />
          <AIAssistant />
          <Marketplace />
          <SupplierProfile />
          <Portals />
          <Analytics />
          <TrendForecast />
          <SourcingNetwork />
          <GlobalPresence />
          <Automation />
          <HowItWorks />
          <CaseStudies />
          <TrustStrip />
          <Founders />
          <ExtraMile />
          <Partners />
          <Testimonials />
          <Pricing />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
