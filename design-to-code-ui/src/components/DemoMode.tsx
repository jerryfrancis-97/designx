/**
 * DemoMode.tsx
 *
 * Welcome tutorial component that provides onboarding for new users.
 * Displays helpful instructions about using the DesignX interface,
 * including how to drag components, move nodes, and create connections.
 * Can be dismissed by the user and includes interactive guidance elements.
 */

'use client';

import { useState } from 'react';
import { Move, Zap, X, Sparkles } from 'lucide-react';
import { useTheme } from './DesignWorkspace';

export default function DemoMode() {
  const { isDarkMode } = useTheme();
  const [isVisible, setIsVisible] = useState(true);

  // Hide the demo mode if user dismisses it
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 transition-colors duration-300 ${
          isDarkMode ? 'bg-black/50' : 'bg-black/30'
        }`}
        onClick={() => setIsVisible(false)}
      />

      {/* Tutorial Card */}
      <div className={`relative max-w-md w-full p-6 rounded-xl shadow-2xl transition-all duration-300 ${
        isDarkMode
          ? 'bg-gray-800 text-white border border-gray-600'
          : 'bg-white text-gray-900 border border-gray-200'
      }`}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg transition-colors duration-300 ${
            isDarkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-600'
          }`}>
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`text-lg font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Welcome to DesignX! 🎨
            </h3>
            <p className={`text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Your AI-powered UI design workspace
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className={`space-y-3 mb-6 transition-colors duration-300 ${
          isDarkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          <div className="flex items-start gap-2">
            <Move className="w-4 h-4 mt-0.5 text-green-500" />
            <p>Move and resize components on the canvas</p>
          </div>
          <div className="flex items-start gap-2">
            <Zap className="w-4 h-4 mt-0.5 text-yellow-500" />
            <p>Connect components to create interactive flows</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 mt-0.5 text-blue-500">🎨</div>
            <p>Click component titles to edit them</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 mt-0.5 text-purple-500">🌙</div>
            <p>Toggle dark/light mode with the theme button</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setIsVisible(false)}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              isDarkMode
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
            }`}
          >
            Get Started
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isDarkMode
                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className={`absolute top-3 right-3 p-1 rounded-full transition-all duration-300 ${
            isDarkMode
              ? 'text-gray-400 hover:text-white hover:bg-gray-700'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
          title="Close tutorial"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
