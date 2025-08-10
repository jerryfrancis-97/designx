'use client';

import { useState } from 'react';
import { AppGenerator } from '@/components/AppGenerator';
import { Workspace } from '@/components/Workspace';
import { Projects } from '@/components/Projects';
import { Header } from '@/components/Header';

interface WorkspaceProject {
  id: string;
  name: string;
  description: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  status: 'generated' | 'saved' | 'running';
}

export default function Home() {
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentApp, setCurrentApp] = useState<string>('');
  const [currentProjectId, setCurrentProjectId] = useState<string>('');

  const handleAppGenerated = (code: string, appName: string) => {
    setGeneratedCode(code);
    setCurrentApp(appName);
  };

  const handleProjectSelect = (project: WorkspaceProject) => {
    setGeneratedCode(project.code);
    setCurrentApp(project.name);
    setCurrentProjectId(project.id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - App Generator */}
          <div className="xl:col-span-1 space-y-6">
            <AppGenerator 
              onAppGenerated={handleAppGenerated}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
            />
          </div>
          
          {/* Middle Column - Workspace */}
          <div className="xl:col-span-1 space-y-6">
            <Workspace 
              generatedCode={generatedCode}
              appName={currentApp}
            />
          </div>
          
          {/* Right Column - Projects */}
          <div className="xl:col-span-1 space-y-6">
            <Projects 
              onProjectSelect={handleProjectSelect}
              currentProjectId={currentProjectId}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
