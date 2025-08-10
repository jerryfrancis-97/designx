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
  onBringToFront: (id: string) => void;
  onSendToBack: (id: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  onSave: () => void;
  onLoad: (file: File) => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function DesignCanvas({
  components,
  selectedComponent,
  onUpdateComponent,
  onDeleteComponent,
  onSelectComponent,
  onCanvasClick,
  onAddComponent,
  onBringToFront,
  onSendToBack,
  onUndo,
  onRedo,
  onReset,
  onSave,
  onLoad,
  canUndo,
  canRedo
}: DesignCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileLoad = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onLoad(file);
      e.target.value = ''; // Reset file input
    }
  }, [onLoad]);

  const triggerFileLoad = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

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

  const handleResizeMouseDown = useCallback((e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    if (!selectedComponent) return;
    
    setIsResizing(true);
    setResizeHandle(handle);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: selectedComponent.width,
      height: selectedComponent.height
    });
  }, [selectedComponent]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isResizing && selectedComponent && resizeHandle) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;
      let newX = selectedComponent.x;
      let newY = selectedComponent.y;
      
      switch (resizeHandle) {
        case 'nw':
          newWidth = Math.max(50, resizeStart.width - deltaX);
          newHeight = Math.max(50, resizeStart.height - deltaY);
          newX = selectedComponent.x + (resizeStart.width - newWidth);
          newY = selectedComponent.y + (resizeStart.height - newHeight);
          break;
        case 'ne':
          newWidth = Math.max(50, resizeStart.width + deltaX);
          newHeight = Math.max(50, resizeStart.height - deltaY);
          newY = selectedComponent.y + (resizeStart.height - newHeight);
          break;
        case 'sw':
          newWidth = Math.max(50, resizeStart.width - deltaX);
          newHeight = Math.max(50, resizeStart.height + deltaY);
          newX = selectedComponent.x + (resizeStart.width - newWidth);
          break;
        case 'se':
          newWidth = Math.max(50, resizeStart.width + deltaX);
          newHeight = Math.max(50, resizeStart.height + deltaY);
          break;
        case 'n':
          newHeight = Math.max(50, resizeStart.height - deltaY);
          newY = selectedComponent.y + (resizeStart.height - newHeight);
          break;
        case 's':
          newHeight = Math.max(50, resizeStart.height + deltaY);
          break;
        case 'w':
          newWidth = Math.max(50, resizeStart.width - deltaX);
          newX = selectedComponent.x + (resizeStart.width - newWidth);
          break;
        case 'e':
          newWidth = Math.max(50, resizeStart.width + deltaX);
          break;
      }
      
      onUpdateComponent(selectedComponent.id, {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight
      });
    } else if (isDragging && selectedComponent && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const newX = e.clientX - rect.left - dragOffset.x;
      const newY = e.clientY - rect.top - dragOffset.y;

      onUpdateComponent(selectedComponent.id, { x: newX, y: newY });
    }
  }, [isResizing, isDragging, selectedComponent, resizeHandle, resizeStart, dragOffset, onUpdateComponent]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
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

  const renderResizeHandles = (component: AnyComponent) => {
    if (component.id !== selectedComponent?.id) return null;
    
    const handleSize = 8;
    
    return (
      <>
        {/* Corner handles */}
        <div
          className="resize-handle cursor-nw-resize"
          style={{
            left: -handleSize,
            top: -handleSize,
            zIndex: component.zIndex + 1
          }}
          onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
        />
        <div
          className="resize-handle cursor-ne-resize"
          style={{
            right: -handleSize,
            top: -handleSize,
            zIndex: component.zIndex + 1
          }}
          onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
        />
        <div
          className="resize-handle cursor-sw-resize"
          style={{
            left: -handleSize,
            bottom: -handleSize,
            zIndex: component.zIndex + 1
          }}
          onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
        />
        <div
          className="resize-handle cursor-se-resize"
          style={{
            right: -handleSize,
            bottom: -handleSize,
            zIndex: component.zIndex + 1
          }}
          onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
        />
        
        {/* Edge handles */}
        <div
          className="resize-handle cursor-n-resize"
          style={{
            left: '50%',
            top: -handleSize,
            transform: 'translateX(-50%)',
            zIndex: component.zIndex + 1
          }}
          onMouseDown={(e) => handleResizeMouseDown(e, 'n')}
        />
        <div
          className="resize-handle cursor-s-resize"
          style={{
            left: '50%',
            bottom: -handleSize,
            transform: 'translateX(-50%)',
            zIndex: component.zIndex + 1
          }}
          onMouseDown={(e) => handleResizeMouseDown(e, 's')}
        />
        <div
          className="resize-handle cursor-w-resize"
          style={{
            left: -handleSize,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: component.zIndex + 1
          }}
          onMouseDown={(e) => handleResizeMouseDown(e, 'w')}
        />
        <div
          className="resize-handle cursor-e-resize"
          style={{
            right: -handleSize,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: component.zIndex + 1
          }}
          onMouseDown={(e) => handleResizeMouseDown(e, 'e')}
        />
      </>
    );
  };

  return (
    <div className="relative h-full bg-white">
      {/* Canvas Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Design Canvas</h2>
          <div className="flex items-center gap-2">
            {/* File Operations */}
            <div className="flex items-center gap-2 mr-4">
              <button
                onClick={onSave}
                className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                title="Save Components"
              >
                💾 Save
              </button>
              <button
                onClick={triggerFileLoad}
                className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                title="Load Components"
              >
                📁 Load
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileLoad}
                className="hidden"
              />
            </div>

            {/* Undo/Redo */}
            <div className="flex items-center gap-2 mr-4">
              <button
                onClick={onUndo}
                disabled={!canUndo}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  canUndo 
                    ? 'bg-gray-500 text-white hover:bg-gray-600' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                title="Undo"
              >
                ↩️ Undo
              </button>
              <button
                onClick={onRedo}
                disabled={!canRedo}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  canRedo 
                    ? 'bg-gray-500 text-white hover:bg-gray-600' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                title="Redo"
              >
                ↪️ Redo
              </button>
            </div>

            {/* Reset */}
            <button
              onClick={onReset}
              className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors mr-4"
              title="Reset Workspace"
            >
              🗑️ Reset
            </button>

            {/* Z-Index Controls */}
            {selectedComponent && (
              <div className="flex items-center gap-2 mr-4">
                <button
                  onClick={() => onBringToFront(selectedComponent.id)}
                  className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  title="Bring to Front"
                >
                  ↑ Front
                </button>
                <button
                  onClick={() => onSendToBack(selectedComponent.id)}
                  className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                  title="Send to Back"
                >
                  ↓ Back
                </button>
              </div>
            )}

            <div className="text-sm text-gray-500">
              {components.length} component{components.length !== 1 ? 's' : ''}
            </div>
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
          <div key={component.id} className="relative">
            <DesignComponentRenderer
              component={component}
              isSelected={component.id === selectedComponent?.id}
              onMouseDown={(e) => handleComponentMouseDown(e, component)}
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={(e) => e.stopPropagation()}
              onUpdateComponent={onUpdateComponent}
            />
            {renderResizeHandles(component)}
          </div>
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
          Click to select • Drag to move • Drag handles to resize • Delete key to remove
        </div>
      </div>
    </div>
  );
}


