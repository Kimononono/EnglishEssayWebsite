import React, { useRef, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';

function RingItem({ position }) {
  const ref = useRef();

  // GSAP animation setup
  useLayoutEffect(() => {
    const mesh = ref.current;

    gsap.fromTo(
      mesh.position,
      { x: position[0], y: position[1] - 10, z: position[2] }, // Start off-screen
      {
        x: position[0],
        y: position[1],
        z: position[2],
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#canvas-container', // Trigger element
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  }, [position]);

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}


import { useThree } from '@react-three/fiber';

export function Ring() {
  const { viewport } = useThree();
  const radius = viewport.width / 4; // Adjust radius based on viewport
  const numItems = Math.max(5, Math.round(viewport.width / 2)); // Adjust count dynamically

  const positions = Array.from({ length: numItems }).map((_, i) => {
    const angle = Math.PI * (i / (numItems - 1));
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    const z = 0;
    return [x, y, z];
  });

  return (
    <>
      {positions.map((position, index) => (
        <RingItem key={index} position={position} />
      ))}
    </>
  );
}
export default Ring;
