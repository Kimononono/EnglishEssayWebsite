import { useState, useEffect } from 'react'
import './App.css'

import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ConsumerSphere, BrandObject, BrandRing, Lights } from "./scene/objects"
import rawContext from './context';
import { MainScene } from './scene';

gsap.registerPlugin(ScrollTrigger);

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
