/**
 * Workspace Component
 * 
 * Displays generated code and provides workspace management tools.
 * Features a tabbed interface for code viewing and preview functionality.
 * 
 * Features:
 * - Multi-file code display with file tree navigation
 * - Tab navigation (Code/Preview)
 * - Copy to clipboard functionality
 * - File download capability
 * - Workspace integration options
 * - Code execution simulation
 * - Support for both single files and multi-file projects
 */

'use client';

import { useState } from 'react';
import { Copy, Download, FolderOpen, Play, Code, Eye, Folder } from 'lucide-react';

interface WorkspaceProps {
  generatedCode: string | Record<string, string>;
  appName: string;
}

export function Workspace({ generatedCode, appName }: WorkspaceProps) {
  // State for tab management and UI feedback
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [copied, setCopied] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // Helper function to check if generatedCode is a file object
  const isFileObject = (code: string | Record<string, string>): code is Record<string, string> => {
    return typeof code === 'object' && code !== null;
  };

  // Get the current code to display
  const getCurrentCode = (): string => {
    if (isFileObject(generatedCode)) {
      return selectedFile && generatedCode[selectedFile] ? generatedCode[selectedFile] : '';
    }
    return generatedCode;
  };

  // Get file list if it's a file object
  const getFileList = (): string[] => {
    if (isFileObject(generatedCode)) {
      return Object.keys(generatedCode);
    }
    return [];
  };

  /**
   * Copies the generated code to the user's clipboard
   * Provides visual feedback when copying is successful
   */
  const handleCopyCode = async () => {
    try {
      const codeToCopy = getCurrentCode();
      await navigator.clipboard.writeText(codeToCopy);
      setCopied(true);
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  /**
   * Downloads the generated code as a JavaScript file
   * Creates a blob and triggers download with appropriate filename
   */
  const handleSaveToFile = () => {
    const codeToSave = getCurrentCode();
    const blob = new Blob([codeToSave], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${appName || 'generated-app'}.js`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /**
   * Simulates opening the code in a workspace/editor
   * Currently shows an alert, but would integrate with actual editor
   */
  const handleOpenInWorkspace = () => {
    // This would typically open the code in a new editor or workspace
    alert('Opening in workspace... (This would integrate with your preferred editor)');
  };

  /**
   * Simulates running the generated code
   * Currently shows an alert, but would execute the actual application
   */
  const handleRunCode = () => {
    // This would typically execute the generated code
    alert('Running code... (This would execute the generated application)');
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Component Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Code className="h-5 w-5 text-green-500" />
          Workspace
        </h2>
        <p className="text-gray-600 mt-1">
          {appName ? `Generated code for: ${appName}` : 'No app generated yet'}
          {isFileObject(generatedCode) && getFileList().length > 1 && (
            <span className="ml-2 text-blue-600">
              ({getFileList().length} files)
            </span>
          )}
        </p>
      </div>
      
      <div className="p-6">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-4">
          {/* Code Tab */}
          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'code'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Code className="h-4 w-4 inline mr-2" />
            Code
          </button>
          
          {/* Preview Tab */}
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'preview'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Eye className="h-4 w-4 inline mr-2" />
            Preview
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'code' ? (
          <div className="space-y-4">
            {generatedCode ? (
              <>
                {/* File Tree Navigation (if multiple files) */}
                {isFileObject(generatedCode) && getFileList().length > 1 && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Folder className="h-4 w-4 text-blue-500" />
                      Project Files ({getFileList().length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {getFileList().map((filename) => (
                        <button
                          key={filename}
                          onClick={() => setSelectedFile(filename)}
                          className={`px-3 py-1 text-sm rounded-md border ${
                            selectedFile === filename
                              ? 'bg-blue-100 border-blue-300 text-blue-700'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {filename}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 mb-4">
                  {/* Copy Code Button */}
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    <Copy className="h-4 w-4" />
                    {copied ? 'Copied!' : 'Copy Code'}
                  </button>
                  
                  {/* Save to File Button */}
                  <button
                    onClick={handleSaveToFile}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    <Download className="h-4 w-4" />
                    Save to File
                  </button>
                  
                  {/* Open in Workspace Button */}
                  <button
                    onClick={handleOpenInWorkspace}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    <FolderOpen className="h-4 w-4" />
                    Open in Workspace
                  </button>
                  
                  {/* Run Code Button */}
                  <button
                    onClick={handleRunCode}
                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    <Play className="h-4 w-4" />
                    Run Code
                  </button>
                </div>

                {/* File Info (if multiple files) */}
                {isFileObject(generatedCode) && selectedFile && (
                  <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800">
                      <strong>Current file:</strong> {selectedFile}
                    </p>
                  </div>
                )}
                
                {/* Code Display */}
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto max-h-96">
                  <pre className="text-sm">
                    <code>{getCurrentCode()}</code>
                  </pre>
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="text-center py-12 text-gray-500">
                <Code className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No code generated yet</p>
                <p className="text-sm">Use the App Generator to create your first app</p>
              </div>
            )}
          </div>
        ) : (
          /* Preview Tab Content */
          <div className="text-center py-12 text-gray-500">
            <Eye className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Preview coming soon</p>
            <p className="text-sm">This will show a live preview of your generated app</p>
          </div>
        )}
      </div>
    </div>
  );
}
