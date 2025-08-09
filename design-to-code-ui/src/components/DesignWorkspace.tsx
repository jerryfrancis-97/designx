/**
 * DesignWorkspace.tsx
 *
 * Main container component that orchestrates the entire DesignX application.
 * Integrates the AI sidebar, React Flow canvas, toolbar controls, and demo mode.
 * Manages the React Flow instance and provides control functions for canvas operations
 * like zoom, export, code generation, and preview.
 */

'use client';

import { useState, createContext, useContext } from 'react';
import { ReactFlowInstance } from 'reactflow';
import AISidebar from './AISidebar';
import FlowCanvas from './FlowCanvas';
import Toolbar from './Toolbar';
import DemoMode from './DemoMode';

// Theme context for dark/light mode
interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default function DesignWorkspace() {
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle between dark and light themes
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Zoom in on the canvas
  const handleZoomIn = () => {
    if (reactFlowInstance) {
      reactFlowInstance.zoomIn();
    }
  };

  // Zoom out on the canvas
  const handleZoomOut = () => {
    if (reactFlowInstance) {
      reactFlowInstance.zoomOut();
    }
  };

  // Fit all nodes within the viewport
  const handleFitView = () => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView();
    }
  };

  // Reset canvas to initial state
  const handleReset = () => {
    if (reactFlowInstance) {
      reactFlowInstance.setNodes([]);
      reactFlowInstance.setEdges([]);
    }
  };

  // Export the current design
  const handleExport = () => {
    if (reactFlowInstance) {
      const data = reactFlowInstance.toObject();
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'design-export.json';
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  // Generate code from the design
  const handleGenerateCode = () => {
    // TODO: Implement code generation logic
    console.log('Code generation feature coming soon!');
  };

  // Preview the design
  const handlePreview = () => {
    // TODO: Implement preview logic
    console.log('Preview feature coming soon!');
  };

  // Initialize React Flow instance
  const onInit = (instance: ReactFlowInstance) => {
    setReactFlowInstance(instance);
  };

  // Theme context value
  const themeContextValue: ThemeContextType = {
    isDarkMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <div className={`h-screen flex ${isDarkMode ? 'dark' : ''}`}>
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`fixed top-4 right-4 z-50 p-3 rounded-full shadow-lg transition-all duration-300 ${
            isDarkMode
              ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
              : 'bg-white text-gray-800 hover:bg-gray-100'
          } border-2 ${
            isDarkMode ? 'border-gray-600' : 'border-gray-300'
          }`}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>

        {/* Main Workspace */}
        <div className={`flex-1 flex ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <AISidebar />
          <div className="flex-1 relative">
            <FlowCanvas onInit={onInit} />
            <Toolbar
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onFitView={handleFitView}
              onReset={handleReset}
              onExport={handleExport}
              onGenerateCode={handleGenerateCode}
              onPreview={handlePreview}
            />
          </div>
        </div>

        {/* Demo Mode Overlay */}
        <DemoMode />
      </div>
    </ThemeContext.Provider>
  );
}
