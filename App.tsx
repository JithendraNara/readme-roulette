import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ArtifactDisplay } from './components/ArtifactDisplay';
import { Controls } from './components/Controls';
import { AboutModal } from './components/AboutModal';
import { HistoryModal } from './components/HistoryModal';
import { fetchArtifact } from './services/gemini';
import { CodeArtifact } from './types';
import { extractComment } from './utils/regex';
import { detectMood } from './utils/mood';
import { LOADING_MESSAGES } from './constants';

const MOOD_COLORS: Record<string, string> = {
  frustrated: '#6b5b4f',
  confused: '#4a5e7a',
  angry: '#7a2a2a',
  funny: '#3a6b3a',
  defeated: '#3a3a5a',
};

const App: React.FC = () => {
  const [currentArtifact, setCurrentArtifact] = useState<CodeArtifact | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>(LOADING_MESSAGES[0]);
 
  // Modal States
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Presentation Mode
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);
  const [presentationIndex, setPresentationIndex] = useState<number>(0);
  const presentationTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // History State
  const [history, setHistory] = useState<CodeArtifact[]>([]);

  // Presentation controls
  const startPresentation = useCallback((startIdx = 0) => {
    if (history.length === 0) return;
    setPresentationIndex(startIdx);
    setCurrentArtifact(history[startIdx]);
    setIsPresentationMode(true);
    // Auto-advance every 6 seconds
    if (presentationTimerRef.current) clearInterval(presentationTimerRef.current);
    presentationTimerRef.current = setInterval(() => {
      setPresentationIndex(prev => {
        const next = (prev + 1) % history.length;
        setCurrentArtifact(history[next]);
        return next;
      });
    }, 6000);
  }, [history]);

  const stopPresentation = useCallback(() => {
    if (presentationTimerRef.current) {
      clearInterval(presentationTimerRef.current);
      presentationTimerRef.current = null;
    }
    setIsPresentationMode(false);
  }, []);

  const presentationPrev = useCallback(() => {
    setPresentationIndex(prev => {
      const idx = (prev - 1 + history.length) % history.length;
      setCurrentArtifact(history[idx]);
      return idx;
    });
  }, [history]);

  const presentationNext = useCallback(() => {
    setPresentationIndex(prev => {
      const idx = (prev + 1) % history.length;
      setCurrentArtifact(history[idx]);
      return idx;
    });
  }, [history]);

  // Reset timer on manual navigation
  useEffect(() => {
    if (isPresentationMode) {
      if (presentationTimerRef.current) clearInterval(presentationTimerRef.current);
      presentationTimerRef.current = setInterval(() => {
        setPresentationIndex(prev => {
          const next = (prev + 1) % history.length;
          setCurrentArtifact(history[next]);
          return next;
        });
      }, 6000);
    }
    return () => {
      if (presentationTimerRef.current) clearInterval(presentationTimerRef.current);
    };
  }, [isPresentationMode, history.length]);

  // Load history from local storage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('readme_rouletter_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }, []);

  // Save history whenever it changes
  useEffect(() => {
    localStorage.setItem('readme_rouletter_history', JSON.stringify(history));
  }, [history]);

  const getRandomLoadingMessage = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * LOADING_MESSAGES.length);
    return LOADING_MESSAGES[randomIndex];
  }, []);

  const handleScan = useCallback(async () => {
    setIsLoading(true);
    // Cycle loading messages while fetching
    const msgInterval = setInterval(() => {
        setLoadingMessage(getRandomLoadingMessage());
    }, 800);

    try {
      const rawData = await fetchArtifact();
      
      const extracted = extractComment(rawData.codeSnippet);
      
      const newArtifact: CodeArtifact = {
        id: Math.random().toString(36).substring(7),
        repoName: rawData.repoName,
        fileName: rawData.fileName,
        language: rawData.language,
        rawCode: rawData.codeSnippet,
        extractedComment: extracted,
        mood: detectMood(extracted),
        timestamp: new Date().toISOString().split('T')[0]
      };

      setCurrentArtifact(newArtifact);
      
      // Add to history, limit to 50 items
      setHistory(prev => {
        const newHistory = [newArtifact, ...prev];
        return newHistory.slice(0, 50); 
      });

    } catch (error) {
      console.error("Failed to scan:", error);
    } finally {
      clearInterval(msgInterval);
      setIsLoading(false);
    }
  }, [getRandomLoadingMessage]);

  // Initial scan on mount if no history or just to start fresh
  useEffect(() => {
    // Optionally check if we have history to show last item, but for now let's just scan fresh
    handleScan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectFromHistory = (artifact: CodeArtifact) => {
    setCurrentArtifact(artifact);
    setIsHistoryOpen(false);
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to delete all archived discoveries?")) {
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-museum-black overflow-hidden relative selection:bg-stone-700 selection:text-museum-paper">
        
        <Header 
          onOpenAbout={() => setIsAboutOpen(true)} 
          onOpenHistory={() => setIsHistoryOpen(true)}
        />

        <main className="flex-grow flex flex-col items-center justify-center relative z-10 w-full max-w-6xl mx-auto px-4">
            <ArtifactDisplay 
                artifact={currentArtifact} 
                isLoading={isLoading} 
                loadingMessage={loadingMessage}
            />
        </main>

        <Controls onScan={handleScan} isLoading={isLoading} onStartPresentation={() => startPresentation(0)} historyCount={history.length} />

        {/* Subtle Fixed Footer Credit */}
        <div className="absolute bottom-2 right-4 z-20 hidden md:block">
           <span className="text-[10px] font-mono text-stone-800 uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity cursor-default">
             Archived by Jithsss
           </span>
        </div>
        
        <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
        
        <HistoryModal 
          isOpen={isHistoryOpen} 
          onClose={() => setIsHistoryOpen(false)}
          history={history}
          onSelectArtifact={handleSelectFromHistory}
          onClearHistory={handleClearHistory}
        />

        {/* ─── Presentation Mode Overlay ─── */}
        {isPresentationMode && (
          <div
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center cursor-none"
            onClick={stopPresentation}
          >
            {/* Main artifact display in fullscreen */}
            <div className="flex-grow flex flex-col items-center justify-center w-full max-w-5xl px-8">
              <div className="relative w-full bg-[#050505] border border-stone-800 shadow-[0_0_80px_-10px_rgba(0,0,0,0.9)] rounded-sm overflow-hidden">
                {/* Corner brackets */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-stone-600 opacity-50"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-stone-600 opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-stone-600 opacity-50"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-stone-600 opacity-50"></div>

                <div className="relative z-10 p-16 flex flex-col items-center">
                  {/* Quote mark */}
                  <div className="text-8xl font-serif text-stone-700/30 select-none">"</div>

                  {/* Artifact quote */}
                  <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif leading-tight text-[#fffef5] text-center drop-shadow-[0_0_15px_rgba(242,238,203,0.15)] selection:bg-stone-700 selection:text-white">
                    {currentArtifact?.extractedComment}
                  </p>

                  {/* Closing quote */}
                  <div className="text-8xl font-serif text-stone-700/30 mt-6 transform rotate-180 select-none">"</div>

                  {/* Mood badge */}
                  {currentArtifact && (
                    <div className="mt-4 mb-2">
                      <span
                        className="px-3 py-1 rounded-sm text-[10px] font-mono uppercase tracking-[0.2em]"
                        style={{
                          backgroundColor: MOOD_COLORS[currentArtifact.mood] || '#3a3a3a',
                          color: '#f2eecb',
                        }}
                      >
                        {currentArtifact.mood}
                      </span>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs font-mono text-stone-500 tracking-widest uppercase border-t border-stone-900 pt-6 w-full opacity-70">
                    <span>{currentArtifact?.repoName}</span>
                    <span className="text-stone-800">•</span>
                    <span>{currentArtifact?.language}</span>
                    <span className="text-stone-800">•</span>
                    <span>{currentArtifact?.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Presentation controls */}
            <div className="flex items-center gap-8 p-6 z-10">
              <button
                onClick={(e) => { e.stopPropagation(); presentationPrev(); }}
                className="text-stone-600 hover:text-museum-paper transition-colors px-4 py-2 border border-stone-800 hover:border-stone-500 rounded-sm"
              >
                ← Prev
              </button>

              <div className="flex items-center gap-3">
                <span className="text-stone-600 font-mono text-xs">
                  {presentationIndex + 1} / {history.length}
                </span>
                <div className="flex gap-1">
                  {history.map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${i === presentationIndex ? 'bg-museum-paper' : 'bg-stone-700'}`}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); presentationNext(); }}
                className="text-stone-600 hover:text-museum-paper transition-colors px-4 py-2 border border-stone-800 hover:border-stone-500 rounded-sm"
              >
                Next →
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); stopPresentation(); }}
                className="text-stone-700 hover:text-stone-400 transition-colors px-4 py-2 text-xs font-mono uppercase tracking-widest"
              >
                Exit [ESC]
              </button>
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 h-[2px] bg-museum-paper/30 w-full">
              <div
                className="h-full bg-museum-paper/60 transition-all duration-1000"
                style={{ width: `${((presentationIndex + 1) / history.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Background Texture/Noise overlay */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>
  );
};

export default App;