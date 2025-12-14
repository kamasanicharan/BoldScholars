import React from 'react';
import { X, ShieldAlert } from 'lucide-react';
import { ContentItem } from '../types';

interface DocumentViewerProps {
  item: ContentItem;
  onClose: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ item, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl h-[90vh] rounded-lg flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-brand-900 text-white p-4 flex justify-between items-center select-none">
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-accent-500" />
              Protected View: {item.title}
            </h3>
            <p className="text-xs text-brand-200">Read-only mode. Downloading is disabled.</p>
          </div>
          <button 
            onClick={onClose}
            className="hover:bg-brand-700 p-2 rounded transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area - Protected */}
        <div 
          className="flex-1 overflow-auto bg-gray-100 p-8 flex flex-col items-center protected-content"
          onContextMenu={(e) => e.preventDefault()} // Disable Right Click
        >
          <div className="bg-white shadow-lg p-12 max-w-3xl w-full min-h-[1000px] relative">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <span className="text-6xl font-bold rotate-45 transform">BOLD SCHOLARS COPY</span>
            </div>
            
            <h1 className="text-3xl font-bold mb-6 text-gray-900">{item.title}</h1>
            <p className="text-sm text-gray-500 mb-8 border-b pb-4">
              Published: {item.date} | Category: {item.category}
            </p>

            <div className="space-y-6 text-gray-800 leading-relaxed font-serif">
              <p>
                <strong>Abstract:</strong> {item.description}
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <h2 className="text-xl font-bold mt-8 mb-4 text-brand-700">1. Introduction</h2>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              
              <div className="my-8 p-4 bg-gray-50 border-l-4 border-brand-500 italic">
                "Education is not the learning of facts, but the training of the mind to think." - Albert Einstein
              </div>

              <h2 className="text-xl font-bold mt-8 mb-4 text-brand-700">2. Core Concepts</h2>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
                totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p>
              {/* Simulation of a long document */}
              <div className="h-64 bg-gray-200 rounded mt-4 flex items-center justify-center">
                <span className="text-gray-500">Diagram / Chart Placeholder</span>
              </div>
              <p className="mt-4">
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur 
                magni dolores eos qui ratione voluptatem sequi nesciunt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};