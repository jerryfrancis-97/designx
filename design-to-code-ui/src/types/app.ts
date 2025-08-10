export interface AppGenerationRequest {
  description: string
  features?: string[]
  technology?: string
  complexity?: string
}

export interface GeneratedApp {
  id: string
  name: string
  description: string
  code: string
  language: string
  framework: string
  createdAt: string
  status: string
}

export interface LovableAPIResponse {
  success: boolean
  data?: {
    app: GeneratedApp
  }
  error?: string
}

// Backend API response types
export interface BackendHealthResponse {
  status: string
  timestamp: string
}

export interface BackendErrorResponse {
  detail: string
}

// Repository and file management types
export interface RepositoryFile {
  name: string
  path: string
  content: string
  language: string
  size: number
  isDirectory: boolean
  children?: RepositoryFile[]
}

export interface Repository {
  id: string
  name: string
  description?: string
  files: RepositoryFile[]
  totalFiles: number
  totalSize: number
  uploadedAt: string
  lastModified: string
}

export interface RepositoryUploadResponse {
  success: boolean
  data?: {
    repository: Repository
  }
  error?: string
}
