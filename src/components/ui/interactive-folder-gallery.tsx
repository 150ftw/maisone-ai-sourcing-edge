"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export interface GalleryPhoto {
  id: string | number;
  image: string;
}

const defaultPhotos: GalleryPhoto[] = [
  { id: 1, image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop" },
  { id: 2, image: "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=800&auto=format&fit=crop" },
  { id: 3, image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop" },
  { id: 4, image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=800&auto=format&fit=crop" },
  { id: 5, image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=800&auto=format&fit=crop" },
];

interface FolderCardProps {
  photo: GalleryPhoto;
  i: number;
  isFolderOpen: boolean;
  setIsFolderOpen: (v: boolean) => void;
  setHoverFolder: (v: boolean) => void;
  stackY: number;
  stackX: number;
  stackRotate: number;
  stackScale: number;
  openY: number;
  openX: number;
  openRotate: number;
  openScale: number;
}

function FolderCard({
  photo,
  i,
  isFolderOpen,
  setIsFolderOpen,
  setHoverFolder,
  stackY,
  stackX,
  stackRotate,
  stackScale,
  openY,
  openX,
  openRotate,
  openScale
}: FolderCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Preload image and track success/error state
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
    
    const img = new Image();
    img.src = photo.image;
    img.onload = () => setIsLoaded(true);
    img.onerror = () => {
      setHasError(true);
      setIsLoaded(true); // Treat as loaded so it doesn't block transitions
    };
  }, [photo.image]);

  return (
    <motion.div
      drag={isFolderOpen}
      dragSnapToOrigin={true}
      onDragEnd={(e, info) => {
        if (info.offset.y > 100 && isFolderOpen) {
          setIsFolderOpen(false);
          setHoverFolder(false);
        }
      }}
      onClick={() => {
        if (!isFolderOpen) {
          setIsFolderOpen(true);
        }
      }}
      className="absolute bottom-0 w-56 h-72 rounded-xl shadow-[0_20px_45px_rgba(0,0,0,0.6)] overflow-hidden border border-white/10 cursor-pointer pointer-events-auto bg-[#1A1917]"
      initial={{
        y: 60,
        x: 0,
        rotate: 0,
        scale: 0.8,
        opacity: 0
      }}
      animate={!isFolderOpen ? {
        y: stackY,
        x: stackX,
        rotate: stackRotate,
        scale: stackScale,
        opacity: 1,
        zIndex: i + 10
      } : {
        y: openY,
        x: openX,
        rotate: openRotate,
        scale: openScale,
        opacity: 1,
        zIndex: 50
      }}
      whileHover={!isFolderOpen ? {
        y: stackY - 25,
        scale: stackScale + 0.03,
        zIndex: 100
      } : {
        scale: openScale + 0.05,
        y: openY - 15,
        zIndex: 100
      }}
      whileDrag={isFolderOpen ? { scale: openScale + 0.1, rotate: 5, zIndex: 150 } : {}}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 28,
        delay: isFolderOpen ? 0 : i * 0.05
      }}
    >
      {!hasError && (
        <img 
          src={photo.image} 
          alt="" 
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover pointer-events-none transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`} 
        />
      )}
    </motion.div>
  );
}

export interface InteractiveFolderGalleryProps {
  photos?: GalleryPhoto[];
  folderName?: string;
  dragHintText?: string;
  className?: string;
}

export function InteractiveFolderGallery({
  photos = defaultPhotos,
  folderName = "Photography.gallery",
  dragHintText = "Drag any photo down to close",
  className
}: InteractiveFolderGalleryProps) {
  const [isFolderOpen, setIsFolderOpen] = useState(false);
  const [hoverFolder, setHoverFolder] = useState(false);

  return (
    <div className={`w-full py-8 relative ${className || ""}`}>
      <div className="relative w-full min-h-[460px] flex flex-col items-center justify-center">

        <div className="relative w-[400px] h-[460px] flex justify-center pointer-events-none z-0 scale-[0.7] min-[400px]:scale-[0.85] sm:scale-100 origin-center transition-transform">

          <motion.div 
            className="absolute bottom-6 w-80 h-56"
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: isFolderOpen ? 0 : 1, scale: isFolderOpen ? 0.9 : 1 }}
          >
            <div className="absolute top-0 left-0 w-32 h-10 bg-gradient-to-t from-[#201D1A] to-[#2E2C28] rounded-t-xl border-t border-l border-r border-[#C2A46D]/20">
              <div className="absolute inset-x-1.5 top-1.5 bottom-0 rounded-t-lg border-t border-l border-r border-[#C2A46D]/5 pointer-events-none" />
            </div>
            <div className="absolute top-8 left-0 right-0 bottom-0 bg-gradient-to-b from-[#2E2C28] to-[#141312] rounded-b-xl rounded-tr-xl border border-[#C2A46D]/20 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]">
              <div className="absolute inset-2 rounded-lg border border-[#C2A46D]/5 pointer-events-none" />
            </div>
            <div className="absolute top-10 left-2 right-2 bottom-2 bg-black rounded-lg shadow-inner pointer-events-none" />
          </motion.div>

          <div className="absolute bottom-10 z-10 flex justify-center">
            {photos.map((photo, i) => {
              const offset = i - (photos.length - 1) / 2;

              const stackY = -40 - Math.abs(offset) * 8;
              const stackX = offset * 42;
              const stackRotate = offset * 10;
              const stackScale = 1 - Math.abs(offset) * 0.025;

              const openY = -110;
              const openX = offset * 130;
              const openRotate = 0;
              const openScale = 1.05;

              return (
                <FolderCard
                  key={photo.id}
                  photo={photo}
                  i={i}
                  isFolderOpen={isFolderOpen}
                  setIsFolderOpen={setIsFolderOpen}
                  setHoverFolder={setHoverFolder}
                  stackY={stackY}
                  stackX={stackX}
                  stackRotate={stackRotate}
                  stackScale={stackScale}
                  openY={openY}
                  openX={openX}
                  openRotate={openRotate}
                  openScale={openScale}
                />
              );
            })}
          </div>

          <motion.div 
            className="absolute bottom-0 w-[340px] h-44 cursor-pointer z-20 pointer-events-auto"
            style={{ transformOrigin: "bottom" }}
            initial={{ opacity: 1, rotateX: -25, y: 10 }}
            animate={{ 
              opacity: isFolderOpen ? 0 : 1, 
              rotateX: -25, 
              y: 10,
              pointerEvents: isFolderOpen ? "none" : "auto" 
            }}
            onMouseEnter={() => setHoverFolder(true)}
            onMouseLeave={() => setHoverFolder(false)}
            onClick={() => setIsFolderOpen(true)}
          >
            <div className="w-full h-full bg-gradient-to-b from-[#3E3A33] to-[#1A1816] rounded-2xl border border-[#C2A46D]/30 shadow-[inset_0_2px_12px_rgba(194,164,109,0.15)] relative overflow-hidden flex items-end justify-center pb-8">
              <div className="absolute inset-2 rounded-xl border border-[#C2A46D]/12 pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C2A46D]/40 to-transparent" />

              <div className="px-6 py-2.5 bg-gradient-to-b from-[#24211D] to-[#13110E] rounded-md border border-[#C2A46D]/45 shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex items-center justify-center relative">
                {/* Brass Rivets on Corners */}
                <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#C2A46D]/50 border border-[#C2A46D]/20 shadow-[inset_0_0.5px_1px_rgba(0,0,0,0.8)]" />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#C2A46D]/50 border border-[#C2A46D]/20 shadow-[inset_0_0.5px_1px_rgba(0,0,0,0.8)]" />

                <span className="text-[#C2A46D] text-[10px] font-serif tracking-[0.25em] uppercase font-bold px-3">
                  {folderName}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30, visibility: "hidden" }}
          animate={isFolderOpen ? {
            opacity: 1, y: 0, visibility: "visible"
          } : {
            opacity: 0, y: 30, transitionEnd: { visibility: "hidden" }
          }}
          className="absolute bottom-6 px-6 py-3 rounded-full bg-black/40 border border-[#C2A46D]/20 backdrop-blur-md text-[#C2A46D]/80 text-[10px] font-bold uppercase tracking-widest pointer-events-none"
        >
          {dragHintText}
        </motion.div>

      </div>
    </div>
  );
}

export { InteractiveFolderGallery as Component };
