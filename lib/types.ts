export interface AIModel {
  id: string
  name: string
  provider: string
  description?: string
}

export interface GeneratedCode {
  code: string
  model: string
  timestamp: number
}

export interface DeploymentResult {
  url: string
  appName: string
  success: boolean
}

export interface IntegrationConfig {
  endpoint: string
  response: any
  instruction: string
}

export interface Integration {
  id: string
  endpoint: string
  response: any
  instruction: string
  component: string
  createdAt: string
}

export interface ProjectFile {
  path: string
  content: string
  language: string
}

export interface VersionHistory {
  id: string
  timestamp: number
  code: string
  prompt: string
}

export interface ExportOptions {
  type: 'github' | 'zip' | 'deploy'
  files: ProjectFile[]
  projectName: string
}
