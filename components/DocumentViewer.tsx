import React from 'react';
import { X, ShieldAlert, FileText, Download } from 'lucide-react';
import { ContentItem } from '../types';

interface DocumentViewerProps {
  item: ContentItem;
  onClose: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ item, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-2 md:p-4">
      <div className="bg-white w-full max-w-6xl h-[95vh] rounded-lg flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gray-900 text-white p-4 flex justify-between items-center select-none shrink-0">
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-accent-500" />
              Protected View: {item.title}
            </h3>
            <p className="text-xs text-gray-400">Read-only mode. Downloading disabled.</p>
          </div>
          <button 
            onClick={onClose}
            className="hover:bg-gray-700 p-2 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-gray-100 relative w-full h-full overflow-hidden flex flex-col items-center justify-center">
          
          {/* Real File Viewer */}
          {item.fileUrl ? (
            item.type === 'video' ? (
              <video 
                controls 
                controlsList="nodownload" 
                className="max-w-full max-h-full rounded-lg shadow-lg"
                src={item.fileUrl}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              // PDF / Document Viewer
              <iframe 
                src={`${item.fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                className="w-full h-full"
                title="Document Viewer"
                style={{ border: 'none' }} 
              />
            )
          ) : (
            // Fallback for Text Articles
            <div className="bg-white shadow-lg p-12 max-w-3xl w-full h-full overflow-y-auto relative protected-content">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 fixed">
                <span className="text-6xl font-bold rotate-45 transform">BOLD SCHOLARS</span>
              </div>
              <h1 className="text-3xl font-bold mb-6 text-gray-900">{item.title}</h1>
              <p className="text-sm text-gray-500 mb-8 border-b pb-4">
                Published: {item.date} | Category: {item.category}
              </p>
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {item.description}
              </p>
            </div>
          )}
          
          {/* Overlay to discourage Right Click/Save */}
          <div 
            className="absolute inset-0 z-10 pointer-events-none"
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
      </div>
    </div>
  );
};