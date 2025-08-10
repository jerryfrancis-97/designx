'use client';

import { useState } from 'react';
import { Code, FileText, Folder, Download, Copy, Eye } from 'lucide-react';
import { GeneratedApp } from '@/types/app';

interface GeneratedAppViewerProps {
  generatedApp: GeneratedApp | null;
  isGenerating: boolean;
}

export function GeneratedAppViewer({ generatedApp, isGenerating }: GeneratedAppViewerProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const handleDownloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
      case 'ts':
      case 'jsx':
      case 'tsx':
        return <Code className="h-4 w-4 text-blue-500" />;
      case 'html':
        return <FileText className="h-4 w-4 text-orange-500" />;
      case 'css':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'json':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'py':
        return <FileText className="h-4 w-4 text-yellow-500" />;
      case 'java':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'cpp':
      case 'c':
        return <FileText className="h-4 w-4 text-indigo-500" />;
      case 'md':
        return <FileText className="h-4 w-4 text-gray-500" />;
      case 'xml':
        return <FileText className="h-4 w-4 text-orange-600" />;
      case 'yaml':
      case 'yml':
        return <FileText className="h-4 w-4 text-blue-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getFileLanguage = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
        return 'javascript';
      case 'ts':
        return 'typescript';
      case 'jsx':
        return 'jsx';
      case 'tsx':
        return 'tsx';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'json':
        return 'json';
      case 'py':
        return 'python';
      case 'java':
        return 'java';
      case 'cpp':
        return 'cpp';
      case 'c':
        return 'c';
      case 'md':
        return 'markdown';
      case 'xml':
        return 'xml';
      case 'yaml':
      case 'yml':
        return 'yaml';
      default:
        return 'text';
    }
  };

  const getFileSize = (content: string) => {
    const bytes = new Blob([content]).size;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (isGenerating) {
    return (
      <div className="w-full bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating your app...</p>
        </div>
      </div>
    );
  }

  if (!generatedApp) {
    return (
      <div className="w-full bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <div className="text-center py-12 text-gray-500">
          <Code className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No app generated yet</p>
          <p className="text-sm">Use the App Generator to create your first app</p>
        </div>
      </div>
    );
  }

  // Handle both old and new app formats
  const appFiles = generatedApp.files || { [generatedApp.name || 'app.js']: generatedApp.code || '// Generated app code' };
  const appName = generatedApp.name || generatedApp.appName || 'Generated App';

  return (
    <div className="w-full bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Code className="h-5 w-5 text-green-500" />
          Generated App: {appName}
        </h2>
        <p className="text-gray-600 mt-1">
          {Object.keys(appFiles).length} files generated
        </p>
        {generatedApp.description && (
          <p className="text-sm text-gray-500 mt-1">{generatedApp.description}</p>
        )}
      </div>

      <div className="flex h-96">
        {/* File Tree Sidebar */}
        <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Folder className="h-4 w-4 text-blue-500" />
              Project Files ({Object.keys(appFiles).length})
            </h3>
            <div className="space-y-1">
              {Object.keys(appFiles).map((filename) => {
                const content = appFiles[filename];
                const isSelected = selectedFile === filename;
                const fileSize = getFileSize(content);
                
                return (
                  <button
                    key={filename}
                    onClick={() => setSelectedFile(filename)}
                    className={`w-full text-left p-3 rounded-md flex items-center gap-3 hover:bg-gray-100 transition-colors ${
                      isSelected ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-gray-700'
                    }`}
                  >
                    {getFileIcon(filename)}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{filename}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <span>{getFileLanguage(filename)}</span>
                        <span>•</span>
                        <span>{fileSize}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Code Display */}
        <div className="flex-1 overflow-y-auto">
          {selectedFile && appFiles[selectedFile] ? (
            <div className="p-4">
              {/* File Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  {getFileIcon(selectedFile)}
                  <div>
                    <span className="font-medium text-gray-900">{selectedFile}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({getFileLanguage(selectedFile)} • {getFileSize(appFiles[selectedFile])})
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopyCode(appFiles[selectedFile])}
                    className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    <Copy className="h-3 w-3" />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={() => handleDownloadFile(selectedFile, appFiles[selectedFile])}
                    className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </button>
                </div>
              </div>

              {/* Code Content */}
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto max-h-80">
                <pre className="text-sm">
                  <code>{appFiles[selectedFile]}</code>
                </pre>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Select a file to view its code</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
