"use client";

import React, { useState, useEffect, useRef } from "react";
import { searchItems, SearchItem } from "../data/mockComponents";
import { SearchIcon, BookIcon, LayersIcon } from "../atoms/Icons";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: SearchItem) => void;
}

export const CommandPalette = ({ isOpen, onClose, onSelect }: CommandPaletteProps) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Toggle body scroll locking when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      inputRef.current?.focus();
      setQuery("");
      setSelectedIndex(0);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Filter items
  const filteredItems = searchItems.filter((item) => {
    const cleanQuery = query.toLowerCase().trim();
    if (!cleanQuery) return true;
    return (
      item.name.toLowerCase().includes(cleanQuery) ||
      item.category.toLowerCase().includes(cleanQuery) ||
      item.description.toLowerCase().includes(cleanQuery)
    );
  });

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          onSelect(filteredItems[selectedIndex]);
          onClose();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onSelect, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div
        ref={containerRef}
        className="w-full max-w-xl overflow-hidden rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 shadow-2xl animate-scale-up"
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-zinc-100 dark:border-zinc-800">
          <SearchIcon className="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 ml-3 bg-transparent text-base text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none"
            placeholder="Type a component name or guide..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <span className="px-2 py-0.5 text-xs text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 rounded font-mono">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-sm text-zinc-400 dark:text-zinc-500">
              No results found for &ldquo;<span className="font-semibold">{query}</span>&rdquo;
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              const isGuide = item.type === "guide";

              return (
                <button
                  key={`${item.type}-${item.id}`}
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between text-left px-4 py-3 rounded-lg transition-all duration-150 ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                      : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-1.5 rounded-md ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                      }`}
                    >
                      {isGuide ? <BookIcon size={16} /> : <LayersIcon size={16} />}
                    </div>
                    <div>
                      <div className="font-medium text-sm leading-tight">{item.name}</div>
                      <div
                        className={`text-xs mt-0.5 line-clamp-1 ${
                          isSelected ? "text-zinc-200" : "text-zinc-400 dark:text-zinc-500"
                        }`}
                      >
                        {item.description}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 font-medium rounded-full uppercase tracking-wider ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                    }`}
                  >
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-[11px] text-zinc-400 dark:text-zinc-500">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1 py-0.5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded shadow-sm">
                ↑
              </kbd>{" "}
              <kbd className="px-1 py-0.5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded shadow-sm">
                ↓
              </kbd>{" "}
              Navigate
            </span>
            <span>
              <kbd className="px-1 py-0.5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded shadow-sm">
                ↵
              </kbd>{" "}
              Select
            </span>
          </div>
          <div>Cmd + K to close</div>
        </div>
      </div>
    </div>
  );
};
