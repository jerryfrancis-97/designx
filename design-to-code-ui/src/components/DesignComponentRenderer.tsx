'use client';

import React from 'react';
import { AnyComponent, ShapeComponent, TextComponent, SliderComponent, ButtonComponent, PageComponent } from '@/types/design';

interface DesignComponentRendererProps {
  component: AnyComponent;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onClick: (e: React.MouseEvent) => void;
  onDoubleClick: (e: React.MouseEvent) => void;
  onUpdateComponent: (id: string, updates: Partial<AnyComponent>) => void;
}

export function DesignComponentRenderer({
  component,
  isSelected,
  onMouseDown,
  onClick,
  onDoubleClick,
  onUpdateComponent
}: DesignComponentRendererProps) {
  const baseClasses = `absolute cursor-move select-none ${
    isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
  }`;

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (component.type === 'text') {
      onUpdateComponent(component.id, { content: e.target.value });
    }
  };

  const handleButtonTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (component.type === 'button') {
      onUpdateComponent(component.id, { buttonText: e.target.value });
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (component.type === 'slider') {
      onUpdateComponent(component.id, { defaultValue: parseInt(e.target.value) });
    }
  };

  switch (component.type) {
    case 'shape':
      return (
        <div
          className={`${baseClasses} ${component.color}`}
          style={{
            left: component.x,
            top: component.y,
            width: component.width,
            height: component.height,
            zIndex: component.zIndex,
          }}
          onMouseDown={onMouseDown}
          onClick={onClick}
          onDoubleClick={onDoubleClick}
        >
          {component.shapeType === 'rectangle' && (
            <div className="w-full h-full rounded border border-gray-300"></div>
          )}
          {component.shapeType === 'circle' && (
            <div className="w-full h-full rounded-full border border-gray-300"></div>
          )}
          {component.shapeType === 'triangle' && (
            <div className="w-full h-full flex items-center justify-center">
              <div 
                className="border-l-[20px] border-r-[20px] border-b-[35px] border-l-transparent border-r-transparent"
                style={{ borderBottomColor: component.color }}
              ></div>
            </div>
          )}
        </div>
      );

    case 'text':
      return (
        <div
          className={baseClasses}
          style={{
            left: component.x,
            top: component.y,
            width: component.width,
            height: component.height,
            zIndex: component.zIndex,
          }}
          onMouseDown={onMouseDown}
          onClick={onClick}
          onDoubleClick={onDoubleClick}
        >
          <input
            type="text"
            value={component.content || ''}
            onChange={handleTextChange}
            className="w-full h-full px-2 py-1 border border-gray-300 rounded bg-white text-black"
            style={{
              fontSize: component.fontSize,
              fontWeight: component.fontWeight,
              textAlign: component.textAlign,
            }}
            placeholder="Enter text..."
          />
        </div>
      );

    case 'slider':
      return (
        <div
          className={baseClasses}
          style={{
            left: component.x,
            top: component.y,
            width: component.width,
            height: component.height,
            zIndex: component.zIndex,
          }}
          onMouseDown={onMouseDown}
          onClick={onClick}
          onDoubleClick={onDoubleClick}
        >
          <div className="w-full h-full flex flex-col justify-center px-2">
            <input
              type="range"
              min={component.minValue}
              max={component.maxValue}
              value={component.defaultValue}
              onChange={handleSliderChange}
              className="w-full"
            />
            <div className="text-xs text-gray-600 text-center mt-1">
              {component.defaultValue}
            </div>
          </div>
        </div>
      );

    case 'button':
      return (
        <div
          className={baseClasses}
          style={{
            left: component.x,
            top: component.y,
            width: component.width,
            height: component.height,
            zIndex: component.zIndex,
          }}
          onMouseDown={onMouseDown}
          onClick={onClick}
          onDoubleClick={onDoubleClick}
        >
          <input
            type="text"
            value={component.buttonText}
            onChange={handleButtonTextChange}
            className="w-full h-full px-3 py-2 border border-gray-300 rounded bg-blue-500 text-white text-center font-medium"
            placeholder="Button text..."
          />
        </div>
      );

    case 'page':
      return (
        <div
          className={baseClasses}
          style={{
            left: component.x,
            top: component.y,
            width: component.width,
            height: component.height,
            zIndex: component.zIndex,
            backgroundColor: component.backgroundColor,
          }}
          onMouseDown={onMouseDown}
          onClick={onClick}
          onDoubleClick={onDoubleClick}
        >
          <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-2xl mb-2">📄</div>
              <p className="font-medium">{component.pageTitle}</p>
              <p className="text-sm">Page Container</p>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}
