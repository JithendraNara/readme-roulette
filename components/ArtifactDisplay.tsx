import React, { useState, useRef, MouseEvent, useEffect } from 'react';
import { CodeArtifact } from '../types';
import { generateArtifactPDF } from '../services/pdfExport';

interface ArtifactDisplayProps {
  artifact: CodeArtifact | null;
  isLoading: boolean;
  loadingMessage: string;
}

export const ArtifactDisplay: React.FC<ArtifactDisplayProps> = ({ artifact, isLoading, loadingMessage }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isCopied, setIsCopied] = useState(false);
  const [showRawCode, setShowRawCode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsCopied(false);
    setShowRawCode(false);
  }, [artifact]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!artifact) return;

    const textToShare = `"${artifact.extractedComment}"\n\n— Found in ${artifact.fileName} from repo '${artifact.repoName}'\n#ReadmeRouletter`;
    
    try {
      // Try native sharing first if available (works great on Mobile)
      if (navigator.share) {
        await navigator.share({
          title: 'Readme.txt Artifact',
          text: textToShare,
        });
      } else {
        await navigator.clipboard.writeText(textToShare);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 3000);
      }
    } catch (err) {
      console.error('Failed to share/copy:', err);
    }
  };

  const handleDownloadPDF = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!artifact) return;
    try {
      await generateArtifactPDF(artifact);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] animate-pulse-slow px-4 text-center z-10">
        <div className="relative p-8 md:p-12 border border-stone-800 bg-stone-900/20 rounded-sm max-w-2xl w-full">
          {/* Scanning visual effect */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
             <div className="w-full h-[2px] bg-museum-paper/50 absolute top-0 animate-[scan_2s_ease-in-out_infinite]"></div>
          </div>
          
          <div className="font-mono text-museum-paper text-lg md:text-2xl tracking-widest uppercase drop-shadow-[0_0_8px_rgba(242,238,203,0.5)]">
            {loadingMessage}
          </div>
          <div className="mt-8 flex justify-center gap-1">
             <div className="w-2 h-2 bg-stone-600 animate-bounce delay-0"></div>
             <div className="w-2 h-2 bg-stone-600 animate-bounce delay-100"></div>
             <div className="w-2 h-2 bg-stone-600 animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!artifact) {
    return (
      <div className="flex items-center justify-center h-[60vh] z-10">
        <div className="p-10 border border-dashed border-stone-800 rounded-sm bg-stone-900/20">
            <div className="font-mono text-stone-600 text-sm md:text-base tracking-widest uppercase animate-pulse">
            [ System Ready. Awaiting Input. ]
            </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="w-full max-w-5xl mx-auto py-8 md:py-12 flex flex-col items-center animate-fade-in relative z-20 min-h-[60vh] justify-center"
    >
      {/* Main "Display Case" Card */}
      <div className="relative w-full bg-[#050505] border border-stone-800 shadow-[0_0_50px_-10px_rgba(0,0,0,0.7)] rounded-sm overflow-hidden group">
        
        {/* Corner Brackets / Viewfinder styling */}
        <div className="absolute top-0 left-0 w-4 h-4 md:w-8 md:h-8 border-t border-l border-stone-600 z-20 opacity-50"></div>
        <div className="absolute top-0 right-0 w-4 h-4 md:w-8 md:h-8 border-t border-r border-stone-600 z-20 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 md:w-8 md:h-8 border-b border-l border-stone-600 z-20 opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 md:w-8 md:h-8 border-b border-r border-stone-600 z-20 opacity-50"></div>

        {/* Spotlight Effect */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden md:block"
          style={{
            background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(30, 30, 30, 0.8), transparent 40%)`
          }}
        />

        {/* Inner Content Padding */}
        <div className="relative z-10 p-8 md:p-16 flex flex-col items-center">
            
            {/* Decorative Quote Mark */}
            <div className="text-6xl md:text-8xl font-serif text-stone-700/30 mb-6 select-none">“</div>
            
            {/* The Artifact Text - Highlighting applied here */}
            <div className="w-full text-center">
                <p className="selectable-text text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-serif leading-tight text-[#fffef5] drop-shadow-[0_0_15px_rgba(242,238,203,0.15)] selection:bg-stone-700 selection:text-white break-words">
                {artifact.extractedComment}
                </p>
            </div>

            {/* Decorative Quote Mark Bottom */}
            <div className="text-6xl md:text-8xl font-serif text-stone-700/30 mt-6 transform rotate-180 select-none">“</div>

            {/* Metadata Line */}
            <div className="mt-10 flex flex-wrap justify-center items-center gap-4 text-xs md:text-sm font-mono text-stone-500 tracking-widest uppercase border-t border-stone-900 pt-6 w-full opacity-70">
                <span className="text-museum-paper opacity-60">Repo: {artifact.repoName}</span>
                <span className="hidden md:inline text-stone-800">•</span>
                <span>{artifact.language}</span>
                <span className="hidden md:inline text-stone-800">•</span>
                <span>{artifact.timestamp}</span>
                <span className="hidden md:inline text-stone-800">•</span>
                <span
                  className="px-2 py-0.5 rounded-sm text-[10px] tracking-[0.15em]"
                  style={{
                    backgroundColor: artifact.mood === 'angry' ? '#7a2a2a'
                      : artifact.mood === 'funny' ? '#3a6b3a'
                      : artifact.mood === 'confused' ? '#4a5e7a'
                      : artifact.mood === 'defeated' ? '#3a3a5a'
                      : '#6b5b4f',
                    color: '#f2eecb',
                  }}
                >
                  {artifact.mood}
                </span>
            </div>

            {/* Action Bar */}
            <div className="mt-8 flex gap-4 relative z-30">
                <button 
                    onClick={handleShare}
                    className="flex items-center gap-2 px-5 py-2 text-[10px] md:text-xs font-mono text-stone-400 hover:text-white uppercase tracking-[0.2em] transition-all duration-300 bg-stone-900/50 hover:bg-stone-800 border border-stone-800 rounded-sm hover:border-stone-600"
                >
                    {isCopied ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 text-green-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                            <span>Copied</span>
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.287.696.345 1.093m0 0c.48 2.734 4.746 4.746 4.746-2.734 4.746 1.093m-3.651 0a2.25 2.25 0 1 0 0 2.186m0-2.186c.324-.18.696-.287 1.093-.345m0 0a14.325 14.325 0 0 1 4.746 0m-4.746 0c0-2.734-4.746-4.746-4.746-4.746 0 2.734-4.746 4.746-4.746 4.746m3.651 0a2.25 2.25 0 1 0 0-2.186" />
                            </svg>
                            <span>Share</span>
                        </>
                    )}
                </button>

                <button 
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2 px-5 py-2 text-[10px] md:text-xs font-mono text-stone-400 hover:text-white uppercase tracking-[0.2em] transition-all duration-300 bg-stone-900/50 hover:bg-stone-800 border border-stone-800 rounded-sm hover:border-stone-600"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    <span>Download PDF</span>
                </button>
                
                <button 
                    onClick={() => setShowRawCode(!showRawCode)}
                    className={`flex items-center gap-2 px-5 py-2 text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] transition-all duration-300 border rounded-sm ${showRawCode ? 'bg-stone-800 text-white border-stone-600' : 'bg-stone-900/50 text-stone-400 border-stone-800 hover:text-white hover:border-stone-600'}`}
                >
                    <span>{showRawCode ? 'Hide Context' : 'View Context'}</span>
                </button>
            </div>
        </div>

        {/* Slide-down Source Context Panel */}
        <div 
          className={`w-full border-t border-stone-800 bg-[#080808] transition-all duration-500 ease-in-out ${showRawCode ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="p-6 md:p-8 overflow-x-auto selectable-text">
            <div className="flex items-center justify-between mb-4 border-b border-stone-800 pb-2">
                <span className="text-[10px] font-mono text-stone-500 uppercase">File: {artifact.fileName}</span>
                <span className="text-[10px] font-mono text-stone-600 uppercase">Ln 12-24</span>
            </div>
            <pre className="font-mono text-xs md:text-sm leading-loose min-w-max">
              {artifact.rawCode.split('\n').map((line, i) => {
                 const isComment = line.trim().startsWith('//') || line.trim().startsWith('#') || line.trim().startsWith('--') || line.trim().startsWith('/*') || line.trim().startsWith('*');
                 return (
                    <div key={i} className={`flex ${isComment ? 'text-stone-400 italic bg-stone-900/30' : 'text-stone-600'}`}>
                        <span className="inline-block w-8 select-none text-stone-800 text-right mr-4 text-[10px] pt-1">{i + 1}</span>
                        <span className={isComment ? 'opacity-100' : 'opacity-70'}>{line}</span>
                    </div>
                 )
              })}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};