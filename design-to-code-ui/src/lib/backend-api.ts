import { AppGenerationRequest, GeneratedApp, BackendHealthResponse } from '@/types/app'

// Configuration for Python backend
const BACKEND_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000',
  timeout: 30000, // 30 seconds
}

/**
 * Check if the Python backend is healthy and running
 */
export async function checkBackendHealth(): Promise<BackendHealthResponse> {
  try {
    const response = await fetch(`${BACKEND_CONFIG.baseUrl}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(BACKEND_CONFIG.timeout),
    })

    if (!response.ok) {
      throw new Error(`Backend health check failed: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Backend health check error:', error)
    throw new Error('Backend is not accessible')
  }
}

/**
 * Generate an application using the Python backend
 */
export async function generateAppWithBackend(request: AppGenerationRequest): Promise<GeneratedApp> {
  try {
    // Validate request
    if (!request.description.trim()) {
      throw new Error('App description is required')
    }

    // Prepare the request payload
    const payload = {
      description: request.description,
      features: request.features || [],
      technology: request.technology || 'auto',
      complexity: request.complexity || 'medium',
    }

    // Make API call to Python backend
    const response = await fetch(`${BACKEND_CONFIG.baseUrl}/generate-app`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(BACKEND_CONFIG.timeout),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `Backend request failed: ${response.status}`)
    }

    const generatedApp: GeneratedApp = await response.json()

    // Save the generated app to local storage for persistence
    saveGeneratedApp(generatedApp)

    return generatedApp

  } catch (error) {
    console.error('Error generating app with backend:', error)
    throw error
  }
}

/**
 * Get all generated apps from the backend
 */
export async function getAppsFromBackend(): Promise<GeneratedApp[]> {
  try {
    const response = await fetch(`${BACKEND_CONFIG.baseUrl}/apps`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(BACKEND_CONFIG.timeout),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch apps: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching apps from backend:', error)
    // Fallback to local storage if backend is unavailable
    return getSavedApps()
  }
}

/**
 * Get a specific app by ID from the backend
 */
export async function getAppFromBackend(appId: string): Promise<GeneratedApp> {
  try {
    const response = await fetch(`${BACKEND_CONFIG.baseUrl}/apps/${appId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(BACKEND_CONFIG.timeout),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch app: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching app from backend:', error)
    throw error
  }
}

/**
 * Delete an app from the backend
 */
export async function deleteAppFromBackend(appId: string): Promise<void> {
  try {
    const response = await fetch(`${BACKEND_CONFIG.baseUrl}/apps/${appId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(BACKEND_CONFIG.timeout),
    })

    if (!response.ok) {
      throw new Error(`Failed to delete app: ${response.status}`)
    }

    // Also remove from local storage
    deleteSavedApp(appId)
  } catch (error) {
    console.error('Error deleting app from backend:', error)
    throw error
  }
}

/**
 * Save generated app to local storage
 */
function saveGeneratedApp(app: GeneratedApp): void {
  try {
    const savedApps = JSON.parse(localStorage.getItem('generatedApps') || '[]')
    savedApps.push(app)
    localStorage.setItem('generatedApps', JSON.stringify(savedApps))
  } catch (error) {
    console.error('Failed to save app to local storage:', error)
  }
}

/**
 * Get all saved generated apps from local storage
 */
export function getSavedApps(): GeneratedApp[] {
  try {
    return JSON.parse(localStorage.getItem('generatedApps') || '[]')
  } catch (error) {
    console.error('Failed to load apps from local storage:', error)
    return []
  }
}

/**
 * Delete a saved app from local storage
 */
export function deleteSavedApp(appId: string): void {
  try {
    const savedApps = getSavedApps()
    const filteredApps = savedApps.filter(app => app.id !== appId)
    localStorage.setItem('generatedApps', JSON.stringify(filteredApps))
  } catch (error) {
    console.error('Failed to delete app from local storage:', error)
  }
}
