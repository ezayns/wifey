// src/components/RainEffect.jsx
import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'

export default function RainEffect({ pointsRef, active }) {
  const velocities = useRef([])
  const originalPositions = useRef([])

  useEffect(() => {
    if (!pointsRef.current || !active) return
    
    const positions = pointsRef.current.geometry.attributes.position.array
    const count = positions.length / 3
    
    // Store original positions when rain starts
    originalPositions.current = new Float32Array(positions.length)
    for (let i = 0; i < positions.length; i++) {
      originalPositions.current[i] = positions[i]
    }
    
    // Initialize velocities for each particle
    for (let i = 0; i < count; i++) {
      velocities.current[i] = {
        y: 0.02 + Math.random() * 0.03, // Fall speed
        x: (Math.random() - 0.5) * 0.01, // Horizontal drift
        z: (Math.random() - 0.5) * 0.01
      }
    }
  }, [active])

  useFrame(() => {
    if (!pointsRef.current || !active) return
    
    const positions = pointsRef.current.geometry.attributes.position.array
    const count = positions.length / 3
    
    for (let i = 0; i < count; i++) {
      // Make particles fall down
      positions[i * 3 + 1] -= velocities.current[i]?.y || 0.02
      
      // Add slight horizontal movement for realism
      positions[i * 3] += velocities.current[i]?.x || 0
      positions[i * 3 + 2] += velocities.current[i]?.z || 0
      
      // If they fall too low, reset them higher up
      if (positions[i * 3 + 1] < -10) {
        // Reset to top but keep some randomness
        positions[i * 3] = (Math.random() - 0.5) * 20
        positions[i * 3 + 1] = 12 + Math.random() * 6
        positions[i * 3 + 2] = (Math.random() - 0.5) * 15
      }
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return null
}