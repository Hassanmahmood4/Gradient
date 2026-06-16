"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------------
   Lightweight Python syntax highlighter with an IDE-style line-number gutter.
   Tokenizes per line: keywords (violet), strings (green), numbers (amber),
   comments (faint), calls/builtins (coral). No dependency, runs client-side.
---------------------------------------------------------------------------- */

const KEYWORDS = new Set([
  "import", "from", "as", "for", "in", "while", "with", "def", "class",
  "return", "yield", "if", "elif", "else", "try", "except", "finally",
  "raise", "lambda", "pass", "break", "continue", "global", "nonlocal",
  "assert", "del", "not", "and", "or", "is", "await", "async",
]);
const CONSTANTS = new Set(["True", "False", "None", "self", "cls"]);
const BUILTINS = new Set([
  "print", "range", "len", "sum", "min", "max", "abs", "zip", "enumerate",
  "map", "filter", "sorted", "list", "dict", "set", "tuple", "int", "float",
  "str", "bool", "super", "round", "pow", "open",
]);

const TOKEN = /(#.*$)|("[^"]*"|'[^']*')|(\d+(?:\.\d+)?)|(@[A-Za-z_]\w*)|([A-Za-z_]\w*)/g;

function tokenize(line: string): ReactNode {
  const nodes: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(line))) {
    if (m.index > last) {
      nodes.push(
        <span key={`s${i}`} className="text-muted">
          {line.slice(last, m.index)}
        </span>,
      );
    }
    const [, comment, str, num, deco, word] = m;
    if (comment) {
      nodes.push(<span key={i} className="italic text-faint">{comment}</span>);
    } else if (str) {
      nodes.push(<span key={i} className="text-success">{str}</span>);
    } else if (num) {
      nodes.push(<span key={i} className="text-warning">{num}</span>);
    } else if (deco) {
      nodes.push(<span key={i} className="text-coral">{deco}</span>);
    } else if (word) {
      const isCall = /^\s*\(/.test(line.slice(TOKEN.lastIndex));
      const cls =
        KEYWORDS.has(word) || CONSTANTS.has(word)
          ? "text-violet"
          : BUILTINS.has(word) || isCall
            ? "text-coral"
            : "text-text";
      nodes.push(<span key={i} className={cls}>{word}</span>);
    }
    last = TOKEN.lastIndex;
    i++;
  }
  if (last < line.length) {
    nodes.push(
      <span key={`s${i}`} className="text-muted">
        {line.slice(last)}
      </span>,
    );
  }
  return nodes;
}

export function CodeBlock({
  source,
  className,
}: {
  source: string;
  className?: string;
}) {
  const lines = source.replace(/\n+$/, "").split("\n");
  const gutter = String(lines.length).length;

  return (
    <div className={cn("overflow-x-auto font-mono text-[0.8rem] leading-relaxed", className)}>
      <code className="block min-w-max">
        {lines.map((line, i) => (
          <span key={i} className="flex">
            <span
              aria-hidden
              className="shrink-0 select-none pr-4 text-right tabular-nums text-faint/50"
              style={{ minWidth: `${gutter + 1}ch` }}
            >
              {i + 1}
            </span>
            <span className="whitespace-pre">
              {line.length ? tokenize(line) : " "}
            </span>
          </span>
        ))}
      </code>
    </div>
  );
}
