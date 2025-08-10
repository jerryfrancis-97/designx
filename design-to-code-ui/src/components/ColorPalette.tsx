'use client';

import { useState } from 'react';
import { DESIGN_COLORS } from '@/types/design';

interface ColorPaletteProps {
  currentColor: string;
  onColorChange: (color: string) => void;
}

export function ColorPalette({ currentColor, onColorChange }: ColorPaletteProps) {
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [customColor, setCustomColor] = useState(currentColor);

  const extendedColors = [
    ...DESIGN_COLORS,
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
    '#F9E79F', '#ABEBC6', '#FAD7A0', '#D5A6BD', '#A9CCE3'
  ];

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    onColorChange(color);
  };

  const handleCustomColorSubmit = () => {
    onColorChange(customColor);
    setShowCustomPicker(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">Colors</h3>
        <button
          onClick={() => setShowCustomPicker(!showCustomPicker)}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          {showCustomPicker ? 'Hide' : 'Custom'}
        </button>
      </div>
      
      {/* Custom color picker */}
      {showCustomPicker && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              placeholder="#000000"
              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={handleCustomColorSubmit}
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Color grid */}
      <div className="grid grid-cols-8 gap-2">
        {extendedColors.map((color) => (
          <button
            key={color}
            className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
              currentColor === color 
                ? 'border-blue-500 ring-2 ring-blue-200' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            style={{ backgroundColor: color }}
            onClick={() => onColorChange(color)}
            title={`Color: ${color}`}
          />
        ))}
      </div>

      {/* Current color display */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-600">Current:</span>
          <div
            className="w-6 h-6 rounded border border-gray-300"
            style={{ backgroundColor: currentColor }}
          />
          <span className="text-xs font-mono text-gray-700">{currentColor}</span>
        </div>
      </div>
    </div>
  );
}
