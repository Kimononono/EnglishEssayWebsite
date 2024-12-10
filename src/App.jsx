import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { gsap } from 'gsap';
//import "./test.css";
import { MainScene } from './scene';
import { Ring } from './scene/ringitems';
import * as THREE from 'three';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import RotatingRingSection from './ringSection';
import { DeeplScene } from './deepl';
import { useGSAP } from '@gsap/react';
import Section from './section';
import rawContext from './context';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(useGSAP);
gsap.registerPlugin(THREE)
// Custom hook for camera animation
export function useCameraAnimator(keyframes) {
  const { camera } = useThree();


  const moveToKeyframe = (index, duration = 1, easing = 'power2.inOut') => {
    const { position, rotation } = keyframes[index];

    gsap.to(camera.position, {
      x: position[0],
      y: position[1],
      z: position[2],
      duration,
      ease: easing,
    }).to(camera.rotation, {
      x: rotation[0],
      y: rotation[1],
      z: rotation[2],
      duration,
      ease: easing,
    });
  };

  return { moveToKeyframe };
}

// Keyframes for the camera animation
const cameraKeyframes = [
  { position: [0, 1, 5], rotation: [0, 0, 0] },
  { position: [5, 1, 0], rotation: [0, Math.PI / 2, 0] },
  { position: [0, 5, 0], rotation: [-Math.PI / 2, 0, 0] },
];

function Scene() {
  const { moveToKeyframe } = useCameraAnimator(cameraKeyframes);
  const scrollRef = useRef(0); // Track the current scroll index

    useEffect(() => {
    const handleResize = () => {
        ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    }, []);
  useEffect(() => {
    const handleScroll = (event) => {
      const delta = event.deltaY > 0 ? 1 : -1; // Scroll direction
      let newIndex = scrollRef.current + delta;

      // Clamp index within keyframes range
      newIndex = Math.max(0, Math.min(newIndex, cameraKeyframes.length - 1));

      if (newIndex !== scrollRef.current) {
        scrollRef.current = newIndex;
        moveToKeyframe(newIndex);
      }
    };

    window.addEventListener('wheel', handleScroll);
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [moveToKeyframe]);

  return (
    <>
      <ambientLight />
      <OrbitControls />
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>

      {/* Buttons to trigger keyframes */}
      <Html>
        <div style={{ position: 'absolute', top: 20, left: 20 }}>
          {cameraKeyframes.map((_, index) => (
            <button key={index} onClick={() => moveToKeyframe(index)}>
              Go to Keyframe {index + 1}
            </button>
          ))}
        </div>
      </Html>
    </>
  );
}

export default function App() {
  const [tl, setTl] = useState();
  const [tl2, setT2] = useState();
  const refs = useRef([]);

    useEffect(() => {
    // Ensure refs.current is a proper array
    if (!refs.current.length) {
        refs.current = Array(Object.keys(rawContext).length)
        .fill(null)
        .map(() => React.createRef());
    }
    }, [rawContext]);
  useGSAP(() => {
    const tl = gsap.timeline();
    setTl(tl);
    const t2 = gsap.timeline();
    setT2(t2);
  });

  useGSAP(() => {
  });
  return (
      <>
    <div

        id="section-start"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
        position: 'relative',
        backgroundColor: '#f0f0f0', // Optional background color
      }}
    >


<div
  style={{
    position: 'absolute',
    left: '10vw', // Adjust for desired left margin
    top: '50%',
    transform: 'translateY(-50%)', // Center vertically
    textAlign: 'left',
    zIndex: 50,
  }}
>
  <div
    style={{
      fontSize: '4rem',
      fontWeight: 'bold',
    }}
  >
    <div>Identity-Based Branding:</div>
    <div>Authentic or Exploitation?</div>
  </div>
  <div
    style={{
      textAlign: 'left',
      fontSize: '2rem',
      fontWeight: 'bold',
      marginTop: '20px', // Adjust for spacing between title and author
    }}
  >
    By Hunter
  </div>
</div>

    </div>

      {/*<Section title={Object.keys(rawContext)[0]} sentences={rawContext[Object.keys(rawContext)[0]]}  /> */}



<div className="container" style={{marginBottom: "100vh", overflowY: "hidden"}}>
  {Object.keys(rawContext).map((key, index) => {
    let idName = `idName-${index}`;
    if (index === 0) {
      idName = "section-hope";
    }

    // Ensure refs array has enough entries
    if (!refs.current[index]) refs.current[index] = React.createRef();

    return (
      <div key={idName} className="section">
        <Section
          title={key}
          sentences={rawContext[key]}
          idName={idName}
          masterTimeline={tl2} 
          index={index}
        />
        {index < Object.keys(rawContext).length - 1 && <div style={{ height: "20px" }}></div>}
      </div>
    );
  })}
</div>

        <RotatingRingSection timeline={tl2} index={0} />
      </>

  );
}
