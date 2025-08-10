'use client';

import { useState, useEffect } from 'react';
import { CodeFolderUploader } from './CodeFolderUploader';
import { CodeFolderViewer } from './CodeFolderViewer';

interface CodeFolder {
  id: string;
  name: string;
  files: Record<string, string>;
  uploadDate: Date;
  description?: string;
  source?: 'upload' | 'github' | 'url';
  githubUrl?: string;
  originalUrl?: string;
}

export function CodeWorkspace() {
  const [codeFolders, setCodeFolders] = useState<CodeFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<CodeFolder | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Load saved folders from localStorage on component mount
  useEffect(() => {
    const savedFolders = localStorage.getItem('codeFolders');
    if (savedFolders) {
      try {
        const parsed = JSON.parse(savedFolders);
        // Convert date strings back to Date objects
        const foldersWithDates = parsed.map((folder: any) => ({
          ...folder,
          uploadDate: new Date(folder.uploadDate)
        }));
        setCodeFolders(foldersWithDates);
        
        // Auto-select first folder if available
        if (foldersWithDates.length > 0 && !selectedFolder) {
          setSelectedFolder(foldersWithDates[0]);
        }
      } catch (error) {
        console.error('Error loading saved folders:', error);
      }
    }
  }, []);

  // Save folders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('codeFolders', JSON.stringify(codeFolders));
  }, [codeFolders]);

  const handleFolderAdded = (newFolder: CodeFolder) => {
    setCodeFolders(prev => [...prev, newFolder]);
    setSelectedFolder(newFolder);
  };

  const handleFolderDeleted = (folderId: string) => {
    setCodeFolders(prev => prev.filter(folder => folder.id !== folderId));
    
    // If the deleted folder was selected, select another one or clear selection
    if (selectedFolder?.id === folderId) {
      const remainingFolders = codeFolders.filter(folder => folder.id !== folderId);
      setSelectedFolder(remainingFolders.length > 0 ? remainingFolders[0] : null);
    }
  };

  const handleFileEdited = (folderId: string, filename: string, newContent: string) => {
    setCodeFolders(prev => prev.map(folder => {
      if (folder.id === folderId) {
        return {
          ...folder,
          files: {
            ...folder.files,
            [filename]: newContent
          }
        };
      }
      return folder;
    }));

    // Update selected folder if it's the one being edited
    if (selectedFolder?.id === folderId) {
      setSelectedFolder(prev => prev ? {
        ...prev,
        files: {
          ...prev.files,
          [filename]: newContent
        }
      } : null);
    }
  };

  const getFolderStats = () => {
    const totalFiles = codeFolders.reduce((sum, folder) => sum + Object.keys(folder.files).length, 0);
    const totalSize = codeFolders.reduce((sum, folder) => {
      return sum + Object.values(folder.files).reduce((folderSum, content) => {
        return folderSum + new Blob([content]).size;
      }, 0);
    }, 0);
    
    const formatSize = (bytes: number) => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return { totalFiles, totalSize: formatSize(totalSize) };
  };

  const stats = getFolderStats();

  return (
    <div className="w-full space-y-6">
      {/* Repository Uploader */}
      <CodeFolderUploader
        onFolderAdded={handleFolderAdded}
        existingFolders={codeFolders}
      />

      {/* Statistics and Controls */}
      {codeFolders.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Workspace Overview</h3>
              <p className="text-gray-600">
                {codeFolders.length} repositories • {stats.totalFiles} files • {stats.totalSize}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${
                    viewMode === 'list' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="List view"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${
                    viewMode === 'grid' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="Grid view"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Repository Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {codeFolders.map((folder) => (
                <div
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedFolder?.id === folder.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {folder.source === 'github' ? (
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                        </div>
                      ) : folder.source === 'url' ? (
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                          </svg>
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{folder.name}</h4>
                        <p className="text-xs text-gray-500">
                          {Object.keys(folder.files).length} files
                        </p>
                      </div>
                    </div>
                  </div>
                  {folder.description && (
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">{folder.description}</p>
                  )}
                  <div className="text-xs text-gray-500">
                    {folder.uploadDate.toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {codeFolders.map((folder) => (
                <div
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder)}
                  className={`p-3 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                    selectedFolder?.id === folder.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {folder.source === 'github' ? (
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                        </div>
                      ) : folder.source === 'url' ? (
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                          </svg>
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-gray-900">{folder.name}</h4>
                        <p className="text-sm text-gray-600">
                          {Object.keys(folder.files).length} files • {folder.uploadDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {Object.keys(folder.files).length} files
                      </div>
                      <div className="text-xs text-gray-500">
                        {folder.source === 'github' ? 'GitHub' : folder.source === 'url' ? 'URL Import' : 'Upload'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Code Folder Viewer */}
      {selectedFolder && (
        <CodeFolderViewer
          folder={selectedFolder}
          onFolderDeleted={handleFolderDeleted}
          onFileEdited={handleFileEdited}
        />
      )}

      {/* Empty State */}
      {codeFolders.length === 0 && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No repositories yet</h3>
          <p className="text-gray-600 mb-6">
            Get started by adding your first code repository. You can upload files, connect to GitHub, or import from URLs.
          </p>
        </div>
      )}
    </div>
  );
}
