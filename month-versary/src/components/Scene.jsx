import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
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
  const pointsRef = useRef();
  const audioRef = useRef();

  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState(0);
  const [targetPositions, setTargetPositions] = useState(null);
  const [showMyText, setShowMyText] = useState(true);

  const [typedLine1, setTypedLine1] = useState("");
  const [typedLine2, setTypedLine2] = useState("");

  const [fadeOpacity, setFadeOpacity] = useState(0);
  const [introPulse, setIntroPulse] = useState(1);

  const currentPosRef = useRef(useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return positions;
  }, []));

  const velocityRef = useRef(new Float32Array(PARTICLE_COUNT * 3));

  const colors = useMemo(() => ({
    crownShape: "#ffcc00",
    heart: "#ff4d6d",
    tree: "#2ecc71",
    rose: "#ff1493",
    stars: "#f1c40f",
    explosion: "#ffaa00",
    rain: "#3498db"
  }), []);

  /* =========================
     INTRO ANIMATION
  ==========================*/
  useFrame(({ clock }) => {
    if (!started) {
      const t = clock.getElapsedTime();
      setIntroPulse(1 + Math.sin(t * 2) * 0.1);
    }
  });

  /* =========================
     HANDLE START CLICK + AUDIO
  ==========================*/
  const handleStart = () => {
    setStarted(true);

    if (!audioRef.current) {
      audioRef.current = new Audio("/music/myTech.mp3"); // put your file in public/music/
      audioRef.current.loop = true; // loop background music
      audioRef.current.play().catch((err) => {
        console.log("Audio play blocked (user interaction needed):", err);
      });
    }
  };

  /* =========================
     TIMELINE
  ==========================*/
  useEffect(() => {
    if (!started) return;

    const timeline = [
      { time: 0, phase: 0, positions: generateCrownShape(), color: colors.crownShape },
      { time: 4000, phase: 1, positions: generateHeart(), color: colors.heart },
      { time: 9000, phase: 2, positions: generateTree(), color: colors.tree },
      { time: 14000, phase: 3, positions: generateRose(), color: colors.rose },
      { time: 19000, phase: 4, positions: generateStars(), color: colors.stars },

      { time: 24000, phase: 5, positions: generateExplosion(), color: colors.explosion },
      { time: 29000, phase: 6, positions: generateRainFromCurrent(currentPosRef.current), color: colors.rain },
      { time: 34000, phase: 7, positions: null, color: null }
    ];

    const timeouts = timeline.map(({ time, phase, positions, color }) =>
      setTimeout(() => {
        setPhase(phase);
        setTargetPositions(positions);

        if (phase === 5) setShowMyText(false);

        if (pointsRef.current && color)
          pointsRef.current.material.color.set(color);
      }, time)
    );

    return () => timeouts.forEach(clearTimeout);
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
     TYPEWRITER EFFECT
  ==========================*/
  useEffect(() => {
    if (phase !== 7) return;

    const line1 = "HAPPY MONTH VERSARY BABE";
    const line2 = "I LOVE YOU";

    let i = 0;

    const interval1 = setInterval(() => {
      setTypedLine1(line1.slice(0, i + 1));
      i++;
      if (i >= line1.length) {
        clearInterval(interval1);

        let j = 0;
        const interval2 = setInterval(() => {
          setTypedLine2(line2.slice(0, j + 1));
          j++;
          if (j >= line2.length) clearInterval(interval2);
        }, 100);
      }
    }, 100);
  }, [phase]);

  return (
    <>
      <color attach="background" args={["#000"]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />

      {/* INTRO SCREEN */}
      {!started && (
        <mesh onClick={handleStart}>
          <planeGeometry args={[20, 20]} />
          <meshBasicMaterial color="black" />
          <Text
            position={[0, 0, 0.1]}
            fontSize={1.2 * introPulse}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            WELCOME
          </Text>
        </mesh>
      )}

      {started && phase < 7 && (
        <Points ref={pointsRef} positions={currentPosRef.current}>
          <PointMaterial
            transparent
            color={colors.crownShape}
            size={0.035}
            sizeAttenuation
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </Points>
      )}

      {started && showMyText && (
        <Text
          position={[0, 5, 0]}
          fontSize={1}
          color="#ffcc00"
          anchorX="center"
          anchorY="middle"
        >
          MY
        </Text>
      )}

      {started && phase === 7 && (
        <>
          <Text position={[0, 1, 0]} fontSize={0.8} color="#ff69b4" anchorX="center" anchorY="middle">
            {typedLine1}
          </Text>
          <Text position={[0, 0, 0]} fontSize={0.8} color="#ff69b4" anchorX="center" anchorY="middle">
            {typedLine2}
          </Text>
        </>
      )}

      {/* CINEMATIC FADE TO BLACK */}
      {fadeOpacity > 0 && (
        <mesh>
          <planeGeometry args={[20, 20]} />
          <meshBasicMaterial color="black" transparent opacity={fadeOpacity} />
        </mesh>
      )}
    </>
  );
}
