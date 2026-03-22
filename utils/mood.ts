/**
 * Detects the emotional mood of a developer from their comment text.
 * Returns one of: 'angry' | 'confused' | 'funny' | 'defeated' | 'frustrated'
 */
export type Mood = 'frustrated' | 'confused' | 'angry' | 'funny' | 'defeated';

const MOOD_PATTERNS: Record<Mood, RegExp[]> = {
  angry: [
    /\bf(u|uck|ucking|ucker)\b/i,
    /\bshit\b/i,
    /\bdamnit?\b/i,
    /\bhate\s+(this|it|you|them|everything)/i,
    /\bdie\b/i,
    /\bkill\s+(me|this|it)/i,
    /\b(lose|lost)\s+(my|mind|brain)/i,
    /\bworst\b.*\bever\b/i,
    /\bwhy\s+the\s+(fuck|hell)\b/i,
    /\bget\s+out\b.*\bhere\b/i,
  ],
  funny: [
    /magic\s+number/i,
    /random\.choice/i,
    /\bdream\b/i,
    /contractor.*disappeared/i,
    /disappeared.*contractor/i,
    /\bAI\s+powered\b/i,
    /\bfor\s+now\b.*\bmarketing\b/i,
    /\bmaybe\s+it.*works\b/i,
    /don'?t\s+ask\b/i,
    /\bno\s+one\s+knows\b/i,
    /if\s+.*\s+works.*\s+don'?t\s+touch/i,
    /it\s+just\s+works/i,
    /black\s*magic/i,
    /voodoo/i,
    /dark\s+magic/i,
  ],
  confused: [
    /\bwhy\s+(does|is|doesn?'?t|the)\b/i,
    /\bhow\s+(does|do|is|can|can'?t)\b/i,
    /\bwhat\s+(the\s+hell|is|are|does)\b/i,
    /\?{3,}/,
    /\bnobody\s+(knows|understands)/i,
    /no\s+idea\b/i,
    /\bcan'?t\s+(figure|remember|explain)/i,
    /\bassume?s?\b.*\s*(doesn|don)?'?t\s+(know|work)/i,
    /\bhow\s+the\s+hell?\b/i,
    /\bwho\s+(the\s+heck|knows)/i,
    /\bthis\s+shouldn?'?t\s+work\b/i,
  ],
  defeated: [
    /\bquit\b/i,
    /\babandon(ed|ing)?\b/i,
    /\bborrow\s+checker\b/i,
    /\bimpossible\b/i,
    /\bcan'?t\s+fix\b/i,
    /\bgive\s+up\b/i,
    /\beye\b.*\s*brow\b/i,
    /\bdrink\s+(from|through)\b/i,
    /\bgoing\s+to\s+(get|make)\b.*\s*bail\b/i,
    /\bself\s+destruct\b/i,
    /\bthis\s+(code|file|project)\s+(is\s+)?done\b/i,
    /\bjust\s+want\s+to\s+go\s+home\b/i,
    /\bsomeone\s+else[.!?]\b/i,
  ],
  frustrated: [
    /\bTODO\b/i,
    /\bFIXME\b/i,
    /\bHACK\b/i,
    /\bWORKAROUND\b/i,
    /\btemporary\b/i,
    /\bbroken\b/i,
    /\bdoesn'?t\s+work\b/i,
    /\bfix\s+later\b/i,
    /\bclean\s+up\b/i,
    /\brefactor\b/i,
    /\bnarrator.*didn'?t\b/i,
    /\bDEPLOY/i,
    /\bdemo\s+tomorrow\b/i,
    /\bdo\s+not\s+merge\b/i,
    /\bby\s+a\s+contractor\b/i,
    /\bcontractor\b.*\b2012\b/i,
    /\b(I|we)?\s*don'?t\s+(know|understand|remember)/i,
    /\bwho\s+wrote\s+this\b/i,
    /\bblame\b/i,
    /\bnot\s+my\s+(fault|problem|job)\b/i,
  ],
};

// Higher = stronger emotion for tie-breaking
const MOOD_PRIORITY: Record<Mood, number> = {
  angry: 5,
  funny: 4,
  confused: 3,
  defeated: 2,
  frustrated: 1,
};

export function detectMood(comment: string): Mood {
  const scores: Record<Mood, number> = {
    frustrated: 0,
    confused: 0,
    angry: 0,
    funny: 0,
    defeated: 0,
  };

  for (const [mood, patterns] of Object.entries(MOOD_PATTERNS) as [Mood, RegExp[]][]) {
    for (const pattern of patterns) {
      if (pattern.test(comment)) {
        scores[mood] += 1;
      }
    }
  }

  let bestMood: Mood = 'frustrated';
  let bestScore = 0;

  for (const [mood, score] of Object.entries(scores) as [Mood, number][]) {
    if (score > bestScore) {
      bestScore = score;
      bestMood = mood;
    } else if (score === bestScore && score > 0) {
      if (MOOD_PRIORITY[mood] > MOOD_PRIORITY[bestMood]) {
        bestMood = mood;
      }
    }
  }

  return bestMood;
}
