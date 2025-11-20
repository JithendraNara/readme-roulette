import React from 'react';
import { CodeArtifact } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: CodeArtifact[];
  onSelectArtifact: (artifact: CodeArtifact) => void;
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ 
  isOpen, 
  onClose, 
  history, 
  onSelectArtifact,
  onClearHistory 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end md:pr-0">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Drawer Content */}
      <div className="relative bg-museum-black border-l border-stone-800 h-full w-full md:max-w-md shadow-2xl animate-fade-in flex flex-col z-50">
        <div className="p-6 border-b border-stone-800 flex justify-between items-center bg-museum-black z-10">
          <h2 className="text-xl font-serif tracking-widest text-museum-paper opacity-90">
            ARCHIVES ({history.length})
          </h2>
          <button 
            onClick={onClose}
            className="text-stone-500 hover:text-museum-paper transition-colors text-xl px-2"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {history.length === 0 ? (
            <div className="text-center text-stone-600 font-mono text-sm mt-10">
              No artifacts discovered yet.
            </div>
          ) : (
            history.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectArtifact(item)}
                className="w-full text-left p-4 border border-stone-800 hover:border-museum-paper/50 bg-stone-900/30 hover:bg-stone-900/80 transition-all group rounded-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider group-hover:text-stone-400">
                    {item.repoName}/{item.fileName}
                  </span>
                  <span className="text-[10px] font-mono text-stone-600">
                    {item.language}
                  </span>
                </div>
                <p className="text-sm font-serif text-stone-300 line-clamp-2 italic group-hover:text-museum-paper transition-colors">
                  "{item.extractedComment}"
                </p>
              </button>
            ))
          )}
        </div>

        {history.length > 0 && (
          <div className="p-4 border-t border-stone-800 bg-museum-black">
            <button
              onClick={onClearHistory}
              className="w-full text-xs font-mono text-red-900/70 hover:text-red-500 hover:bg-red-950/10 py-3 border border-transparent hover:border-red-900/30 transition-all uppercase tracking-widest"
            >
              Burn Archives
            </button>
          </div>
        )}
      </div>
    </div>
  );
};