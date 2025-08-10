'use client';

import { useState } from 'react';
import { AppGenerator } from '@/components/AppGenerator';
import { GeneratedAppViewer } from '@/components/GeneratedAppViewer';
import { CodeWorkspace } from '@/components/CodeWorkspace';
import { DesignWorkspace } from '@/components/DesignWorkspace';
import { Header } from '@/components/Header';
import { GeneratedApp } from '@/types/app';

export default function Home() {
  const [generatedApp, setGeneratedApp] = useState<GeneratedApp | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'generator' | 'workspace' | 'design'>('generator');

  const handleAppGenerated = (app: GeneratedApp) => {
    setGeneratedApp(app);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('generator')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'generator'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                AI App Generator
              </button>
              <button
                onClick={() => setActiveTab('workspace')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'workspace'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Code Workspace
              </button>
              <button
                onClick={() => setActiveTab('design')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'design'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Design Workspace
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'generator' ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Left Column - App Generator */}
            <div className="space-y-6">
              <AppGenerator 
                onAppGenerated={handleAppGenerated}
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
              />
            </div>
            
            {/* Right Column - Generated App Viewer */}
            <div className="space-y-6">
              <GeneratedAppViewer 
                generatedApp={generatedApp}
                isGenerating={isGenerating}
              />
            </div>
          </div>
        ) : activeTab === 'workspace' ? (
          <div className="space-y-6">
            <CodeWorkspace />
          </div>
        ) : (
          <div className="h-[calc(100vh-200px)]">
            <DesignWorkspace />
          </div>
        )}
      </main>
    </div>
  );
}
