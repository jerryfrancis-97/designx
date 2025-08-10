'use client';

import { useState, useRef } from 'react';
import { Upload, Folder, FileText, X, Plus, Code, Github, Link, Globe } from 'lucide-react';

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

interface CodeFolderUploaderProps {
  onFolderAdded: (folder: CodeFolder) => void;
  existingFolders: CodeFolder[];
}

export function CodeFolderUploader({ onFolderAdded, existingFolders }: CodeFolderUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [folderDescription, setFolderDescription] = useState('');
  const [uploadMode, setUploadMode] = useState<'files' | 'github' | 'url'>('files');
  const [githubUrl, setGithubUrl] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const validateGithubUrl = (url: string): boolean => {
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-._]+\/?$/;
    return githubRegex.test(url);
  };

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Check if the dropped items have webkitRelativePath (indicating folder structure)
      const hasFolderStructure = Array.from(e.dataTransfer.files).some(
        (file: any) => file.webkitRelativePath && file.webkitRelativePath.includes('/')
      );
      
      if (hasFolderStructure) {
        handleFolderUpload(e.dataTransfer.files);
      } else {
        handleFiles(e.dataTransfer.files);
      }
    }
  };

  const handleFiles = async (files: FileList) => {
    if (files.length === 0) return;

    setIsUploading(true);
    setError('');
    setSuccess('');

    try {
      const finalFolderName = folderName || `Upload_${new Date().toISOString().split('T')[0]}`;
      const filesMap: Record<string, string> = {};

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          throw new Error(`File ${file.name} is too large. Maximum size is 10MB.`);
        }

        const content = await file.text();
        filesMap[file.name] = content;
      }

      const newFolder: CodeFolder = {
        id: `folder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: finalFolderName,
        files: filesMap,
        uploadDate: new Date(),
        description: folderDescription,
        source: 'upload'
      };

      onFolderAdded(newFolder);
      setSuccess(`Successfully uploaded ${files.length} files!`);
      
      // Reset form
      setFolderName('');
      setFolderDescription('');
      setUploadMode('files');
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload files');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFolderUpload = async (files: FileList) => {
    if (files.length === 0) return;

    setIsUploading(true);
    setError('');
    setSuccess('');

    try {
      const finalFolderName = folderName || `Folder_${new Date().toISOString().split('T')[0]}`;
      const filesMap: Record<string, string> = {};

      // Process files and maintain folder structure
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          throw new Error(`File ${file.name} is too large. Maximum size is 10MB.`);
        }

        // Get the relative path from the file's webkitRelativePath
        const relativePath = (file as any).webkitRelativePath || file.name;
        
        const content = await file.text();
        filesMap[relativePath] = content;
      }

      const newFolder: CodeFolder = {
        id: `folder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: finalFolderName,
        files: filesMap,
        uploadDate: new Date(),
        description: folderDescription,
        source: 'upload'
      };

      onFolderAdded(newFolder);
      setSuccess(`Successfully uploaded folder with ${Object.keys(filesMap).length} files!`);
      
      // Reset form
      setFolderName('');
      setFolderDescription('');
      setUploadMode('files');
      
      // Clear inputs
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (folderInputRef.current) {
        folderInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload folder');
    } finally {
      setIsUploading(false);
    }
  };

  const handleGithubImport = async () => {
    if (!githubUrl.trim()) {
      setError('Please enter a GitHub repository URL');
      return;
    }

    if (!validateGithubUrl(githubUrl)) {
      setError('Please enter a valid GitHub repository URL (e.g., https://github.com/username/repo)');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccess('');

          try {
        // For demo purposes, we'll create a mock folder
        // In a real implementation, you would fetch the repository from GitHub API
        const repoName = githubUrl.split('/').pop()?.replace('.git', '') || 'github-repo';
        const finalFolderName = folderName || repoName;
        
        const mockFiles: Record<string, string> = {
          'README.md': `# ${repoName}\n\nImported from GitHub: ${githubUrl}\n\nThis is a placeholder for the actual repository content.`,
          'package.json': JSON.stringify({
            name: repoName,
            version: '1.0.0',
            description: `Imported from ${githubUrl}`,
            main: 'index.js'
          }, null, 2),
          'index.js': `// ${repoName}\n// Imported from GitHub: ${githubUrl}\n\nconsole.log('Hello from ${repoName}!');`
        };

        const newFolder: CodeFolder = {
          id: `github_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: finalFolderName,
          files: mockFiles,
          uploadDate: new Date(),
          description: folderDescription || `Imported from GitHub: ${githubUrl}`,
          source: 'github',
          githubUrl: githubUrl
        };

      onFolderAdded(newFolder);
      setSuccess(`Successfully imported repository from GitHub!`);
      
      // Reset form
      setFolderName('');
      setFolderDescription('');
      setGithubUrl('');
      setUploadMode('files');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import from GitHub');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlImport = async () => {
    if (!urlInput.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!validateUrl(urlInput)) {
      setError('Please enter a valid URL');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccess('');

    try {
      // For demo purposes, we'll create a mock folder
      // In a real implementation, you would fetch the content from the URL
      const urlName = new URL(urlInput).hostname.replace('www.', '');
      const finalFolderName = folderName || `${urlName}_import`;
      
      const mockFiles: Record<string, string> = {
        'imported.html': `<!DOCTYPE html>\n<html>\n<head>\n  <title>Imported from ${urlInput}</title>\n</head>\n<body>\n  <h1>Content imported from: ${urlInput}</h1>\n  <p>This is a placeholder for the actual content.</p>\n</body>\n</html>`,
        'metadata.json': JSON.stringify({
          source: urlInput,
          importedAt: new Date().toISOString(),
          description: `Content imported from ${urlInput}`
        }, null, 2)
      };

      const newFolder: CodeFolder = {
        id: `url_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: finalFolderName,
        files: mockFiles,
        uploadDate: new Date(),
        description: folderDescription || `Imported from URL: ${urlInput}`,
        source: 'url',
        originalUrl: urlInput
      };

      onFolderAdded(newFolder);
      setSuccess(`Successfully imported content from URL!`);
      
      // Reset form
      setFolderName('');
      setFolderDescription('');
      setUrlInput('');
      setUploadMode('files');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import from URL');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFolderInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFolderUpload(e.target.files);
    }
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Code Repository</h3>
        <p className="text-gray-600">Upload files, connect to GitHub, or import from URLs</p>
      </div>

      {/* Mode Selection */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setUploadMode('files')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            uploadMode === 'files'
              ? 'bg-blue-100 border-blue-300 text-blue-700'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Upload className="h-4 w-4" />
          Upload Files
        </button>
        <button
          onClick={() => setUploadMode('github')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            uploadMode === 'github'
              ? 'bg-green-100 border-green-300 text-green-700'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Github className="h-4 w-4" />
          GitHub Repository
        </button>
        <button
          onClick={() => setUploadMode('url')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            uploadMode === 'url'
              ? 'bg-purple-100 border-purple-300 text-purple-700'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Link className="h-4 w-4" />
          URL Import
        </button>
      </div>

      {/* Repository Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Repository Name
          </label>
          <input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Enter repository name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <input
            type="text"
            value={folderDescription}
            onChange={(e) => setFolderDescription(e.target.value)}
            placeholder="Enter description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* File Upload Mode */}
      {uploadMode === 'files' && (
        <div className="space-y-6">
          {/* Drag & Drop Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drop files or folders here
            </p>
            <p className="text-gray-600 mb-4">
              Support for multiple files and entire folders. Maximum file size: 10MB
            </p>
          </div>

          {/* Upload Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="text-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                disabled={isUploading}
              >
                <Upload className="h-4 w-4" />
                {isUploading ? 'Uploading...' : 'Choose Files'}
              </button>
              <p className="text-sm text-gray-500 mt-2">Upload multiple individual files</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileInputChange}
                className="hidden"
                accept=".js,.ts,.jsx,.tsx,.html,.css,.json,.py,.java,.cpp,.c,.md,.xml,.yaml,.yml,.txt"
              />
            </div>

            <div className="text-center">
              <button
                onClick={() => folderInputRef.current?.click()}
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto"
                disabled={isUploading}
              >
                <Folder className="h-4 w-4" />
                {isUploading ? 'Uploading...' : 'Choose Folder'}
              </button>
              <p className="text-sm text-gray-500 mt-2">Upload entire folder with structure</p>
              <input
                ref={folderInputRef}
                type="file"
                {...({ webkitdirectory: '' } as any)}
                onChange={handleFolderInputChange}
                className="hidden"
              />
            </div>
          </div>
        </div>
      )}

      {/* GitHub Import Mode */}
      {uploadMode === 'github' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GitHub Repository URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username/repository"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleGithubImport}
                disabled={isUploading || !githubUrl.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUploading ? 'Importing...' : 'Import'}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Enter the full GitHub repository URL
            </p>
          </div>
        </div>
      )}

      {/* URL Import Mode */}
      {uploadMode === 'url' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL to Import
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/file.txt"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleUrlImport}
                disabled={isUploading || !urlInput.trim()}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUploading ? 'Importing...' : 'Import'}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Enter the URL of the content you want to import
            </p>
          </div>
        </div>
      )}

      {/* Messages */}
      {(error || success) && (
        <div className="mt-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center justify-between">
              <span>{error}</span>
              <button onClick={clearMessages} className="text-red-500 hover:text-red-700">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center justify-between">
              <span>{success}</span>
              <button onClick={clearMessages} className="text-green-500 hover:text-green-700">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Existing Repositories Info */}
      {existingFolders.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            You have {existingFolders.length} repository{existingFolders.length !== 1 ? 's' : ''} in your workspace
          </p>
        </div>
      )}
    </div>
  );
}
