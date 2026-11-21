import { OrbitControls, Sparkles } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react'
import * as THREE from 'three'

type SignalSceneProps = {
  className?: string
  label?: string
}

const gems = [
  { color: '#ee536b', position: [-2.15, 0.78, 0.15], scale: 0.58, speed: 0.32 },
  { color: '#63b6d8', position: [-0.85, -0.65, 0.3], scale: 0.46, speed: 0.46 },
  { color: '#8ed17e', position: [0.55, 0.9, -0.2], scale: 0.63, speed: 0.28 },
  { color: '#e7a851', position: [1.88, -0.35, 0.2], scale: 0.5, speed: 0.4 },
  { color: '#9d75d7', position: [0.2, -1.38, -0.25], scale: 0.4, speed: 0.52 },
] as const

const visuallyHidden: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return reduced
}

function useSceneActive(root: RefObject<HTMLDivElement | null>) {
  const [active, setActive] = useState(true)
  const intersecting = useRef(true)

  useEffect(() => {
    const updateActiveState = () => setActive(document.visibilityState === 'visible' && intersecting.current)
    const observer = new IntersectionObserver(
      ([entry]) => {
        intersecting.current = entry.isIntersecting
        updateActiveState()
      },
      { threshold: 0.02 },
    )
    const element = root.current
    if (element) observer.observe(element)
    document.addEventListener('visibilitychange', updateActiveState)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', updateActiveState)
    }
  }, [root])

  return active
}

function Gem({ color, position, scale, speed, reducedMotion }: (typeof gems)[number] & { reducedMotion: boolean }) {
  const mesh = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (!mesh.current || reducedMotion) return
    mesh.current.rotation.x += delta * speed * 0.38
    mesh.current.rotation.y += delta * speed
    mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed + position[0]) * 0.08
  })

  return (
    <mesh ref={mesh} position={position} scale={scale} castShadow>
      <icosahedronGeometry args={[1, 1]} />
      <meshPhysicalMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.2}
        metalness={0.38}
        roughness={0.17}
        clearcoat={0.85}
        clearcoatRoughness={0.12}
      />
    </mesh>
  )
}

function GoldenKey({ reducedMotion }: { reducedMotion: boolean }) {
  const key = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (!key.current || reducedMotion) return
    key.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.35) * 0.1 - 0.2
    key.current.rotation.y += delta * 0.12
  })

  return (
    <group ref={key} position={[0, 0.05, 0]} rotation={[0.22, -0.35, -0.2]}>
      <mesh castShadow>
        <torusGeometry args={[0.47, 0.1, 14, 40]} />
        <meshStandardMaterial color="#d6a33d" emissive="#8d5b12" emissiveIntensity={0.4} metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0.88, 0, 0]} castShadow>
        <boxGeometry args={[1.35, 0.17, 0.17]} />
        <meshStandardMaterial color="#e7bd57" metalness={0.95} roughness={0.18} />
      </mesh>
      <mesh position={[1.45, -0.18, 0]} castShadow>
        <boxGeometry args={[0.18, 0.38, 0.17]} />
        <meshStandardMaterial color="#c88a26" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[1.05, -0.13, 0]} castShadow>
        <boxGeometry args={[0.16, 0.28, 0.17]} />
        <meshStandardMaterial color="#c88a26" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  )
}

function Scene({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <>
      <color attach="background" args={['#100e15']} />
      <fog attach="fog" args={['#100e15', 5, 12]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 5]} intensity={2.4} color="#fff4d5" castShadow />
      <pointLight position={[-3, -1, 2]} intensity={8} color="#b85cff" distance={7} />
      <GoldenKey reducedMotion={reducedMotion} />
      {gems.map((gem) => <Gem key={gem.color} {...gem} reducedMotion={reducedMotion} />)}
      <Sparkles count={reducedMotion ? 20 : 58} scale={[7, 4.5, 4]} size={1.8} speed={reducedMotion ? 0 : 0.45} color="#f5d77f" />
      <OrbitControls enablePan={false} enableZoom={false} rotateSpeed={0.45} />
    </>
  )
}

function SceneFallback() {
  return <p style={{ color: '#f6e6b2', padding: '1rem', fontFamily: 'sans-serif' }}>Signal scene unavailable. Five gems and a golden key remain available as text.</p>
}

export function SignalScene({ className, label = 'Five gems orbiting a golden key' }: SignalSceneProps) {
  const root = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const active = useSceneActive(root)

  return (
    <div ref={root} className={className} style={{ position: 'relative', width: '100%', minHeight: '100dvh', overflow: 'hidden', background: '#100e15' }}>
      <Canvas
        aria-label={label}
        camera={{ position: [0, 0, 6], fov: 42 }}
        dpr={[1, 1.75]}
        frameloop={active && !reducedMotion ? 'always' : 'demand'}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        shadows
        fallback={<SceneFallback />}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Scene reducedMotion={reducedMotion} />
      </Canvas>
      <p style={visuallyHidden}>
        {label}. The scene contains five colored gem forms around a golden key. Motion pauses when this section is hidden and respects reduced-motion preferences.
      </p>
    </div>
  )
}

export default SignalScene
