import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  MathUtils,
  Object3D,
  type Group,
  type InstancedMesh,
  type Mesh,
  type MeshPhysicalMaterial,
  type PointLight,
  type ShaderMaterial,
} from 'three'
import fragmentShader from './quintessence.fragment.glsl?raw'
import vertexShader from './quintessence.vertex.glsl?raw'

const PARTICLE_COUNT = 600
const SHARD_COUNT = 5
const TAU = Math.PI * 2

interface QuintessenceWorldProps {
  readonly gathered: boolean
}

interface ParticleField {
  readonly expanded: Float32Array
  readonly gathered: Float32Array
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
  const random = createRandom(5012026)
  const expanded = new Float32Array(PARTICLE_COUNT * 3)
  const gathered = new Float32Array(PARTICLE_COUNT * 3)
  const scale = new Float32Array(PARTICLE_COUNT)

  for (let index = 0; index < PARTICLE_COUNT; index += 1) {
    const offset = index * 3
    const angle = random() * TAU
    const radius = 1.08 + random() * 1.72
    const depth = random() - 0.5
    expanded[offset] = Math.cos(angle) * radius * 0.72
    expanded[offset + 1] = Math.sin(angle) * radius + depth * 0.34
    expanded[offset + 2] = depth * 1.65

    const gatheredAngle = random() * TAU
    const gatheredRadius = 0.18 + random() * 0.58
    gathered[offset] = Math.cos(gatheredAngle) * gatheredRadius * 0.56
    gathered[offset + 1] = Math.sin(gatheredAngle) * gatheredRadius * 1.32
    gathered[offset + 2] = (random() - 0.5) * 0.42
    scale[index] = 0.52 + random() * 1.1
  }

  return { expanded, gathered, scale }
}

function createStratumGeometry(): BufferGeometry {
  const segments = 48
  const positions: number[] = []
  const indices: number[] = []

  for (let index = 0; index <= segments; index += 1) {
    const progress = index / segments
    const angle = -Math.PI * 0.72 + progress * Math.PI * 1.52
    const radius = 1.52 + Math.sin(index * 1.73) * 0.08
    const width = 0.19 + Math.sin(index * 0.91) * 0.045
    const z = Math.sin(progress * Math.PI * 3) * 0.14 - 0.18
    for (const edge of [-1, 1]) {
      positions.push(
        Math.cos(angle) * (radius + width * edge),
        Math.sin(angle) * (radius + width * edge) * 1.14,
        z + edge * 0.055,
      )
    }
    if (index < segments) {
      const vertex = index * 2
      indices.push(vertex, vertex + 1, vertex + 2, vertex + 1, vertex + 3, vertex + 2)
    }
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

export function QuintessenceWorld({ gathered }: QuintessenceWorldProps) {
  const root = useRef<Group>(null)
  const stratum = useRef<Mesh>(null)
  const shards = useRef<InstancedMesh>(null)
  const particleMaterial = useRef<ShaderMaterial>(null)
  const coreMaterial = useRef<MeshPhysicalMaterial>(null)
  const coreLight = useRef<PointLight>(null)
  const gather = useRef(0)
  const dummy = useMemo(() => new Object3D(), [])
  const field = useMemo(createParticleField, [])
  const stratumGeometry = useMemo(createStratumGeometry, [])
  const uniforms = useMemo(
    () => ({
      uAsh: { value: new Color('#e8ded0') },
      uIron: { value: new Color('#a82f2d') },
      uGather: { value: 0 },
      uTime: { value: 0 },
    }),
    [],
  )

  useEffect(() => () => stratumGeometry.dispose(), [stratumGeometry])

  useFrame((state, delta) => {
    const elapsed = state.clock.elapsedTime
    gather.current = MathUtils.damp(gather.current, gathered ? 1 : 0, 2.6, delta)
    const progress = gather.current

    if (particleMaterial.current) {
      particleMaterial.current.uniforms.uGather.value = progress
      particleMaterial.current.uniforms.uTime.value = elapsed
    }
    if (root.current) {
      root.current.rotation.y = elapsed * 0.035 + state.pointer.x * 0.06
      root.current.rotation.x = state.pointer.y * 0.035
      root.current.scale.setScalar(0.94 + progress * 0.09)
    }
    if (stratum.current) {
      stratum.current.rotation.z = -0.08 - progress * 0.18
      stratum.current.scale.setScalar(1 - progress * 0.2)
    }
    if (coreMaterial.current) {
      coreMaterial.current.emissiveIntensity = 0.08 + progress * 0.92
      coreMaterial.current.roughness = 0.34 - progress * 0.2
    }
    if (coreLight.current) {
      coreLight.current.intensity = 1.4 + progress * 6.2
    }
    if (shards.current) {
      for (let index = 0; index < SHARD_COUNT; index += 1) {
        const phase = (index / SHARD_COUNT) * TAU + elapsed * 0.08
        const expandedX = Math.cos(phase) * 1.58
        const expandedY = Math.sin(phase) * 1.34
        const expandedZ = Math.sin(phase * 1.7) * 0.42
        const compactX = Math.cos(phase) * 0.34
        const compactY = (index - 2) * 0.2
        const compactZ = Math.sin(phase) * 0.12
        dummy.position.set(
          MathUtils.lerp(expandedX, compactX, progress),
          MathUtils.lerp(expandedY, compactY, progress),
          MathUtils.lerp(expandedZ, compactZ, progress),
        )
        dummy.rotation.set(phase * 0.42, phase + elapsed * 0.05, phase * 0.28)
        dummy.scale.setScalar((0.3 + index * 0.025) * (1 - progress * 0.24))
        dummy.updateMatrix()
        shards.current.setMatrixAt(index, dummy.matrix)
      }
      shards.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <group ref={root} position={[0.64, 0.02, 0]}>
      <ambientLight intensity={0.22} color="#3b2c28" />
      <directionalLight position={[-3.2, 4.5, 3.8]} intensity={2.1} color="#e8ded0" />
      <pointLight ref={coreLight} position={[0.25, 0.15, 1.5]} intensity={1.4} color="#a82f2d" distance={6} />

      <mesh ref={stratum} geometry={stratumGeometry} rotation={[0.24, -0.36, -0.08]}>
        <meshStandardMaterial color="#342925" roughness={0.94} metalness={0.12} flatShading side={2} />
      </mesh>

      <instancedMesh ref={shards} args={[undefined, undefined, SHARD_COUNT]}>
        <tetrahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#5d3a32" roughness={0.82} metalness={0.28} flatShading />
      </instancedMesh>

      <mesh rotation={[0.08, 0.42, Math.PI * 0.25]} scale={[0.72, 1.28, 0.48]}>
        <octahedronGeometry args={[0.92, 2]} />
        <meshPhysicalMaterial
          ref={coreMaterial}
          color="#111011"
          emissive="#d9c8b8"
          emissiveIntensity={0.08}
          metalness={0.78}
          roughness={0.34}
          clearcoat={0.72}
          clearcoatRoughness={0.18}
        />
      </mesh>
      <mesh rotation={[0.08, 0.42, Math.PI * 0.25]} scale={[0.735, 1.295, 0.495]}>
        <octahedronGeometry args={[0.92, 2]} />
        <meshBasicMaterial color="#e8ded0" wireframe transparent opacity={0.12} />
      </mesh>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[field.expanded, 3]} />
          <bufferAttribute attach="attributes-aGathered" args={[field.gathered, 3]} />
          <bufferAttribute attach="attributes-aScale" args={[field.scale, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={particleMaterial}
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
