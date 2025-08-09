/**
 * Toolbar.tsx
 *
 * Floating toolbar component that provides canvas control functions.
 * Includes zoom controls (zoom in, zoom out, fit view), canvas actions
 * (reset, export, code generation, preview), and layer management.
 * Positioned above the canvas for easy access to common operations.
 */

'use client';

import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Download,
  Code,
  Eye,
  Layers
} from 'lucide-react';
import { useTheme } from './DesignWorkspace';

interface ToolbarProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onReset: () => void;
  onExport: () => void;
  onGenerateCode: () => void;
  onPreview: () => void;
}

export default function Toolbar({
  onZoomIn, onZoomOut, onFitView, onReset, onExport, onGenerateCode, onPreview
}: ToolbarProps) {
  const { isDarkMode } = useTheme();

  return (
    <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-10 border rounded-lg shadow-lg p-2 transition-all duration-300 ${
      isDarkMode
        ? 'bg-gray-800 border-gray-600 shadow-gray-900/50'
        : 'bg-white border-gray-200 shadow-gray-200/50'
    }`}>
      <div className="flex items-center gap-2">
        {/* Zoom Controls */}
        <button
          onClick={onZoomIn}
          className={`p-2 rounded-md transition-all duration-300 ${
            isDarkMode
              ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
          }`}
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={onZoomOut}
          className={`p-2 rounded-md transition-all duration-300 ${
            isDarkMode
              ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
          }`}
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={onFitView}
          className={`p-2 rounded-md transition-all duration-300 ${
            isDarkMode
              ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
          }`}
          title="Fit View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <button
          onClick={onReset}
          className={`p-2 rounded-md transition-all duration-300 ${
            isDarkMode
              ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
          }`}
          title="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Divider */}
        <div className={`w-px h-6 mx-1 transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
        }`} />

        {/* Action Controls */}
        <button
          onClick={onExport}
          className={`p-2 rounded-md transition-all duration-300 ${
            isDarkMode
              ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
          }`}
          title="Export Design"
        >
          <Download className="w-4 h-4" />
        </button>
        <button
          onClick={onGenerateCode}
          className={`p-2 rounded-md transition-all duration-300 ${
            isDarkMode
              ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
          }`}
          title="Generate Code"
        >
          <Code className="w-4 h-4" />
        </button>
        <button
          onClick={onPreview}
          className={`p-2 rounded-md transition-all duration-300 ${
            isDarkMode
              ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
          }`}
          title="Preview Design"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          className={`p-2 rounded-md transition-all duration-300 ${
            isDarkMode
              ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
          }`}
          title="Layer Management"
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
