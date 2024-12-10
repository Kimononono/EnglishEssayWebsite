import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { gsap } from 'gsap';
import "./test.css";
import { Lights, ConsumerSphere, BrandObject, BrandRing } from './scene/objects';
import RingItems from './scene/ringitems';
import RotatingRingItems from './scene/rotatingringitems';



function TransitionOverlay({ opacity }) {
  // A full-screen quad to fade in/out
  // Use a plane covering the entire camera frustum or <Html> overlay with CSS
  return (
    <mesh position={[0,0,-1]} scale={[100,100,1]}>
      <planeGeometry args={[1,1]} />
      <meshBasicMaterial color="black" transparent opacity={opacity} />
    </mesh>
  );
}

function SceneManager({ phase }) {
  return (
    <>
      <Lights />
        <>
          <ConsumerSphere />
          <BrandRing />
        </>
    </>
  );
}

function MainScene() {
  const { camera } = useThree();
  const [phase, setPhase] = useState("brandScene");
  const [overlayOpacity, setOverlayOpacity] = useState(0);

  const handleNext = () => {
    // Assume we know the brand position we want to zoom into, say brand at [3,0,0]
    //const targetPos = { x: 3, y: 0, z: 0.5 };
    const targetPos = { x: -5, y: -5, z: -5 };
    //const targetPos = { x: 2.121320343559643, y: 0, z: 2.1213203435596424 };

    // Step 1: Animate camera toward brand
    gsap.to(camera.position, {
      duration: 2,
      x: targetPos.x,
      y: targetPos.y,
      z: targetPos.z,
      onUpdate: () => camera.lookAt(2.12, 0, 2.12),

    });
  }

  // We'll need a mutable ref to handle overlay opacity through gsap easily
  const overlayOpacityRef = useRef(overlayOpacity);

  useEffect(() => {
    overlayOpacityRef.current = overlayOpacity;
  }, [overlayOpacity]);

  return (
    <>
      <Html position={[0, 1, 0]} style={{ pointerEvents: 'auto' }}>
        <button onClick={handleNext}>Next</button>
      </Html>
      {/* <SceneManager phase={phase} /> */ }
      <RotatingRingItems />
      <TransitionOverlay opacity={overlayOpacity} />
    </>
  );
}

export { SceneManager, MainScene };
