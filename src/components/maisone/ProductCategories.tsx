import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft, ChevronRight, ArrowRight,
  Network, Search, Globe2, Workflow, Truck, TrendingUp,
  PackageSearch, Bot, ShieldAlert, Zap
} from "lucide-react";

const categories = [
  {
    name: "Accessories",
    images: [
      "/Collection/Accessories/0e00bd82-b031-48e1-b502-2f4dffcf8e07.png",
      "/Collection/Accessories/2b2eb367-df33-4f0a-a36c-68d9d3514450.png",
      "/Collection/Accessories/3a4297fb-f28b-4f54-b6b7-4a105b51da46.png",
      "/Collection/Accessories/abb3c3dc-0560-44d6-a42a-8bbb33009dc5.jpg",
      "/Collection/Accessories/b46593f6-880c-4be5-97b7-1a7febe2f08d.png",
      "/Collection/Accessories/c8533f33-8838-4e81-82b9-bfd906f7fa31.jpg",
      "/Collection/Accessories/eb92f048-b69c-4eb7-89d4-2abedeb0b789.jpg"
    ],
    hue: "from-amber-700/40 to-stone-800/50"
  },
  {
    name: "Cap",
    images: [
      "/Collection/Cap/44370349-2f4c-4ed1-81c5-13a244c9b3f5.png",
      "/Collection/Cap/8ef9dd0a-cffb-4456-8493-08c86fabf1d0.png",
      "/Collection/Cap/9046fc65-a921-4bd8-8b39-41bfdd573df0.png"
    ],
    hue: "from-sky-700/40 to-slate-800/50"
  },
  {
    name: "Circular Knits",
    images: [
      "/Collection/Circular Knits/027051a3-ab6f-46e3-95ef-4fb908c2b4c4.jpg",
      "/Collection/Circular Knits/1263161e-4be7-4252-a223-3b0489b716ac.jpg",
      "/Collection/Circular Knits/59cec728-4dc6-4c13-bfa1-a71127108451.jpg",
      "/Collection/Circular Knits/7daacc62-d813-4422-8b57-a11a54ba0dd5.jpg",
      "/Collection/Circular Knits/888253f8-ae1d-4909-bc25-306b7db92d94.jpg",
      "/Collection/Circular Knits/90095dd7-55b9-408b-9dcb-a5eadd1968af.jpg",
      "/Collection/Circular Knits/96660e59-c61e-46f5-815b-9ed26ddb7b71.jpg",
      "/Collection/Circular Knits/9fdb21f7-cee0-43b0-9ff9-7e6c34815a05.jpg",
      "/Collection/Circular Knits/c71655cb-d316-4bf2-aa72-fea63ad2282d.jpg",
      "/Collection/Circular Knits/cb3a1a41-564a-4b43-906f-cbf9b96bfd7b.jpg"
    ],
    hue: "from-emerald-700/40 to-teal-900/50"
  },
  {
    name: "Contemporary Ready to Wear",
    images: [
      "/Collection/Contemporary Ready to wear/07b5fee6-250e-41c7-b35d-b4d046084860.png",
      "/Collection/Contemporary Ready to wear/122359e6-72f9-486b-99ec-01e842f63093.png",
      "/Collection/Contemporary Ready to wear/1399681e-c6eb-40fb-9159-77081a1a4713.jpg",
      "/Collection/Contemporary Ready to wear/39beb263-9fce-4d4f-b92d-5816f3bdcc73.png",
      "/Collection/Contemporary Ready to wear/77c8f070-160d-44cf-acd6-54450d3854dc.png",
      "/Collection/Contemporary Ready to wear/ac14b9b9-764a-4b4d-a016-348ffdcc6b5c.png",
      "/Collection/Contemporary Ready to wear/afe7306f-8852-46e5-aec0-bd775fcc6615.png",
      "/Collection/Contemporary Ready to wear/bed6d090-e826-4b04-8bd1-aafab870e449.jpg",
      "/Collection/Contemporary Ready to wear/f0374c2b-809e-405d-994b-41ce329b23fc.png"
    ],
    hue: "from-violet-500/30 to-fuchsia-700/40"
  },
  {
    name: "Couture",
    images: [
      "/Collection/Couture/a857cc2e-9ddc-447a-ac21-72eddeedb8e9.png",
      "/Collection/Couture/bfdc6f98-0ed9-4337-980a-0db0946f02e0.png",
      "/Collection/Couture/db93e3bb-ff5c-4138-8d35-350e20b2ee21.jpg",
      "/Collection/Couture/e0678264-e479-4495-a213-3b770d7739f3.png",
      "/Collection/Couture/f9157e3c-272c-4ecc-b57f-e01c9f151182.png",
      "/Collection/Couture/fe03754b-cf51-4e93-aa67-5ef9f2005e5d.png"
    ],
    hue: "from-slate-500/40 to-zinc-800/50"
  },
  {
    name: "Denim",
    images: [
      "/Collection/Denim/1479053d-c9a1-4177-a23e-67e2389a0991.png",
      "/Collection/Denim/68cf250d-2029-4855-bfda-6c48f0bce3a5.png",
      "/Collection/Denim/8a7d1d6b-9b2d-4f30-bc67-9a13ec8ed07a.png",
      "/Collection/Denim/a5483b4a-5676-46a8-8ba2-6b27a93487c1.png",
      "/Collection/Denim/fd5b1bbe-14d2-477a-99a9-1297d1001495.png"
    ],
    hue: "from-blue-700/40 to-indigo-900/50"
  },
  {
    name: "Flat Knits",
    images: [
      "/Collection/Flat Knits/18290e7a-af54-4e5c-b779-405380f0c8c3.png",
      "/Collection/Flat Knits/191811fc-1215-44af-be4b-ab50c58ef7e5.png",
      "/Collection/Flat Knits/1f6706c0-2758-4393-aaa3-da241d40ae37.png",
      "/Collection/Flat Knits/3f5a5075-3445-48ff-8b26-1bd187eb0699.png",
      "/Collection/Flat Knits/6640d1b6-db97-4803-8f27-8a891155b7bc.png",
      "/Collection/Flat Knits/9fb4ccf8-186b-4ce4-9741-cd60f8fae3b0.png",
      "/Collection/Flat Knits/baa97763-0b6d-4070-8981-d9836238d1a3.png",
      "/Collection/Flat Knits/c38fb3da-2369-4ca3-8167-75dd68b9355e.png",
      "/Collection/Flat Knits/cad51d5c-a4f8-40f9-8aa4-47a7ed264b58.png",
      "/Collection/Flat Knits/f70e450a-0e70-40e8-ac8f-01842a246143.png"
    ],
    hue: "from-rose-500/30 to-amber-700/40"
  },
  {
    name: "Leather",
    images: [
      "/Collection/Leather/41a2df11-af75-4d02-968d-01df938fd8ae.jpg",
      "/Collection/Leather/497857fc-583b-4f01-9045-a5d86ee7c0d3.jpg",
      "/Collection/Leather/75f56406-53bb-4e2d-9080-257aa78a89e7.jpg",
      "/Collection/Leather/b1e4722a-6329-4b61-bef6-2e8784ffa9ca.jpg",
      "/Collection/Leather/d8155f59-0c3a-4a67-8305-f8c25b6b6e4c.jpg",
      "/Collection/Leather/f6ec41e2-9404-4b31-a278-4a19a9714167.jpg"
    ],
    hue: "from-pink-500/30 to-rose-700/40"
  }
];

const features = [
  { icon: Network, title: "AI Supplier Matching", desc: "Semantic vector matching across 50K+ verified vendors by capability, MOQ, lead time and ethics score." },
  { icon: Search, title: "Smart Product Discovery", desc: "Image-to-supplier search powered by multimodal models trained on textile, trim and silhouette taxonomies." },
  { icon: Globe2, title: "Global Vendor Network", desc: "Curated mills and ateliers in Tokyo, London, Paris, Milan, Berlin, New York and Los Angeles." },
  { icon: Workflow, title: "Procurement Automation", desc: "From RFQ to PO in minutes. Auto-route quotes, negotiate terms and trigger contract workflows." },
  { icon: Truck, title: "Real-Time Shipment Tracking", desc: "Container-level visibility across air, sea and rail with predictive ETAs and customs alerts." },
  { icon: TrendingUp, title: "Fashion Trend Intelligence", desc: "Runway, social and retail signals condensed into actionable colour, fabric and silhouette forecasts." },
  { icon: PackageSearch, title: "Inventory Forecasting", desc: "Demand models trained on your sell-through data anticipate stock-outs eight weeks ahead." },
  { icon: Bot, title: "AI Chat Assistant", desc: "A sourcing copilot that drafts briefs, summarises quotes and answers supplier questions, 24/7." },
  { icon: ShieldAlert, title: "Supplier Risk Analysis", desc: "Continuous monitoring of compliance, financial health and geopolitical exposure." },
  { icon: Zap, title: "Workflow Automation", desc: "Connect Notion, Zoho, WhatsApp and email to orchestrate every step of your supply chain." },
];

const pairs = [
  {
    problem: "Struggling to find reliable factories?",
    solution: "We connect brands with trusted manufacturing partners.",
  },
  {
    problem: "Need tighter quality control?",
    solution: "Our rigorous inspection systems ensure premium quality.",
  },
  {
    problem: "Need compliance-ready factories?",
    solution: "We help establish ethically responsible production ecosystems.",
  },
  {
    problem: "Looking for innovative materials?",
    solution: "Access cutting-edge fabrics and sustainable sourcing solutions.",
  },
  {
    problem: "Want to focus on growth?",
    solution: "We handle sourcing and operations while you focus on creativity.",
  },
];

function CategoryCard({ category, index }: { category: typeof categories[0]; index: number }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveIndex((prev) => (prev + 1) % category.images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveIndex((prev) => (prev - 1 + category.images.length) % category.images.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 3) * 0.08 }}
      className="group relative aspect-[4/5] rounded-3xl overflow-hidden glass-strong shadow-xl"
    >
      {/* Category Image Slider */}
      {category.images.map((img, idx) => (
        <img
          key={img}
          src={img}
          alt={`${category.name} image ${idx + 1}`}
          className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 ease-in-out ${
            idx === activeIndex
              ? "opacity-100 scale-100 group-hover:scale-105"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        />
      ))}

      {/* Hue overlays */}
      <div className={`absolute inset-0 bg-gradient-to-br ${category.hue} mix-blend-overlay opacity-60 group-hover:opacity-85 transition-opacity duration-700`} />
      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent" />

      {/* Navigation Arrows */}
      {category.images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-background/45 backdrop-blur-md border border-white/10 text-white hover:bg-electric hover:border-electric hover:text-background active:scale-95 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-background/45 backdrop-blur-md border border-white/10 text-white hover:bg-electric hover:border-electric hover:text-background active:scale-95 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Slide dots indicator lines */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-w-[80%] overflow-hidden py-1">
        {category.images.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setActiveIndex(idx);
            }}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              idx === activeIndex ? "w-5 bg-electric" : "w-1.5 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Info details */}
      <div className="absolute inset-x-6 bottom-6 z-10 transform transition-transform duration-500 group-hover:-translate-y-2">
        <p className="text-[10px] uppercase tracking-[0.25em] text-electric mb-2 opacity-80 font-bold">
          Category {String(index + 1).padStart(2, "0")}
        </p>
        <h3 className="font-serif text-2xl sm:text-3xl leading-tight text-balance font-medium text-white">{category.name}</h3>
      </div>
    </motion.div>
  );
}

export function ProductCategories() {
  return (
    <section id="categories" className="relative py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 space-y-32">
        
        {/* Main Section Header */}
        <div className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6">— Sourcing Categories & Capabilities</p>
          <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-balance">
            A full spectrum of <span className="italic gradient-text">luxury categories</span> & intelligent sourcing solutions.
          </h2>
        </div>

        {/* 1. Product Categories Sub-section */}
        <div>
          <div className="mb-10 border-b border-border/40 pb-4">
            <h3 className="font-serif text-2xl tracking-wide">Product Categories</h3>
            <p className="text-sm text-muted-foreground mt-1">Our curated selection of manufacturing domains.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((c, i) => (
              <CategoryCard key={c.name} category={c} index={i} />
            ))}
          </div>
        </div>

        {/* 2. Capabilities (Features) Sub-section */}
        <div>
          <div className="mb-10 border-b border-border/40 pb-4">
            <h3 className="font-serif text-2xl tracking-wide">Capabilities</h3>
            <p className="text-sm text-muted-foreground mt-1">Ten modules engineered to compress months of sourcing work.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-border rounded-3xl overflow-hidden">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: (i % 5) * 0.08 }}
                className="group relative bg-background p-8 hover:bg-accent/40 transition-colors"
              >
                <div className="size-11 rounded-xl glass flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <f.icon className="size-5 text-electric" />
                </div>
                <h3 className="text-base font-medium mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                <div className="absolute top-6 right-6 text-[10px] text-muted-foreground/50 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 3. Challenges We Solve Sub-section */}
        <div>
          <div className="mb-10 border-b border-border/40 pb-4">
            <h3 className="font-serif text-2xl tracking-wide">Challenges We Solve</h3>
            <p className="text-sm text-muted-foreground mt-1">Every bottleneck resolved by our supply chain experts.</p>
          </div>
          <div className="space-y-4">
            {pairs.map((p, i) => (
              <motion.div
                key={p.problem}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="grid md:grid-cols-[1fr_auto_1fr] items-center gap-5 glass-strong rounded-3xl p-6 md:p-8"
              >
                <p className="font-serif text-xl md:text-2xl text-balance">{p.problem}</p>
                <ArrowRight className="size-5 text-electric mx-auto rotate-90 md:rotate-0" />
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{p.solution}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
