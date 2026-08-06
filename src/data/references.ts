import awwwardsReferences from './awwwards-references.json'

export interface Reference {
  id: string
  source: 'Awwwards' | 'user-provided'
  url: string
  title: string
  category?: string
  pattern: string
  caution: string
}

const userProvidedReferences: Reference[] = [
  {
    id: 'user-msi-ai-pc', source: 'user-provided', url: 'https://www.awwwards.com/sites/msi-ai-pc', title: 'MSI AI PC',
    pattern: 'Persona interactiva, navegacion inusual, transiciones y escena 3D.', caution: 'Ficha Awwwards verificada; el dominio de experiencia no resolvia durante la revision.',
  },
  {
    id: 'user-dragonfly', source: 'user-provided', url: 'https://www.dragonfly.xyz/', title: 'Dragonfly',
    pattern: 'Portfolio espacial de canvas continuo con capas editoriales.', caution: 'Sitio vivo inspeccionado; reutilizar ritmo y jerarquia, no codigo ni activos.',
  },
  {
    id: 'user-dogstudio', source: 'user-provided', url: 'https://dogstudio.co/mx/', title: 'Dogstudio',
    pattern: 'Showreel WebGL, transiciones de medios y carga de geometria comprimida.', caution: 'Sitio vivo inspeccionado; mantener fallback, rendimiento y autoria propia.',
  },
  {
    id: 'user-field-ground-up', source: 'user-provided', url: 'https://www.awwwards.com/sites/the-field-from-the-ground-up', title: 'The Field From The Ground Up',
    pattern: 'Lobby, historia por escenas, cursor reactivo y narrativa 3D inmersiva.', caution: 'Ficha Awwwards verificada; accesibilidad original puntuada por debajo de otros criterios.',
  },
  {
    id: 'user-ambush-silver-fctry', source: 'user-provided', url: 'https://www.awwwards.com/sites/ambush-r-silver-fctry', title: 'AMBUSH R Silver Fctry',
    pattern: 'Fabrica digital como escenario de producto y cultura.', caution: 'Ficha historica no cargo durante la revision; patron pendiente de inspeccion visual.',
  },
  {
    id: 'user-dojacode', source: 'user-provided', url: 'https://www.awwwards.com/sites/dojacode', title: 'DojaCode',
    pattern: 'Musica y codigo como interaccion narrativa.', caution: 'Ficha historica agoto el tiempo de carga; detalle tecnico pendiente de verificacion.',
  },
  {
    id: 'user-xbox-museum', source: 'user-provided', url: 'https://www.awwwards.com/sites/20-years-of-xbox-museum', title: '20 Years of Xbox Museum',
    pattern: 'Museo navegable, linea temporal y archivo personalizable.', caution: 'Awwwards lo registra como Site of the Month de 2021; adaptar estructura, no activos.',
  },
  {
    id: 'user-nurture', source: 'user-provided', url: 'https://www.awwwards.com/sites/nurture', title: 'Nurture',
    pattern: 'Cinco entornos musicales explorables y experiencia multijugador intima.', caution: 'Ficha Awwwards verificada; BELENTANI usa audio opcional y experiencia local.',
  },
  {
    id: 'user-the-field', source: 'user-provided', url: 'https://www.awwwards.com/sites/the-field', title: 'The Field',
    pattern: 'Campo interactivo como espacio de descubrimiento.', caution: 'Ficha no devolvio contenido durante la revision; patron pendiente de verificacion.',
  },
  {
    id: 'user-harmonic-state', source: 'user-provided', url: 'https://www.awwwards.com/sites/the-harmonic-state', title: 'The Harmonic State',
    pattern: 'Estado audiovisual que responde a sonido, movimiento y exploracion.', caution: 'Awwwards registra premio mensual; detalle de interaccion pendiente de revision directa.',
  },
]

export const references: Reference[] = [
  ...(awwwardsReferences as Reference[]),
  ...userProvidedReferences,
]
