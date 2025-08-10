import axios from 'axios';

// Configuration for Lovable API
const LOVABLE_API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_LOVABLE_API_URL || 'https://api.lovable.dev',
  apiKey: process.env.NEXT_PUBLIC_LOVABLE_API_KEY || '',
  timeout: 60000, // 60 seconds timeout for generation
};

// Interface for app generation request
interface AppGenerationRequest {
  description: string;
  framework?: string;
  features?: string[];
  style?: string;
}

// Interface for app generation response
interface AppGenerationResponse {
  code: string;
  files?: Array<{
    name: string;
    content: string;
    path: string;
  }>;
  metadata?: {
    framework: string;
    dependencies: string[];
    instructions: string;
  };
}

// Interface for workspace project
interface WorkspaceProject {
  id: string;
  name: string;
  description: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  status: 'generated' | 'saved' | 'running';
}

/**
 * Generate an app using the Lovable API
 * @param description - User's app description
 * @param options - Additional generation options
 * @returns Generated app code and metadata
 */
export async function generateAppWithLovable(
  description: string,
  options: Partial<AppGenerationRequest> = {}
): Promise<string> {
  try {
    // For demo purposes, we'll simulate the API call
    // In production, you would use the actual Lovable API
    console.log('Generating app with description:', description);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate sample code based on description
    const generatedCode = generateSampleCode(description, options);
    
    // Save to workspace
    await saveToWorkspace({
      id: `app_${Date.now()}`,
      name: options.framework ? `${options.framework} App` : 'Generated App',
      description,
      code: generatedCode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'generated'
    });
    
    return generatedCode;
  } catch (error) {
    console.error('Error generating app with Lovable:', error);
    throw new Error('Failed to generate app. Please try again.');
  }
}

/**
 * Generate sample code based on description
 * This is a placeholder - in production, this would come from Lovable API
 */
function generateSampleCode(description: string, options: Partial<AppGenerationRequest>): string {
  const framework = options.framework || 'react';
  const hasAuth = description.toLowerCase().includes('authentication') || description.toLowerCase().includes('login');
  const hasDatabase = description.toLowerCase().includes('database') || description.toLowerCase().includes('storage');
  const hasAPI = description.toLowerCase().includes('api') || description.toLowerCase().includes('backend');
  
  if (framework === 'react') {
    return generateReactCode(description, { hasAuth, hasDatabase, hasAPI });
  } else if (framework === 'vue') {
    return generateVueCode(description, { hasAuth, hasDatabase, hasAPI });
  } else if (framework === 'node') {
    return generateNodeCode(description, { hasAuth, hasDatabase, hasAPI });
  } else {
    return generateGenericCode(description, { hasAuth, hasDatabase, hasAPI });
  }
}

function generateReactCode(description: string, features: any): string {
  return `// React App: ${description}
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  ${features.hasAuth ? `
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  ` : ''}

  useEffect(() => {
    // Initialize app
    console.log('App initialized');
  }, []);

  ${features.hasAuth ? `
  const handleLogin = async (credentials) => {
    setLoading(true);
    try {
      // Implement authentication logic here
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };
  ` : ''}

  ${features.hasDatabase ? `
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };
  ` : ''}

  return (
    <div className="App">
      <header className="App-header">
        <h1>${description.split(' ').slice(0, 3).join(' ')}</h1>
        <p>Generated with DesignX + Lovable</p>
      </header>
      
      <main className="App-main">
        ${features.hasAuth ? `
        {!isAuthenticated ? (
          <div className="auth-section">
            <h2>Welcome! Please log in</h2>
            <button onClick={() => handleLogin({ username: 'demo', password: 'demo' })}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        ) : (
          <div className="app-content">
            <h2>Welcome back, {features.hasDatabase ? '{user?.name || "User"}' : 'User'}!</h2>
            ${features.hasDatabase ? `
            <button onClick={fetchData} disabled={loading}>
              {loading ? 'Loading...' : 'Load Data'}
            </button>
            {data.length > 0 && (
              <div className="data-display">
                <h3>Your Data:</h3>
                <ul>
                  {data.map((item, index) => (
                    <li key={index}>{JSON.stringify(item)}</li>
                  ))}
                </ul>
              </div>
            )}
            ` : ''}
          </div>
        )}
        ` : `
        <div className="app-content">
          <h2>Your App is Ready!</h2>
          <p>This is a sample React app generated based on your description:</p>
          <blockquote>${description}</blockquote>
          ${features.hasDatabase ? `
          <button onClick={fetchData} disabled={loading}>
            {loading ? 'Loading...' : 'Load Sample Data'}
          </button>
          ` : ''}
        </div>
        `}
      </main>
    </div>
  );
}

export default App;
`;
}

function generateVueCode(description: string, features: any): string {
  return `<!-- Vue App: ${description} -->
<template>
  <div id="app">
    <header class="app-header">
      <h1>${description.split(' ').slice(0, 3).join(' ')}</h1>
      <p>Generated with DesignX + Lovable</p>
    </header>
    
    <main class="app-main">
      <div class="app-content">
        <h2>Your Vue App is Ready!</h2>
        <p>This is a sample Vue app generated based on your description:</p>
        <blockquote>${description}</blockquote>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      message: 'Hello Vue!'
    }
  }
}
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  text-align: center;
  padding: 20px;
}

.app-header {
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.app-main {
  max-width: 800px;
  margin: 0 auto;
}
</style>
`;
}

function generateNodeCode(description: string, features: any): string {
  return `// Node.js App: ${description}
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

${features.hasAuth ? `
// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.sendStatus(401);
  }
  
  // Implement JWT verification here
  next();
};
` : ''}

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to your generated app!',
    description: '${description}',
    timestamp: new Date().toISOString()
  });
});

${features.hasAuth ? `
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  // Implement actual authentication logic here
  if (username === 'demo' && password === 'demo') {
    res.json({
      user: { id: 1, username: 'demo', name: 'Demo User' },
      token: 'sample-jwt-token'
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/profile', authenticateToken, (req, res) => {
  res.json({ user: { id: 1, username: 'demo', name: 'Demo User' } });
});
` : ''}

${features.hasDatabase ? `
app.get('/api/data', (req, res) => {
  // Implement database query here
  const sampleData = [
    { id: 1, name: 'Sample Item 1', description: 'This is sample data' },
    { id: 2, name: 'Sample Item 2', description: 'More sample data' }
  ];
  
  res.json(sampleData);
});
` : ''}

// Start server
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
  console.log(\`App: ${description}\`);
});

module.exports = app;
`;
}

function generateGenericCode(description: string, features: any): string {
  return `// Generated App: ${description}
// This is a generic template for your app

console.log('Welcome to your generated app!');
console.log('Description:', '${description}');

// TODO: Implement your app logic here
// Based on your description, you might want to:
${features.hasAuth ? '- Add user authentication and login/logout functionality' : ''}
${features.hasDatabase ? '- Set up a database connection and data models' : ''}
${features.hasAPI ? '- Create API endpoints for your application' : ''}
- Build a user interface for your app
- Add business logic and features
- Implement error handling and validation
- Add testing and documentation

// Happy coding! 🚀
`;
}

/**
 * Save project to workspace
 */
async function saveToWorkspace(project: WorkspaceProject): Promise<void> {
  try {
    // In a real implementation, this would save to a database or file system
    // For now, we'll use localStorage for demo purposes
    const existingProjects = JSON.parse(localStorage.getItem('designx-projects') || '[]');
    existingProjects.push(project);
    localStorage.setItem('designx-projects', JSON.stringify(existingProjects));
    
    console.log('Project saved to workspace:', project);
  } catch (error) {
    console.error('Error saving to workspace:', error);
  }
}

/**
 * Get all projects from workspace
 */
export async function getWorkspaceProjects(): Promise<WorkspaceProject[]> {
  try {
    const projects = JSON.parse(localStorage.getItem('designx-projects') || '[]');
    return projects;
  } catch (error) {
    console.error('Error getting workspace projects:', error);
    return [];
  }
}

/**
 * Delete project from workspace
 */
export async function deleteWorkspaceProject(projectId: string): Promise<void> {
  try {
    const projects = JSON.parse(localStorage.getItem('designx-projects') || '[]');
    const filteredProjects = projects.filter((p: WorkspaceProject) => p.id !== projectId);
    localStorage.setItem('designx-projects', JSON.stringify(filteredProjects));
    
    console.log('Project deleted from workspace:', projectId);
  } catch (error) {
    console.error('Error deleting project:', error);
  }
}
