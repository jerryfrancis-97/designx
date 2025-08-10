'use client';

import React from 'react';
import { AnyComponent, ShapeComponent, TextComponent, SliderComponent, ButtonComponent, PageComponent } from '@/types/design';

interface DesignPropertiesPanelProps {
  selectedComponent: AnyComponent | null;
  onUpdateComponent: (id: string, updates: Partial<AnyComponent>) => void;
  onBringToFront: (id: string) => void;
  onSendToBack: (id: string) => void;
}

export function DesignPropertiesPanel({ selectedComponent, onUpdateComponent, onBringToFront, onSendToBack }: DesignPropertiesPanelProps) {
  if (!selectedComponent) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Properties</h2>
        <div className="text-center text-gray-500 py-8">
          <div className="text-4xl mb-2">📋</div>
          <p>Select a component to edit its properties</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: string, value: any) => {
    onUpdateComponent(selectedComponent.id, { [field]: value });
  };

  const renderCommonProperties = () => (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700 border-b pb-2">Position & Size</h3>
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-600 mb-1">X Position</label>
          <input
            type="number"
            value={selectedComponent.x}
            onChange={(e) => handleInputChange('x', parseInt(e.target.value) || 0)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Y Position</label>
          <input
            type="number"
            value={selectedComponent.y}
            onChange={(e) => handleInputChange('y', parseInt(e.target.value) || 0)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Width</label>
          <input
            type="number"
            value={selectedComponent.width}
            onChange={(e) => handleInputChange('width', parseInt(e.target.value) || 100)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Height</label>
          <input
            type="number"
            value={selectedComponent.height}
            onChange={(e) => handleInputChange('height', parseInt(e.target.value) || 100)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-600 mb-1">Background Color</label>
        <input
          type="color"
          value={selectedComponent.color}
          onChange={(e) => handleInputChange('color', e.target.value)}
          className="w-full h-10 border border-gray-300 rounded"
        />
      </div>

      <div>
        <label className="block text-xs text-gray-600 mb-1">Z-Index</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={selectedComponent.zIndex}
            onChange={(e) => handleInputChange('zIndex', parseInt(e.target.value) || 0)}
            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
          />
          <button
            onClick={() => onBringToFront(selectedComponent.id)}
            className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            title="Bring to Front"
          >
            ↑
          </button>
          <button
            onClick={() => onSendToBack(selectedComponent.id)}
            className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            title="Send to Back"
          >
            ↓
          </button>
        </div>
      </div>
    </div>
  );

  const renderShapeProperties = (component: ShapeComponent) => (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700 border-b pb-2">Shape Properties</h3>
      
      <div>
        <label className="block text-xs text-gray-600 mb-1">Shape Type</label>
        <select
          value={component.shapeType}
          onChange={(e) => handleInputChange('shapeType', e.target.value)}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
        >
          <option value="rectangle">Rectangle</option>
          <option value="circle">Circle</option>
          <option value="triangle">Triangle</option>
        </select>
      </div>
    </div>
  );

  const renderTextProperties = (component: TextComponent) => (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700 border-b pb-2">Text Properties</h3>
      
      <div>
        <label className="block text-xs text-gray-600 mb-1">Content</label>
        <input
          type="text"
          value={component.content || ''}
          onChange={(e) => handleInputChange('content', e.target.value)}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
          placeholder="Enter text content..."
        />
      </div>

      <div>
        <label className="block text-xs text-gray-600 mb-1">Font Size</label>
        <input
          type="number"
          value={component.fontSize}
          onChange={(e) => handleInputChange('fontSize', parseInt(e.target.value) || 16)}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
          min="8"
          max="72"
        />
      </div>

      <div>
        <label className="block text-xs text-gray-600 mb-1">Font Weight</label>
        <select
          value={component.fontWeight}
          onChange={(e) => handleInputChange('fontWeight', e.target.value)}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
        >
          <option value="normal">Normal</option>
          <option value="bold">Bold</option>
        </select>
      </div>

      <div>
        <label className="block text-xs text-gray-600 mb-1">Text Align</label>
        <select
          value={component.textAlign}
          onChange={(e) => handleInputChange('textAlign', e.target.value)}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
    </div>
  );

  const renderSliderProperties = (component: SliderComponent) => (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700 border-b pb-2">Slider Properties</h3>
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Min Value</label>
          <input
            type="number"
            value={component.minValue}
            onChange={(e) => handleInputChange('minValue', parseInt(e.target.value) || 0)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Max Value</label>
          <input
            type="number"
            value={component.maxValue}
            onChange={(e) => handleInputChange('maxValue', parseInt(e.target.value) || 100)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-600 mb-1">Default Value</label>
        <input
          type="number"
          value={component.defaultValue}
          onChange={(e) => handleInputChange('defaultValue', parseInt(e.target.value) || 50)}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
          min={component.minValue}
          max={component.maxValue}
        />
      </div>
    </div>
  );

  const renderButtonProperties = (component: ButtonComponent) => (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700 border-b pb-2">Button Properties</h3>
      
      <div>
        <label className="block text-xs text-gray-600 mb-1">Button Text</label>
        <input
          type="text"
          value={component.buttonText}
          onChange={(e) => handleInputChange('buttonText', e.target.value)}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
          placeholder="Enter button text..."
        />
      </div>

      <div>
        <label className="block text-xs text-gray-600 mb-1">Button Type</label>
        <select
          value={component.buttonType}
          onChange={(e) => handleInputChange('buttonType', e.target.value)}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
        >
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
          <option value="outline">Outline</option>
        </select>
      </div>
    </div>
  );

  const renderPageProperties = (component: PageComponent) => (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700 border-b pb-2">Page Properties</h3>
      
      <div>
        <label className="block text-xs text-gray-600 mb-1">Page Title</label>
        <input
          type="text"
          value={component.pageTitle}
          onChange={(e) => handleInputChange('pageTitle', e.target.value)}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
          placeholder="Enter page title..."
        />
      </div>

      <div>
        <label className="block text-xs text-gray-600 mb-1">Background Color</label>
        <input
          type="color"
          value={component.backgroundColor}
          onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
          className="w-full h-10 border border-gray-300 rounded"
        />
      </div>
    </div>
  );

  const renderSpecificProperties = () => {
    switch (selectedComponent.type) {
      case 'shape':
        return renderShapeProperties(selectedComponent as ShapeComponent);
      case 'text':
        return renderTextProperties(selectedComponent as TextComponent);
      case 'slider':
        return renderSliderProperties(selectedComponent as SliderComponent);
      case 'button':
        return renderButtonProperties(selectedComponent as ButtonComponent);
      case 'page':
        return renderPageProperties(selectedComponent as PageComponent);
      default:
        return null;
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Properties</h2>
      
      <div className="space-y-6">
        {renderCommonProperties()}
        {renderSpecificProperties()}
      </div>
    </div>
  );
}
