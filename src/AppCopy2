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

function Section({ title, sentences }) {
  const sectionRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    const sentenceEls = sectionEl.querySelectorAll('.sentence');

    // Height: we want enough scroll space for each sentence + some extra
    // For N sentences, let's create a scrollable area ~ (N+1)*100vh
    const totalSentences = sentences.length;
    const pinDuration = (totalSentences + 5) * window.innerHeight;

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
    const sectionHeight = (sentences.length + 5) * window.innerHeight; // Each sentence gets 1 viewport height
    sectionHeights[title] = {
      height: sectionHeight,
      start: cumulativeHeight
    };
    cumulativeHeight += sectionHeight;
  });

  return sectionHeights;
}
export default function App() {
  const sectionHeights = calculateSectionHeights(rawContext);
  // Convert rawContext to an array of sections for easier rendering
  const sections = Object.entries(rawContext); 
  // sections = [ [title, [sentences...]], [title, [sentences...]] ]

  return (
    <div style={{margin:0, padding:0}}>
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
          <Scene />
        </Canvas>
      </div>
    </div>
  );
}
