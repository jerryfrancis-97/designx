'use client';

import { COMPONENT_TYPES } from '@/types/design';

interface DesignSidebarProps {
  onAddComponent: (type: string, x: number, y: number, options?: any) => void;
}

export function DesignSidebar({ onAddComponent }: DesignSidebarProps) {
  const handleDragStart = (e: React.DragEvent, type: string, options?: any) => {
    e.dataTransfer.setData('componentType', type);
    e.dataTransfer.setData('componentOptions', JSON.stringify(options || {}));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const componentType = e.dataTransfer.getData('componentType');
    const componentOptions = JSON.parse(e.dataTransfer.getData('componentOptions') || '{}');
    
    onAddComponent(componentType, x, y, componentOptions);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Component Library</h2>
      
      <div className="space-y-4">
        {/* Shapes Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Shapes</h3>
          <div className="grid grid-cols-2 gap-2">
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, 'shape', { shapeType: 'rectangle' })}
              className="p-3 border border-gray-200 rounded-lg cursor-move hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="w-8 h-6 bg-gray-300 rounded mb-2"></div>
              <p className="text-xs text-gray-600">Rectangle</p>
            </div>
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, 'shape', { shapeType: 'circle' })}
              className="p-3 border border-gray-200 rounded-lg cursor-move hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="w-8 h-6 bg-gray-300 rounded-full mb-2"></div>
              <p className="text-xs text-gray-600">Circle</p>
            </div>
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, 'shape', { shapeType: 'triangle' })}
              className="p-3 border border-gray-200 rounded-lg cursor-move hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[12px] border-l-transparent border-r-transparent border-b-gray-300 mx-auto mb-2"></div>
              <p className="text-xs text-gray-600">Triangle</p>
            </div>
          </div>
        </div>

        {/* Interactive Components */}
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Interactive</h3>
          <div className="space-y-2">
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, 'button')}
              className="p-3 border border-gray-200 rounded-lg cursor-move hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <button className="w-full px-3 py-2 bg-blue-500 text-white rounded text-sm mb-2">
                Button
              </button>
              <p className="text-xs text-gray-600">Button</p>
            </div>
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, 'slider')}
              className="p-3 border border-gray-200 rounded-lg cursor-move hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="w-full h-2 bg-gray-200 rounded-full mb-2">
                <div className="w-1/2 h-2 bg-blue-500 rounded-full"></div>
              </div>
              <p className="text-xs text-gray-600">Slider</p>
            </div>
          </div>
        </div>

        {/* Text Components */}
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Text</h3>
          <div
            draggable
            onDragStart={(e) => handleDragStart(e, 'text')}
            className="p-3 border border-gray-200 rounded-lg cursor-move hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="w-full h-4 bg-gray-100 rounded mb-2"></div>
            <p className="text-xs text-gray-600">Text Box</p>
          </div>
        </div>

        {/* Page Component */}
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Layout</h3>
          <div
            draggable
            onDragStart={(e) => handleDragStart(e, 'page')}
            className="p-3 border border-gray-200 rounded-lg cursor-move hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="w-full h-8 bg-gray-200 rounded mb-2"></div>
            <p className="text-xs text-gray-600">Page Container</p>
          </div>
        </div>
      </div>

      {/* Drop Zone Instructions */}
      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-700 text-center">
          Drag components from here to the canvas
        </p>
      </div>
    </div>
  );
}
