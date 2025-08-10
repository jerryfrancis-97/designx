/**
 * AppGenerator Component
 * 
 * Main form component for generating applications using AI.
 * Allows users to input app name, description, and generate code
 * through the Lovable API integration.
 * 
 * Features:
 * - App name and description input
 * - AI-powered code generation
 * - Workspace saving functionality
 * - Loading states and error handling
 */

'use client';

import { useState } from 'react';
import { Sparkles, Save, Play } from 'lucide-react';
import { AppGenerationRequest, GeneratedApp } from '@/types/app';
import { generateAppWithBackend } from '@/lib/backend-api';

interface AppGeneratorProps {
  onAppGenerated: (app: GeneratedApp) => void;
  isGenerating?: boolean;
  setIsGenerating?: (generating: boolean) => void;
}

export function AppGenerator({ onAppGenerated, isGenerating, setIsGenerating }: AppGeneratorProps) {
  // State for form inputs and UI states
  const [appDescription, setAppDescription] = useState('');
  const [appName, setAppName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Handles the AI app generation process
   * Calls the Lovable API to generate code based on user description
   */
  const handleGenerate = async () => {
    if (!appDescription.trim()) return;
    
    setIsGenerating(true);
    try {
      const request: AppGenerationRequest = {
        description: appDescription,
        features: [],
        technology: 'auto',
        complexity: 'medium'
      };
      
      const generatedApp = await generateAppWithBackend(request);
      onAppGenerated(generatedApp);
    } catch (error) {
      console.error('Error generating app:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Saves the current app description to the workspace
   * Currently uses localStorage for persistence
   */
  const handleSaveToWorkspace = async () => {
    if (!appDescription.trim() || !appName.trim()) return;
    
    setIsSaving(true);
    try {
      // Save to localStorage for now
      const workspaceData = {
        description: appDescription,
        name: appName,
        timestamp: new Date().toISOString(),
      };
      
      localStorage.setItem('designx-workspace', JSON.stringify(workspaceData));
      alert('App description saved to workspace!');
    } catch (error) {
      console.error('Error saving to workspace:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Component Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-500" />
          App Generator
        </h2>
        <p className="text-gray-600 mt-1">
          Describe your app idea and let AI generate the code for you
        </p>
      </div>
      
      {/* Form Content */}
      <div className="p-6 space-y-4">
        {/* App Name Input */}
        <div className="space-y-2">
          <label htmlFor="app-name" className="block text-sm font-medium text-gray-700">
            App Name
          </label>
          <input
            id="app-name"
            type="text"
            placeholder="Enter app name..."
            value={appName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAppName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* App Description Input */}
        <div className="space-y-2">
          <label htmlFor="app-description" className="block text-sm font-medium text-gray-700">
            App Description
          </label>
          <textarea
            id="app-description"
            placeholder="Describe your app idea in detail... (e.g., 'A todo app with user authentication, drag-and-drop tasks, and real-time updates')"
            value={appDescription}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAppDescription(e.target.value)}
            className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!appDescription.trim() || isGenerating}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Generating...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Generate App
              </>
            )}
          </button>
          
          {/* Save Button */}
          <button
            onClick={handleSaveToWorkspace}
            disabled={!appDescription.trim() || !appName.trim() || isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
