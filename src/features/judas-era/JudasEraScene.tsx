import { AdaptiveDpr, AdaptiveEvents, Float, MeshDistortMaterial, Sparkles } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, type MutableRefObject } from 'react'
import * as THREE from 'three'
import type { JudasEraSceneState } from './judasEra.types'

interface JudasEraSceneProps {
  readonly active: boolean
  readonly reducedMotion: boolean
  readonly state: MutableRefObject<JudasEraSceneState>
}

function seeded(index: number, salt: number): number {
  const value = Math.sin(index * 9283.31 + salt * 77.17) * 43758.5453
  return value - Math.floor(value)
}

function MemoryFragments({ reducedMotion, state }: Omit<JudasEraSceneProps, 'active'>) {
  const fragments = useRef<THREE.InstancedMesh>(null)
  const count = 96
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useEffect(() => {
    const mesh = fragments.current
    if (!mesh) return
    for (let index = 0; index < count; index += 1) {
      const radius = 2.7 + seeded(index, 1) * 4.8
      const angle = seeded(index, 2) * Math.PI * 2
      dummy.position.set(Math.cos(angle) * radius, (seeded(index, 3) - 0.5) * 7, Math.sin(angle) * radius - 1)
      dummy.rotation.set(seeded(index, 4) * Math.PI, seeded(index, 5) * Math.PI, angle)
      const scale = 0.04 + seeded(index, 6) * 0.17
      dummy.scale.set(scale * 0.34, scale * 2.8, scale)
      dummy.updateMatrix()
      mesh.setMatrixAt(index, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  }, [dummy])

  useFrame((frame, delta) => {
    const mesh = fragments.current
    if (!mesh || reducedMotion) return
    mesh.rotation.y += delta * (0.018 + state.current.progress * 0.05)
    mesh.rotation.z = Math.sin(frame.clock.elapsedTime * 0.08) * 0.08
  })

  return (
    <instancedMesh ref={fragments} args={[undefined, undefined, count]}>
      <tetrahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#8f0c1d" emissive="#ff1738" emissiveIntensity={0.42} metalness={0.88} roughness={0.24} />
    </instancedMesh>
  )
}

function Artifact({ reducedMotion, state }: Omit<JudasEraSceneProps, 'active'>) {
  const group = useRef<THREE.Group>(null)
  const knot = useRef<THREE.Mesh>(null)

  useFrame((frame, delta) => {
    if (!group.current || !knot.current) return
    const progress = state.current.progress
    const pointer = frame.pointer
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, pointer.x * 0.32 + progress * Math.PI * 1.2, 3.2, delta)
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, pointer.y * 0.18 - progress * 0.2, 3.2, delta)
    group.current.position.z = THREE.MathUtils.damp(group.current.position.z, progress * 0.8, 2.5, delta)
    if (!reducedMotion) knot.current.rotation.z += delta * 0.07
  })

  return (
    <group ref={group}>
      <Float speed={reducedMotion ? 0 : 0.75} rotationIntensity={reducedMotion ? 0 : 0.12} floatIntensity={reducedMotion ? 0 : 0.18}>
        <mesh ref={knot} scale={1.32}>
          <torusKnotGeometry args={[1.04, 0.28, 180, 24, 2, 3]} />
          <MeshDistortMaterial color="#160208" emissive="#b90729" emissiveIntensity={0.62} metalness={0.92} roughness={0.12} distort={reducedMotion ? 0 : 0.22} speed={1.15} />
        </mesh>
        <mesh scale={2.15} rotation={[0.24, 0.52, 0]}>
          <icosahedronGeometry args={[1, 2]} />
          <meshPhysicalMaterial color="#ff2445" transmission={0.94} thickness={0.8} roughness={0.08} metalness={0.12} transparent opacity={0.16} wireframe />
        </mesh>
      </Float>
    </group>
  )
}

function Scene({ reducedMotion, state }: Omit<JudasEraSceneProps, 'active'>) {
  return (
    <>
      <color attach="background" args={['#030103']} />
      <fog attach="fog" args={['#030103', 6, 18]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 5, 4]} intensity={2.8} color="#ffe0c0" />
      <pointLight position={[-3, -1, 3]} intensity={18} distance={9} color="#ff002f" />
      <pointLight position={[4, 2, -2]} intensity={10} distance={8} color="#3994ff" />
      <Artifact reducedMotion={reducedMotion} state={state} />
      <MemoryFragments reducedMotion={reducedMotion} state={state} />
      <Sparkles count={reducedMotion ? 32 : 110} scale={[12, 9, 9]} size={1.6} speed={reducedMotion ? 0 : 0.22} color="#ff6b72" />
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </>
  )
}

export function JudasEraScene({ active, reducedMotion, state }: JudasEraSceneProps) {
  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 0, 7.5], fov: 44, near: 0.1, far: 40 }}
      dpr={[1, 1.65]}
      frameloop={active && !reducedMotion ? 'always' : 'demand'}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      fallback={<div className="judas-era__canvas-fallback" />}
    >
      <Scene reducedMotion={reducedMotion} state={state} />
    </Canvas>
  )
}
