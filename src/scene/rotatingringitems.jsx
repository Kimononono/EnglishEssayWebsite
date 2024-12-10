import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const RotatingRingItems = () => {
  const groupRef = useRef();
  const numItems = 10;

  // Calculate radius dynamically based on viewport size
  const radius = Math.min(window.innerWidth, window.innerHeight) * 0.5;

  // Generate positions for the semicircle
  const positions = Array.from({ length: numItems }).map((_, i) => {
    const angle = (Math.PI * i) / (numItems - 1); // Spread across semicircle
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    return { x, y, z: 0 };
  });

  useEffect(() => {
    const group = groupRef.current;

    // Animate the group rotation based on scrolling
    gsap.to(group.rotation, {
      z: -Math.PI / 2, // Rotate counterclockwise by 90 degrees
      scrollTrigger: {
        trigger: document.body, // Use the entire page as the scrollable area
        start: "top top", // Start rotating when the user starts scrolling
        end: "bottom top", // Finish rotating at the bottom of the page
        scrub: true, // Sync animation with scroll
        markers: true, // Debugging markers (remove in production)
      },
    });

    return () => {
      ScrollTrigger.killAll(); // Clean up scroll triggers on component unmount
    };
  }, []);

  return (
    <group ref={groupRef}>
      {positions.map((pos, index) => (
        <mesh key={index} position={[pos.x, pos.y, pos.z]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color={`hsl(${(index / numItems) * 360}, 100%, 50%)`} />
        </mesh>
      ))}
    </group>
  );
};

export default RotatingRingItems
