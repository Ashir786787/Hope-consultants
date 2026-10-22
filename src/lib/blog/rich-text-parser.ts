export type InlineToken =
  | { type: "text"; value: string }
  | { type: "strong"; children: InlineToken[] }
  | { type: "em"; children: InlineToken[] }
  | { type: "strike"; children: InlineToken[] }
  | { type: "underline"; children: InlineToken[] }
  | { type: "link"; href: string; children: InlineToken[] };

export type RichTextBlock =
  | { kind: "heading"; level: number; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "list"; ordered: boolean; items: string[] }
  | { kind: "quote"; text: string }
  | { kind: "rule" }
  | { kind: "code"; text: string };

const HEADING_PATTERN = /^(#{1,6})\s+(.*)$/;
const UNORDERED_PATTERN = /^[-*+]\s+(.*)$/;
const ORDERED_PATTERN = /^\d+[.)]\s+(.*)$/;
const QUOTE_PATTERN = /^>\s?(.*)$/;
const RULE_PATTERN = /^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/;
const FENCE_PATTERN = /^\s*```/;

const INLINE_SOURCE =
  "(\\*\\*|__)(?=\\S)([\\s\\S]*?\\S)\\1|(\\*|_)(?=\\S)([\\s\\S]*?\\S)\\3|(~~)(?=\\S)([\\s\\S]*?\\S)\\5|<u>([\\s\\S]*?)<\\/u>|\\[([^\\]\\n]*)\\]\\(([^)\\s]+)\\)";

export function safeHref(url: string): string | null {
  const value = url.trim();
  if (value.length === 0) return null;
  if (value.startsWith("/")) return value;
  if (/^https?:\/\//i.test(value)) return value;
  if (/^mailto:/i.test(value)) return value;
  if (/^tel:/i.test(value)) return value;
  return null;
}

function parseInline(text: string): InlineToken[] {
  const pattern = new RegExp(INLINE_SOURCE, "g");
  const tokens: InlineToken[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }
    if (match[1]) {
      tokens.push({ type: "strong", children: parseInline(match[2]) });
    } else if (match[3]) {
      tokens.push({ type: "em", children: parseInline(match[4]) });
    } else if (match[5]) {
      tokens.push({ type: "strike", children: parseInline(match[6]) });
    } else if (match[7] !== undefined) {
      tokens.push({ type: "underline", children: parseInline(match[7]) });
    } else if (match[8] !== undefined) {
      const href = safeHref(match[9]);
      if (href) {
        tokens.push({ type: "link", href, children: parseInline(match[8]) });
      } else {
        tokens.push({ type: "text", value: match[8] });
      }
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    tokens.push({ type: "text", value: text.slice(lastIndex) });
  }
  return tokens;
}

export function parseInlineTokens(text: string): InlineToken[] {
  return parseInline(text);
}

export function parseRichTextBlocks(content: string): RichTextBlock[] {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: RichTextBlock[] = [];
  const paragraph: string[] = [];
  const quote: string[] = [];
  const listItems: string[] = [];
  const codeLines: string[] = [];
  let listOrdered = false;
  let inCode = false;

  function flushParagraph() {
    if (paragraph.length === 0) return;
    blocks.push({ kind: "paragraph", text: paragraph.join(" ").trim() });
    paragraph.length = 0;
  }

  function flushQuote() {
    if (quote.length === 0) return;
    blocks.push({ kind: "quote", text: quote.join(" ").trim() });
    quote.length = 0;
  }

  function flushList() {
    if (listItems.length === 0) return;
    blocks.push({ kind: "list", ordered: listOrdered, items: listItems.slice() });
    listItems.length = 0;
  }

  function flushAll() {
    flushParagraph();
    flushQuote();
    flushList();
  }

  for (const line of lines) {
    if (FENCE_PATTERN.test(line)) {
      if (inCode) {
        blocks.push({ kind: "code", text: codeLines.join("\n") });
        codeLines.length = 0;
        inCode = false;
      } else {
        flushAll();
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    if (line.trim().length === 0) {
      flushAll();
      continue;
    }

    const heading = line.match(HEADING_PATTERN);
    if (heading) {
      flushAll();
      blocks.push({
        kind: "heading",
        level: heading[1].length,
        text: heading[2].trim(),
      });
      continue;
    }

    if (RULE_PATTERN.test(line)) {
      flushAll();
      blocks.push({ kind: "rule" });
      continue;
    }

    const quoted = line.match(QUOTE_PATTERN);
    if (quoted) {
      flushParagraph();
      flushList();
      quote.push(quoted[1]);
      continue;
    }

    const unordered = line.match(UNORDERED_PATTERN);
    if (unordered) {
      flushParagraph();
      flushQuote();
      if (listItems.length > 0 && listOrdered) flushList();
      listOrdered = false;
      listItems.push(unordered[1]);
      continue;
    }

    const ordered = line.match(ORDERED_PATTERN);
    if (ordered) {
      flushParagraph();
      flushQuote();
      if (listItems.length > 0 && !listOrdered) flushList();
      listOrdered = true;
      listItems.push(ordered[1]);
      continue;
    }

    flushQuote();
    flushList();
    paragraph.push(line.trim());
  }

  flushAll();
  if (inCode && codeLines.length > 0) {
    blocks.push({ kind: "code", text: codeLines.join("\n") });
  }
  return blocks;
}

export function richTextToPlainText(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^\d+[.)]\s+/gm, "")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/~~(.*?)~~/g, "$1")
    .replace(/<\/?u>/g, "")
    .replace(/\[([^\]]*)\]\(([^)]*)\)/g, "$1")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{2,}/g, "\n\n")
    .trim();
}
