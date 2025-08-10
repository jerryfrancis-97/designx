'use client';

import { useState, useMemo } from 'react';
import { Code, FileText, Folder, Download, Copy, Edit, Trash2, Eye, Search, Save, X, GitBranch, ExternalLink } from 'lucide-react';

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

interface CodeFolderViewerProps {
  folder: CodeFolder;
  onFolderDeleted: (folderId: string) => void;
  onFileEdited: (folderId: string, filename: string, newContent: string) => void;
}

export function CodeFolderViewer({ folder, onFolderDeleted, onFileEdited }: CodeFolderViewerProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeletedFiles, setShowDeletedFiles] = useState(false);

  // Auto-select first file if none selected
  useMemo(() => {
    if (!selectedFile && Object.keys(folder.files).length > 0) {
      setSelectedFile(Object.keys(folder.files)[0]);
    }
  }, [folder.files, selectedFile]);

  // Organize files by folder structure
  const organizedFiles = useMemo(() => {
    const fileTree: Record<string, { files: string[], isFolder: boolean }> = {};
    
    Object.keys(folder.files).forEach(filepath => {
      const parts = filepath.split('/');
      if (parts.length === 1) {
        // Root level file
        if (!fileTree['root']) {
          fileTree['root'] = { files: [], isFolder: false };
        }
        fileTree['root'].files.push(filepath);
      } else {
        // File in subfolder
        const folderPath = parts.slice(0, -1).join('/');
        if (!fileTree[folderPath]) {
          fileTree[folderPath] = { files: [], isFolder: true };
        }
        fileTree[folderPath].files.push(filepath);
      }
    });
    
    return fileTree;
  }, [folder.files]);

  // Filter files based on search term
  const filteredFiles = useMemo(() => {
    if (!searchTerm) return Object.keys(folder.files);
    return Object.keys(folder.files).filter(filename =>
      filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      folder.files[filename].toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [folder.files, searchTerm]);

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

  const handleEditFile = (filename: string) => {
    setSelectedFile(filename);
    setEditedContent(folder.files[filename]);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (selectedFile && editedContent !== folder.files[selectedFile]) {
      onFileEdited(folder.id, selectedFile, editedContent);
    }
    setIsEditing(false);
    setEditedContent('');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent('');
  };

  const handleDeleteFolder = () => {
    if (confirm(`Are you sure you want to delete "${folder.name}" and all its files?`)) {
      onFolderDeleted(folder.id);
    }
  };

  const openExternalLink = () => {
    if (folder.githubUrl) {
      window.open(folder.githubUrl, '_blank');
    } else if (folder.originalUrl) {
      window.open(folder.originalUrl, '_blank');
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {folder.source === 'github' ? (
                <GitBranch className="h-6 w-6 text-green-500" />
              ) : folder.source === 'url' ? (
                <ExternalLink className="h-6 w-6 text-purple-500" />
              ) : (
                <Folder className="h-6 w-6 text-blue-500" />
              )}
              <h2 className="text-xl font-semibold text-gray-900">
                {folder.name}
              </h2>
              {(folder.githubUrl || folder.originalUrl) && (
                <button
                  onClick={openExternalLink}
                  className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded"
                  title="Open external link"
                >
                  <ExternalLink className="h-4 w-4" />
                </button>
              )}
            </div>
            <p className="text-gray-600">
              {Object.keys(folder.files).length} files • Uploaded {folder.uploadDate.toLocaleDateString()}
            </p>
            {folder.description && (
              <p className="text-sm text-gray-500 mt-1">{folder.description}</p>
            )}
            {folder.source === 'github' && folder.githubUrl && (
              <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                <GitBranch className="h-3 w-3" />
                {folder.githubUrl}
              </p>
            )}
            {folder.source === 'url' && folder.originalUrl && (
              <p className="text-sm text-purple-600 mt-1 flex items-center gap-1">
                <ExternalLink className="h-3 w-3" />
                {folder.originalUrl}
              </p>
            )}
          </div>
          <button
            onClick={handleDeleteFolder}
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md"
            title="Delete repository"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex h-[600px]">
        {/* File Tree Sidebar */}
        <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Code className="h-4 w-4 text-green-500" />
              Files ({filteredFiles.length})
            </h3>
            
            {filteredFiles.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No files found</p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-blue-500 hover:text-blue-700 text-xs mt-1"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {Object.entries(organizedFiles).map(([folderPath, folderData]) => (
                  <div key={folderPath} className="space-y-1">
                    {folderPath !== 'root' && (
                      <div className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600">
                        <Folder className="h-3 w-3" />
                        {folderPath}
                      </div>
                    )}
                    <div className="space-y-1">
                      {folderData.files.map((filename) => {
                        const content = folder.files[filename];
                        const isSelected = selectedFile === filename;
                        const fileSize = getFileSize(content);
                        const displayName = folderPath === 'root' ? filename : filename.split('/').pop() || filename;
                        
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
                              <div className="font-medium text-sm truncate">{displayName}</div>
                              <div className="text-xs text-gray-500 flex items-center gap-2">
                                <span>{getFileLanguage(filename)}</span>
                                <span>•</span>
                                <span>{fileSize}</span>
                                {folderPath !== 'root' && (
                                  <>
                                    <span>•</span>
                                    <span className="text-gray-400">{folderPath}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Code Display/Edit Area */}
        <div className="flex-1 overflow-y-auto">
          {selectedFile && folder.files[selectedFile] ? (
            <div className="p-4">
              {/* File Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  {getFileIcon(selectedFile)}
                  <div>
                    <span className="font-medium text-gray-900">
                      {selectedFile.includes('/') ? selectedFile.split('/').pop() : selectedFile}
                    </span>
                    {selectedFile.includes('/') && (
                      <div className="text-xs text-gray-500">
                        {selectedFile}
                      </div>
                    )}
                    <span className="text-sm text-gray-500 ml-2">
                      ({getFileLanguage(selectedFile)} • {getFileSize(folder.files[selectedFile])})
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!isEditing && (
                    <>
                      <button
                        onClick={() => handleEditFile(selectedFile)}
                        className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                        title="Edit file"
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleCopyCode(folder.files[selectedFile])}
                        className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                      >
                        <Copy className="h-3 w-3" />
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                      <button
                        onClick={() => handleDownloadFile(selectedFile, folder.files[selectedFile])}
                        className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                      >
                        <Download className="h-3 w-3" />
                        Download
                      </button>
                    </>
                  )}
                  {isEditing && (
                    <>
                      <button
                        onClick={handleSaveEdit}
                        className="flex items-center gap-1 px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                      >
                        <Save className="h-3 w-3" />
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                      >
                        <X className="h-3 w-3" />
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Code Content */}
              {isEditing ? (
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full h-80 p-4 bg-gray-900 text-gray-100 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Edit your code here..."
                />
              ) : (
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto max-h-80">
                  <pre className="text-sm">
                    <code>{folder.files[selectedFile]}</code>
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Select a file to view or edit</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
