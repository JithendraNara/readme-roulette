import React from 'react';
import { ArtifactMode, Language } from '../types';

interface HeaderProps {
  onOpenAbout: () => void;
  onOpenHistory: () => void;
  artifactMode?: ArtifactMode;
  onModeChange?: (mode: ArtifactMode) => void;
  selectedLanguage?: string;
  onLanguageChange?: (lang: string) => void;
  availableLanguages?: Language[];
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAbout,
  onOpenHistory,
  artifactMode = 'ai',
  onModeChange,
  selectedLanguage = '',
  onLanguageChange,
  availableLanguages = [],
}) => {
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

      {/* Mode Toggle + Language Filter — only show when trending mode available */}
      {onModeChange && (
        <div className="order-3 mt-4 flex flex-col sm:flex-row items-center gap-3">
          {/* Mode Toggle */}
          <div className="flex items-center bg-stone-900/50 border border-stone-800 rounded-sm overflow-hidden">
            <button
              onClick={() => onModeChange('ai')}
              className={`px-4 py-2 text-[10px] font-mono uppercase tracking-widest transition-colors ${
                artifactMode === 'ai'
                  ? 'bg-stone-800 text-museum-paper border-r border-stone-700'
                  : 'text-stone-500 hover:text-stone-300'
              }`}
            >
              AI
            </button>
            <button
              onClick={() => onModeChange('trending')}
              className={`px-4 py-2 text-[10px] font-mono uppercase tracking-widest transition-colors ${
                artifactMode === 'trending'
                  ? 'bg-stone-800 text-museum-paper'
                  : 'text-stone-500 hover:text-stone-300'
              }`}
            >
              Trending
            </button>
          </div>

          {/* Language Filter — only visible in trending mode */}
          {artifactMode === 'trending' && onLanguageChange && (
            <div className="flex items-center gap-2">
              <span className="text-stone-600 text-[10px] font-mono uppercase tracking-widest">Lang:</span>
              <select
                value={selectedLanguage}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="bg-stone-900/50 border border-stone-800 text-stone-400 text-[10px] font-mono uppercase tracking-widest px-3 py-2 rounded-sm hover:border-stone-600 focus:border-stone-500 outline-none transition-colors cursor-pointer"
              >
                <option value="">All Languages</option>
                {availableLanguages.map(lang => (
                  <option key={lang.urlParam} value={lang.urlParam}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
