import { Float } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { AdditiveBlending, Color, type Group, type ShaderMaterial } from 'three'
import fragmentShader from './living-diamond.fragment.glsl?raw'
import vertexShader from './living-diamond.vertex.glsl?raw'

const PARTICLE_COUNT = 4200

interface ParticleField {
  readonly world: Float32Array
  readonly diamond: Float32Array
  readonly scale: Float32Array
}

function createRandom(seed: number): () => number {
  let value = seed >>> 0
  return () => {
    value += 0x6d2b79f5
    let next = value
    next = Math.imul(next ^ (next >>> 15), next | 1)
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61)
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296
  }
}

function createParticleField(): ParticleField {
  const random = createRandom(7061995)
  const world = new Float32Array(PARTICLE_COUNT * 3)
  const diamond = new Float32Array(PARTICLE_COUNT * 3)
  const scale = new Float32Array(PARTICLE_COUNT)

  for (let index = 0; index < PARTICLE_COUNT; index += 1) {
    const offset = index * 3
    const theta = random() * Math.PI * 2
    const phi = Math.acos(2 * random() - 1)
    const radius = 1.75 + random() * 1.55
    world[offset] = Math.sin(phi) * Math.cos(theta) * radius
    world[offset + 1] = Math.cos(phi) * radius
    world[offset + 2] = Math.sin(phi) * Math.sin(theta) * radius * 0.52

    const section = random()
    const angle = random() * Math.PI * 2
    const progress = random()
    const crown = section < 0.38
    const girdle = section >= 0.38 && section < 0.58
    const width = crown ? 1.9 - progress * 0.45 : girdle ? 2.15 : (1 - progress) * 2.15
    diamond[offset] = Math.cos(angle) * width
    diamond[offset + 1] = crown ? 0.45 + progress * 1.35 : girdle ? 0.35 * (random() - 0.5) : 0.2 - progress * 2.55
    diamond[offset + 2] = Math.sin(angle) * width * 0.42
    scale[index] = 0.45 + random() * 1.25
  }

  return { world, diamond, scale }
}

export function LivingDiamondWorld() {
  const root = useRef<Group>(null)
  const orbit = useRef<Group>(null)
  const material = useRef<ShaderMaterial>(null)
  const field = useMemo(createParticleField, [])
  const uniforms = useMemo(
    () => ({
      uColor: { value: new Color('#ff315c') },
      uMorph: { value: 0 },
      uTime: { value: 0 },
    }),
    [],
  )

  useFrame((state, delta) => {
    const elapsed = state.clock.elapsedTime
    if (material.current) {
      material.current.uniforms.uTime.value = elapsed
      material.current.uniforms.uMorph.value = 0.5 + Math.sin(elapsed * 0.42 - 0.7) * 0.5
    }
    if (root.current) {
      root.current.rotation.y += delta * 0.035
      root.current.rotation.x += (state.pointer.y * 0.12 - root.current.rotation.x) * 0.025
      root.current.rotation.z += (state.pointer.x * 0.08 - root.current.rotation.z) * 0.025
    }
    if (orbit.current) {
      orbit.current.rotation.y = elapsed * 0.22
      orbit.current.rotation.z = Math.sin(elapsed * 0.28) * 0.2
    }
  })

  return (
    <group ref={root} scale={0.92} position={[0.35, 0, 0]}>
      <Float speed={0.8} rotationIntensity={0.08} floatIntensity={0.2}>
        <mesh>
          <sphereGeometry args={[1.16, 64, 64]} />
          <meshPhysicalMaterial
            color="#080104"
            emissive="#ff003c"
            emissiveIntensity={0.74}
            metalness={0.82}
            roughness={0.24}
            clearcoat={1}
          />
        </mesh>
        <mesh scale={1.025}>
          <icosahedronGeometry args={[1.16, 4]} />
          <meshBasicMaterial color="#ff315c" wireframe transparent opacity={0.12} />
        </mesh>
        <mesh rotation={[1.12, 0.2, 0.32]}>
          <torusGeometry args={[1.82, 0.018, 8, 180]} />
          <meshBasicMaterial color="#ff5675" transparent opacity={0.42} />
        </mesh>
        <mesh rotation={[0.74, -0.45, -0.18]}>
          <torusGeometry args={[2.22, 0.012, 8, 180]} />
          <meshBasicMaterial color="#ff9aae" transparent opacity={0.22} />
        </mesh>
      </Float>

      <group ref={orbit} rotation={[0.42, 0, -0.12]}>
        <Float speed={1.15} rotationIntensity={0.42} floatIntensity={0.18}>
          <mesh position={[2.58, 0, 0]} scale={[0.52, 0.82, 0.52]} rotation={[0.08, 0.24, 0.1]}>
            <octahedronGeometry args={[0.68, 2]} />
            <meshPhysicalMaterial
              color="#ff8ba0"
              emissive="#ff174d"
              emissiveIntensity={0.48}
              metalness={0.18}
              roughness={0.06}
              transmission={0.36}
              thickness={0.8}
              clearcoat={1}
              transparent
              opacity={0.86}
            />
          </mesh>
        </Float>
      </group>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[field.world, 3]} />
          <bufferAttribute attach="attributes-aTarget" args={[field.diamond, 3]} />
          <bufferAttribute attach="attributes-aScale" args={[field.scale, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={material}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>
    </group>
  )
}
