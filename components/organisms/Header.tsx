"use client";

import React, { useEffect, useState } from "react";
import { SearchIcon, SunIcon, MoonIcon, GithubIcon, MenuIcon, XIcon } from "../atoms/Icons";

interface HeaderProps {
  onSearchClick: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  isMobileMenuOpen: boolean;
  onToggleMenu: () => void;
}

export const Header = ({
  onSearchClick,
  darkMode,
  onToggleDarkMode,
  isMobileMenuOpen,
  onToggleMenu
}: HeaderProps) => {
  const [shortcutKey, setShortcutKey] = useState("Cmd + K");

  useEffect(() => {
    // Detect OS for shortcut display
    if (typeof window !== "undefined") {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      setShortcutKey(isMac ? "⌘ K" : "Ctrl + K");
    }
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full h-14 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 transition-all duration-300">
      {/* Left items: hamburger and logo */}
      <div className="flex items-center gap-2">
        {/* Hamburger / Menu toggle for mobile */}
        <button
          onClick={onToggleMenu}
          className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400 lg:hidden cursor-pointer"
          title="Toggle Menu"
        >
          {isMobileMenuOpen ? <XIcon size={18} /> : <MenuIcon size={18} />}
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-bold text-base tracking-wider">FK</span>
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Frontkit
            </span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono -mt-1">
              v0.1.0
            </span>
          </div>
        </div>
      </div>

      {/* Search Trigger Bar */}
      <button
        onClick={onSearchClick}
        className="flex-1 max-w-sm md:max-w-md mx-4 h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 flex items-center justify-between text-zinc-400 dark:text-zinc-500 transition-all duration-200 shadow-sm cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <SearchIcon size={16} />
          <span className="text-xs sm:text-sm text-left">Search guides & components...</span>
        </div>
        <kbd className="hidden sm:inline-flex items-center h-5 px-1.5 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-[10px] font-mono text-zinc-400 dark:text-zinc-500 shadow-xs">
          {shortcutKey}
        </kbd>
      </button>

      {/* Right Action Controls */}
      <div className="flex items-center gap-2">
        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 transition-all duration-200 shadow-sm cursor-pointer"
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <SunIcon size={18} /> : <MoonIcon size={18} />}
        </button>

        {/* GitHub Link */}
        <a
          href="https://github.com/byahram/web-frontkit"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 transition-all duration-200 shadow-sm"
          title="View on GitHub"
        >
          <GithubIcon size={18} />
        </a>
      </div>
    </header>
  );
};
