/**
 * ui-components.tsx
 * 
 * Custom React Flow node components that represent different UI elements.
 * Each component (Button, Card, Input, Text) is designed as a draggable
 * node with connection handles for building interactive flows. Components
 * include visual styling, labels, and metadata for the design canvas.
 */

'use client';

import { Handle, Position, NodeProps } from 'reactflow';
import { useState } from 'react';

// Button Component Node - Interactive button with variant support
export function Button({ data }: NodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.title || 'Button Component');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    data.title = e.target.value;
  };

  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-white border-2 border-stone-400 min-w-[200px]">
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      
      {/* Editable Title */}
      <div className="mb-2">
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            onBlur={() => setIsEditing(false)}
            onKeyPress={(e) => e.key === 'Enter' && setIsEditing(false)}
            className="w-full px-2 py-1 text-sm font-bold text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        ) : (
          <div 
            onClick={() => setIsEditing(true)}
            className="px-2 py-1 text-sm font-bold text-black cursor-pointer hover:bg-gray-100 rounded"
          >
            {title}
          </div>
        )}
      </div>

      <div className="flex items-center">
        <div className="rounded-full w-3 h-3 bg-red-500 mr-2" />
        <div className="ml-2">
          <div className="text-sm font-semibold text-black">{data.label}</div>
          <div className="text-xs text-gray-600">Interactive Button</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-4 h-4" />
    </div>
  );
}

// Card Component Node - Container for content with title and description
export function Card({ data }: NodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.title || 'Card Component');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    data.title = e.target.value;
  };

  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-white border-2 border-stone-400 min-w-[200px]">
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      
      {/* Editable Title */}
      <div className="mb-2">
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            onBlur={() => setIsEditing(false)}
            onKeyPress={(e) => e.key === 'Enter' && setIsEditing(false)}
            className="w-full px-2 py-1 text-sm font-bold text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        ) : (
          <div 
            onClick={() => setIsEditing(true)}
            className="px-2 py-1 text-sm font-bold text-black cursor-pointer hover:bg-gray-100 rounded"
          >
            {title}
          </div>
        )}
      </div>

      <div className="flex items-center">
        <div className="rounded-full w-3 h-3 bg-blue-500 mr-2" />
        <div className="ml-2">
          <div className="text-sm font-semibold text-black">{data.label}</div>
          <div className="text-xs text-gray-600">{data.content}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
}

// Input Component Node - Text input field with placeholder
export function Input({ data }: NodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.title || 'Input Component');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    data.title = e.target.value;
  };

  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-white border-2 border-stone-400 min-w-[200px]">
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      
      {/* Editable Title */}
      <div className="mb-2">
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            onBlur={() => setIsEditing(false)}
            onKeyPress={(e) => e.key === 'Enter' && setIsEditing(false)}
            className="w-full px-2 py-1 text-sm font-bold text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        ) : (
          <div 
            onClick={() => setIsEditing(true)}
            className="px-2 py-1 text-sm font-bold text-black cursor-pointer hover:bg-gray-100 rounded"
          >
            {title}
          </div>
        )}
      </div>

      <div className="flex items-center">
        <div className="rounded-full w-3 h-3 bg-green-500 mr-2" />
        <div className="ml-2">
          <div className="text-sm font-semibold text-black">{data.label}</div>
          <div className="text-xs text-gray-600">{data.placeholder}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
}

// Text Component Node - Typography component for displaying text content
export function Text({ data }: NodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.title || 'Text Component');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    data.title = e.target.value;
  };

  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-white border-2 border-stone-400 min-w-[200px]">
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      
      {/* Editable Title */}
      <div className="mb-2">
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            onBlur={() => setIsEditing(false)}
            onKeyPress={(e) => e.key === 'Enter' && setIsEditing(false)}
            className="w-full px-2 py-1 text-sm font-bold text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        ) : (
          <div 
            onClick={() => setIsEditing(true)}
            className="px-2 py-1 text-sm font-bold text-black cursor-pointer hover:bg-gray-100 rounded"
          >
            {title}
          </div>
        )}
      </div>

      <div className="flex items-center">
        <div className="rounded-full w-3 h-3 bg-purple-500 mr-2" />
        <div className="ml-2">
          <div className="text-sm font-semibold text-black">{data.label}</div>
          <div className="text-xs text-gray-600">Text Display</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
}

// Prompt Input Component Node - AI prompt input with character count
export function PromptInput({ data }: NodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.title || 'Prompt Input');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    data.title = e.target.value;
  };

  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-white border-2 border-stone-400 min-w-[200px]">
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      
      {/* Editable Title */}
      <div className="mb-2">
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            onBlur={() => setIsEditing(false)}
            onKeyPress={(e) => e.key === 'Enter' && setIsEditing(false)}
            className="w-full px-2 py-1 text-sm font-bold text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        ) : (
          <div 
            onClick={() => setIsEditing(true)}
            className="px-2 py-1 text-sm font-bold text-black cursor-pointer hover:bg-gray-100 rounded"
          >
            {title}
          </div>
        )}
      </div>

      <div className="flex items-center">
        <div className="rounded-full w-3 h-3 bg-orange-500 mr-2" />
        <div className="ml-2">
          <div className="text-sm font-semibold text-black">{data.label}</div>
          <div className="text-xs text-gray-600">Prompt: {data.prompt || 'Enter AI prompt...'}</div>
          <div className="text-xs text-gray-500">Max: {data.maxLength || 500} chars</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
}

// Slider Component Node - Parameter tuning slider with range values
export function Slider({ data }: NodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.title || 'Slider Control');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    data.title = e.target.value;
  };

  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-white border-2 border-stone-400 min-w-[200px]">
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      
      {/* Editable Title */}
      <div className="mb-2">
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            onBlur={() => setIsEditing(false)}
            onKeyPress={(e) => e.key === 'Enter' && setIsEditing(false)}
            className="w-full px-2 py-1 text-sm font-bold text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        ) : (
          <div 
            onClick={() => setIsEditing(true)}
            className="px-2 py-1 text-sm font-bold text-black cursor-pointer hover:bg-gray-100 rounded"
          >
            {title}
          </div>
        )}
      </div>

      <div className="flex items-center">
        <div className="rounded-full w-3 h-3 bg-teal-500 mr-2" />
        <div className="ml-2">
          <div className="text-sm font-semibold text-black">{data.label}</div>
          <div className="text-xs text-gray-600">Range: {data.min || 0} - {data.max || 100}</div>
          <div className="text-xs text-gray-500">Current: {data.value || 50}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
}

// Selector Dropdown Component Node - Dropdown with multiple options
export function Selector({ data }: NodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.title || 'Selector Component');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    data.title = e.target.value;
  };

  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-white border-2 border-stone-400 min-w-[200px]">
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      
      {/* Editable Title */}
      <div className="mb-2">
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            onBlur={() => setIsEditing(false)}
            onKeyPress={(e) => e.key === 'Enter' && setIsEditing(false)}
            className="w-full px-2 py-1 text-sm font-bold text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        ) : (
          <div 
            onClick={() => setIsEditing(true)}
            className="px-2 py-1 text-sm font-bold text-black cursor-pointer hover:bg-gray-100 rounded"
          >
            {title}
          </div>
        )}
      </div>

      <div className="flex items-center">
        <div className="rounded-full w-3 h-3 bg-indigo-500 mr-2" />
        <div className="ml-2">
          <div className="text-sm font-semibold text-black">{data.label}</div>
          <div className="text-xs text-gray-600">Options: {data.options?.length || 0} items</div>
          <div className="text-xs text-gray-500">Selected: {data.selected || 'None'}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
}

// Image Viewer Component Node - Display and manage images
export function ImageViewer({ data }: NodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.title || 'Image Viewer');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    data.title = e.target.value;
  };

  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-white border-2 border-stone-400 min-w-[200px]">
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      
      {/* Editable Title */}
      <div className="mb-2">
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            onBlur={() => setIsEditing(false)}
            onKeyPress={(e) => e.key === 'Enter' && setIsEditing(false)}
            className="w-full px-2 py-1 text-sm font-bold text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        ) : (
          <div 
            onClick={() => setIsEditing(true)}
            className="px-2 py-1 text-sm font-bold text-black cursor-pointer hover:bg-gray-100 rounded"
          >
            {title}
          </div>
        )}
      </div>

      <div className="flex items-center">
        <div className="rounded-full w-3 h-3 bg-pink-500 mr-2" />
        <div className="ml-2">
          <div className="text-sm font-semibold text-black">{data.label}</div>
          <div className="text-xs text-gray-600">Image: {data.imageName || 'No image selected'}</div>
          <div className="text-xs text-gray-500">Size: {data.dimensions || 'Unknown'}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
}

// Run Button Component Node - Execute actions or processes
export function RunButton({ data }: NodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.title || 'Run Button');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    data.title = e.target.value;
  };

  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-white border-2 border-stone-400 min-w-[200px]">
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      
      {/* Editable Title */}
      <div className="mb-2">
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            onBlur={() => setIsEditing(false)}
            onKeyPress={(e) => e.key === 'Enter' && setIsEditing(false)}
            className="w-full px-2 py-1 text-sm font-bold text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        ) : (
          <div 
            onClick={() => setIsEditing(true)}
            className="px-2 py-1 text-sm font-bold text-black cursor-pointer hover:bg-gray-100 rounded"
          >
            {title}
          </div>
        )}
      </div>

      <div className="flex items-center">
        <div className="rounded-full w-3 h-3 bg-emerald-500 mr-2" />
        <div className="ml-2">
          <div className="text-sm font-semibold text-black">{data.label}</div>
          <div className="text-xs text-gray-600">Action: {data.action || 'Run process'}</div>
          <div className="text-xs text-gray-500">Status: {data.status || 'Ready'}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
}
