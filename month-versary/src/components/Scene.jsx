import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, Text } from "@react-three/drei";
import * as THREE from "three";
import {
  generateCrownShape,
  generateHeart,
  generateTree,
  generateRose,
  generateStars,
  generateExplosion,
  generateRainFromCurrent
} from "../utils/shapes";

const PARTICLE_COUNT = 1500;

export default function Scene() {
  const { camera, size } = useThree();

  const pointsRef = useRef();
  const audioRef = useRef();

  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState(0);
  const [targetPositions, setTargetPositions] = useState(null);
  const [showMyText, setShowMyText] = useState(true);

  const [phaseText, setPhaseText] = useState("");
  const [typedFinal1, setTypedFinal1] = useState("");
  const [typedFinal2, setTypedFinal2] = useState("");

  const [fadeOpacity, setFadeOpacity] = useState(0);
  const [introPulse, setIntroPulse] = useState(1);

  const isMobile = size.width < 768;

  /* =========================
     RESPONSIVE CAMERA
  ==========================*/
  useEffect(() => {
    camera.position.z = isMobile ? 10 : 8;
  }, [isMobile, camera]);

  /* =========================
     INITIAL PARTICLE CLOUD
  ==========================*/
  const initialPositions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, []);

  const currentPosRef = useRef(initialPositions);
  const velocityRef = useRef(new Float32Array(PARTICLE_COUNT * 3));

  const colors = {
    crown: "#ffcc00",
    heart: "#ff4d6d",
    tree: "#2ecc71",
    rose: "#ff1493",
    stars: "#f1c40f",
    explosion: "#ffaa00",
    rain: "#3498db"
  };

  /* =========================
     PHASE MESSAGES
  ==========================*/
  const phaseMessages = [
    "Hello My Queen", // phase 0
    "My Heart",       // phase 1
    "My Peace",       // phase 2
    "My Flower",      // phase 3
    "My World"        // phase 4
  ];

  /* =========================
     INTRO PULSE
  ==========================*/
  useFrame(({ clock }) => {
    if (!started) {
      const t = clock.getElapsedTime();
      setIntroPulse(1 + Math.sin(t * 2) * 0.1);
    }
  });

  /* =========================
     START AUDIO ON CLICK
  ==========================*/
  useEffect(() => {
    if (!started) return;
    if (!audioRef.current) {
      audioRef.current = new Audio("/Slower.mp3"); // make sure Slower.mp3 is in public/
      audioRef.current.loop = true;
      audioRef.current.play().catch(e => console.log("Audio blocked:", e));
    }
  }, [started]);

  /* =========================
     TIMELINE
  ==========================*/
  useEffect(() => {
    if (!started) return;

    const timeline = [
      { time: 0, phase: 0, pos: generateCrownShape(), color: colors.crown },
      { time: 4000, phase: 1, pos: generateHeart(), color: colors.heart },
      { time: 9000, phase: 2, pos: generateTree(), color: colors.tree },
      { time: 14000, phase: 3, pos: generateRose(), color: colors.rose },
      { time: 19000, phase: 4, pos: generateStars(), color: colors.stars },
      { time: 24000, phase: 5, pos: generateExplosion(), color: colors.explosion },
      { time: 29000, phase: 6, pos: generateRainFromCurrent(currentPosRef.current), color: colors.rain },
      { time: 34000, phase: 7, pos: null, color: null }
    ];

    const timers = timeline.map(item =>
      setTimeout(() => {
        setPhase(item.phase);
        setTargetPositions(item.pos);

        // PHASE 0–4 TEXT
        if (item.phase >= 0 && item.phase <= 4) {
          setPhaseText(phaseMessages[item.phase]);
        }

        // PHASE 5: hide emoji & text
        if (item.phase === 5) {
          setShowMyText(false);
          setPhaseText("");
        }

        if (pointsRef.current && item.color) {
          pointsRef.current.material.color.set(item.color);
        }
      }, item.time)
    );

    return () => timers.forEach(clearTimeout);
  }, [started]);

  /* =========================
     PARTICLE ANIMATION
  ==========================*/
  useFrame(() => {
    if (!pointsRef.current || !targetPositions) return;

    const positions = pointsRef.current.geometry.attributes.position.array;
    const velocities = velocityRef.current;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;

      if (phase === 6) {
        velocities[idx + 1] = velocities[idx + 1] || -0.05 - Math.random() * 0.05;
        positions[idx + 1] += velocities[idx + 1];
      } else {
        positions[idx] += (targetPositions[idx] - positions[idx]) * 0.05;
        positions[idx + 1] += (targetPositions[idx + 1] - positions[idx + 1]) * 0.05;
        positions[idx + 2] += (targetPositions[idx + 2] - positions[idx + 2]) * 0.05;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  /* =========================
     FINAL TYPEWRITER & CINEMATIC FADE
  ==========================*/
  useEffect(() => {
    if (phase !== 7) return;

    const line1 = "HAPPY MONTH VERSARY BABE";
    const line2 = "I LOVE YOU";

    let i = 0;
    const int1 = setInterval(() => {
      setTypedFinal1(line1.slice(0, i + 1));
      i++;
      if (i >= line1.length) {
        clearInterval(int1);
        let j = 0;
        const int2 = setInterval(() => {
          setTypedFinal2(line2.slice(0, j + 1));
          j++;
          if (j >= line2.length) {
            clearInterval(int2);
            setTimeout(() => setFadeOpacity(1), 1500);
          }
        }, 100);
      }
    }, 100);
  }, [phase]);

  return (
    <>
      <color attach="background" args={["#000"]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />

      {!started && (
        <mesh onClick={() => setStarted(true)}>
          <planeGeometry args={[20, 20]} />
          <meshBasicMaterial color="black" />
          <Text fontSize={1.2 * introPulse} color="white">
            WELCOME
          </Text>
        </mesh>
      )}

      {started && phase < 7 && (
        <Points ref={pointsRef} positions={currentPosRef.current}>
          <PointMaterial
            transparent
            size={isMobile ? 0.03 : 0.04}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </Points>
      )}

      {started && showMyText && (
        <Text position={[0, 5, 0]} fontSize={isMobile ? 0.8 : 1} color="#ffcc00">
          😘
        </Text>
      )}

      {started && phaseText && (
        <Text position={[0, -4, 0]} fontSize={isMobile ? 0.6 : 0.8} color="white">
          {phaseText}
        </Text>
      )}

      {started && phase === 7 && (
        <>
          <Text position={[0, 1, 0]} fontSize={isMobile ? 0.6 : 0.8} color="#ff69b4">
            {typedFinal1}
          </Text>
          <Text position={[0, 0, 0]} fontSize={isMobile ? 0.6 : 0.8} color="#ff69b4">
            {typedFinal2}
          </Text>
        </>
      )}

      {fadeOpacity > 0 && (
        <mesh>
          <planeGeometry args={[20, 20]} />
          <meshBasicMaterial color="black" transparent opacity={fadeOpacity} />
        </mesh>
      )}
    </>
  );
}
