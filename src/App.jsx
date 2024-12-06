import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { gsap } from 'gsap';

import ScrollTrigger from 'gsap/ScrollTrigger';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const rawContext = {
  "The Marketplace of Identity": [
    "Brands have evolved beyond selling products.",
    "They now offer identities, tapping into our deep-seated need for belonging and self-expression.",
    "Companies like Patagonia and Levi’s align their products with environmental values, allowing consumers to feel their purchases reflect a commitment to sustainability."
  ],
  "Connection and Belonging": [
    "This approach fosters loyalty and pride.",
    "But what happens when brands realize they can simply market these values instead of truly embodying them?",
    "We must ask: Are these values genuine or are they a carefully crafted facade?"
  ]
};

// A simple 3D scene placeholder
function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5,5,5]} />
      <mesh position={[0,0,0]}>
        <sphereGeometry args={[1,32,32]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </>
  );
}

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

function BrandRing() {
  // We’ll place N brands around a circle
  const N = 8;
  const radius = 3;
  const brands = Array.from({ length: N }, (_, i) => {
    const angle = (i / N) * 2 * Math.PI;
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    return { position: [x, 0, z], color: "#a2d2ff" }; // Soft blue for now
  });

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
      {phase === "brandScene" && (
        <>
          <ConsumerSphere />
          <BrandRing />
        </>
      )}
      {phase === "facadeScene" && <FacadeScene />}
    </>
  );
}

function MainScene() {
  const { camera } = useThree();
  const [phase, setPhase] = useState("brandScene");
  const [overlayOpacity, setOverlayOpacity] = useState(0);

  const handleNext = () => {
    // Assume we know the brand position we want to zoom into, say brand at [3,0,0]
    const targetPos = { x: 3, y: 0, z: 0.5 };

    // Step 1: Animate camera toward brand
    gsap.to(camera.position, {
      duration: 2,
      x: targetPos.x,
      y: targetPos.y,
      z: targetPos.z,
      onUpdate: () => camera.lookAt(0,0,0),
      onComplete: () => {
        // Camera is now close to brand
        // Fade in overlay
        gsap.to({}, { 
          duration: 1,
          onStart: () => {
            gsap.to(overlayOpacityRef, { current: 1, duration: 0.5, onUpdate: () => setOverlayOpacity(overlayOpacityRef.current) });
          },
          onComplete: () => {
            // Switch phase
            setPhase("facadeScene");
            // Fade out overlay
            gsap.to(overlayOpacityRef, { current: 0, duration: 0.5, onUpdate: () => setOverlayOpacity(overlayOpacityRef.current) });
          }
        });
      }
    });

    // Alternatively, trigger the fade earlier (e.g., halfway):
    // You could implement a timed delay or a distance check inside onUpdate.
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
      <SceneManager phase={phase} />
      <TransitionOverlay opacity={overlayOpacity} />
    </>
  );
}


function Section({ title, sentences }) {
  const sectionRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    const sentenceEls = sectionEl.querySelectorAll('.sentence');

    // Height: we want enough scroll space for each sentence + some extra
    // For N sentences, let's create a scrollable area ~ (N+1)*100vh
    const totalSentences = sentences.length;
    const pinDuration = (totalSentences + 1) * window.innerHeight;

    // Set up ScrollTrigger for this section
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionEl,
        start: "top top",
        end: `+=${pinDuration}`,
        pin: true,
        scrub: true
      }
    });

    // For each sentence, fade it in at different increments of the timeline
    sentenceEls.forEach((el, i) => {
      tl.fromTo(el, {opacity:0, y:50}, {opacity:1, y:0, duration:0.5}, i);
      // Each sentence fades in at a different scroll position
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [sentences]);

  return (
    <div ref={sectionRef} className="section-container">
      <h2 className="section-title">{title}</h2>
      <div className="sentences-wrapper">
        {sentences.map((text, i) => (
          <p className="sentence" key={i}>{text}</p>
        ))}
      </div>
    </div>
  );
}



function calculateSectionHeights(rawContext) {
  const sectionHeights = {};
  let cumulativeHeight = 0;

  Object.entries(rawContext).forEach(([title, sentences]) => {
    const sectionHeight = (sentences.length + 1) * window.innerHeight; // Each sentence gets 1 viewport height
    sectionHeights[title] = {
      height: sectionHeight,
      start: cumulativeHeight,
    };
    cumulativeHeight += sectionHeight;
  });

  return { sectionHeights, totalHeight: cumulativeHeight };
}
export default function App() {
  const { sectionHeights, totalHeight } = calculateSectionHeights(rawContext);
  // Convert rawContext to an array of sections for easier rendering
  // sections = [ [title, [sentences...]], [title, [sentences...]] ]

  return (
    <div style={{margin:0, padding:0, height: `${totalHeight*2}px`}}>
      {/* Text Sections */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 10 }}>
        {Object.entries(rawContext).map(([title, sentences], idx) => (
          <div
            key={idx}
            className="section-container"
            style={{
              position: 'absolute',
              top: `${sectionHeights[title].start}px`, // Start position dynamically calculated
              height: `${sectionHeights[title].height}px`, // Total height for the section
            }}
          >
            <Section title={title} sentences={sentences} />

          </div>
        ))}
      </div>

      {/* 3D Background */}
      <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', zIndex:1}}>
        <Canvas>
          <OrbitControls enableZoom={false} enablePan={false} />
          <MainScene />
        </Canvas>
      </div>
    </div>
  );
}
