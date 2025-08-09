/**
 * AISidebar.tsx
 * 
 * Interactive sidebar component that displays available AI UI components.
 * Provides search functionality, category filtering, and drag-and-drop
 * capabilities for transferring components to the canvas. Includes a
 * component library with buttons, cards, inputs, and text components
 * organized by category for easy discovery and use.
 */

'use client';

import { useState } from 'react';
import { 
  MousePointer as ButtonIcon, 
  Square, 
  Type, 
  FormInput as InputIcon,
  MessageSquare,
  Sliders,
  ChevronDown,
  Image,
  Play,
  Plus,
  Settings,
  Sparkles
} from 'lucide-react';
import { useTheme } from './DesignWorkspace';

interface ComponentItem {
  id: string;
  type: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  category: string;
}

// Available UI components for the sidebar
const componentItems: ComponentItem[] = [
  {
    id: 'button',
    type: 'button',
    label: 'Button',
    icon: <ButtonIcon className="w-4 h-4" />,
    description: 'Interactive button component',
    category: 'Basic'
  },
  {
    id: 'card',
    type: 'card',
    label: 'Card',
    icon: <Square className="w-4 h-4" />,
    description: 'Container for content',
    category: 'Layout'
  },
  {
    id: 'input',
    type: 'input',
    label: 'Input',
    icon: <InputIcon className="w-4 h-4" />,
    description: 'Text input field',
    category: 'Form'
  },
  {
    id: 'text',
    type: 'text',
    label: 'Text',
    icon: <Type className="w-4 h-4" />,
    description: 'Text display component',
    category: 'Typography'
  },
  {
    id: 'promptInput',
    type: 'promptInput',
    label: 'Prompt Input',
    icon: <MessageSquare className="w-4 h-4" />,
    description: 'AI prompt input with character limit',
    category: 'AI'
  },
  {
    id: 'slider',
    type: 'slider',
    label: 'Slider',
    icon: <Sliders className="w-4 h-4" />,
    description: 'Parameter tuning slider control',
    category: 'Controls'
  },
  {
    id: 'selector',
    type: 'selector',
    label: 'Selector',
    icon: <ChevronDown className="w-4 h-4" />,
    description: 'Dropdown selector with options',
    category: 'Controls'
  },
  {
    id: 'imageViewer',
    type: 'imageViewer',
    label: 'Image Viewer',
    icon: <Image className="w-4 h-4" />,
    description: 'Display and manage images',
    category: 'Media'
  },
  {
    id: 'runButton',
    type: 'runButton',
    label: 'Run Button',
    icon: <Play className="w-4 h-4" />,
    description: 'Execute actions or processes',
    category: 'Actions'
  },
];

export default function AISidebar() {
  const { isDarkMode } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Available categories for filtering
  const categories = ['All', 'Basic', 'Layout', 'Form', 'Typography', 'AI', 'Controls', 'Media', 'Actions'];

  // Filter components based on category and search query
  const filteredComponents = componentItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle drag start for component transfer to canvas
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className={`w-80 border-r transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700 text-white' 
        : 'bg-white border-gray-200 text-gray-900'
    } flex flex-col h-full`}>
      {/* Header */}
      <div className={`p-4 border-b transition-colors duration-300 ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            AI UI Components
          </h2>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className={`p-4 border-b transition-colors duration-300 ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 text-sm rounded-full transition-colors duration-300 ${
                selectedCategory === category
                  ? isDarkMode
                    ? 'bg-blue-600 text-white border border-blue-500'
                    : 'bg-blue-100 text-blue-700 border border-blue-200'
                  : isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Components List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {filteredComponents.map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={(event) => onDragStart(event, item.type)}
              className={`p-3 border rounded-lg cursor-move transition-all duration-300 ${
                isDarkMode
                  ? 'border-gray-600 hover:border-blue-400 hover:shadow-lg bg-gray-700 hover:bg-gray-600'
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-sm bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-md transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {item.label}
                  </h3>
                  <p className={`text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {item.description}
                  </p>
                  <span className={`inline-block mt-1 px-2 py-1 text-xs rounded transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-600 text-gray-300' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {item.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className={`p-4 border-t transition-colors duration-300 ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <button className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors duration-300 ${
          isDarkMode
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}>
          <Plus className="w-4 h-4" />
          Generate New Component
        </button>
        <button className={`w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 transition-colors duration-300 ${
          isDarkMode
            ? 'text-gray-300 hover:text-white'
            : 'text-gray-600 hover:text-gray-800'
        }`}>
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>
    </div>
  );
}
