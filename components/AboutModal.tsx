import React from 'react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/95 md:bg-black/90 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-museum-black border border-stone-700 p-6 md:p-12 max-w-2xl w-full shadow-2xl animate-fade-in text-museum-paper overflow-y-auto max-h-[90vh] rounded-sm">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-500 hover:text-museum-paper transition-colors font-mono text-xl px-3 py-1 hover:bg-stone-900 rounded"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="text-center mb-6 md:mb-8 mt-4 md:mt-0">
          <h2 className="text-xl md:text-3xl font-serif tracking-widest text-museum-paper opacity-90 border-b border-stone-800 pb-4 inline-block">
            ABOUT THE COLLECTION
          </h2>
        </div>

        <div className="space-y-4 md:space-y-6 font-mono text-xs md:text-base text-stone-400 leading-relaxed text-justify">
          <p>
            <strong className="text-museum-paper">Readme.txt Rouletter</strong> is an interactive exhibition dedicated to the uncelebrated literature of software engineering: the code comment.
          </p>
          <p>
            Deep within the "untitled" repositories and abandoned forks of the open-source world, developers leave behind traces of their humanity. Unlike polished documentation, these artifacts reveal the raw emotions of creation—frustration, confusion, delirium, and the bargaining phase of debugging.
          </p>
          <p>
            This tool acts as a digital archaeologist. Using generative AI trained on the patterns of real-world development struggles, it simulates the experience of stumbling upon these hidden messages in the dark corners of a codebase.
          </p>
          <p>
            <em className="text-stone-500 border-l-2 border-stone-800 pl-4 block my-4">"Every line of code is a decision, but every comment is a confession."</em>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-stone-800 flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-stone-600">
            <span>Est. 2025 • Digital Archaeology Division</span>
            <span className="text-stone-500 hover:text-stone-400 transition-colors">
              Curated by <span className="text-museum-paper underline decoration-stone-800 underline-offset-4">Jithsss</span>
            </span>
          </div>
          
          <button
            onClick={onClose}
            className="w-full md:w-auto text-xs font-mono text-stone-500 hover:text-museum-paper border border-stone-800 hover:border-stone-600 px-6 py-3 transition-all uppercase tracking-wider rounded-sm mt-2"
          >
            Close File
          </button>
        </div>
      </div>
    </div>
  );
};