"use client";

import React, { useEffect, useState } from "react";
import { mockGuides, mockComponents } from "../data/mockComponents";

interface TocProps {
  type: "component" | "guide";
  contentId: string;
}

interface TocItem {
  id: string;
  label: string;
  level: number;
}

export const Toc = ({ type, contentId }: TocProps) => {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (type === "component") {
      setItems([
        { id: "overview", label: "Overview", level: 1 },
        { id: "preview", label: "Interactive Preview", level: 1 },
        { id: "props", label: "Props API", level: 1 },
        { id: "usage", label: "Copy Code", level: 1 }
      ]);
    } else if (type === "guide") {
      const guide = mockGuides.find((g) => g.id === contentId);
      if (guide) {
        // Parse headers from the guide content
        const lines = guide.content.split("\n");
        const headers: TocItem[] = [];

        lines.forEach((line) => {
          const trimmed = line.trim();
          if (trimmed.startsWith("# ")) {
            const label = trimmed.slice(2);
            headers.push({
              id: label.toLowerCase().replace(/\s+/g, "-"),
              label,
              level: 1
            });
          } else if (trimmed.startsWith("## ")) {
            const label = trimmed.slice(3);
            headers.push({
              id: label.toLowerCase().replace(/\s+/g, "-"),
              label,
              level: 2
            });
          } else if (trimmed.startsWith("### ")) {
            const label = trimmed.slice(4);
            headers.push({
              id: label.toLowerCase().replace(/\s+/g, "-"),
              label,
              level: 3
            });
          }
        });
        setItems(headers);
      }
    }
  }, [type, contentId]);

  // Track scroll position to highlight active section
  useEffect(() => {
    if (items.length === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Offset for header

      // Find the header element currently in view
      let currentActiveId = "";
      for (const item of items) {
        const element = document.getElementById(item.id);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top) {
            currentActiveId = item.id;
          }
        }
      }

      if (currentActiveId) {
        setActiveId(currentActiveId);
      } else if (items.length > 0) {
        setActiveId(items[0].id);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Trigger once on load
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80, // Offset for header padding
        behavior: "smooth"
      });
      setActiveId(id);
    }
  };

  if (items.length === 0) return null;

  return (
    <nav className="w-full flex flex-col gap-3 text-left">
      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
        On This Page
      </h4>
      <div className="flex flex-col gap-2">
        {items.map((item) => {
          const isActive = activeId === item.id;
          const levelIndent = item.level === 2 ? "pl-3 text-xs" : item.level === 3 ? "pl-6 text-[11px]" : "text-xs";

          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleLinkClick(e, item.id)}
              className={`block py-0.5 border-l transition-all duration-150 truncate leading-relaxed ${levelIndent} ${
                isActive
                  ? "border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 font-semibold pl-2.5"
                  : "border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 pl-2"
              }`}
            >
              {item.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
};
