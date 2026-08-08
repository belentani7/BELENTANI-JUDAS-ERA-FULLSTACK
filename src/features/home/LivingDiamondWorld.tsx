import { Float, MeshTransmissionMaterial, Sparkles } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  type Group,
  type MeshBasicMaterial,
  type PointLight,
  type ShaderMaterial,
} from 'three'
import fragmentShader from './living-diamond.fragment.glsl?raw'
import vertexShader from './living-diamond.vertex.glsl?raw'

const PARTICLE_COUNT = 4200

const GEM_STONES = [
  { color: '#f8fdff', glow: '#7ce8ff', position: [-2.52, 0.84, -0.18], scale: 0.46, speed: 0.74, phase: 0.2 },
  { color: '#fff7a8', glow: '#ffd84a', position: [-1.52, -0.9, 0.34], scale: 0.35, speed: 1.08, phase: 1.3 },
  { color: '#9dffcf', glow: '#32ff9a', position: [2.5, 0.08, 0.12], scale: 0.52, speed: 0.9, phase: 2.2 },
  { color: '#89f3ff', glow: '#34d8ff', position: [1.18, 1.34, -0.42], scale: 0.31, speed: 1.22, phase: 3.1 },
  { color: '#ffb67a', glow: '#ff7a2f', position: [0.12, -1.52, 0.26], scale: 0.4, speed: 0.82, phase: 4.4 },
  { color: '#ff9bd8', glow: '#ff3fb4', position: [-0.42, 1.66, 0.06], scale: 0.29, speed: 1.34, phase: 5.6 },
  { color: '#d8c7ff', glow: '#8d5bff', position: [1.88, -1.08, -0.24], scale: 0.33, speed: 1.02, phase: 6.2 },
  { color: '#ff8f8f', glow: '#ff3434', position: [-2.02, 1.58, -0.38], scale: 0.25, speed: 1.42, phase: 7.1 },
  { color: '#ffffff', glow: '#f9fbff', position: [2.26, 1.18, 0.28], scale: 0.24, speed: 1.28, phase: 8.4 },
] as const

function createDiamondGeometry() {
  const sides = 12
  const positions: number[] = []
  const indices: number[] = []

  const rings = [
    { y: 0.72, radius: 0.38 },
    { y: 0.36, radius: 1.0 },
    { y: 0.0, radius: 0.86 },
  ]
  const table = positions.length / 3
  positions.push(0, 0.82, 0)
  const tip = 1 + sides * rings.length

  for (const ring of rings) {
    for (let index = 0; index < sides; index += 1) {
      const angle = (index / sides) * Math.PI * 2
      positions.push(Math.cos(angle) * ring.radius, ring.y, Math.sin(angle) * ring.radius)
    }
  }
  positions.push(0, -1.28, 0)

  for (let index = 0; index < sides; index += 1) {
    const next = (index + 1) % sides
    indices.push(table, 1 + index, 1 + next)
  }

  for (let ring = 0; ring < rings.length - 1; ring += 1) {
    const current = 1 + ring * sides
    const lower = current + sides
    for (let index = 0; index < sides; index += 1) {
      const next = (index + 1) % sides
      indices.push(current + index, lower + index, current + next)
      indices.push(current + next, lower + index, lower + next)
    }
  }

  const lastRing = 1 + (rings.length - 1) * sides
  for (let index = 0; index < sides; index += 1) {
    const next = (index + 1) % sides
    indices.push(lastRing + index, tip, lastRing + next)
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

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

interface FloatingGemProps {
  readonly color: string
  readonly glow: string
  readonly position: readonly [number, number, number]
  readonly scale: number
  readonly speed: number
  readonly phase: number
}

function FloatingGem({ color, glow, position, scale, speed, phase }: FloatingGemProps) {
  const gem = useRef<Group>(null)
  const geometry = useMemo(createDiamondGeometry, [])

  useFrame((state, delta) => {
    if (!gem.current) return
    const elapsed = state.clock.elapsedTime * speed + phase
    gem.current.rotation.x += delta * (0.62 + speed * 0.14)
    gem.current.rotation.y += delta * (1.05 + speed * 0.22)
    gem.current.rotation.z += delta * 0.34
    gem.current.position.y = position[1] + Math.sin(elapsed) * 0.18
    gem.current.position.x = position[0] + Math.cos(elapsed * 0.62) * 0.08
  })

  return (
    <group ref={gem} position={position} scale={scale}>
      <mesh>
        <primitive object={geometry} attach="geometry" />
        <MeshTransmissionMaterial
          color={color}
          emissive={glow}
          emissiveIntensity={0.38}
          roughness={0.02}
          transmission={1}
          thickness={1.85}
          chromaticAberration={0.62}
          anisotropicBlur={0.08}
          distortion={0.18}
          distortionScale={0.22}
          temporalDistortion={0.08}
          ior={2.417}
          backside
          samples={8}
          resolution={384}
        />
      </mesh>
      <mesh scale={1.035}>
        <primitive object={geometry} attach="geometry" />
        <meshBasicMaterial color={glow} wireframe transparent opacity={0.18} />
      </mesh>
      <mesh scale={[1.55, 0.04, 0.08]} rotation={[0, 0, Math.PI * 0.08]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          color={glow}
          transparent
          opacity={0.34}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>
      <mesh scale={[0.05, 1.05, 0.05]} rotation={[0, 0, Math.PI * 0.5]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.22}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>
      <pointLight color={glow} intensity={2.35} distance={3.8} />
    </group>
  )
}

interface LivingDiamondWorldProps {
  readonly maximumIllumination: boolean
}

export function LivingDiamondWorld({ maximumIllumination }: LivingDiamondWorldProps) {
  const root = useRef<Group>(null)
  const orbit = useRef<Group>(null)
  const material = useRef<ShaderMaterial>(null)
  const keyLight = useRef<PointLight>(null)
  const rimLight = useRef<PointLight>(null)
  const maximumLight = useRef<PointLight>(null)
  const shockwave = useRef<Group>(null)
  const shockwaveMaterial = useRef<MeshBasicMaterial>(null)
  const illumination = useRef(0)
  const shockwaveProgress = useRef(1)
  const previousMaximum = useRef(false)
  const field = useMemo(createParticleField, [])
  const coreGeometry = useMemo(createDiamondGeometry, [])
  const uniforms = useMemo(
    () => ({
      uColor: { value: new Color('#8f5cff') },
      uMorph: { value: 0 },
      uTime: { value: 0 },
      uIllumination: { value: 0 },
    }),
    [],
  )

  useFrame((state, delta) => {
    const elapsed = state.clock.elapsedTime
    const targetIllumination = maximumIllumination ? 1 : 0
    illumination.current += (targetIllumination - illumination.current) * (1 - Math.exp(-delta * 2.8))

    if (maximumIllumination && !previousMaximum.current) shockwaveProgress.current = 0
    previousMaximum.current = maximumIllumination

    if (shockwaveProgress.current < 1) {
      shockwaveProgress.current = Math.min(1, shockwaveProgress.current + delta * 0.62)
      const progress = shockwaveProgress.current
      if (shockwave.current) {
        const scale = 0.65 + progress * 5.8
        shockwave.current.scale.setScalar(scale)
        shockwave.current.visible = progress < 1
      }
      if (shockwaveMaterial.current) {
        shockwaveMaterial.current.opacity = Math.sin(progress * Math.PI) * 0.58
      }
    }

    if (material.current) {
      material.current.uniforms.uTime.value = elapsed
      material.current.uniforms.uMorph.value = 0.5 + Math.sin(elapsed * 0.42 - 0.7) * 0.5
      material.current.uniforms.uIllumination.value = illumination.current
    }
    if (root.current) {
      root.current.rotation.y += delta * 0.035
      root.current.rotation.x += (state.pointer.y * 0.12 - root.current.rotation.x) * 0.025
      root.current.rotation.z += (state.pointer.x * 0.08 - root.current.rotation.z) * 0.025
    }
    if (keyLight.current) {
      keyLight.current.position.x = Math.cos(elapsed * 0.72) * 2.8
      keyLight.current.position.y = 1.4 + Math.sin(elapsed * 0.9) * 0.85
      keyLight.current.position.z = 1.2 + Math.sin(elapsed * 0.4) * 0.6
    }
    if (rimLight.current) {
      rimLight.current.position.x = Math.sin(elapsed * 0.46) * -3.2
      rimLight.current.position.y = -1.1 + Math.cos(elapsed * 0.68) * 0.7
      rimLight.current.position.z = 1.6 + Math.cos(elapsed * 0.52) * 0.45
    }
    if (maximumLight.current) {
      maximumLight.current.intensity = illumination.current * 42
    }
    if (orbit.current) {
      orbit.current.rotation.y = elapsed * 0.22
      orbit.current.rotation.z = Math.sin(elapsed * 0.28) * 0.2
    }
  })

  return (
    <group ref={root} scale={0.92} position={[0.35, 0, 0]}>
      <color attach="background" args={['#020409']} />
      <ambientLight intensity={0.13} color="#22344b" />
      <pointLight ref={keyLight} position={[0, 2.4, 1.5]} intensity={7.4} color="#f9fbff" distance={8.5} />
      <pointLight position={[2.6, -1.8, 1.2]} intensity={5.2} color="#ff7a2f" distance={7} />
      <pointLight position={[-2.7, 1.8, 0.9]} intensity={4.4} color="#32ff9a" distance={6.5} />
      <pointLight position={[1.8, 1.7, -1.4]} intensity={4.6} color="#ffd84a" distance={7.2} />
      <pointLight ref={rimLight} position={[-2.8, -0.6, 0.8]} intensity={4.8} color="#34d8ff" distance={7.5} />
      <pointLight ref={maximumLight} position={[0, 1.4, 3.2]} intensity={0} color="#fff8fb" distance={12} />
      <spotLight position={[0, 3.8, 2.4]} angle={0.42} penumbra={1} intensity={9} color="#ffffff" distance={11} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.08, 0]} scale={[3.2, 3.2, 3.2]}>
        <circleGeometry args={[1, 96]} />
        <meshBasicMaterial color="#34d8ff" transparent opacity={0.14} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.02, 0]} scale={[2.1, 2.1, 2.1]}>
        <ringGeometry args={[0.72, 1, 96]} />
        <meshBasicMaterial color="#ffd84a" transparent opacity={0.2} depthWrite={false} />
      </mesh>

      <Float speed={0.8} rotationIntensity={0.08} floatIntensity={0.2}>
        <mesh>
          <primitive object={coreGeometry} attach="geometry" />
          <MeshTransmissionMaterial
            color="#f8fdff"
            emissive="#b9f3ff"
            emissiveIntensity={0.32}
            roughness={0.01}
            transmission={1}
            thickness={3.2}
            chromaticAberration={0.92}
            anisotropicBlur={0.04}
            distortion={0.12}
            distortionScale={0.18}
            temporalDistortion={0.06}
            ior={2.417}
            backside
            samples={12}
            resolution={768}
          />
        </mesh>
        <mesh scale={1.045}>
          <primitive object={coreGeometry} attach="geometry" />
          <meshBasicMaterial color="#f9fbff" wireframe transparent opacity={0.16} />
        </mesh>
        <mesh rotation={[1.12, 0.2, 0.32]}>
          <torusGeometry args={[1.82, 0.018, 8, 180]} />
          <meshBasicMaterial color="#34d8ff" transparent opacity={0.36} />
        </mesh>
        <mesh rotation={[0.74, -0.45, -0.18]}>
          <torusGeometry args={[2.22, 0.012, 8, 180]} />
          <meshBasicMaterial color="#ffd84a" transparent opacity={0.2} />
        </mesh>
        <mesh scale={[1.9, 0.06, 0.08]} rotation={[0.16, 0.2, Math.PI * 0.16]} position={[0.2, 0.24, 0.42]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.2} depthWrite={false} blending={AdditiveBlending} />
        </mesh>
        <mesh scale={[0.08, 1.52, 0.08]} rotation={[0.16, 0.1, Math.PI * 0.5]} position={[-0.12, 0.12, 0.36]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color="#fff6ff" transparent opacity={0.16} depthWrite={false} blending={AdditiveBlending} />
        </mesh>
      </Float>

      <group ref={shockwave} visible={false} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <ringGeometry args={[0.82, 1, 128]} />
          <meshBasicMaterial
            ref={shockwaveMaterial}
            color="#fff5fb"
            transparent
            opacity={0}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>
      </group>

      <group ref={orbit} rotation={[0.42, 0, -0.12]}>
        <Float speed={1.15} rotationIntensity={0.42} floatIntensity={0.18}>
          <mesh position={[2.58, 0, 0]} scale={[0.52, 0.82, 0.52]} rotation={[0.08, 0.24, 0.1]}>
            <primitive object={coreGeometry} attach="geometry" />
            <MeshTransmissionMaterial
              color="#d5c0ff"
              emissive="#32ff9a"
              emissiveIntensity={0.4}
              roughness={0.025}
              transmission={1}
              thickness={0.8}
              chromaticAberration={0.48}
              ior={2.417}
              backside
              samples={8}
              resolution={320}
            />
          </mesh>
        </Float>
      </group>

      <group rotation={[0.16, -0.08, 0.04]}>
        {GEM_STONES.map((gem) => (
          <FloatingGem
            key={gem.color}
            color={gem.color}
            glow={gem.glow}
            position={gem.position}
            scale={gem.scale}
            speed={gem.speed}
            phase={gem.phase}
          />
        ))}
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
      <Sparkles count={42} scale={[4.8, 4.2, 3.2]} size={2.8} speed={0.24} color="#f9fbff" opacity={0.7} />
      <Sparkles count={24} scale={[2.8, 2.4, 2]} size={4.2} speed={0.32} color="#34d8ff" opacity={0.42} />
      <Sparkles count={18} scale={[3.1, 2.6, 2]} size={3.4} speed={0.3} color="#ffd84a" opacity={0.34} />
    </group>
  )
}
