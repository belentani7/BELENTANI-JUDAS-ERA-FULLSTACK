import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, PerformanceMonitor, Sparkles } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import type { Group } from 'three'
import type { HomeDirectionId } from './homeDirections'
import { LivingDiamondWorld } from './LivingDiamondWorld'
import { QuintessenceWorld } from './QuintessenceWorld'
import type { QuintessencePhase } from './QuintessenceWorld'

interface HomeArtifactSceneProps {
  readonly direction: HomeDirectionId
  readonly accent: string
  readonly motionEnabled: boolean
  readonly maximumIllumination: boolean
  readonly quintessencePhase: QuintessencePhase
}

interface ArtifactProps {
  readonly direction: HomeDirectionId
  readonly accent: string
}

interface ContextGuardProps {
  readonly onLost: () => void
  readonly onRestored: () => void
}

function useCompactExperience(): boolean {
  const query = '(max-width: 760px), (prefers-reduced-motion: reduce)'
  const [compact, setCompact] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const media = window.matchMedia(query)
    const update = () => setCompact(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return compact
}

function WebglContextGuard({ onLost, onRestored }: ContextGuardProps) {
  const canvas = useThree((state) => state.gl.domElement)

  useEffect(() => {
    const handleLost = (event: Event) => {
      event.preventDefault()
      onLost()
    }
    canvas.addEventListener('webglcontextlost', handleLost)
    canvas.addEventListener('webglcontextrestored', onRestored)
    return () => {
      canvas.removeEventListener('webglcontextlost', handleLost)
      canvas.removeEventListener('webglcontextrestored', onRestored)
    }
  }, [canvas, onLost, onRestored])

  return null
}

function Artifact({ direction, accent }: ArtifactProps) {
  const group = useRef<Group>(null)

  useFrame((state, delta) => {
    if (!group.current) return
    group.current.rotation.y += delta * 0.08
    group.current.rotation.x += (state.pointer.y * 0.18 - group.current.rotation.x) * 0.035
    group.current.rotation.z += (state.pointer.x * 0.12 - group.current.rotation.z) * 0.035
  })

  const material = (
    <meshPhysicalMaterial
      color={accent}
      emissive={accent}
      emissiveIntensity={0.16}
      metalness={0.82}
      roughness={0.18}
      clearcoat={1}
      clearcoatRoughness={0.08}
      iridescence={0.65}
      wireframe={direction === 'body'}
    />
  )

  return (
    <group ref={group} scale={direction === 'portal' ? 1.15 : 0.92}>
      <Float speed={1.25} rotationIntensity={0.2} floatIntensity={0.35}>
        <mesh rotation={[0.48, 0.26, -0.16]}>
          {direction === 'ritual' && <octahedronGeometry args={[1.32, 3]} />}
          {direction === 'archive' && <torusKnotGeometry args={[0.98, 0.19, 180, 24, 3, 5]} />}
          {direction === 'body' && <icosahedronGeometry args={[1.35, 4]} />}
          {direction === 'portal' && <torusGeometry args={[1.12, 0.14, 32, 180]} />}
          {material}
        </mesh>
        {direction === 'portal' && (
          <mesh rotation={[1.18, 0.32, 0.74]} scale={0.72}>
            <torusGeometry args={[1.12, 0.08, 24, 140]} />
            {material}
          </mesh>
        )}
      </Float>
    </group>
  )
}

function SceneFallback({ direction, phase, contextLost = false }: {
  readonly direction: HomeDirectionId
  readonly phase: QuintessencePhase
  readonly contextLost?: boolean
}) {
  return (
    <div
      className="home-artifact-fallback"
      data-direction={direction}
      data-state={direction === 'quintessence' ? phase : undefined}
      data-context-lost={contextLost || undefined}
      aria-hidden="true"
    />
  )
}

export function HomeArtifactScene({ direction, accent, motionEnabled, maximumIllumination, quintessencePhase }: HomeArtifactSceneProps) {
  const compact = useCompactExperience()
  const [quality, setQuality] = useState(0.72)
  const [contextLost, setContextLost] = useState(false)
  const dpr: [number, number] = [1, direction === 'quintessence' ? 1 + quality * 0.42 : 1 + quality * 0.62]

  if (compact || !motionEnabled) return <SceneFallback direction={direction} phase={quintessencePhase} />

  return (
    <div className="home-artifact-stage" data-context-state={contextLost ? 'lost' : 'ready'} aria-hidden="true">
      {contextLost && <SceneFallback direction={direction} phase={quintessencePhase} contextLost />}
      <Canvas
        className="home-artifact-canvas"
        camera={{ position: [0, 0, 4.3], fov: 42 }}
        dpr={dpr}
        gl={{ alpha: true, antialias: quality > 0.42, powerPreference: 'high-performance' }}
      >
        <WebglContextGuard onLost={() => setContextLost(true)} onRestored={() => setContextLost(false)} />
        <PerformanceMonitor
          bounds={(refreshRate) => refreshRate > 90 ? [55, 90] : [42, 58]}
          flipflops={3}
          onChange={({ factor }) => setQuality(factor)}
          onFallback={() => setQuality(0.25)}
        />
        {direction !== 'quintessence' && <ambientLight intensity={direction === 'portal' ? 0.12 : 0.34} />}
        {direction !== 'quintessence' && <directionalLight position={[4, 5, 5]} intensity={direction === 'portal' ? 0.7 : 2.4} color={accent} />}
        {direction !== 'quintessence' && <pointLight position={[-4, -2, 3]} intensity={direction === 'portal' ? 7 : 28} color="#ffffff" distance={9} />}
        {direction === 'quintessence' ? (
          <QuintessenceWorld phase={quintessencePhase} quality={quality} />
        ) : direction === 'portal' ? (
          <LivingDiamondWorld maximumIllumination={maximumIllumination} />
        ) : (
          <Artifact direction={direction} accent={accent} />
        )}
        {direction !== 'quintessence' && <Sparkles count={Math.round(36 + quality * 54)} scale={[7, 5, 3]} size={1.4} speed={0.14} color={accent} opacity={0.42} />}
      </Canvas>
    </div>
  )
}
