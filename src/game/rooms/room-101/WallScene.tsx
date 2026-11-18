'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { Component, Suspense, useEffect, useRef, type ReactNode } from 'react';
import { MathUtils, SRGBColorSpace } from 'three';
import { room101Walls } from '@/content/room-101/room';

const WIDTH = 12;
const HEIGHT = WIDTH * (1168 / 2112);
const HALF_TURN = Math.PI / 2;
const FOV = MathUtils.radToDeg(2 * Math.atan(HEIGHT / WIDTH));
const poses = [
  { position: [0, 0, -6], rotation: [0, 0, 0] },
  { position: [6, 0, 0], rotation: [0, -Math.PI / 2, 0] },
  { position: [0, 0, 6], rotation: [0, Math.PI, 0] },
  { position: [-6, 0, 0], rotation: [0, Math.PI / 2, 0] },
] as const;

function Walls() {
  const textures = useTexture(room101Walls.map((wall) => wall.image));

  useEffect(() => {
    textures.forEach((texture) => {
      texture.colorSpace = SRGBColorSpace;
      texture.needsUpdate = true;
    });
  }, [textures]);

  return <group>
    {poses.map((pose, index) => (
      <mesh key={room101Walls[index].id} position={[...pose.position]} rotation={[...pose.rotation]}>
        <planeGeometry args={[WIDTH, HEIGHT]} />
        <meshBasicMaterial map={textures[index]} toneMapped={false} />
      </mesh>
    ))}
    <mesh position={[0, -HEIGHT / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[WIDTH, WIDTH]} /><meshBasicMaterial color="#2a190d" />
    </mesh>
    <mesh position={[0, HEIGHT / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[WIDTH, WIDTH]} /><meshBasicMaterial color="#174844" />
    </mesh>
  </group>;
}

function CenterCamera({ turn, reducedMotion }: { turn: number; reducedMotion: boolean }) {
  const { camera, invalidate } = useThree();
  const start = useRef({ angle: 0, time: 0, target: 0 });

  useEffect(() => {
    start.current = { angle: camera.rotation.y, time: performance.now(), target: -turn * HALF_TURN };
    invalidate();
  }, [turn, camera, invalidate, reducedMotion]);

  useFrame(() => {
    const motion = start.current;
    const t = reducedMotion ? 1 : Math.min((performance.now() - motion.time) / 650, 1);
    const eased = t * t * (3 - 2 * t);
    camera.rotation.set(0, MathUtils.lerp(motion.angle, motion.target, eased), 0);
    if (t < 1) invalidate();
  });

  return null;
}

// The HTML artwork beneath the canvas keeps the same controls usable if WebGL fails.
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function WallScene({ turn, reducedMotion }: { turn: number; reducedMotion: boolean }) {
  return (
    <SceneBoundary>
      <Canvas frameloop="demand" dpr={[1, 1.5]} camera={{ position: [0, 0, 0], fov: FOV, near: 0.1, far: 25 }} fallback={null} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}><Walls /></Suspense>
        <CenterCamera turn={turn} reducedMotion={reducedMotion} />
      </Canvas>
    </SceneBoundary>
  );
}
