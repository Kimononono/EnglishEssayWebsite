import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { gsap } from 'gsap';
import "./test.css";
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);
const SectionN = React.forwardRef(({ title, sentences, tl, index }, ref) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!tl || !sectionRef.current) return;
    const sectionEl = sectionRef.current;
    const sentenceEls = sectionEl.querySelectorAll('.sentence');

    // Add this section’s animations to the master timeline
    // Stagger them or place them at the end of the TL so they run in sequence
    sentenceEls.forEach((el, i) => {
      // We'll add them after some offset (like "+=0.5") or rely on the natural sequence
      tl.fromTo(el, {opacity:0, y:50}, {opacity:1, y:10, duration:0.2}, `+=0.3`);
    });
  }, [tl, sentences]);

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
});




function Section({ title, sentences, masterTimeline, index, idName }) {
  const sectionRef = useRef(null);

  // Helper function to calculate the pin offset for a given index
  const pinOffsetFormula = (i) => i * window.innerHeight * 0.5;

  // Helper function to calculate the total aggregate pin duration
  const calculateAggregatePinDuration = () =>
    sentences.reduce((total, _, i) => total + pinOffsetFormula(i), 0);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    const sentenceEls = sectionEl.querySelectorAll(".sentence");

    // Calculate the aggregate pin duration and set the section height
    const aggregatePinDuration = calculateAggregatePinDuration();
    const paddingHeight = 200; // Add extra padding (e.g., 200px)
    const totalHeight = aggregatePinDuration + paddingHeight;
    sectionEl.style.height = `${totalHeight}px`;

    // Create a standalone miniTimeline
    const tlMini = gsap.timeline();

    // Add animations to the miniTimeline
    sentenceEls.forEach((el, i) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: el,
            start: `top+=${pinOffsetFormula(i)} center`, // Use the pin offset formula
            end: "top bottom",
            scrub: false, // Smoothly tie animation to scroll
          },
        }
      );
    });

    // Add the miniTimeline to the masterTimeline sequentially
    if (masterTimeline) {
      masterTimeline.add(tlMini);
    }

    // Add ScrollTrigger for visual pinning and scrubbing (does not affect timeline sequencing)
    ScrollTrigger.create({
      trigger: sectionEl,
      start: "top top",
      end: `+=${aggregatePinDuration}`,
      pin: true,
      scrub: true,
    });

    return () => {
      tlMini.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [sentences, masterTimeline]);

  return (

<div
  ref={sectionRef}
  className="section-container"
  id={idName}
  style={{
    zIndex: (index + 1) * 10,
    padding: "20px", // General padding for the container
    borderRadius: "8px", // Optional, for rounded corners
      pointerEvents: "auto",
  }}
>
  <h2 className="section-title" style={{ marginBottom: "16px" }}>
    {title}
  </h2>
  <div
    className="sentences-wrapper"
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "16px", // Adds space between sentences
      overflow: "hidden", // Prevent overflow
    }}
  >
    {sentences.map((text, i) => (
      <p
        className="sentence"
        key={i}
        style={{
          margin: 0,
          padding: "12px", // Padding for the sentence
          background: "#ffffff", // Slightly lighter background for contrast
          borderRadius: "4px", // Rounded corners for sentences
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Subtle shadow
        }}
      >
        {text}
      </p>
    ))}
  </div>
</div>
  );
}

export default Section;
