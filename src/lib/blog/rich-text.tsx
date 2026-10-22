import type { ReactNode } from "react";
import {
  type InlineToken,
  type RichTextBlock,
  parseRichTextBlocks,
  parseInlineTokens,
} from "@/lib/blog/rich-text-parser";

const HEADING_TAGS = ["h2", "h3", "h4", "h5", "h6"] as const;

const HEADING_CLASSES = [
  "font-display text-2xl font-bold tracking-tight text-hope-midnight",
  "font-display text-xl font-bold text-hope-midnight",
  "font-display text-lg font-semibold text-hope-midnight",
  "font-display text-base font-semibold text-hope-midnight",
  "font-display text-sm font-semibold text-hope-midnight",
];

function renderTokens(tokens: InlineToken[], keyPrefix: string): ReactNode[] {
  return tokens.map((token, index) => {
    const key = `${keyPrefix}-${index}`;
    if (token.type === "text") return <span key={key}>{token.value}</span>;
    if (token.type === "strong") {
      return (
        <strong key={key} className="font-bold text-hope-midnight">
          {renderTokens(token.children, key)}
        </strong>
      );
    }
    if (token.type === "em") {
      return (
        <em key={key} className="italic">
          {renderTokens(token.children, key)}
        </em>
      );
    }
    if (token.type === "strike") {
      return (
        <s key={key} className="text-hope-fog line-through">
          {renderTokens(token.children, key)}
        </s>
      );
    }
    if (token.type === "underline") {
      return (
        <u key={key} className="decoration-hope-ember decoration-2 underline-offset-4">
          {renderTokens(token.children, key)}
        </u>
      );
    }
    return (
      <a
        key={key}
        href={token.href}
        className="font-semibold text-hope-midnight decoration-hope-ember decoration-2 underline-offset-4"
      >
        {renderTokens(token.children, key)}
      </a>
    );
  });
}

function renderBlock(block: RichTextBlock, index: number): ReactNode {
  const key = `block-${index}`;
  if (block.kind === "heading") {
    const level = Math.min(block.level, HEADING_TAGS.length) - 1;
    const Tag = HEADING_TAGS[level];
    return (
      <Tag className={`mt-10 first:mt-0 ${HEADING_CLASSES[level]}`}>
        {renderTokens(parseInlineTokens(block.text), key)}
      </Tag>
    );
  }
  if (block.kind === "paragraph") {
    return (
      <p key={key} className="mt-4 first:mt-0 text-base leading-8 text-muted-foreground">
        {renderTokens(parseInlineTokens(block.text), key)}
      </p>
    );
  }
  if (block.kind === "list") {
    const items = block.items.map((item, itemIndex) => (
      <li key={`${key}-${itemIndex}`} className="text-base leading-8 text-muted-foreground">
        {renderTokens(parseInlineTokens(item), `${key}-${itemIndex}`)}
      </li>
    ));
    if (block.ordered) {
      return (
        <ol
          key={key}
          className="mt-4 list-decimal space-y-1 pl-6 marker:font-bold marker:text-hope-ember"
        >
          {items}
        </ol>
      );
    }
    return (
      <ul key={key} className="mt-4 list-disc space-y-1 pl-6 marker:font-bold marker:text-hope-ember">
        {items}
      </ul>
    );
  }
  if (block.kind === "quote") {
    return (
      <blockquote
        key={key}
        className="mt-6 border-l-2 border-hope-ember pl-5 text-base leading-8 text-hope-midnight italic"
      >
        {renderTokens(parseInlineTokens(block.text), key)}
      </blockquote>
    );
  }
  if (block.kind === "rule") {
    return <hr key={key} className="mt-8 border-hope-midnight/10" />;
  }
  return (
    <pre
      key={key}
      className="mt-6 overflow-x-auto rounded-2xl bg-hope-midnight/5 p-4 font-mono text-sm leading-6 text-hope-midnight"
    >
      <code>{block.text}</code>
    </pre>
  );
}

export function RichText({ content, className }: { content: string; className?: string }) {
  const blocks = parseRichTextBlocks(content);
  if (blocks.length === 0) {
    return <div className={className} />;
  }
  return (
    <div className={className}>
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
}
