export type SplitWord = {
  word: string;
  trailingSpace: boolean;
};

export function splitWords(text: string): SplitWord[] {
  const parts = text.split(/\s+/).filter(Boolean);
  return parts.map((part, index) => ({
    word: part,
    trailingSpace: index < parts.length - 1,
  }));
}

export function splitLines(text: string): string[] {
  return text.split(/\r?\n/).filter((line) => line.trim().length > 0);
}