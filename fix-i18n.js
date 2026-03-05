const fs = require('fs');

const content = fs.readFileSync('messages/en.json', 'utf8');
const lines = content.split('\n');

const seenSections = new Set();
const cleaned = [];
const skip = new Set();
let depth = 0;
let braceDepth = 0;

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];

  if (skip.has(i)) continue;

  let inString = false;
  let escapeNext = false;
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if (escapeNext) {
      escapeNext = false;
      continue;
    }
    if (char === '\\\\') {
      escapeNext = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
    }
    if (!inString) {
      if (char === '{') braceDepth++;
      if (char === '}') braceDepth--;
    }
  }

  const sectionMatch = line.match(/^  "([^"]+)": \{$/);
  if (sectionMatch && braceDepth === 2) {
    const section = sectionMatch[1];
    if (seenSections.has(section)) {
      skip.add(i);
      let tempDepth = braceDepth;
      for (let j = i + 1; j < lines.length; j++) {
        skip.add(j);
        let lineInString = false;
        let lineEscape = false;
        for (let k = 0; k < lines[j].length; k++) {
          const ch = lines[j][k];
          if (lineEscape) {
            lineEscape = false;
            continue;
          }
          if (ch === '\\\\') {
            lineEscape = true;
            continue;
          }
          if (ch === '"') lineInString = !lineInString;
          if (!lineInString) {
            if (ch === '{') tempDepth++;
            if (ch === '}') {
              tempDepth--;
              if (tempDepth < 2) break;
            }
          }
        }
      }
      continue;
    }
    seenSections.add(section);
  }

  cleaned.push(line);
}

fs.writeFileSync('messages/en.json.cleaned', cleaned.join('\n'));
