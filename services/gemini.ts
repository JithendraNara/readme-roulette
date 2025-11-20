
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiArtifactResponse } from '../types';
import { FALLBACK_ARTIFACTS } from '../constants';

// Initialize Gemini Client
// Note: process.env.API_KEY is guaranteed to be available by the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchArtifact = async (): Promise<GeminiArtifactResponse> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const prompt = `
      You are a digital archaeologist scanning the 'Untitled' and 'test' repositories of GitHub. 
      Generate a single raw code snippet (approx 5-10 lines) that contains a funny, frustrated, bizarre, or desperate comment left by a developer. 
      
      The comment is the most important part. It should express typical developer emotions: confusion, anger at legacy code, sleep deprivation, or accidental success.
      The code surrounding it should look realistic for the language chosen.

      Examples of vibes:
      - "// I am not proud of this, but it works."
      - "# FIXME: This assumes the user isn't an idiot."
      - "// logic stolen from stackoverflow, thread #29384"
      - "// Dear maintainer: Once you are done trying to 'optimize' this routine, and have realized what a terrible mistake that was, please increment the following counter as a warning to the next guy: total_hours_wasted_here = 42"

      Output must be valid JSON.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            repoName: { type: Type.STRING },
            fileName: { type: Type.STRING },
            language: { type: Type.STRING },
            codeSnippet: { type: Type.STRING },
          },
          required: ["repoName", "fileName", "language", "codeSnippet"]
        },
        temperature: 1.2, // High temperature for variety and chaos
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");
    
    return JSON.parse(text) as GeminiArtifactResponse;

  } catch (error: any) {
    // Handle rate limiting specifically to provide a better UX
    // Check for various forms of quota errors (HTTP 429, RESOURCE_EXHAUSTED, etc.)
    const isQuotaError = 
      error?.status === 429 || 
      error?.code === 429 ||
      (error?.message && (
        error.message.includes('429') || 
        error.message.includes('quota') || 
        error.message.includes('RESOURCE_EXHAUSTED')
      ));

    if (isQuotaError) {
      console.warn("Quota exceeded. Switching to offline archaeological archives.");
    } else {
      // Only log actual crashes as errors
      console.error("Archaeology failed:", error);
    }
    
    // Return a random fallback artifact to keep the experience alive and varied
    return FALLBACK_ARTIFACTS[Math.floor(Math.random() * FALLBACK_ARTIFACTS.length)];
  }
};
