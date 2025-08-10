/**
 * Projects Component
 * 
 * Displays and manages a list of previously generated projects.
 * Provides project selection, deletion, and status tracking functionality.
 * 
 * Features:
 * - Project list with status indicators
 * - Project selection and highlighting
 * - Project deletion with confirmation
 * - Loading states and empty states
 * - Date formatting and status icons
 */

'use client';

import { useState, useEffect } from 'react';
import { Folder, Trash2, Clock, Code, Play } from 'lucide-react';
import { getWorkspaceProjects, deleteWorkspaceProject } from '@/lib/lovable-api';

/**
 * Interface for workspace project data structure
 */
interface WorkspaceProject {
  id: string;
  name: string;
  description: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  status: 'generated' | 'saved' | 'running';
}

interface ProjectsProps {
  onProjectSelect: (project: WorkspaceProject) => void;
  currentProjectId: string;
}

export function Projects({ onProjectSelect, currentProjectId }: ProjectsProps) {
  // State for project data and UI states
  const [projects, setProjects] = useState<WorkspaceProject[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Loads projects from the workspace on component mount
   * Fetches project data from the Lovable API
   */
  useEffect(() => {
    loadProjects();
  }, []);

  /**
   * Fetches all workspace projects from the API
   * Updates the projects state and handles loading states
   */
  const loadProjects = async () => {
    try {
      const projectList = await getWorkspaceProjects();
      setProjects(projectList);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Deletes a project after user confirmation
   * Removes the project from the API and reloads the list
   */
  const handleDeleteProject = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteWorkspaceProject(projectId);
        await loadProjects(); // Reload the list
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  /**
   * Formats a date string to a readable format
   * Converts ISO date strings to localized date format
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  /**
   * Returns appropriate CSS classes for project status styling
   * Provides visual distinction between different project states
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generated':
        return 'bg-blue-100 text-blue-800';
      case 'saved':
        return 'bg-green-100 text-green-800';
      case 'running':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  /**
   * Returns appropriate icon component for project status
   * Provides visual indicators for different project states
   */
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'generated':
        return <Code className="h-3 w-3" />;
      case 'saved':
        return <Folder className="h-3 w-3" />;
      case 'running':
        return <Play className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Component Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Folder className="h-5 w-5 text-purple-500" />
          Projects
        </h2>
        <p className="text-gray-600 mt-1">
          Your generated and saved projects
        </p>
      </div>
      
      {/* Projects Content */}
      <div className="p-6">
        {loading ? (
          /* Loading State */
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          /* Empty State */
          <div className="text-center py-8 text-gray-500">
            <Folder className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No projects yet</p>
            <p className="text-sm">Generate your first app to see it here</p>
          </div>
        ) : (
          /* Projects List */
          <div className="space-y-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  currentProjectId === project.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => onProjectSelect(project)}
              >
                <div className="flex items-start justify-between">
                  {/* Project Information */}
                  <div className="flex-1 min-w-0">
                    {/* Project Header with Name and Status */}
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-gray-900 truncate">
                        {project.name}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getStatusColor(project.status)}`}>
                        {getStatusIcon(project.status)}
                        {project.status}
                      </span>
                    </div>
                    
                    {/* Project Description */}
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {project.description}
                    </p>
                    
                    {/* Project Metadata */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Created: {formatDate(project.createdAt)}</span>
                      <span>Updated: {formatDate(project.updatedAt)}</span>
                    </div>
                  </div>
                  
                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.id);
                    }}
                    className="ml-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                    title="Delete project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
