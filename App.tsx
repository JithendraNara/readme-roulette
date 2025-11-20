import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ArtifactDisplay } from './components/ArtifactDisplay';
import { Controls } from './components/Controls';
import { AboutModal } from './components/AboutModal';
import { HistoryModal } from './components/HistoryModal';
import { fetchArtifact } from './services/gemini';
import { CodeArtifact } from './types';
import { extractComment } from './utils/regex';
import { LOADING_MESSAGES } from './constants';

const App: React.FC = () => {
  const [currentArtifact, setCurrentArtifact] = useState<CodeArtifact | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>(LOADING_MESSAGES[0]);
  
  // Modal States
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // History State
  const [history, setHistory] = useState<CodeArtifact[]>([]);

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
        mood: 'frustrated', 
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

        <Controls onScan={handleScan} isLoading={isLoading} />

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

        {/* Background Texture/Noise overlay */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>
  );
};

export default App;