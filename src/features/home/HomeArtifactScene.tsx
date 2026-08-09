import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import type { Group } from 'three'
import type { HomeDirectionId } from './homeDirections'
import { LivingDiamondWorld } from './LivingDiamondWorld'
import { QuintessenceWorld } from './QuintessenceWorld'

interface HomeArtifactSceneProps {
  readonly direction: HomeDirectionId
  readonly accent: string
  readonly motionEnabled: boolean
  readonly maximumIllumination: boolean
  readonly quintessenceGathered: boolean
}

interface ArtifactProps {
  readonly direction: HomeDirectionId
  readonly accent: string
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

export function HomeArtifactScene({ direction, accent, motionEnabled, maximumIllumination, quintessenceGathered }: HomeArtifactSceneProps) {
  const compact = useCompactExperience()
  if (compact || !motionEnabled) {
    return (
      <div
        className="home-artifact-fallback"
        data-direction={direction}
        data-gathered={direction === 'quintessence' && quintessenceGathered ? true : undefined}
        aria-hidden="true"
      />
    )
  }

  return (
    <Canvas
      className="home-artifact-canvas"
      camera={{ position: [0, 0, 4.3], fov: 42 }}
      dpr={direction === 'quintessence' ? [1, 1.25] : [1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      aria-hidden="true"
    >
      {direction !== 'quintessence' && <ambientLight intensity={direction === 'portal' ? 0.12 : 0.34} />}
      {direction !== 'quintessence' && <directionalLight position={[4, 5, 5]} intensity={direction === 'portal' ? 0.7 : 2.4} color={accent} />}
      {direction !== 'quintessence' && <pointLight position={[-4, -2, 3]} intensity={direction === 'portal' ? 7 : 28} color="#ffffff" distance={9} />}
      {direction === 'quintessence' ? (
        <QuintessenceWorld gathered={quintessenceGathered} />
      ) : direction === 'portal' ? (
        <LivingDiamondWorld maximumIllumination={maximumIllumination} />
      ) : (
        <Artifact direction={direction} accent={accent} />
      )}
      {direction !== 'quintessence' && <Sparkles count={70} scale={[7, 5, 3]} size={1.4} speed={0.14} color={accent} opacity={0.42} />}
    </Canvas>
  )
}
