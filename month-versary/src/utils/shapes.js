const PARTICLE_COUNT = 1500;

// 👑 Crown Shape
export function generateCrownShape() {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const t = (i / PARTICLE_COUNT) * Math.PI * 2;
    const radius = 1 + Math.sin(5 * t) * 0.3;
    const x = radius * Math.cos(t);
    const y = 2 + Math.abs(Math.sin(3 * t)) * 0.5;
    const z = radius * Math.sin(t) * 0.3 + (Math.random() - 0.5) * 0.05;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }
  return positions;
}
// ❤️ Heart
export function generateHeart() {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const t = Math.random() * Math.PI * 2;
    const r = 0.8 + Math.random() * 0.2;

    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

    positions[i * 3] = (x * r) / 10;
    positions[i * 3 + 1] = (y * r) / 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
  }
  return positions;
}

// 🌳 Tree
export function generateTree() {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    if (i < PARTICLE_COUNT * 0.2) {
      // Trunk
      positions[i * 3] = (Math.random() - 0.5) * 0.2;
      positions[i * 3 + 1] = (i / (PARTICLE_COUNT * 0.2)) * 2 - 1;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
    } else {
      // Leaves
      const layer = Math.floor(Math.random() * 5);
      const layerHeight = 1 + layer * 0.4;
      const radius = 0.5 - layer * 0.08 + Math.random() * 0.05;
      const angle = Math.random() * Math.PI * 2;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = layerHeight + Math.random() * 0.2;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
  }
  return positions;
}

// 🌹 Rose
export function generateRose() {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const stemCount = Math.floor(PARTICLE_COUNT * 0.15);

  for (let i = 0; i < stemCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 0.05;
    positions[i * 3 + 1] = -1 + (i / stemCount) * 1.5;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
  }

  for (let i = stemCount; i < PARTICLE_COUNT; i++) {
    const t = Math.random() * Math.PI * 2;
    const k = 5;
    const r = 0.5 * Math.sin(k * t) + Math.random() * 0.05;
    const z = (Math.random() - 0.5) * 0.3;

    positions[i * 3] = r * Math.cos(t);
    positions[i * 3 + 1] = r * Math.sin(t) + 0.5;
    positions[i * 3 + 2] = z;
  }

  return positions;
}

// ⭐ Stars
export function generateStars() {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const radius = 4;
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(Math.random() * 2 - 1);

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
  }
  return positions;
}

// 💥 Explosion
export function generateExplosion() {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const radius = 8 + Math.random() * 5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
    positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * radius;
    positions[i * 3 + 2] = Math.cos(phi) * radius;
  }
  return positions;
}

// 🌧️ Rain
export function generateRainFromCurrent(currentPositions) {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3] = currentPositions[i * 3];
    positions[i * 3 + 1] = currentPositions[i * 3 + 1]; // start where explosion left them
    positions[i * 3 + 2] = currentPositions[i * 3 + 2];
  }
  return positions;
}