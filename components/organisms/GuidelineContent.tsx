"use client";

import React from "react";
import { mockGuides, GuideSpec } from "../data/mockComponents";
import { BookIcon, InfoIcon } from "../atoms/Icons";

interface GuidelineContentProps {
  guideId: string;
}

export const GuidelineContent = ({ guideId }: GuidelineContentProps) => {
  const guide = mockGuides.find((g) => g.id === guideId);

  if (!guide) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <InfoIcon className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mb-3" />
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Guide Not Found
        </h3>
        <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1 max-w-xs">
          Please select a valid developer guide from the sidebar.
        </p>
      </div>
    );
  }

  // A very lightweight, robust markdown-like formatter for our mock data
  const renderFormattedContent = (text: string) => {
    const lines = text.split("\n");
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];
    let codeBlockLang = "";

    const renderedElements: React.ReactNode[] = [];

    lines.forEach((line, index) => {
      // Handle code block boundaries
      if (line.trim().startsWith("```")) {
        if (inCodeBlock) {
          // Close code block
          inCodeBlock = false;
          renderedElements.push(
            <pre
              key={`code-${index}`}
              className="my-5 p-4 rounded-xl bg-zinc-950 border border-zinc-900 overflow-x-auto text-xs font-mono text-zinc-300 leading-relaxed text-left"
            >
              <code>{codeBlockContent.join("\n")}</code>
            </pre>
          );
          codeBlockContent = [];
        } else {
          // Open code block
          inCodeBlock = true;
          codeBlockLang = line.trim().slice(3);
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      // Handle normal line parsing
      const trimmed = line.trim();

      // Empty lines
      if (!trimmed) {
        return;
      }

      // H1 Header (# Title)
      if (line.startsWith("# ")) {
        renderedElements.push(
          <h1
            id={trimmed.replace("# ", "").toLowerCase().replace(/\s+/g, "-")}
            key={`h1-${index}`}
            className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-6 scroll-mt-20 text-left"
          >
            {line.slice(2)}
          </h1>
        );
        return;
      }

      // H2 Header (## Title)
      if (line.startsWith("## ")) {
        renderedElements.push(
          <h2
            id={trimmed.replace("## ", "").toLowerCase().replace(/\s+/g, "-")}
            key={`h2-${index}`}
            className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mt-8 mb-4 scroll-mt-20 text-left"
          >
            {line.slice(3)}
          </h2>
        );
        return;
      }

      // H3 Header (### Title)
      if (line.startsWith("### ")) {
        renderedElements.push(
          <h3
            id={trimmed.replace("### ", "").toLowerCase().replace(/\s+/g, "-")}
            key={`h3-${index}`}
            className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mt-6 mb-3 scroll-mt-20 text-left"
          >
            {line.slice(4)}
          </h3>
        );
        return;
      }

      // List item (* or -)
      if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
        const contentStr = trimmed.slice(2);
        renderedElements.push(
          <ul key={`ul-${index}`} className="list-disc pl-5 my-2 text-zinc-600 dark:text-zinc-400 text-left">
            <li className="text-sm leading-relaxed">
              {parseInlineStyles(contentStr)}
            </li>
          </ul>
        );
        return;
      }

      // Default paragraph
      renderedElements.push(
        <p key={`p-${index}`} className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 my-3 text-left">
          {parseInlineStyles(line)}
        </p>
      );
    });

    return renderedElements;
  };

  // Helper to parse inline bold and inline code highlights
  const parseInlineStyles = (text: string) => {
    // Basic regex styling for `code` and **bold**
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-bold text-zinc-950 dark:text-zinc-50">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-200 font-mono text-[13px] border border-zinc-200/50 dark:border-zinc-700/50"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <article className="prose prose-zinc dark:prose-invert max-w-3xl w-full">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
        <BookIcon size={14} />
        <span>Developer Guide</span>
      </div>
      <div>{renderFormattedContent(guide.content)}</div>
    </article>
  );
};
