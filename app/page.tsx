"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/organisms/Header";
import { Sidebar } from "@/components/organisms/Sidebar";
import { ComponentViewer } from "@/components/organisms/ComponentViewer";
import { GuidelineContent } from "@/components/organisms/GuidelineContent";
import { Toc } from "@/components/organisms/Toc";
import { CommandPalette } from "@/components/organisms/CommandPalette";
import { SearchItem } from "@/components/data/mockComponents";
import { BookIcon, LayersIcon, InfoIcon, LayoutGridIcon } from "@/components/atoms/Icons";

export default function Home() {
  const [activeFirstTier, setActiveFirstTier] = useState("guides");
  const [activeSecondTier, setActiveSecondTier] = useState("convention");
  const [darkMode, setDarkMode] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync state with URL params on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      const id = params.get("id");
      if (tab) setActiveFirstTier(tab);
      if (id) setActiveSecondTier(id);
    }
  }, []);

  // Initialize and track theme mode class
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark =
        localStorage.theme === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  // Set navigation values and update search parameters
  const handleNavigation = (tab: string, id: string) => {
    setActiveFirstTier(tab);
    setActiveSecondTier(id);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      url.searchParams.set("id", id);
      window.history.pushState({}, "", url.toString());
    }
  };

  const handleToggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }
  };

  // Keyboard shortcut listener for Command Palette (Cmd + K, Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearchSelect = (item: SearchItem) => {
    if (item.type === "guide") {
      handleNavigation("guides", item.id);
    } else if (item.type === "component") {
      handleNavigation("components", item.id);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans">
      {/* ❶ 최상단 고정 헤더 */}
      <Header
        onSearchClick={() => setIsSearchOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* ❷ 하단 메인 컨테이너 */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Backdrop overlay for mobile drawer */}
        {isMobileMenuOpen && (
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/45 backdrop-blur-xs lg:hidden transition-opacity duration-300"
          />
        )}

        {/* Sidebar wrapper: slide out mobile drawer, inline display on desktop */}
        <div
          className={`fixed inset-y-0 left-0 z-50 flex transform transition-transform duration-300 lg:static lg:translate-x-0 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar
            activeFirstTier={activeFirstTier}
            activeSecondTier={activeSecondTier}
            onNavigate={(tab, id) => {
              handleNavigation(tab, id);
              setIsMobileMenuOpen(false); // Auto close menu drawer on mobile item select!
            }}
          />
        </div>

        {/* ❸ 중앙 본문 + 우측 TOC */}
        <main className="flex-1 overflow-y-auto flex bg-zinc-50/30 dark:bg-zinc-900/10">
          <div className="flex-1 p-6 md:p-10 flex justify-center">
            <div className="w-full max-w-4xl">
              {/* Content Router */}
              {activeFirstTier === "guides" && (
                <GuidelineContent guideId={activeSecondTier} />
              )}

              {activeFirstTier === "components" && (
                <ComponentViewer componentId={activeSecondTier} />
              )}

              {/* Interactions Preview Dashboard */}
              {activeFirstTier === "interactions" && (
                <div className="flex flex-col gap-6 text-left">
                  <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Interactions</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-2">
                      고급스러운 UX를 위한 마이크로 인터랙션 및 애니메이션 가이드
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 font-bold">
                        H
                      </div>
                      <h3 className="text-base font-bold mb-2">Hover Transition</h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
                        엘리먼트 호버 시 스케일, 보더 색상 및 쉐도우가 300ms 동안 부드럽게 감속(cubic-bezier)하여 피드백을 전달합니다.
                      </p>
                      <button className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shadow-sm">
                        Hover Me
                      </button>
                    </div>

                    <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 font-bold">
                        P
                      </div>
                      <h3 className="text-base font-bold mb-2">Pulse Indicator</h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
                        사용자의 주목을 부드럽게 유도하는 Pulse 링 무한 애니메이션 효과입니다. 알림 배지 등에 사용됩니다.
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="relative flex h-3.5 w-3.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs text-zinc-500">Active indicator</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Templates Preview Dashboard */}
              {activeFirstTier === "templates" && (
                <div className="flex flex-col gap-6 text-left">
                  <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Templates</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-2">
                      원자(Atom)와 분자(Molecule)들이 조합된 완성형 페이지 템플릿 레이아웃
                    </p>
                  </div>
                  <div className="border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center mt-4 bg-white dark:bg-zinc-950/20">
                    <LayoutGridIcon className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-4" />
                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                      Standard Wireframe Layouts
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm leading-relaxed">
                      이 영역은 복잡한 비즈니스 뷰나 대시보드 구조의 기본 골격을 이루는 레이아웃 템플릿을 제공합니다. 상단 GNC 선택에 따른 다양한 레이아웃 프리셋을 추가할 수 있습니다.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 우측 TOC 목차 (데스크톱 전용) */}
          {activeSecondTier && (activeFirstTier === "components" || activeFirstTier === "guides") && (
            <div className="w-52 border-l border-zinc-200/80 dark:border-zinc-800/80 p-6 hidden xl:block shrink-0 sticky top-0 h-fit max-h-[calc(100vh-3.5rem)] overflow-y-auto">
              <Toc type={activeFirstTier as "component" | "guide"} contentId={activeSecondTier} />
            </div>
          )}
        </main>
      </div>

      {/* Cmd + K Command Palette */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={handleSearchSelect}
      />
    </div>
  );
}
