import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft, ChevronRight, ArrowRight,
  Network, Search, Globe2, Workflow, Truck, TrendingUp,
  PackageSearch, Bot, ShieldAlert, Zap
} from "lucide-react";
import { InteractiveFolderGallery } from "@/components/ui/interactive-folder-gallery";
import { useLanguage } from "@/lib/i18n";

const categories = [
  {
    name: "Accessories",
    images: [
      "/Collection/Accessories/4b3bf434-00a4-4370-af69-50ed0580b876.JPG",
      "/Collection/Accessories/734b3628-afe6-4e31-aca8-f3d77e1307f4.JPG",
      "/Collection/Accessories/7ae47efa-fd39-45a9-8053-63d363fa416d.JPG",
      "/Collection/Accessories/8e3df532-8f74-43d2-bbf7-0efb2c99110d.JPG"
    ],
    hue: "from-amber-700/40 to-stone-800/50"
  },
  {
    name: "Cap",
    images: [
      "/Collection/Cap/BEAF6079-040E-4CD1-9EEF-4382DCA8176D.PNG",
      "/Collection/Cap/E023E362-5001-4F7E-BBBF-B0F00AAC5612.PNG",
      "/Collection/Cap/E0CD412C-E506-4D3F-B379-9141D7ACAC53.PNG",
      "/Collection/Cap/E4F91B06-8970-4836-A860-375D49FEFB79.PNG"
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
      "/Collection/Contemporary Ready to wear/a8bd5aab-32c3-41b9-aa9e-3069ce14c649.JPG",
      "/Collection/Contemporary Ready to wear/d39b0b24-051a-4216-8007-0ff7dae8c983 2.jpg",
      "/Collection/Contemporary Ready to wear/d39b0b24-051a-4216-8007-0ff7dae8c983 3.jpg",
      "/Collection/Contemporary Ready to wear/e68f411a-661f-4aa7-994c-a0e1862d2849 3.jpg"
    ],
    hue: "from-violet-500/30 to-fuchsia-700/40"
  },
  {
    name: "Couture",
    images: [
      "/Collection/Couture/a857cc2e-9ddc-447a-ac21-72eddeedb8e9.png",
      "/Collection/Couture/bfdc6f98-0ed9-4337-980a-0db0946f02e0.png",
      "/Collection/Couture/db93e3bb-ff5c-4138-8d35-350e20b2ee21.jpg"
    ],
    hue: "from-slate-500/40 to-zinc-800/50"
  },
  {
    name: "Denim",
    images: [
      "/Collection/Denim/8a7d1d6b-9b2d-4f30-bc67-9a13ec8ed07a.png",
      "/Collection/Denim/a5483b4a-5676-46a8-8ba2-6b27a93487c1.png",
      "/Collection/Denim/e68f411a-661f-4aa7-994c-a0e1862d2849 2.jpg",
      "/Collection/Denim/e68f411a-661f-4aa7-994c-a0e1862d2849.jpg"
    ],
    hue: "from-blue-700/40 to-indigo-900/50"
  },
  {
    name: "Flat Knits",
    images: [
      "/Collection/Flat Knits/50e30627-3abb-4ecc-8c6a-9ba0b34333ea 2.jpg",
      "/Collection/Flat Knits/50e30627-3abb-4ecc-8c6a-9ba0b34333ea.jpg",
      "/Collection/Flat Knits/d39b0b24-051a-4216-8007-0ff7dae8c983 4.jpg",
      "/Collection/Flat Knits/d39b0b24-051a-4216-8007-0ff7dae8c983.jpg"
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

// features list moved inside ProductCategories component to use translations dynamically

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
  const [activeIdx, setActiveIdx] = useState(0);
  const { t } = useLanguage();

  const features = [
    { icon: Network, title: t("categories.feat1Title"), desc: t("categories.feat1Desc") },
    { icon: Search, title: t("categories.feat2Title"), desc: t("categories.feat2Desc") },
    { icon: Globe2, title: t("categories.feat3Title"), desc: t("categories.feat3Desc") },
    { icon: Workflow, title: t("categories.feat4Title"), desc: t("categories.feat4Desc") },
    { icon: Truck, title: t("categories.feat5Title"), desc: t("categories.feat5Desc") },
    { icon: TrendingUp, title: t("categories.feat6Title"), desc: t("categories.feat6Desc") },
    { icon: PackageSearch, title: t("categories.feat7Title"), desc: t("categories.feat7Desc") },
    { icon: Bot, title: t("categories.feat8Title"), desc: t("categories.feat8Desc") },
    { icon: ShieldAlert, title: t("categories.feat9Title"), desc: t("categories.feat9Desc") },
    { icon: Zap, title: t("categories.feat10Title"), desc: t("categories.feat10Desc") },
  ];

  const activeCategory = categories[activeIdx];
  const galleryPhotos = activeCategory.images.slice(0, 5).map((img, idx) => ({
    id: idx,
    image: img
  }));

  return (
    <section id="categories" className="relative py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 space-y-32">
        
        {/* Main Section Header */}
        <div className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.3em] text-electric mb-6">{t("categories.label")}</p>
          <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-balance">
            {t("categories.heading")} <span className="italic gradient-text">{t("categories.headingHighlight")}</span>{t("categories.headingEnd")}
          </h2>
        </div>

        {/* 1. Product Categories Sub-section */}
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6 lg:gap-12 items-center">
            {/* Category Navigation List */}
            <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto max-w-full lg:max-h-[580px] pr-0 lg:pr-3 py-1 scrollbar-none lg:custom-scrollbar shrink-0">
              {categories.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => setActiveIdx(i)}
                  className={`shrink-0 text-left px-4 py-2.5 lg:px-5 lg:py-2.5 rounded-xl border transition-all duration-300 relative overflow-hidden group cursor-pointer min-w-[150px] lg:min-w-0 ${
                    i === activeIdx
                      ? "bg-[#C2A46D]/12 dark:bg-[#C2A46D]/8 border-[#C2A46D]/70 dark:border-[#C2A46D]/50 text-[#2C2C2C] dark:text-white shadow-[0_0_25px_rgba(194,164,109,0.06)]"
                      : "bg-[#E5E1D8]/35 dark:bg-[#2A2A2A]/20 border-[#B7B0A6]/20 dark:border-white/5 text-[#2C2C2C]/70 dark:text-muted-foreground hover:border-[#C2A46D]/60 dark:hover:border-[#C2A46D]/50 hover:bg-[#C2A46D]/8 hover:text-[#2C2C2C] dark:hover:text-white hover:shadow-[0_0_25px_rgba(194,164,109,0.06)]"
                  }`}
                >
                  <div className="flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-3 lg:gap-4">
                      <span className={`font-serif text-[10px] lg:text-xs transition-colors duration-300 ${
                        i === activeIdx ? "text-[#C2A46D] font-bold" : "text-[#2C2C2C]/40 dark:text-muted-foreground/40 group-hover:text-[#C2A46D] group-hover:font-bold"
                      }`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h4 className={`font-serif text-sm lg:text-base tracking-wide transition-colors duration-300 ${
                          i === activeIdx ? "text-[#C2A46D] font-medium" : "text-[#2C2C2C]/80 dark:text-white/80 group-hover:text-[#C2A46D]"
                        }`}>
                          {c.name}
                        </h4>
                      </div>
                    </div>
                    <ArrowRight className={`hidden lg:block size-3.5 transition-all duration-300 ${
                      i === activeIdx ? "text-[#C2A46D] translate-x-0 opacity-100" : "text-muted-foreground/50 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[#C2A46D]"
                    }`} />
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-r from-[#C2A46D]/5 to-transparent pointer-events-none transition-opacity duration-300 ${
                    i === activeIdx ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`} />
                </button>
              ))}
            </div>

            {/* Folder Gallery Display */}
            <div className="relative flex flex-col items-center justify-center min-h-[420px] sm:min-h-[520px] lg:min-h-[580px]">
              <InteractiveFolderGallery
                key={activeCategory.name} // Force re-render on tab change to reset folder state
                photos={galleryPhotos}
                folderName={`${activeCategory.name}.sourcing`}
                dragHintText="Drag photo down to return to folder"
                className="py-4 lg:py-6"
              />
            </div>
          </div>
        </div>

        {/* 2. Capabilities (Features) Sub-section */}
        <div>
          <div className="mb-10 border-b border-border/40 pb-4">
            <h3 className="font-serif text-2xl tracking-wide">{t("categories.capabilitiesTitle")}</h3>
            <p className="text-sm text-muted-foreground mt-1">{t("categories.capabilitiesSubtitle")}</p>
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
      </div>
    </section>
  );
}
