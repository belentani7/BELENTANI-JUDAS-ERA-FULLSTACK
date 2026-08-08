import { useEffect, useRef } from 'react'
import { hashSignal } from './studioEngine'

interface StudioFieldProps {
  accent: string
  intensity: number
  motionEnabled: boolean
}

interface FieldPoint {
  x: number
  y: number
  depth: number
  phase: number
}

function createPoints(count: number) {
  return Array.from({ length: count }, (_, index): FieldPoint => {
    const seed = hashSignal(`belentani-field-${index}`)
    return {
      x: (seed % 1000) / 1000,
      y: ((seed >>> 8) % 1000) / 1000,
      depth: 0.2 + ((seed >>> 16) % 800) / 1000,
      phase: ((seed >>> 24) % 628) / 100,
    }
  })
}

const points = createPoints(76)

export function StudioField({ accent, intensity, motionEnabled }: StudioFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    let frame = 0
    let width = 0
    let height = 0
    let visible = !document.hidden
    let inViewport = true

    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      width = Math.max(1, bounds.width)
      height = Math.max(1, bounds.height)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const draw = (time = 0) => {
      const seconds = motionEnabled ? time / 1000 : 0
      context.clearRect(0, 0, width, height)
      const wash = context.createRadialGradient(width * 0.55, height * 0.46, 0, width * 0.55, height * 0.46, Math.max(width, height) * 0.68)
      wash.addColorStop(0, `${accent}22`)
      wash.addColorStop(0.34, 'rgba(24, 18, 46, .26)')
      wash.addColorStop(1, 'rgba(2, 3, 8, 0)')
      context.fillStyle = wash
      context.fillRect(0, 0, width, height)

      const projected = points.map((point) => {
        const orbit = seconds * (0.018 + point.depth * 0.012) + point.phase
        const driftX = Math.cos(orbit) * 22 * point.depth
        const driftY = Math.sin(orbit * 1.7) * 15 * point.depth
        return { x: point.x * width + driftX, y: point.y * height + driftY, depth: point.depth }
      })

      context.lineWidth = 0.55
      for (let first = 0; first < projected.length; first += 1) {
        const source = projected[first]
        if (!source) continue
        for (let second = first + 1; second < projected.length; second += 1) {
          const target = projected[second]
          if (!target) continue
          const distance = Math.hypot(source.x - target.x, source.y - target.y)
          if (distance > 118) continue
          context.strokeStyle = `rgba(172, 208, 255, ${(1 - distance / 118) * 0.12})`
          context.beginPath()
          context.moveTo(source.x, source.y)
          context.lineTo(target.x, target.y)
          context.stroke()
        }
      }

      for (const point of projected) {
        const radius = 0.65 + point.depth * 1.8 + intensity * 0.025
        context.fillStyle = point.depth > 0.75 ? accent : `rgba(222, 231, 255, ${0.26 + point.depth * 0.56})`
        context.beginPath()
        context.arc(point.x, point.y, radius, 0, Math.PI * 2)
        context.fill()
      }

      context.save()
      context.translate(width * 0.56, height * 0.46)
      context.rotate(seconds * 0.025)
      context.strokeStyle = `${accent}38`
      context.lineWidth = 1
      for (let ring = 0; ring < 3; ring += 1) {
        context.beginPath()
        context.ellipse(0, 0, 110 + ring * 74, 32 + ring * 28, ring * 0.34, 0, Math.PI * 2)
        context.stroke()
      }
      context.restore()
    }

    const tick = (time: number) => {
      frame = 0
      draw(time)
      if (motionEnabled && visible && inViewport) frame = window.requestAnimationFrame(tick)
    }
    const resume = () => {
      if (motionEnabled && visible && inViewport && !frame) frame = window.requestAnimationFrame(tick)
    }
    const onVisibility = () => {
      visible = !document.hidden
      if (visible) resume()
      if (!visible && frame) {
        window.cancelAnimationFrame(frame)
        frame = 0
      }
    }

    const observer = new ResizeObserver(() => {
      resize()
      if (!motionEnabled) draw()
    })
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      inViewport = entry?.isIntersecting ?? false
      if (inViewport) resume()
      if (!inViewport && frame) {
        window.cancelAnimationFrame(frame)
        frame = 0
      }
    }, { rootMargin: '120px' })
    observer.observe(canvas)
    visibilityObserver.observe(canvas)
    document.addEventListener('visibilitychange', onVisibility)
    resize()
    draw()
    resume()

    return () => {
      observer.disconnect()
      visibilityObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [accent, intensity, motionEnabled])

  return <canvas ref={canvasRef} className="studio-field" aria-hidden="true" />
}
