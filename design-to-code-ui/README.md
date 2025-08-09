# DesignX - AI-Powered UI Design Tool

A Next.js application with a visual canvas using React Flow and a sidebar for AI UI components.

## Features

- **Visual Canvas**: Drag-and-drop interface using React Flow
- **AI UI Components**: Pre-built components (Button, Card, Input, Text)
- **Interactive Sidebar**: Search and filter components by category
- **Toolbar**: Zoom controls, export, code generation, and preview
- **Modern UI**: Built with Tailwind CSS and Lucide React icons

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main page using DesignWorkspace
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles with Tailwind
├── components/
│   ├── DesignWorkspace.tsx   # Main workspace component
│   ├── FlowCanvas.tsx        # React Flow canvas
│   ├── AISidebar.tsx         # Component sidebar
│   ├── Toolbar.tsx           # Canvas controls
│   └── ui-components.tsx     # Custom React Flow nodes
```

## Dependencies to Install

Since this project was scaffolded without npm access, you'll need to install these dependencies:

```bash
npm install reactflow @types/reactflow lucide-react
```

## Getting Started

1. Install dependencies: `npm install`
2. Run the development server: `npm run dev`
3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Drag Components**: Drag UI components from the sidebar onto the canvas
2. **Connect Nodes**: Connect components by dragging from source to target handles
3. **Customize**: Modify component properties through the sidebar
4. **Export**: Use the toolbar to export designs or generate code

## Tech Stack

- **Next.js 15** - React framework
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Flow** - Flow chart library
- **TypeScript** - Type safety
- **Lucide React** - Icon library
