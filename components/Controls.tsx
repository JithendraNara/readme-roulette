import React from 'react';

interface ControlsProps {
  onScan: () => void;
  isLoading: boolean;
}

export const Controls: React.FC<ControlsProps> = ({ onScan, isLoading }) => {
  return (
    <div className="w-full p-4 md:p-8 flex justify-center z-20">
      <button
        onClick={onScan}
        disabled={isLoading}
        className={`
          relative group w-full max-w-xs md:max-w-none md:w-auto px-8 py-4 
          bg-stone-900/50 md:bg-transparent border border-stone-600 
          text-museum-paper font-mono uppercase tracking-[0.2em] text-xs md:text-sm 
          transition-all duration-300 rounded-sm
          hover:bg-stone-800 hover:border-museum-paper
          disabled:opacity-50 disabled:cursor-not-allowed
          active:scale-95 md:active:scale-100
        `}
      >
        <span className="relative z-10">
          {isLoading ? 'Scanning...' : 'Find Another Discovery'}
        </span>
        
        {/* Button glow effect */}
        <div className="absolute inset-0 bg-stone-700 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-md"></div>
      </button>
    </div>
  );
};