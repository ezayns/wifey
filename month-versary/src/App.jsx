import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Scene from "./components/Scene";

export default function App() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "black",
        overflow: "hidden"
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Scene />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}