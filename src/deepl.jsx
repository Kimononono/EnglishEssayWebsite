import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const startRotation = -Math.PI / 2; // -90 degrees in radians
const RingItems = () => {
  const groupRef = useRef();
  const numItems = 10;
  const [radius, setRadius] = useState(window.innerWidth / 2);

  useEffect(() => {
    const handleResize = () => {
      setRadius(window.innerWidth / 2);
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Generate positions for the semicircle with rotation
  const positions = Array.from({ length: numItems }).map((_, i) => {
    const angle = (Math.PI * i) / (numItems - 1); // Spread across semicircle
    return angle;
  });

  useEffect(() => {
    const items = groupRef.current.children;

    // Initial rotation to start off-screen
    const endRotation = 0; // 0 degrees in radians

    // Animate rotation based on scroll
    gsap.to(groupRef.current, {
      rotationY: endRotation,
      duration: 2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: window,
        start: "top top",
        end: "bottom top",
        scrub: true,
        markers: false,
      },
    });

    // Position items based on rotation
    positions.forEach((angle, i) => {
      const pos = groupRef.current.getWorldPosition(new THREE.Vector3());
      const item = items[i];
      const rotatedAngle = angle + groupRef.current.rotationY;

      item.position.x = radius * Math.cos(rotatedAngle);
      item.position.y = radius * Math.sin(rotatedAngle);
    });

    return () => {
      ScrollTrigger.killAll();
    };
  }, [positions, radius]);

  return (
    <group ref={groupRef} rotation={[0, startRotation, 0]}>
      {positions.map((angle, index) => (
        <mesh key={index} position={[0, 0, 0]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color={`hsl(${(index / numItems) * 360}, 100%, 50%)`} />
        </mesh>
      ))}
    </group>
  );
};

export const DeeplScene = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 75 }}
      style={{ height: "100vh", width: "100vw" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} />
      <RingItems />
      <OrbitControls />
    </Canvas>
  );
};

const App = () => {
  return (
    <div style={{ overflow: "hidden", height: "100vh" }}>
      <Scene />
    </div>
  );
};

