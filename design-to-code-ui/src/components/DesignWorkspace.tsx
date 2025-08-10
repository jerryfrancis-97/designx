'use client';

import { useState, useCallback, useEffect } from 'react';
import { DesignSidebar } from './DesignSidebar';
import { DesignCanvas } from './DesignCanvas';
import { DesignPropertiesPanel } from './DesignPropertiesPanel';
import { AnyComponent, ShapeComponent, TextComponent, SliderComponent, ButtonComponent, PageComponent } from '@/types/design';

export function DesignWorkspace() {
  const [components, setComponents] = useState<AnyComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<AnyComponent | null>(null);
  const [nextZIndex, setNextZIndex] = useState(1);
  const [history, setHistory] = useState<AnyComponent[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const saveToHistory = useCallback((newComponents: AnyComponent[]) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push([...newComponents]);
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setComponents([...history[newIndex]]);
      setSelectedComponent(null);
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setComponents([...history[newIndex]]);
      setSelectedComponent(null);
    }
  }, [historyIndex, history]);

  const resetWorkspace = useCallback(() => {
    setComponents([]);
    setSelectedComponent(null);
    setNextZIndex(1);
    setHistory([]);
    setHistoryIndex(-1);
  }, []);

  const saveComponents = useCallback(() => {
    const dataStr = JSON.stringify(components, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'design-components.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [components]);

  const loadComponents = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const loadedComponents = JSON.parse(e.target?.result as string);
        setComponents(loadedComponents);
        setSelectedComponent(null);
        const maxZIndex = Math.max(...loadedComponents.map((comp: AnyComponent) => comp.zIndex));
        setNextZIndex(maxZIndex + 1);
        saveToHistory(loadedComponents);
      } catch (error) {
        console.error('Error loading components:', error);
        alert('Error loading components. Please check the file format.');
      }
    };
    reader.readAsText(file);
  }, [saveToHistory]);

  // Initialize history with empty state
  useEffect(() => {
    if (history.length === 0) {
      setHistory([[]]);
      setHistoryIndex(0);
    }
  }, [history.length]);

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

    const newComponents = [...components, newComponent];
    setComponents(newComponents);
    setNextZIndex(prev => prev + 1);
    setSelectedComponent(newComponent);
    saveToHistory(newComponents);
  }, [nextZIndex, components, saveToHistory]);

  const updateComponent = useCallback((id: string, updates: Partial<AnyComponent>) => {
    const newComponents = components.map(comp => 
      comp.id === id ? { ...comp, ...updates } as AnyComponent : comp
    );
    setComponents(newComponents);
    
    if (selectedComponent?.id === id) {
      setSelectedComponent(prev => prev ? { ...prev, ...updates } as AnyComponent : null);
    }
    saveToHistory(newComponents);
  }, [selectedComponent, components, saveToHistory]);

  const deleteComponent = useCallback((id: string) => {
    const newComponents = components.filter(comp => comp.id !== id);
    setComponents(newComponents);
    if (selectedComponent?.id === id) {
      setSelectedComponent(null);
    }
    saveToHistory(newComponents);
  }, [selectedComponent, components, saveToHistory]);

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

  const bringToFront = useCallback((id: string) => {
    const newComponents = components.map(comp => 
      comp.id === id 
        ? { ...comp, zIndex: Math.max(...components.map(comp => comp.zIndex)) + 1 }
        : comp
    );
    setComponents(newComponents);
    
    if (selectedComponent?.id === id) {
      setSelectedComponent(prev => prev ? { ...prev, zIndex: Math.max(...components.map(comp => comp.zIndex)) + 1 } : null);
    }
    
    setNextZIndex(prev => prev + 1);
    saveToHistory(newComponents);
  }, [selectedComponent, components, saveToHistory]);

  const sendToBack = useCallback((id: string) => {
    const newComponents = components.map(comp => 
      comp.id === id 
        ? { ...comp, zIndex: Math.min(...components.map(comp => comp.zIndex)) - 1 }
        : comp
    );
    setComponents(newComponents);
    
    if (selectedComponent?.id === id) {
      setSelectedComponent(prev => prev ? { ...prev, zIndex: Math.min(...components.map(comp => comp.zIndex)) - 1 } : null);
    }
    saveToHistory(newComponents);
  }, [selectedComponent, components, saveToHistory]);

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
          onBringToFront={bringToFront}
          onSendToBack={sendToBack}
          onUndo={undo}
          onRedo={redo}
          onReset={resetWorkspace}
          onSave={saveComponents}
          onLoad={loadComponents}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
        />
      </div>
      
      {/* Right Sidebar - Properties Panel */}
      <DesignPropertiesPanel
        selectedComponent={selectedComponent}
        onUpdateComponent={updateComponent}
        onBringToFront={bringToFront}
        onSendToBack={sendToBack}
      />
    </div>
  );
}
