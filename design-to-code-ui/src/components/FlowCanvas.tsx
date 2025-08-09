/**
 * FlowCanvas.tsx
 *
 * React Flow visual canvas component that provides the main design workspace.
 * Handles drag-and-drop functionality for adding new UI components, manages
 * node connections, and displays the visual representation of the UI design.
 * Includes built-in controls, minimap, and background grid for better UX.
 */

'use client';

import { useCallback, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  ReactFlowInstance,
  Background,
  Controls,
  MiniMap,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button, Card, Input, Text, PromptInput, Slider, Selector, ImageViewer, RunButton } from './ui-components';
import { useTheme } from './DesignWorkspace';

// Custom node types for UI components
const nodeTypes = {
  button: Button,
  card: Card,
  input: Input,
  text: Text,
  promptInput: PromptInput,
  slider: Slider,
  selector: Selector,
  imageViewer: ImageViewer,
  runButton: RunButton,
};

interface FlowCanvasProps {
  onInit: (instance: ReactFlowInstance) => void;
}

export default function FlowCanvas({ onInit }: FlowCanvasProps) {
  const { isDarkMode } = useTheme();

  // Initial nodes to display on canvas
  const initialNodes: Node[] = [
    {
      id: '1',
      type: 'button',
      position: { x: 100, y: 100 },
      data: { 
        label: 'Submit Button', 
        title: 'Submit Button',
        placeholder: 'Click to submit' 
      },
    },
    {
      id: '2',
      type: 'card',
      position: { x: 300, y: 100 },
      data: { 
        label: 'User Card', 
        title: 'User Card',
        content: 'User information display' 
      },
    },
    {
      id: '3',
      type: 'input',
      position: { x: 500, y: 100 },
      data: { 
        label: 'Email Input', 
        title: 'Email Input',
        placeholder: 'Enter your email' 
      },
    },
    {
      id: '4',
      type: 'promptInput',
      position: { x: 100, y: 350 },
      data: { 
        label: 'AI Prompt', 
        title: 'AI Prompt Input',
        prompt: 'Describe your design...', 
        maxLength: 500 
      },
    },
    {
      id: '5',
      type: 'slider',
      position: { x: 300, y: 350 },
      data: { 
        label: 'Opacity', 
        title: 'Opacity Control',
        min: 0, 
        max: 100, 
        value: 75 
      },
    },
    {
      id: '6',
      type: 'selector',
      position: { x: 500, y: 350 },
      data: { 
        label: 'Theme', 
        title: 'Theme Selector',
        options: ['Light', 'Dark', 'Auto'], 
        selected: 'Light' 
      },
    },
    {
      id: '7',
      type: 'imageViewer',
      position: { x: 100, y: 600 },
      data: { 
        label: 'Generated Image', 
        title: 'Image Display',
        imageName: 'design_output.png', 
        dimensions: '512x512' 
      },
    },
    {
      id: '8',
      type: 'runButton',
      position: { x: 300, y: 600 },
      data: { 
        label: 'Generate Design', 
        title: 'Generate Button',
        action: 'Run AI generation', 
        status: 'Ready' 
      },
    },
  ];

  // Initial edges connecting the nodes
  const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e1-3', source: '1', target: '3' },
    { id: 'e4-5', source: '4', target: '5' },
    { id: 'e5-6', source: '5', target: '6' },
    { id: 'e6-7', source: '6', target: '7' },
    { id: 'e7-8', source: '7', target: '8' },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Handle new connections between nodes
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Allow dropping components on the canvas
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle dropping new components onto the canvas
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = document.querySelector('.react-flow')?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      if (reactFlowBounds) {
        const position = {
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        };

        // Create new node at drop position
        const newNode: Node = {
          id: `${Date.now()}`,
          type,
          position,
          data: { 
            label: `${type.charAt(0).toUpperCase() + type.slice(1)}`, 
            title: `${type.charAt(0).toUpperCase() + type.slice(1)} Component`
          },
        };

        setNodes((nds) => nds.concat(newNode));
      }
    },
    [setNodes]
  );

  return (
    <div className={`h-full w-full transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onInit={onInit}
        nodeTypes={nodeTypes}
        fitView
        className={`transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
        }`}
        proOptions={{ hideAttribution: true }}
      >
        {/* Background Grid */}
        <Background 
          color={isDarkMode ? '#374151' : '#e5e7eb'} 
          gap={20} 
          size={1}
        />
        
        {/* Canvas Controls */}
        <Controls 
          className={`transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
          }`}
        />
        
        {/* Mini Map */}
        <MiniMap 
          className={`transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
          }`}
          nodeColor={isDarkMode ? '#6b7280' : '#9ca3af'}
          maskColor={isDarkMode ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'}
        />
        
        {/* Info Panel */}
        <Panel position="top-left" className="z-10">
          <div className={`px-3 py-2 rounded-lg shadow-lg transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-800 text-white border border-gray-600' 
              : 'bg-white text-gray-900 border border-gray-200'
          }`}>
            <div className="text-sm font-medium">
              {nodes.length} Components • {edges.length} Connections
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
