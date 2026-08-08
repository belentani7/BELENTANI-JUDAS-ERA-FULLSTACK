import atlasPayload from './html-atlas.generated.json'

export type AtlasRelation = 'core' | 'technical' | 'reference' | 'external'
export type AtlasVisibility = 'review' | 'private'

export interface HtmlAtlasRecord {
  id: string
  digest: string
  bytes: number
  structured: boolean
  relation: AtlasRelation
  visibility: AtlasVisibility
}

export interface HtmlAtlasPayload {
  generatedAt: string
  source: string
  uniqueFiles: number
  sourceInstances: number
  records: HtmlAtlasRecord[]
}

export const htmlAtlas = atlasPayload as HtmlAtlasPayload

export const atlasRelationLabels: Record<AtlasRelation, string> = {
  core: 'Núcleo BELENTANI',
  technical: 'Biblioteca técnica',
  reference: 'Referencia visual',
  external: 'Archivo relacionado',
}

export const atlasVisibilityLabels: Record<AtlasVisibility, string> = {
  review: 'Revisión editorial',
  private: 'Privado',
}

export const recoveredFamilies = [
  {
    id: 'shell',
    label: 'Shell vivo',
    sourceIds: ['0679'],
    destination: 'Navegación, PWA, Lenis y módulos locales',
    state: 'integrating',
  },
  {
    id: 'threshold',
    label: 'Umbral',
    sourceIds: ['0003'],
    destination: 'Entrada narrativa reducida y accesible',
    state: 'integrating',
  },
  {
    id: 'editorial-routes',
    label: 'Rutas editoriales',
    sourceIds: ['0526', '0534', '0535', '0536', '0537', '0538', '0539'],
    destination: 'Inicio, artista, música, JUDAS, Portal, archivo y contacto',
    state: 'mapped',
  },
  {
    id: 'terminal',
    label: 'Terminal y oráculo',
    sourceIds: ['0382', '0529', '0530'],
    destination: 'Consola narrativa, chat local y voz con consentimiento',
    state: 'mapped',
  },
  {
    id: 'spatial',
    label: 'Motores espaciales',
    sourceIds: ['0041', '0042'],
    destination: 'Escena 3D diferida con alternativa estática',
    state: 'mapped',
  },
  {
    id: 'identity',
    label: 'Identidad múltiple',
    sourceIds: ['0015'],
    destination: 'Portal, audio, accesibilidad y estados de lectura',
    state: 'integrating',
  },
  {
    id: 'escape',
    label: 'Pacto y escape room',
    sourceIds: ['0438'],
    destination: 'Llave, sello, decisiones y progreso local',
    state: 'mapped',
  },
  {
    id: 'zion',
    label: 'Artefacto Zion',
    sourceIds: ['0604', '0643'],
    destination: 'Nave, telemetría y oráculo como ficción etiquetada',
    state: 'mapped',
  },
] as const

export const atlasCounts = htmlAtlas.records.reduce(
  (counts, record) => {
    counts[record.relation] += 1
    if (record.structured) counts.structured += 1
    counts[record.visibility] += 1
    counts.bytes += record.bytes
    return counts
  },
  {
    core: 0,
    technical: 0,
    reference: 0,
    external: 0,
    review: 0,
    private: 0,
    structured: 0,
    bytes: 0,
  },
)
