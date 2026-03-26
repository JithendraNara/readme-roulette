export interface CodeArtifact {
  id: string;
  repoName: string;
  fileName: string;
  language: string;
  rawCode: string;
  extractedComment: string;
  mood: 'frustrated' | 'confused' | 'angry' | 'funny' | 'defeated';
  timestamp: string;
  // Extended fields for GitHub Trending mode
  readmeUrl?: string;
  readmeRaw?: string;
  stars?: number;
  forks?: number;
  author?: string;
  repoUrl?: string;
}

export interface GeminiArtifactResponse {
  repoName: string;
  fileName: string;
  language: string;
  codeSnippet: string; // This contains both code and comments
}

export type ArtifactMode = 'ai' | 'trending';

export interface Language {
  urlParam: string;
  name: string;
}
