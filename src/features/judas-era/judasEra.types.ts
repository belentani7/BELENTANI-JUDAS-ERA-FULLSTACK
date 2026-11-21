export type JudasEraLocale = 'es' | 'en' | 'pt' | 'ca'
export type JudasEraChapterId = 'threshold' | 'artifact' | 'debt' | 'transmutation' | 'return'

export interface JudasEraChapter {
  readonly id: JudasEraChapterId
  readonly signal: string
  readonly title: string
  readonly body: string
  readonly image: string
  readonly alt: string
}

export interface JudasEraCopy {
  readonly eyebrow: string
  readonly intro: string
  readonly enter: string
  readonly sealed: string
  readonly offline: string
  readonly live: string
  readonly chapters: ReadonlyArray<JudasEraChapter>
}

export interface JudasEraManifest {
  readonly title: 'JUDAS'
  readonly status: 'SEALED'
  readonly releaseMediaAvailable: false
  readonly locales: ReadonlyArray<JudasEraLocale>
  readonly chapters: ReadonlyArray<JudasEraChapterId>
  readonly updatedAt: string
}

export interface JudasEraSession {
  readonly id: string
  readonly locale: JudasEraLocale
  readonly reducedMotion: boolean
  readonly createdAt: string
}

export interface JudasEraSceneState {
  progress: number
  chapter: number
}
