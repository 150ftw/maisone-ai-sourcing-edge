import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export function MeasuringTapeScroll() {
  const { scrollYProgress } = useScroll();
  
  // Add a slight spring to make it feel physical
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  // Move the tape up as we scroll down
  const y = useTransform(smoothProgress, [0, 1], ["0%", "-50%"]);
  
  // Use the "electric" theme color #C2A46D for the marks
  const tickMarksSvg = `data:image/svg+xml;utf8,<svg width="24" height="100" xmlns="http://www.w3.org/2000/svg"><path d="M 24 0 v 100 M 14 10 h 10 M 18 20 h 6 M 12 30 h 12 M 18 40 h 6 M 6 50 h 18 M 18 60 h 6 M 12 70 h 12 M 18 80 h 6 M 14 90 h 10 M 18 100 h 6" stroke="%23C2A46D" stroke-width="1.5" stroke-opacity="0.3" fill="none" /></svg>`;

  return (
    <div className="fixed right-0 top-0 bottom-0 w-6 z-50 pointer-events-none overflow-hidden hidden md:block">
      <motion.div 
        className="absolute top-0 right-0 w-full h-[200vh] bg-repeat-y"
        style={{
           y,
           backgroundImage: `url('${tickMarksSvg}')`,
           backgroundPosition: "top right"
        }}
      />
      {/* Gradient fades at top and bottom to seamlessly blend into the page */}
      <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-b from-background to-transparent" />
      <div className="absolute bottom-0 right-0 w-full h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
