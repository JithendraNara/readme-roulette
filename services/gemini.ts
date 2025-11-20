
import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';
import { GeminiArtifactResponse } from '../types';
import { FALLBACK_ARTIFACTS } from '../constants';

export const fetchArtifact = async (): Promise<GeminiArtifactResponse> => {
  // STRATEGY 1: Firebase Cloud Function (Server-Side /assistant endpoint)
  // We strictly use the server to protect credentials and handle logic.
  if (functions) {
    try {
      // The backend endpoint is named 'assistant'
      const callAssistant = httpsCallable<void, any>(functions, 'assistant');
      
      const result = await callAssistant();
      const data = result.data;

      // Handle explicit backend errors
      if (data.error) {
        console.warn("Backend reported error:", data.message);
        throw new Error(data.message || "Backend internal error");
      }

      // Adapter: The backend returns 'quote', but the UI expects 'codeSnippet'.
      // We synthesize a code snippet so the 'View Context' feature works.
      if (data && data.quote) {
        const commentPrefix = (data.language || '').toLowerCase() === 'python' ? '#' : '//';
        
        return {
          repoName: data.repoName || 'unknown-repo',
          fileName: data.fileName || 'untitled',
          language: data.language || 'Text',
          // Construct a synthetic code snippet from the quote
          codeSnippet: `${commentPrefix} ${data.quote}`
        };
      }
      
      // If the backend returned the legacy format
      if (data && data.codeSnippet) {
        return data as GeminiArtifactResponse;
      }

    } catch (error: any) {
      console.warn("Server-side assistant unavailable (using offline fallback):", error.message);
    }
  } else {
    console.warn("Firebase functions not initialized. Skipping server call.");
  }

  // STRATEGY 2: Static Fallback (Offline Mode)
  // If the server is unreachable or returns an error, use the pre-written artifacts.
  // Client-side generation (API_KEY) has been removed for security.
  return FALLBACK_ARTIFACTS[Math.floor(Math.random() * FALLBACK_ARTIFACTS.length)];
};
