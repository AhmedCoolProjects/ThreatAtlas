"use client";

import React, { useEffect, useState } from "react";
import { useAtlasStore } from "@/store/useAtlasStore";
import { useTheme } from "next-themes";
import {
  ShieldAlert,
  Flame,
  ShieldCheck,
  FolderKanban,
  HelpCircle,
  SidebarClose,
  SidebarOpen,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";

export function Header() {
  const campaign = useAtlasStore((state) => state.getCurrentCampaign());
  const activeStage = useAtlasStore((state) => state.activeStage);
  const perspective = useAtlasStore((state) => state.perspective);
  const setPerspective = useAtlasStore((state) => state.setPerspective);
  const isInspectorOpen = useAtlasStore((state) => state.isInspectorOpen);
  const toggleInspector = useAtlasStore((state) => state.toggleInspector);
  const setCampaignDrawerOpen = useAtlasStore(
    (state) => state.setCampaignDrawerOpen
  );
  const setHelpModalOpen = useAtlasStore((state) => state.setHelpModalOpen);

  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isRed = perspective === "red";
  const currentTheme = mounted ? resolvedTheme || theme : "dark";
  const isDark = currentTheme === "dark";
  const currentStageDef = campaign.stages.find((s) => s.id === activeStage);

  return (
    <header className="h-14 bg-card/95 border-b border-border px-4 flex items-center justify-between z-20 select-none backdrop-blur-md transition-colors text-card-foreground">
      {/* Brand & Campaign Selector */}
      <div className="flex items-center gap-3">
        {/* Brand Icon */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-rose-950/40 via-card to-cyan-950/40 border border-border shadow-sm">
            <ShieldAlert className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-500" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight flex items-center gap-1 text-foreground">
                THREAT
                <span className="text-cyan-600 dark:text-cyan-400">
                  ATLAS
                </span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border font-semibold bg-cyan-50 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800/60">
                v1.0
              </span>
            </div>
            <p className="text-[10px] font-mono text-muted-foreground hidden sm:block">
              APT Provenance & Detection Lifecycle
            </p>
          </div>
        </div>

        <div className="h-5 w-px bg-border mx-1 hidden sm:block" />

        {/* Campaign Switcher Trigger */}
        <button
          onClick={() => setCampaignDrawerOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-secondary/80 hover:bg-secondary text-secondary-foreground text-left transition-all group"
        >
          <FolderKanban className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 group-hover:opacity-80" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold truncate max-w-[240px] sm:max-w-[340px] md:max-w-[440px] text-foreground">
              {campaign.title}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">
              {campaign.actor} &bull; {campaign.year}
            </span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 ml-1 text-muted-foreground group-hover:text-foreground" />
        </button>
      </div>

      {/* Center: Stage breadcrumb indicator */}
      <div className="hidden lg:flex items-center gap-2 border border-border bg-secondary/50 px-3 py-1 rounded-full">
        <span className="text-[11px] font-mono text-muted-foreground">
          Current Phase:
        </span>
        <span
          className={`text-xs font-bold ${
            isRed
              ? "text-rose-600 dark:text-rose-400"
              : "text-cyan-600 dark:text-cyan-400"
          }`}
        >
          {currentStageDef?.shortTitle}
        </span>
      </div>

      {/* Right Controls: Perspective Toggle, Theme Toggle, Help, Inspector Toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dual Perspective Toggle */}
        <div className="flex items-center p-0.5 rounded-lg border border-border bg-secondary/60 shadow-inner">
          <button
            onClick={() => setPerspective("red")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              isRed
                ? "bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800/80 shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Switch to Red Team / Attack Mechanics perspective (Shortcut: R)"
          >
            <Flame
              className={`w-3.5 h-3.5 ${
                isRed
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-muted-foreground"
              }`}
            />
            <span className="hidden sm:inline">Attack Mechanics</span>
            <span className="sm:hidden">Red</span>
          </button>

          <button
            onClick={() => setPerspective("blue")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              !isRed
                ? "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800/80 shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Switch to Blue Team / Detection Anatomy perspective (Shortcut: B)"
          >
            <ShieldCheck
              className={`w-3.5 h-3.5 ${
                !isRed
                  ? "text-cyan-600 dark:text-cyan-400"
                  : "text-muted-foreground"
              }`}
            />
            <span className="hidden sm:inline">Detection Anatomy</span>
            <span className="sm:hidden">Blue</span>
          </button>
        </div>

        {/* Theme Mode Toggle (shadcn next-themes) */}
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="p-2 rounded-lg border border-border bg-secondary/80 hover:bg-secondary text-foreground transition-colors"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>

        {/* Help & Guide Modal Trigger */}
        <button
          onClick={() => setHelpModalOpen(true)}
          className="p-2 rounded-lg border border-border bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          title="Interactive Guide & Shortcuts (?)"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Inspector Toggle */}
        <button
          onClick={toggleInspector}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
            isInspectorOpen
              ? isRed
                ? "bg-rose-500/15 border-rose-300 dark:border-rose-800/80 text-rose-700 dark:text-rose-300"
                : "bg-cyan-500/15 border-cyan-300 dark:border-cyan-800/80 text-cyan-700 dark:text-cyan-300"
              : "bg-secondary/80 border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
          }`}
          title="Toggle Inspector Sidebar (I)"
        >
          {isInspectorOpen ? (
            <SidebarClose className="w-3.5 h-3.5" />
          ) : (
            <SidebarOpen className="w-3.5 h-3.5" />
          )}
          <span className="hidden md:inline">Inspector</span>
        </button>
      </div>
    </header>
  );
}
