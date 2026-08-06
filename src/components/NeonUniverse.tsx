import { useEffect, useRef } from 'react'

interface NeonUniverseProps {
  active: boolean
  intensity?: number
}

interface Star {
  angle: number
  distance: number
  depth: number
  phase: number
  size: number
}

const TAU = Math.PI * 2

function seededRandom(seed: number) {
  let value = seed >>> 0
  return () => {
    value += 0x6d2b79f5
    let sample = value
    sample = Math.imul(sample ^ (sample >>> 15), sample | 1)
    sample ^= sample + Math.imul(sample ^ (sample >>> 7), sample | 61)
    return ((sample ^ (sample >>> 14)) >>> 0) / 4294967296
  }
}

export function NeonUniverse({ active, intensity = 1 }: NeonUniverseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d', { alpha: false })
    if (!context) return

    const random = seededRandom(17091988)
    const starLimit = window.innerWidth < 760 || (navigator.hardwareConcurrency ?? 8) <= 4 ? 110 : 220
    const stars: Star[] = Array.from({ length: starLimit }, () => ({
      angle: random() * TAU,
      distance: 0.12 + random() * 0.88,
      depth: 0.18 + random() * 0.82,
      phase: random() * TAU,
      size: 0.35 + random() * 1.65,
    }))

    let width = 1
    let height = 1
    let ratio = 1
    let frame = 0
    let visible = true
    let pointerX = 0
    let pointerY = 0
    let targetX = 0
    let targetY = 0
    let lastFrame = performance.now()
    let performanceWindow = lastFrame
    let renderedFrames = 0
    let particleRatio = 1

    const draw = (now: number) => {
      const time = active ? now * 0.001 : 0
      const delta = Math.min(0.05, (now - lastFrame) / 1000)
      lastFrame = now
      pointerX += (targetX - pointerX) * Math.min(1, delta * 3.2)
      pointerY += (targetY - pointerY) * Math.min(1, delta * 3.2)

      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      context.clearRect(0, 0, width, height)
      const cx = width * (0.54 + pointerX * 0.028)
      const cy = height * (0.48 + pointerY * 0.022)
      const radius = Math.min(width, height)

      const voidGradient = context.createRadialGradient(cx, cy, radius * 0.02, cx, cy, radius * 0.78)
      voidGradient.addColorStop(0, '#000000')
      voidGradient.addColorStop(0.18, `rgba(58, 0, 10, ${0.82 * intensity})`)
      voidGradient.addColorStop(0.48, `rgba(22, 0, 7, ${0.88 * intensity})`)
      voidGradient.addColorStop(1, '#020204')
      context.fillStyle = voidGradient
      context.fillRect(0, 0, width, height)

      context.save()
      context.translate(cx, cy)
      context.rotate(-0.15)
      context.globalCompositeOperation = 'lighter'

      for (let filament = 0; filament < 13; filament += 1) {
        const phase = filament * 0.83 + time * (filament % 2 ? 0.018 : -0.014)
        const reach = radius * (0.34 + (filament % 5) * 0.07)
        context.beginPath()
        for (let segment = 0; segment <= 36; segment += 1) {
          const progress = segment / 36
          const angle = phase + progress * (2.4 + (filament % 3) * 0.55)
          const distance = radius * 0.07 + reach * progress
          const turbulence = Math.sin(progress * 18 + filament * 2.1 + time * 0.42) * radius * 0.012
          const x = Math.cos(angle) * (distance + turbulence)
          const y = Math.sin(angle) * (distance + turbulence) * 0.62
          if (segment === 0) context.moveTo(x, y)
          else context.lineTo(x, y)
        }
        context.strokeStyle = `rgba(255, ${20 + filament * 2}, ${44 + filament * 3}, ${0.045 + intensity * 0.018})`
        context.lineWidth = 0.45 + (filament % 3) * 0.3
        context.stroke()
      }

      const visibleStars = Math.floor(stars.length * particleRatio)
      for (let index = 0; index < visibleStars; index += 1) {
        const star = stars[index]
        const orbit = star.angle + time * (0.006 + star.depth * 0.018)
        const drift = Math.sin(time * 0.7 + star.phase) * radius * 0.006
        const x = Math.cos(orbit) * (star.distance * radius * 0.74 + drift)
        const y = Math.sin(orbit) * star.distance * radius * 0.46
        const alpha = (0.18 + 0.62 * star.depth) * (0.62 + Math.sin(time * 1.7 + star.phase) * 0.25)
        context.beginPath()
        context.arc(x, y, star.size * star.depth, 0, TAU)
        context.fillStyle = `rgba(255, ${72 + Math.round(90 * star.depth)}, ${84 + Math.round(80 * star.depth)}, ${alpha})`
        context.fill()
      }

      context.lineCap = 'round'
      for (let band = 0; band < 54; band += 1) {
        const normalized = band / 53
        const orbitRadius = radius * (0.09 + normalized * 0.31)
        const angle = band * 2.17 + time * (0.12 + (1 - normalized) * 0.52)
        context.beginPath()
        context.ellipse(0, 0, orbitRadius, orbitRadius * (0.18 + normalized * 0.12), 0.08, angle, angle + 0.28 + normalized * 0.48)
        context.strokeStyle = `rgba(255, ${24 + Math.round(normalized * 72)}, ${42 + Math.round(normalized * 58)}, ${(0.08 + (1 - normalized) * 0.24) * intensity})`
        context.lineWidth = 0.55 + (1 - normalized) * 1.8
        context.stroke()
      }

      const wave = active ? (time % 3.8) / 3.8 : 0.42
      for (let ring = 0; ring < 4; ring += 1) {
        const ringProgress = (wave + ring * 0.22) % 1
        context.beginPath()
        context.ellipse(0, 0, radius * ringProgress * 0.64, radius * ringProgress * 0.39, 0, 0, TAU)
        context.strokeStyle = `rgba(255, 52, 72, ${(1 - ringProgress) * 0.11 * intensity})`
        context.lineWidth = 1
        context.stroke()
      }

      const jetGradient = context.createLinearGradient(0, -radius * 0.54, 0, radius * 0.54)
      jetGradient.addColorStop(0, 'rgba(255,30,58,0)')
      jetGradient.addColorStop(0.42, `rgba(255,70,88,${0.17 * intensity})`)
      jetGradient.addColorStop(0.5, `rgba(255,224,216,${0.7 * intensity})`)
      jetGradient.addColorStop(0.58, `rgba(255,70,88,${0.17 * intensity})`)
      jetGradient.addColorStop(1, 'rgba(255,30,58,0)')
      context.fillStyle = jetGradient
      context.fillRect(-radius * 0.006, -radius * 0.54, radius * 0.012, radius * 1.08)

      const corona = context.createRadialGradient(0, 0, radius * 0.015, 0, 0, radius * 0.12)
      corona.addColorStop(0, '#000000')
      corona.addColorStop(0.38, '#000000')
      corona.addColorStop(0.48, `rgba(255,244,236,${0.9 * intensity})`)
      corona.addColorStop(0.56, `rgba(255,30,54,${0.68 * intensity})`)
      corona.addColorStop(1, 'rgba(255,0,30,0)')
      context.fillStyle = corona
      context.beginPath()
      context.arc(0, 0, radius * 0.12, 0, TAU)
      context.fill()

      context.globalCompositeOperation = 'source-over'
      context.fillStyle = '#000000'
      context.beginPath()
      context.arc(0, 0, radius * 0.042, 0, TAU)
      context.fill()
      context.restore()

      const vignette = context.createRadialGradient(cx, cy, radius * 0.15, cx, cy, Math.max(width, height) * 0.72)
      vignette.addColorStop(0, 'rgba(0,0,0,0)')
      vignette.addColorStop(1, 'rgba(0,0,0,0.82)')
      context.fillStyle = vignette
      context.fillRect(0, 0, width, height)

      renderedFrames += 1
      if (now - performanceWindow > 2000) {
        const fps = renderedFrames / ((now - performanceWindow) / 1000)
        if (fps < 44) particleRatio = Math.max(0.45, particleRatio - 0.18)
        if (fps > 57) particleRatio = Math.min(1, particleRatio + 0.08)
        performanceWindow = now
        renderedFrames = 0
      }
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      ratio = Math.min(window.devicePixelRatio || 1, 1.75)
      canvas.width = Math.floor(width * ratio)
      canvas.height = Math.floor(height * ratio)
      draw(performance.now())
    }

    const handlePointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      targetX = ((event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 2
      targetY = ((event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 2
    }

    const resizeObserver = new ResizeObserver(resize)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true
    })
    resizeObserver.observe(canvas)
    intersectionObserver.observe(canvas)
    canvas.addEventListener('pointermove', handlePointer, { passive: true })
    resize()

    const loop = (now: number) => {
      if (active && visible) draw(now)
      frame = window.requestAnimationFrame(loop)
    }
    if (active) frame = window.requestAnimationFrame(loop)

    return () => {
      window.cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      canvas.removeEventListener('pointermove', handlePointer)
    }
  }, [active, intensity])

  return (
    <div aria-hidden="true" className="neon-universe">
      <canvas className="neon-universe__canvas" ref={canvasRef} />
      <div className="neon-universe__grid" />
      <div className="neon-universe__telemetry"><span>NOIACORE / RED UNIVERSE</span><span>ADAPTIVE FIELD</span></div>
    </div>
  )
}
