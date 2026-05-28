"use client";
import { Canvas } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Icosahedron, Torus, Environment } from "@react-three/drei";
import { Suspense } from "react";

/**
 * Lightweight 3D hero accent. Rendered client-side only (imported with
 * ssr:false from the home page) so it never blocks SSR or hurts SEO. Falls
 * back to nothing if WebGL is unavailable.
 */
export default function Hero3D() {
  return (
    <div className="absolute inset-0 -z-[1]" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 5, 5]} intensity={1.1} />
          <directionalLight position={[-5, -3, 2]} intensity={0.5} color="#22d3ee" />

          <Float speed={1.4} rotationIntensity={1.1} floatIntensity={1.6}>
            <Icosahedron args={[1.35, 6]} position={[1.6, 0.4, 0]}>
              <MeshDistortMaterial
                color="#3f64ff"
                roughness={0.15}
                metalness={0.35}
                distort={0.35}
                speed={1.6}
              />
            </Icosahedron>
          </Float>

          <Float speed={1.1} rotationIntensity={1.4} floatIntensity={1.2}>
            <Torus args={[0.7, 0.26, 24, 64]} position={[-1.9, -0.6, -1]}>
              <meshStandardMaterial color="#22d3ee" roughness={0.2} metalness={0.5} />
            </Torus>
          </Float>

          <Float speed={1.7} rotationIntensity={0.9} floatIntensity={2}>
            <Icosahedron args={[0.4, 2]} position={[-0.4, 1.5, -0.5]}>
              <meshStandardMaterial color="#92b1ff" roughness={0.25} metalness={0.4} />
            </Icosahedron>
          </Float>

          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
