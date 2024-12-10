import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { CustomEase } from 'gsap/all';
//gsap.registerPlugin(ScrollTrigger);

import { OrbitControls, useGLTF } from '@react-three/drei';


function Arc({
  radius = 3,
  itemCount = 5,
  arcDegrees = 90,
  offsetStartDegrees,
  onTransitionComplete,
    timeline,
}) {
  const items = Array.from({ length: itemCount }, (_, i) => i);

  // Refs to keep track of groups and spheres
  const groupsRef = useRef([]);
  const spheresRef = useRef([]);
  const maskRefs = useRef([]);
const { scene: maskModel } = useGLTF('maskBEST.glb')
  // Load the Cottage model
  const { scene: cottageModel } = useGLTF('Cottage.glb');

  // Label file paths in the order they should be displayed
  const labelPaths = [
    'guiterB.glb',
    'Mazda.glb',
    'betterbetterpump.glb',
    'Phone.glb',
    'Perfume bottle.glb',
  ];

  // Load all label models using `useGLTF`
  const labelModels = labelPaths.map((path) => useGLTF(path));


useEffect(() => {
  if (!maskModel) return;

  maskModel.traverse((child) => {
    if (child.isMesh) {
      if (Array.isArray(child.material)) {
        child.material.forEach((material) => {
          material.transparent = true;
          material.opacity = 0;
          material.depthWrite = false; // Prevent depth issues
        });
      } else if (child.material) {
        child.material.transparent = true;
        child.material.opacity = 0;
        child.material.depthWrite = false; // Prevent depth issues
      }
    }
  });
}, [maskModel]);



useGSAP(() => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#section-start',
      start: 'top top',
      end: 'bottom',
      scrub: true,
      markers: false, // Debugging markers
    },
  });

  const t2 = gsap.timeline({
    scrollTrigger: {
      trigger: '#section-hope',
      start: 'top top',
      end: 'bottom',
      scrub: true,
      markers: false, // Debugging markers
    },
  });

  const t3 = gsap.timeline({
    scrollTrigger: {
      trigger: '#idName-2',
      start: 'top top',
      end: '',
      scrub: true,
      markers: false, // Debugging markers
    },
  });
  // Animate the opacity of masks to fade out
  maskRefs.current.forEach((mask) => {
      console.log(mask)
    if (mask.material || true) {
        console.log("UES")
      t2.to(
        mask.children[0].children[0].children[0].material, // Ensure GSAP targets the material's opacity
        {
          opacity: 1,
          ease: 'power1',
        },
        0 // Start at the same time (relative to timeline start)
      );
    }
  });

  // Animate the opacity of spheres to fade out
  spheresRef.current.forEach((sphere) => {

      console.log(sphere)
    if (sphere.material) {
        console.log("JKFL")
      tl.to(
        sphere.material, // Ensure GSAP targets the material's opacity
        {
          opacity: 0,
          ease: '',
        },
        0 // Start at the same time (relative to timeline start)
      );
    }
  });


  // Animate the opacity of spheres to fade out
  spheresRef.current.forEach((sphere) => {

      console.log(sphere)
    if (sphere.material) {
        console.log("JKFL")
      t3.to(
        sphere.material, // Ensure GSAP targets the material's opacity
        {
          opacity: 1,
          ease: '',
        },
      );
    }
  });

  // Add a callback when the animation completes
  tl.call(onTransitionComplete);

}, [onTransitionComplete, maskModel]);

  return (
    <>
      {items.map((i) => {
        const angle = THREE.MathUtils.degToRad(
          offsetStartDegrees - arcDegrees / 2 + (i * arcDegrees) / (itemCount - 1)
        );
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle) - 4;

        return (
          <group
            key={i}
            ref={(el) => (groupsRef.current[i] = el)}
            position={[x, y, 0]}
          >
            {/* Elliptical Blue Sphere */}
            <mesh
              ref={(el) => (spheresRef.current[i] = el)}
              scale={[2, 3, 1.5]} // Scale to make the sphere elliptical
              position={[0, -1, -4]}
            >
              <sphereGeometry args={[0.5, 32, 32]} />
              <meshStandardMaterial
                color="blue"
                transparent
                opacity={1} // Start fully visible
              />
            </mesh>

            {/* Cottage Model */}
            <primitive
              object={cottageModel.clone()}
              position={[0, -1, -5]}
              scale={[0.8, 0.8, 0.8]}
            />

            {/* Label Model */}
            <primitive
              object={labelModels[i].scene.clone()}
              position={[0, -0.5, -5]} // Adjust position to place above the Cottage
              scale={[0.3, 0.3, 0.3]}
            />



            <primitive
                object={maskModel.clone()}
                ref={(el) => (maskRefs.current[i] = el)}
                position={[0, -0.5, -5]}
                scale={[0.1, 0.1, 0.1]}
            />
          </group>

        );
      })}
    </>
  );
}


        function Arc44({
        radius = 3,
        itemCount = 5,
        arcDegrees = 90,
        offsetStartDegrees,
        onTransitionComplete,
        }) {
        const items = Array.from({ length: itemCount }, (_, i) => i);

        // Refs to track groups and sphere materials for animations
        const groupsRef = useRef([]);
        const spheresRef = useRef([]);

        // Load the Cottage model once (can be reused)
        const { scene: cottageModel } = useGLTF('Cottage.glb');

        // Label file paths in the order they should be displayed
        const labelPaths = [
            'guiterB.glb',
            'Mazda.glb',
            'betterbetterpump.glb',
            'Phone.glb',
            'Perfume bottle.glb',
        ];

        // Load all label models using `useGLTF`
        const labelModels = labelPaths.map((path) => useGLTF(path));

        useEffect(() => {
            // Animate the opacity of the blue spheres to fade out
            const timeline = gsap.timeline();

            timeline.to(
            spheresRef.current.map((sphere) => sphere.material),
            {
                opacity: 0,
                duration: .4,
                onComplete: onTransitionComplete,
            }
            );
        }, [onTransitionComplete]);

        return (
            <>
            {items.map((i) => {
                const angle = THREE.MathUtils.degToRad(
                offsetStartDegrees - arcDegrees / 2 + (i * arcDegrees) / (itemCount - 1)
                );
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle) - 4;

                return (
                <group
                    key={i}
                    ref={(el) => (groupsRef.current[i] = el)}
                    position={[x, y, 0]}
                >
                    {/* Encapsulating Blue Sphere (Ellipsoid) */}
                    <mesh
                    ref={(el) => (spheresRef.current[i] = el)}
                    position={[0, 0, 0]}
                    >
                    <sphereGeometry args={[0.5, 32, 32]} />
                    <meshStandardMaterial
                        color="blue"
                        transparent
                        opacity={1} // Initially fully opaque
                    />
                    <scale args={[1, 1.5, 1]} /> {/* Ellipsoid shape */}
                    </mesh>

                    {/* Cottage Model */}
                    <primitive
                    object={cottageModel.clone()}
                    position={[0, 0, 0]} // Position within the group
                    scale={[0.8, 0.8, 0.8]} // Adjust scale as needed
                    />

                    {/* Label Model */}
                    <primitive
                    object={labelModels[i].scene.clone()}
                    position={[0, 0.5, 0]} // Adjust position to place above the Cottage
                    scale={[0.3, 0.3, 0.3]} // Adjust scale as needed
                    />
                </group>
                );
            })}
            </>
        );
        }


    function ArcOLD({
    radius = 3,
    itemCount = 5,
    arcDegrees = 90,
    offsetStartDegrees,
    onTransitionComplete,
    timeline,
    }) {
    const items = Array.from({ length: itemCount }, (_, i) => i);

    // Refs to keep track of Cottage-Label groups
    const groupsRef = useRef([]);

    // Load the Cottage model once (can be reused)
    const { scene: cottageModel } = useGLTF('Cottage.glb');

    // Label file paths in the order they should be displayed
    const labelPaths = [
        'guiterB.glb',
        'Mazda.glb',
        'betterbetterpump.glb',
        'Phone.glb',
        'Perfume bottle.glb',
    ];

    // Load all label models using `useGLTF`
    const labelModels = labelPaths.map((path) => useGLTF(path));

    useEffect(() => {
        // Animate the opacity of the entire group (Cottage + Label)
        const timeline = gsap.timeline();

        timeline.to(groupsRef.current, {
        opacity: 1, // Make groups visible
        duration: 2,
        onComplete: onTransitionComplete,
        });
    }, [onTransitionComplete]);

    return (
        <>
        {items.map((i) => {
            const angle = THREE.MathUtils.degToRad(
            offsetStartDegrees - arcDegrees / 2 + (i * arcDegrees) / (itemCount - 1)
            );
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle) - 4;

            return (
            <group
                key={i}
                ref={(el) => (groupsRef.current[i] = el)}
                position={[x, y, 0]}
            >
                {/* Cottage Model */}
                <primitive
                object={cottageModel.clone()}
                position={[0, 0, 0]} // Position within the group
                scale={[0.8, 0.8, 0.8]} // Adjust scale as needed
                />

                {/* Label Model */}
                <primitive
                object={labelModels[i].scene.clone()}
                position={[0, .5, 0]} // Adjust position to place above the Cottage
                scale={[0.3, 0.3, 0.3]} // Adjust scale as needed
                />
            </group>
            );
        })}
        </>
    );
    }

function Scene({ radius, itemCount, arcDegrees, offsetStartDegrees, groupRef, timeline }) {

  useEffect(() => console.log("OFFSET", offsetStartDegrees))
  

  useGSAP(() => {
    const offsetStartDegrees = 130;


    // Create GSAP timeline
    timeline.set(groupRef.current.rotation, {
      z: THREE.MathUtils.degToRad(offsetStartDegrees), // Rotate arc
      x: THREE.MathUtils.degToRad(20), // Rotate arc
    })
    timeline.to(groupRef.current.rotation, {
      z: THREE.MathUtils.degToRad(-offsetStartDegrees + 130), // Rotate arc
      ease: "power1",
      scrollTrigger: {
        trigger: '#section-start', // Set containerRef as the trigger
        start: 'top top', // Start when top of container hits viewport top
        end: 'bottom center', // End when bottom of container hits viewport bottom
        scrub: true, // Sync animation with scroll
        markers: false, // Debug markers for troubleshooting
      },
    }).to(groupRef.current.position, {
        y: "+=0", 
        ease: "power1",
      scrollTrigger: {
        trigger: '#section-start', // Set containerRef as the trigger
        start: 'top top', // Start when top of container hits viewport top
        end: 'center top', // End when bottom of container hits viewport bottom
        scrub: true, // Sync animation with scroll
        markers: false, // Debug markers for troubleshooting
      },
    }
    ).to(groupRef.current.scale, {
  x: 1.9, // Scale x-axis by 2
  y: 1.9, // Scale y-axis by 2
  z: 1.9, // Scale z-axis by 2
  ease: "power1", // Easing for smooth transition
  scrollTrigger: {
    trigger: '#section-hope', // Set the section as the trigger
    start: 'center bottom', // Start when the center of the section is at the viewport bottom
    end: 'bottom bottom', // End when the section bottom hits the viewport bottom
    scrub: true, // Sync animation with scroll
    markers: false, // Debug markers for troubleshooting
  },
});
  }, [timeline]); // Empty dependency array ensures this runs only once

  return (
    <>
        <hemisphereLight
        skyColor={'#ffffff'}
        groundColor={'#888888'}
        intensity={0.8}
        />
        <group ref={groupRef}>
            <Arc
                radius={radius}
                itemCount={itemCount}
                arcDegrees={arcDegrees}
                offsetStartDegrees={90}
          onTransitionComplete={() =>
            console.log('Transition from blue spheres to cottages complete!')
          }
            timeline={timeline}
            />
        </group>
    </>
  );
}

export default function RotatingArcSection({ timeline, index }) {
  const containerRef = useRef(null);
  const groupRef = useRef(null);

  const calculateRadius = () => 3; // Fixed radius for now


  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
      }}
    >
      <Canvas
        camera={{
          position: [0, 0, 5], // Center camera along Z-axis
          fov: 50, // Field of view to match viewport proportions
        }}
      >
        <Scene
          radius={calculateRadius()}
          itemCount={5}
          arcDegrees={90}
          offsetStartDegrees={90}
          groupRef={groupRef}
          timeline={timeline}
        />
      </Canvas>

    </div>
  );
}
export { Scene as StartRingScene};
