'use client';

import { useState, useCallback } from 'react';
import { DesignSidebar } from './DesignSidebar';
import { DesignCanvas } from './DesignCanvas';
import { DesignPropertiesPanel } from './DesignPropertiesPanel';
import { AnyComponent, ShapeComponent, TextComponent, SliderComponent, ButtonComponent, PageComponent } from '@/types/design';

export function DesignWorkspace() {
  const [components, setComponents] = useState<AnyComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<AnyComponent | null>(null);
  const [nextZIndex, setNextZIndex] = useState(1);

  const addComponent = useCallback((type: string, x: number, y: number, options?: any) => {
    const baseComponent = {
      id: `component_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      x,
      y,
      width: type === 'page' ? 800 : 150,
      height: type === 'page' ? 600 : 100,
      title: type === 'page' ? 'New Page' : '',
      content: '',
      color: '#F8F9FA',
      isSelected: false,
      isEditing: false,
      zIndex: nextZIndex,
    };

    let newComponent: AnyComponent;

    switch (type) {
      case 'shape':
        newComponent = {
          ...baseComponent,
          type: 'shape',
          shapeType: options?.shapeType || 'rectangle'
        } as ShapeComponent;
        break;
      
      case 'text':
        newComponent = {
          ...baseComponent,
          type: 'text',
          fontSize: 16,
          fontWeight: 'normal' as const,
          textAlign: 'left' as const
        } as TextComponent;
        break;
      
      case 'slider':
        newComponent = {
          ...baseComponent,
          type: 'slider',
          minValue: 0,
          maxValue: 100,
          defaultValue: 50
        } as SliderComponent;
        break;
      
      case 'button':
        newComponent = {
          ...baseComponent,
          type: 'button',
          buttonText: 'Button',
          buttonType: 'primary' as const
        } as ButtonComponent;
        break;
      
      case 'page':
        newComponent = {
          ...baseComponent,
          type: 'page',
          pageTitle: 'New Page',
          backgroundColor: '#FFFFFF'
        } as PageComponent;
        break;
      
      default:
        // Fallback to shape component
        newComponent = {
          ...baseComponent,
          type: 'shape',
          shapeType: 'rectangle'
        } as ShapeComponent;
    }

    setComponents(prev => [...prev, newComponent]);
    setNextZIndex(prev => prev + 1);
    setSelectedComponent(newComponent);
  }, [nextZIndex]);

  const updateComponent = useCallback((id: string, updates: Partial<AnyComponent>) => {
    setComponents(prev => prev.map(comp => 
      comp.id === id ? { ...comp, ...updates } as AnyComponent : comp
    ));
    
    if (selectedComponent?.id === id) {
      setSelectedComponent(prev => prev ? { ...prev, ...updates } as AnyComponent : null);
    }
  }, [selectedComponent]);

  const deleteComponent = useCallback((id: string) => {
    setComponents(prev => prev.filter(comp => comp.id !== id));
    if (selectedComponent?.id === id) {
      setSelectedComponent(null);
    }
  }, [selectedComponent]);

  const selectComponent = useCallback((component: AnyComponent | null) => {
    setSelectedComponent(component);
    setComponents(prev => prev.map(comp => ({
      ...comp,
      isSelected: comp.id === component?.id
    })));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedComponent(null);
    setComponents(prev => prev.map(comp => ({ ...comp, isSelected: false })));
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      clearSelection();
    }
  }, [clearSelection]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar - Component Library */}
      <DesignSidebar onAddComponent={addComponent} />
      
      {/* Center - Canvas */}
      <div className="flex-1">
        <DesignCanvas
          components={components}
          selectedComponent={selectedComponent}
          onUpdateComponent={updateComponent}
          onDeleteComponent={deleteComponent}
          onSelectComponent={selectComponent}
          onCanvasClick={handleCanvasClick}
          onAddComponent={addComponent}
        />
      </div>
      
      {/* Right Sidebar - Properties Panel */}
      <DesignPropertiesPanel
        selectedComponent={selectedComponent}
        onUpdateComponent={updateComponent}
      />
    </div>
  );
}
