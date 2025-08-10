/**
 * Header Component
 * 
 * Displays the main application header with title and navigation.
 * This is a simple, static header that provides branding and context
 * for the DesignX application.
 */

'use client';

import { Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center gap-3">
        {/* App Logo/Icon */}
        <Sparkles className="h-8 w-8 text-blue-600" />
        
        {/* App Title */}
        <h1 className="text-2xl font-bold text-gray-900">
          DesignX
        </h1>
        
        {/* App Subtitle */}
        <span className="text-gray-500 text-lg">
          AI-Powered App Generator
        </span>
      </div>
    </header>
  );
}
