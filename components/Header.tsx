import React from 'react';

interface HeaderProps {
  onOpenAbout: () => void;
  onOpenHistory: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAbout, onOpenHistory }) => {
  return (
    <header className="w-full p-6 flex flex-col items-center justify-center border-b border-stone-800 bg-museum-black z-20 relative transition-all duration-300">
      {/* Navigation Controls */}
      <div className="flex order-2 md:order-none md:absolute md:right-8 md:top-8 gap-4 mt-6 md:mt-0">
        <button 
          onClick={onOpenHistory}
          className="text-xs font-mono text-stone-500 hover:text-museum-paper tracking-widest uppercase transition-colors flex items-center gap-2 hover:bg-stone-900 px-4 py-2 md:px-3 md:py-1 rounded-sm border border-stone-900 md:border-transparent hover:border-stone-800"
        >
          <span className="inline">Archives</span>
        </button>
        <button 
          onClick={onOpenAbout}
          className="text-xs font-mono text-stone-500 hover:text-museum-paper tracking-widest uppercase transition-colors flex items-center gap-2 hover:bg-stone-900 px-4 py-2 md:px-3 md:py-1 rounded-sm border border-stone-900 md:border-transparent hover:border-stone-800"
        >
          <span className="inline">About</span>
        </button>
      </div>
      
      {/* Branding */}
      <div className="text-center order-1 md:order-none">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif tracking-[0.15em] text-museum-paper opacity-90 whitespace-nowrap">
          README.TXT
        </h1>
        <p className="text-stone-600 text-[10px] md:text-xs font-mono mt-2 tracking-[0.2em] uppercase">
          Digital Archaeology Division
        </p>
      </div>
    </header>
  );
};