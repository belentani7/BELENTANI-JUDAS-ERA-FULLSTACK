export type HomeDirectionId = 'ritual' | 'archive' | 'body' | 'portal' | 'quintessence'

export interface HomeDirection {
  readonly id: HomeDirectionId
  readonly index: string
  readonly label: string
  readonly title: readonly [string, string]
  readonly statement: string
  readonly image?: string
  readonly accent: string
  readonly objectPosition: string
}

export const homeDirections: readonly HomeDirection[] = [
  {
    id: 'ritual',
    index: '01',
    label: 'Ritual mineral',
    title: ['BELEN', 'TANI'],
    statement: 'La arena recuerda la forma que el cuerpo abandona.',
    image: '/media/judas/judas-desert-armour.webp',
    accent: '#ff4a35',
    objectPosition: '62% 46%',
  },
  {
    id: 'archive',
    index: '02',
    label: 'Archivo vivo',
    title: ['BELEN', 'TANI'],
    statement: 'Nada desaparece. Cambia de estado.',
    image: '/media/judas/judas-cathedral-threshold.webp',
    accent: '#ff7a2f',
    objectPosition: '50% 74%',
  },
  {
    id: 'body',
    index: '03',
    label: 'Cuerpo tipográfico',
    title: ['BE', 'LENTANI'],
    statement: 'Una voz no explica el cuerpo. Lo atraviesa.',
    image: '/media/judas/judas-desert-armour.webp',
    accent: '#ff2348',
    objectPosition: '42% 32%',
  },
  {
    id: 'portal',
    index: '04',
    label: 'Mundo diamante',
    title: ['BELEN', 'TANI'],
    statement: 'La materia recuerda el mundo antes de convertirse en diamante.',
    accent: '#ff315c',
    objectPosition: '50% 56%',
  },
  {
    id: 'quintessence',
    index: '05',
    label: 'Quintessence',
    title: ['BELEN', 'TANI'],
    statement: 'Memoria, materia y luz convergen antes de cruzar el umbral.',
    accent: '#d9c8b8',
    objectPosition: '50% 50%',
  },
]

export function getHomeDirection(value: string | null): HomeDirection {
  return homeDirections.find((direction) => direction.id === value) ?? homeDirections[0]
}
