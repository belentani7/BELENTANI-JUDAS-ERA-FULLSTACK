export type StudioDomain =
  | 'image'
  | 'motion'
  | 'sound'
  | 'video'
  | 'prompt'
  | 'text'
  | 'code'
  | 'world'
  | 'archive'
  | 'ritual'

export type StudioEngine = StudioDomain

export interface StudioTool {
  id: string
  index: number
  name: string
  action: string
  description: string
  domain: StudioDomain
  domainLabel: string
  engine: StudioEngine
  accent: string
  local: true
  truthMode: 'LOCAL_DETERMINISTIC'
  network: 'never'
}

export interface StudioArtifact {
  id: string
  title: string
  designation: string
  summary: string
  lines: string[]
  palette: string[]
  signal: number[]
  code?: string
}

export interface NarrativeChamber {
  id: string
  index: string
  name: string
  invocation: string
  x: number
  y: number
}
