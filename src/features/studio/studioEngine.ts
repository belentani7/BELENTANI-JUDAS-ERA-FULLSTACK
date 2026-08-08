import type { StudioArtifact, StudioTool } from './studio.types'

const materials = ['obsidiana', 'vidrio', 'sal', 'metal', 'humo', 'arena', 'tinta', 'hielo', 'cuero', 'polvo estelar']
const movements = ['órbita lenta', 'corte axial', 'caída suspendida', 'respiración', 'espiral', 'onda expansiva', 'deriva lateral', 'colisión suave']
const lenses = ['18 mm', '24 mm anamórfica', '35 mm', '50 mm macro', '85 mm', 'teleobjetivo 135 mm']
const verbs = ['revelar', 'fracturar', 'recordar', 'atraer', 'ocultar', 'transformar', 'devolver', 'conectar']

export function hashSignal(value: string) {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}
function pick<T>(values: readonly T[], seed: number, offset: number) {
  return values[(seed + offset * 2654435761) % values.length] as T
}

function palette(seed: number, accent: string) {
  const colors = [accent]
  for (let index = 0; index < 4; index += 1) {
    const hue = (seed >>> (index * 4)) % 360
    const saturation = 52 + ((seed >>> (index + 2)) % 38)
    const lightness = 34 + ((seed >>> (index + 5)) % 38)
    colors.push(`hsl(${hue} ${saturation}% ${lightness}%)`)
  }
  return colors
}

function sequence(seed: number, length = 8) {
  return Array.from({ length }, (_, index) => 12 + ((seed >>> (index % 24)) + index * 17) % 89)
}

function makeDesignation(tool: StudioTool, seed: number) {
  return `${tool.domain.toUpperCase()}-${String(tool.index).padStart(3, '0')}-${(seed % 4096).toString(16).toUpperCase().padStart(3, '0')}`
}

function buildLines(tool: StudioTool, input: string, seed: number, intensity: number) {
  const material = pick(materials, seed, 1)
  const secondaryMaterial = pick(materials, seed, 4)
  const movement = pick(movements, seed, 2)
  const lens = pick(lenses, seed, 3)
  const verb = pick(verbs, seed, 5)
  const duration = 4 + ((seed + intensity) % 9)

  switch (tool.engine) {
    case 'image':
      return [
        `Materia: ${material} + ${secondaryMaterial}.`,
        `Encuadre: ${lens}; sujeto desplazado ${18 + (seed % 54)}%.`,
        `Luz: baja exposición, contraste ${55 + intensity * 4}%, un único borde luminoso.`,
        `Lectura: ${verb} “${input}” sin ilustrarlo literalmente.`,
      ]
    case 'motion':
      return [
        `Gesto central: ${movement}.`,
        `Duración: ${duration.toFixed(1)} s; intensidad ${intensity}/10.`,
        `Entrada: máscara geométrica; salida: continuidad por escala.`,
        'Accesibilidad: el estado final permanece íntegro con movimiento reducido.',
      ]
    case 'sound': {
      const bpm = 58 + (seed % 78)
      return [
        `Tempo: ${bpm} BPM; compás ${seed % 2 === 0 ? '4/4' : '6/8'}.`,
        `Centro tonal: ${110 + (seed % 220)} Hz; ocho pasos reproducibles.`,
        `Timbre: ${material}; envolvente ${movement}.`,
        'Síntesis local por gesto explícito; ningún audio privado se carga.',
      ]
    }
    case 'video':
      return Array.from({ length: 6 }, (_, index) => {
        const second = index * duration
        return `${String(second).padStart(2, '0')}s · ${pick(lenses, seed, index)} · ${pick(movements, seed, index + 2)} · ${pick(materials, seed, index + 3)}`
      })
    case 'prompt':
      return [
        `Objetivo: ${tool.action.toLowerCase()} a partir de “${input}”.`,
        `Materia: ${material}, ${secondaryMaterial}; cámara ${lens}; gesto ${movement}.`,
        `Sistema: una escena continua, monumental y legible; intensidad ${intensity}/10.`,
        'Salida: composición original con versión estática equivalente y procedencia declarada.',
      ]
    case 'text':
      return [
        input.trim().replace(/\s+/g, ' '),
        `${verb.toUpperCase()} / ${material.toUpperCase()} / ${movement.toUpperCase()}`,
        `La frase vuelve transformada: ${input.trim().split(/\s+/).reverse().join(' ')}.`,
        `Cierre ${String(seed % 97).padStart(2, '0')}: lo que cambia conserva su origen.`,
      ]
    case 'code':
      return [
        `Token principal: ${tool.accent}.`,
        `Curva: cubic-bezier(0.${2 + (seed % 6)}, 0, 0.${6 + (seed % 3)}, 1).`,
        `Ciclo: ${duration}s; seed: ${seed}.`,
        'Contrato: activar, pausar y liberar recursos al desmontar.',
      ]
    case 'world':
      return [
        `Ley: todo objeto debe ${verb}.`,
        `Clima: ${material} en ${movement}.`,
        `Umbral: ${lens}; profundidad ${3 + (seed % 9)} niveles.`,
        `Salida: el visitante regresa con una marca ${seed % 7}.`,
      ]
    case 'archive':
      return [
        `Huella: BLN-${seed.toString(16).toUpperCase().padStart(8, '0')}.`,
        `Origen declarado: entrada local “${input}”.`,
        `Estado: propuesta generada; publicación no autorizada por defecto.`,
        `Revisión: procedencia, derechos, fecha y derivación antes de integrar.`,
      ]
    case 'ritual':
      return [
        `Invocación: ${verb} mediante ${movement}.`,
        `Regla: reunir ${3 + (seed % 5)} fragmentos sin perder el control de salida.`,
        `Recompensa: una conexión narrativa, nunca contenido privado.`,
        `Retorno: ${material} se convierte en ${secondaryMaterial}.`,
      ]
  }
}

function buildCode(tool: StudioTool, seed: number, colors: string[], intensity: number) {
  if (tool.engine === 'code') {
    return `:root {\n  --signal-${tool.index}: ${colors[0]};\n  --signal-seed: ${seed};\n}\n\n@keyframes signal-${tool.index} {\n  0% { opacity: 0; transform: scale(.92); }\n  100% { opacity: 1; transform: scale(1); }\n}`
  }
  if (tool.engine === 'prompt') return `SEED ${seed}\nINTENSITY ${intensity}/10\nLOCAL GENERATIVE RECIPE\n${tool.action.toUpperCase()}`
  if (tool.engine === 'archive') return JSON.stringify({ id: `BLN-${seed.toString(16).toUpperCase()}`, status: 'proposal', rights: 'review-required', local: true }, null, 2)
  return undefined
}

export function runStudioTool(tool: StudioTool, rawInput: string, intensity: number): StudioArtifact {
  const input = rawInput.trim() || 'señal sin nombre'
  const normalizedIntensity = Math.max(1, Math.min(10, Math.round(intensity)))
  const seed = hashSignal(`${tool.id}:${input}:${normalizedIntensity}`)
  const colors = palette(seed, tool.accent)
  return {
    id: `${tool.id}-${seed}`,
    title: tool.name,
    designation: makeDesignation(tool, seed),
    summary: `${tool.action}. Resultado local, determinista y trazable desde una semilla; no utiliza un modelo remoto.`,
    lines: buildLines(tool, input, seed, normalizedIntensity),
    palette: colors,
    signal: sequence(seed),
    code: buildCode(tool, seed, colors, normalizedIntensity),
  }
}
