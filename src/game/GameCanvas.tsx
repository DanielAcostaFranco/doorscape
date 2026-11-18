'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';

function FoundationScene() {
  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[4, 8, 4]} intensity={2} castShadow />
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[2, 1, 2]} />
        <meshStandardMaterial color="#c28a45" />
      </mesh>
      <Grid args={[20, 20]} cellColor="#3b4655" sectionColor="#e3a84b" />
      <OrbitControls makeDefault />
    </>
  );
}

export function GameCanvas() {
  return (
    <Canvas shadows camera={{ position: [5, 4, 5], fov: 50 }}>
      <FoundationScene />
    </Canvas>
  );
}
