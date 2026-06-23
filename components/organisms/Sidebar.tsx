"use client";

import React, { useState, useEffect } from "react";
import {
  BookIcon,
  LayersIcon,
  ZapIcon,
  LayoutIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon
} from "../atoms/Icons";
import { mockGuides, mockComponents } from "../data/mockComponents";

interface SidebarProps {
  activeFirstTier: string;
  activeSecondTier: string;
  onNavigate: (tab: string, id: string) => void;
}

export const Sidebar = ({
  activeFirstTier,
  activeSecondTier,
  onNavigate
}: SidebarProps) => {
  const [isGncExpanded, setIsGncExpanded] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 1024) {
        setIsGncExpanded(false);
      }
    }
  }, []);
  const [expandedComponents, setExpandedComponents] = useState<Record<string, boolean>>({
    atoms: true,
    molecules: true,
    organisms: false,
    templates: false,
    pages: false
  });

  // 1-Tier categories
  const gncCategories = [
    { id: "guides", name: "Guide", icon: <BookIcon size={18} /> },
    { id: "components", name: "Comp", icon: <LayersIcon size={18} /> },
    { id: "interactions", name: "Inter", icon: <ZapIcon size={18} /> },
    { id: "templates", name: "Templ", icon: <LayoutIcon size={18} /> }
  ];

  const toggleComponentCategory = (cat: string) => {
    setExpandedComponents((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Group components by atomic category
  const componentsByCategory = {
    atoms: mockComponents.filter((c) => c.category === "atoms"),
    molecules: mockComponents.filter((c) => c.category === "molecules"),
    organisms: mockComponents.filter((c) => c.category === "organisms"),
    templates: mockComponents.filter((c) => c.category === "templates"),
    pages: mockComponents.filter((c) => c.category === "pages")
  };

  return (
    <div className="flex h-full overflow-hidden select-none">
      {/* ❶ 1단 사이드바 (GNC) */}
      <aside
        className={`h-full border-r border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-start transition-all duration-300 ${isGncExpanded ? "w-44" : "w-16"
          }`}
      >
        {/* Top Header & Collapse Toggle */}
        <div className="h-12 px-4 border-b border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between">
          {isGncExpanded ? (
            <>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 animate-fade-in">
                Menu
              </span>
              <button
                onClick={() => setIsGncExpanded(false)}
                className="p-1 rounded-md hover:bg-zinc-200/70 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
                title="Collapse Sidebar"
              >
                <ChevronLeftIcon size={14} />
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsGncExpanded(true)}
              className="w-full flex justify-center p-1 rounded-md hover:bg-zinc-200/70 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
              title="Expand Sidebar"
            >
              <ChevronRightIcon size={14} />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <div className="flex flex-col gap-1 p-3">
          {gncCategories.map((cat) => {
            const isActive = activeFirstTier === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  let defaultId = "";
                  if (cat.id === "guides" && mockGuides.length > 0) {
                    defaultId = mockGuides[0].id;
                  } else if (cat.id === "components" && mockComponents.length > 0) {
                    defaultId = mockComponents[0].id;
                  }
                  onNavigate(cat.id, defaultId);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-100"
                  }`}
                title={!isGncExpanded ? cat.name : undefined}
              >
                <div className="flex-shrink-0">{cat.icon}</div>
                {isGncExpanded && (
                  <span className="truncate animate-fade-in">{cat.name}</span>
                )}
              </button>
            );
          })}
        </div>
      </aside>

      {/* ❷ 2단 사이드바 (LNC) */}
      <aside className="w-60 h-full border-r border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 overflow-y-auto flex flex-col transition-all duration-300">
        <div className="h-12 px-4 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            {activeFirstTier === "guides" && "Developer Guides"}
            {activeFirstTier === "components" && "UI Components"}
            {activeFirstTier === "interactions" && "Interactions"}
            {activeFirstTier === "templates" && "Templates"}
          </h2>
        </div>

        <div className="flex-1 p-3">
          {/* LNC Content based on GNC Selection */}
          {activeFirstTier === "guides" && (
            <div className="flex flex-col gap-1">
              {mockGuides.map((guide) => {
                const isActive = activeSecondTier === guide.id;
                return (
                  <button
                    key={guide.id}
                    onClick={() => onNavigate(activeFirstTier, guide.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${isActive
                        ? "bg-zinc-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 font-semibold"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-100"
                      }`}
                  >
                    <span>&gt; {guide.title}</span>
                  </button>
                );
              })}
            </div>
          )}

          {activeFirstTier === "components" && (
            <div className="flex flex-col gap-2">
              {(Object.keys(componentsByCategory) as Array<keyof typeof componentsByCategory>).map((cat) => {
                const isExpanded = expandedComponents[cat];
                const items = componentsByCategory[cat];

                return (
                  <div key={cat} className="flex flex-col">
                    {/* Category Header */}
                    <button
                      onClick={() => toggleComponentCategory(cat)}
                      className="flex items-center justify-between px-2 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 dark:text-zinc-500 transition-colors cursor-pointer text-left"
                    >
                      <span>{cat}</span>
                      <ChevronDownIcon
                        size={12}
                        className={`transition-transform duration-200 ${isExpanded ? "rotate-0" : "-rotate-90"
                          }`}
                      />
                    </button>

                    {/* Category Items Accordion */}
                    <div
                      className={`overflow-hidden transition-all duration-200 ${isExpanded ? "max-h-96 mt-1" : "max-h-0"
                        }`}
                    >
                      <div className="flex flex-col pl-2 border-l border-zinc-100 dark:border-zinc-800 ml-2 gap-0.5 py-0.5">
                        {items.length === 0 ? (
                          <div className="text-xs text-zinc-400 dark:text-zinc-500 py-1 px-3 italic">
                            Empty
                          </div>
                        ) : (
                          items.map((comp) => {
                            const isActive = activeSecondTier === comp.id;
                            return (
                              <button
                                key={comp.id}
                                onClick={() => onNavigate(activeFirstTier, comp.id)}
                                className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-all duration-150 cursor-pointer ${isActive
                                    ? "bg-zinc-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 font-semibold"
                                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-100"
                                  }`}
                              >
                                {comp.name}
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeFirstTier === "interactions" && (
            <div className="flex flex-col gap-1">
              {["Scroll Animations", "Micro Interaction", "Hover Effects"].map((item, idx) => {
                const itemId = `interaction-${idx}`;
                const isActive = activeSecondTier === itemId;
                return (
                  <button
                    key={itemId}
                    onClick={() => onNavigate(activeFirstTier, itemId)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${isActive
                        ? "bg-zinc-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 font-semibold"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-100"
                      }`}
                  >
                    <span>&gt; {item}</span>
                  </button>
                );
              })}
            </div>
          )}

          {activeFirstTier === "templates" && (
            <div className="flex flex-col gap-1">
              {["Dashboard Frame", "Authentication Screen", "Interactive Portal"].map((item, idx) => {
                const itemId = `template-${idx}`;
                const isActive = activeSecondTier === itemId;
                return (
                  <button
                    key={itemId}
                    onClick={() => onNavigate(activeFirstTier, itemId)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${isActive
                        ? "bg-zinc-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 font-semibold"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-100"
                      }`}
                  >
                    <span>&gt; {item}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};
