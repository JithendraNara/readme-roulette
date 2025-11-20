export interface CodeArtifact {
  id: string;
  repoName: string;
  fileName: string;
  language: string;
  rawCode: string;
  extractedComment: string;
  mood: 'frustrated' | 'confused' | 'angry' | 'funny' | 'defeated';
  timestamp: string;
}

export interface GeminiArtifactResponse {
  repoName: string;
  fileName: string;
  language: string;
  codeSnippet: string; // This contains both code and comments
}
