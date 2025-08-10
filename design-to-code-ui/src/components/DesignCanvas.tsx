'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { AnyComponent, ShapeComponent, TextComponent, SliderComponent, ButtonComponent, PageComponent } from '@/types/design';
import { DesignComponentRenderer } from './DesignComponentRenderer';

interface DesignCanvasProps {
  components: AnyComponent[];
  selectedComponent: AnyComponent | null;
  onUpdateComponent: (id: string, updates: Partial<AnyComponent>) => void;
  onDeleteComponent: (id: string) => void;
  onSelectComponent: (component: AnyComponent | null) => void;
  onCanvasClick: (e: React.MouseEvent) => void;
  onAddComponent: (type: string, x: number, y: number, options?: any) => void;
}

export function DesignCanvas({
  components,
  selectedComponent,
  onUpdateComponent,
  onDeleteComponent,
  onSelectComponent,
  onCanvasClick,
  onAddComponent
}: DesignCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const componentType = e.dataTransfer.getData('componentType');
    const componentOptions = JSON.parse(e.dataTransfer.getData('componentOptions') || '{}');
    
    onAddComponent(componentType, x, y, componentOptions);
  }, [onAddComponent]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleComponentMouseDown = useCallback((e: React.MouseEvent, component: AnyComponent) => {
    e.stopPropagation();
    onSelectComponent(component);
    
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  }, [onSelectComponent]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !selectedComponent || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.x;
    const newY = e.clientY - rect.top - dragOffset.y;

    onUpdateComponent(selectedComponent.id, { x: newX, y: newY });
  }, [isDragging, selectedComponent, dragOffset, onUpdateComponent]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Delete' && selectedComponent) {
      onDeleteComponent(selectedComponent.id);
    }
  }, [selectedComponent, onDeleteComponent]);

  // Add keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="relative h-full bg-white">
      {/* Canvas Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Design Canvas</h2>
          <div className="text-sm text-gray-500">
            {components.length} component{components.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div
        ref={canvasRef}
        className="relative flex-1 h-[calc(100vh-120px)] overflow-auto bg-gray-50"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={onCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        
        {/* Components */}
        {components.map((component) => (
          <DesignComponentRenderer
            key={component.id}
            component={component}
            isSelected={component.id === selectedComponent?.id}
            onMouseDown={(e) => handleComponentMouseDown(e, component)}
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={(e) => e.stopPropagation()}
            onUpdateComponent={onUpdateComponent}
          />
        ))}

        {/* Drop Zone Indicator */}
        {!components.length && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-4">🎨</div>
              <p className="text-lg font-medium">Drag components here to start designing</p>
              <p className="text-sm">Use the sidebar to add shapes, buttons, and more</p>
            </div>
          </div>
        )}
      </div>

      {/* Canvas Footer */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-2">
        <div className="text-xs text-gray-500">
          Click to select • Drag to move • Delete key to remove
        </div>
      </div>
    </div>
  );
}


