/**
 * README Parser
 * Extracts a notable "quoteable" section from README markdown.
 * Prioritizes sections that sound like authentic developer voice —
 * tagline, philosophy, or standout description lines.
 */

export interface ParsedReadme {
  /** The extracted notable section — short, punchy, quoteable */
  excerpt: string;
  /** The full README raw markdown (for "View Context") */
  fullMarkdown: string;
  /** The repo description from the API */
  repoDescription: string;
  /** Primary language */
  language: string;
}

/**
 * Given a raw README markdown string, extract a compelling excerpt.
 * Strategy:
 * 1. Look for a compelling tagline in the first paragraph
 * 2. Look for ## About / ## Overview sections
 * 3. Look for bolded/emphasized standalone lines
 * 4. Fall back to first substantial paragraph
 * 5. Fall back to first 200 chars with cleanup
 */
export function extractExcerpt(markdown: string, repoDescription: string): string {
  if (!markdown) return repoDescription || 'No description available.';

  // Split into lines and strip markdown syntax
  const lines = markdown.split('\n');

  // ─── Strategy 1: First line if it's short and punchy (like a tagline) ───
  const firstLine = lines[0]?.replace(/^#+\s*/, '').replace(/\*\*/g, '').replace(/\*/g, '').replace(/`/g, '').trim();
  if (firstLine && firstLine.length > 10 && firstLine.length < 120 && !firstLine.includes('http')) {
    // Check it doesn't look like a code block or table
    if (!firstLine.startsWith('```') && !firstLine.startsWith('|') && !firstLine.startsWith('-')) {
      return firstLine;
    }
  }

  // ─── Strategy 2: Look for ## About / ## Overview / ## What is this ───
  const sectionHeaders = ['about', 'overview', 'what', 'introduction', 'description', 'summary', 'why'];
  for (const line of lines) {
    const stripped = line.trim();
    const lower = stripped.toLowerCase();
    if (sectionHeaders.some((h) => lower.startsWith(`## ${h}`) || lower.startsWith(`## ${h} `))) {
      const contentLines: string[] = [];
      const idx = lines.indexOf(line);
      for (let i = idx + 1; i < lines.length; i++) {
        const next = lines[i];
        if (next.trim().startsWith('##')) break;
        const clean = next.replace(/^#+\s*/, '').replace(/\*\*/g, '').replace(/\*/g, '').replace(/`/g, '').trim();
        if (clean && !clean.startsWith('|') && !clean.startsWith('```') && clean.length > 10) {
          contentLines.push(clean);
          if (contentLines.join(' ').length > 150) break;
        }
      }
      if (contentLines.length > 0) {
        return contentLines.join(' ').slice(0, 300);
      }
    }
  }

  // ─── Strategy 3: Find emphasized standalone lines (bold text that's a sentence) ───
  const boldLines: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    // Match **some meaningful text** that's a standalone sentence
    const match = trimmed.match(/^\*\*([^*]{20,150})\*\*$/);
    if (match) {
      const text = match[1].replace(/\*\*/g, '');
      if (!text.includes('http') && /[.!?]$/.test(text)) {
        boldLines.push(text);
      }
    }
  }
  if (boldLines.length > 0) {
    return boldLines[Math.floor(Math.random() * boldLines.length)];
  }

  // ─── Strategy 4: First substantial paragraph ───
  let paragraph = '';
  for (const line of lines) {
    const stripped = line.replace(/^#+\s*/, '').replace(/\*\*/g, '').replace(/\*/g, '').replace(/`/g, '').trim();
    if (stripped.length > 30 && !stripped.startsWith('|') && !stripped.startsWith('-') && !stripped.startsWith('```') && !stripped.startsWith('!') && !stripped.startsWith('[')) {
      paragraph += ' ' + stripped;
      if (paragraph.length > 200) break;
    }
  }
  if (paragraph.trim().length > 20) {
    return paragraph.trim().slice(0, 300);
  }

  // ─── Strategy 5: Fallback to repo description ───
  return repoDescription || 'An artifact from the digital archaeology archives.';
}

/**
 * Strip heavy markdown formatting for display, keeping it readable.
 */
export function cleanMarkdownForDisplay(markdown: string): string {
  return markdown
    .replace(/#{1,6}\s/g, '')       // headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // bold
    .replace(/\*(.*?)\*/g, '$1')     // italic
    .replace(/`(.*?)`/g, '$1')       // inline code
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // links
    .replace(/!\[(.*?)\]\(.*?\)/g, '$1') // images
    .replace(/^[-*+]\s/gm, '')       // list items
    .replace(/^>\s/gm, '')          // blockquotes
    .replace(/```[\s\S]*?```/g, '')  // code blocks
    .replace(/\n{3,}/g, '\n\n')      // extra newlines
    .trim();
}
