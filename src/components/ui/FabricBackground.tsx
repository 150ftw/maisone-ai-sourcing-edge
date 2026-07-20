import { Canvas } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import { Suspense } from "react";
import { useTheme } from "@/components/theme-provider";

function SilkMesh({ isDark }: { isDark: boolean }) {
  return (
    <mesh scale={15}>
      <planeGeometry args={[2, 2, 128, 128]} />
      <MeshDistortMaterial
        color={isDark ? "#0a0a0a" : "#F6F4F0"}
        roughness={0.3}
        metalness={isDark ? 0.8 : 0.4}
        distort={0.2}
        speed={1}
      />
    </mesh>
  );
}

export function FabricBackground() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`fixed inset-0 z-[-1] pointer-events-none bg-background transition-opacity duration-500 ${isDark ? "opacity-40" : "opacity-[0.85]"}`}>
      <Canvas camera={{ position: [0, 0, 3] }} gl={{ antialias: false }}>
        <ambientLight intensity={isDark ? 0.1 : 1.2} />
        <directionalLight position={[5, 5, 5]} intensity={isDark ? 1 : 1.5} color={isDark ? "#C2A46D" : "#ffffff"} />
        <directionalLight position={[-5, -5, 2]} intensity={isDark ? 0.5 : 1} color={isDark ? "#7C3AED" : "#F6F4F0"} />
        <Suspense fallback={null}>
          <SilkMesh isDark={isDark} />
        </Suspense>
      </Canvas>
      {/* Overlay gradient to blend it perfectly with the bottom of the page */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
    </div>
  );
}
