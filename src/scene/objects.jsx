import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { gsap } from 'gsap';

function ConsumerSphere() {
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="#ffffff" /> {/* Neutral color */}
    </mesh>
  );
}

function BrandObject({ position, color }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.3, 0.3, 0.3]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function BrandRing(N=8, radius=3) {
  // We’ll place N brands around a circle
  //const N = 8;
  //const radius = 3;
  const brands = Array.from({ length: N }, (_, i) => {
    const angle = (i / N) * 2 * Math.PI;
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    return { position: [x, 0, z], color: "#a2d2ff" }; // Soft blue for now
  });
  console.log(brands)

  return (
    <>
      {brands.map((b, i) => (
        <BrandObject key={i} position={b.position} color={b.color} />
      ))}
    </>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
    </>
  );
}

export { ConsumerSphere, BrandObject, BrandRing, Lights };
