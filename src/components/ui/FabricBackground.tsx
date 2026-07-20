import { Canvas } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import { Suspense } from "react";

function SilkMesh() {
  return (
    <mesh scale={15}>
      <planeGeometry args={[2, 2, 128, 128]} />
      <MeshDistortMaterial
        color="#0a0a0a"
        roughness={0.3}
        metalness={0.8}
        distort={0.2}
        speed={1}
      />
    </mesh>
  );
}

export function FabricBackground() {
  return (
    <div className="fixed inset-0 z-[-1] opacity-40 pointer-events-none bg-background">
      <Canvas camera={{ position: [0, 0, 3] }} gl={{ antialias: false }}>
        <ambientLight intensity={0.1} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#C2A46D" />
        <directionalLight position={[-5, -5, 2]} intensity={0.5} color="#7C3AED" />
        <Suspense fallback={null}>
          <SilkMesh />
        </Suspense>
      </Canvas>
      {/* Overlay gradient to blend it perfectly with the bottom of the page */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
    </div>
  );
}
