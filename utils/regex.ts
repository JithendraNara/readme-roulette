/**
 * Extracts the most significant comment from a code snippet.
 * It prioritizes single line comments (//, #, --) and block comments.
 * It strips the code symbols to leave just the text.
 */
export const extractComment = (code: string): string => {
  if (!code) return "No comment found in the void.";

  const lines = code.split('\n');
  const comments: string[] = [];

  // Regex for different comment types
  // Group 1 is usually the content
  const doubleSlash = /\/\/\s*(.*)/;
  const hash = /#\s*(.*)/;
  const dashDash = /--\s*(.*)/; // SQL, Lua, Haskell
  const multiLineStart = /\/\*+/;
  const multiLineEnd = /\*\//;

  let insideMultiLine = false;
  let multiLineBuffer = '';

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Handle C-style block comments /* ... */
    if (insideMultiLine) {
        if (multiLineEnd.test(trimmed)) {
            const parts = trimmed.split('*/');
            multiLineBuffer += ' ' + parts[0].replace(/\*/g, '').trim();
            comments.push(multiLineBuffer);
            insideMultiLine = false;
            multiLineBuffer = '';
        } else {
             multiLineBuffer += ' ' + trimmed.replace(/\*/g, '').trim();
        }
        continue;
    }

    if (multiLineStart.test(trimmed)) {
        const parts = trimmed.split('/*');
        // Check if it ends on same line
        if (multiLineEnd.test(parts[1])) {
            const content = parts[1].split('*/')[0];
            comments.push(content.replace(/\*/g, '').trim());
        } else {
            insideMultiLine = true;
            multiLineBuffer = parts[1].replace(/\*/g, '').trim();
        }
        continue;
    }

    // Handle Line Comments
    const slashMatch = doubleSlash.exec(trimmed);
    if (slashMatch) {
      comments.push(slashMatch[1].trim());
      continue;
    }

    const hashMatch = hash.exec(trimmed);
    if (hashMatch) {
        comments.push(hashMatch[1].trim());
        continue;
    }

    const dashMatch = dashDash.exec(trimmed);
    if (dashMatch) {
        comments.push(dashMatch[1].trim());
        continue;
    }
  }

  // Filter out empty or purely structural comments (like "-------")
  const validComments = comments.filter(c => c.length > 3 && /[a-zA-Z]/.test(c));

  if (validComments.length === 0) return "Silence...";

  // Return the longest comment found, as it's likely the most expressive "rant"
  return validComments.reduce((a, b) => a.length > b.length ? a : b);
};
