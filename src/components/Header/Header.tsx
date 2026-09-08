"use client";

import React from "react";
import { useAtlasStore } from "@/store/useAtlasStore";
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
  const theme = useAtlasStore((state) => state.theme);
  const toggleTheme = useAtlasStore((state) => state.toggleTheme);

  const isRed = perspective === "red";
  const isLight = theme === "light";
  const currentStageDef = campaign.stages.find((s) => s.id === activeStage);

  return (
    <header
      className={`h-14 border-b px-4 flex items-center justify-between z-20 select-none backdrop-blur-md transition-colors ${
        isLight
          ? "bg-white/95 border-slate-200 text-slate-900 shadow-sm"
          : "bg-slate-950/95 border-slate-800/90 text-slate-100"
      }`}
    >
      {/* Brand & Campaign Selector */}
      <div className="flex items-center gap-3">
        {/* Brand Icon */}
        <div className="flex items-center gap-2.5">
          <div
            className={`relative flex items-center justify-center w-8 h-8 rounded-lg border shadow-md ${
              isLight
                ? "bg-gradient-to-br from-cyan-100 via-white to-rose-100 border-slate-300"
                : "bg-gradient-to-br from-rose-950 via-slate-900 to-cyan-950 border-slate-700"
            }`}
          >
            <ShieldAlert
              className={`w-4 h-4 ${isLight ? "text-cyan-600" : "text-cyan-400"}`}
            />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-500" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span
                className={`font-bold text-sm tracking-tight flex items-center gap-1 ${
                  isLight ? "text-slate-900" : "text-white"
                }`}
              >
                THREAT
                <span className={isLight ? "text-cyan-600" : "text-cyan-400"}>
                  ATLAS
                </span>
              </span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded border font-semibold ${
                  isLight
                    ? "bg-cyan-50 text-cyan-700 border-cyan-200"
                    : "bg-cyan-950/80 text-cyan-400 border-cyan-800/60"
                }`}
              >
                v1.0
              </span>
            </div>
            <p
              className={`text-[10px] font-mono hidden sm:block ${
                isLight ? "text-slate-500" : "text-slate-400"
              }`}
            >
              APT Provenance & Detection Lifecycle
            </p>
          </div>
        </div>

        <div
          className={`h-5 w-px mx-1 hidden sm:block ${
            isLight ? "bg-slate-200" : "bg-slate-800"
          }`}
        />

        {/* Campaign Switcher Trigger */}
        <button
          onClick={() => setCampaignDrawerOpen(true)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-left transition-all group ${
            isLight
              ? "bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-slate-300"
              : "bg-slate-900/90 hover:bg-slate-800 border-slate-800 hover:border-slate-700"
          }`}
        >
          <FolderKanban
            className={`w-3.5 h-3.5 ${
              isLight
                ? "text-cyan-600 group-hover:text-cyan-700"
                : "text-cyan-400 group-hover:text-cyan-300"
            }`}
          />
          <div className="flex flex-col">
            <span
              className={`text-xs font-semibold truncate max-w-[240px] sm:max-w-[340px] md:max-w-[440px] ${
                isLight
                  ? "text-slate-800 group-hover:text-slate-900"
                  : "text-slate-200 group-hover:text-white"
              }`}
            >
              {campaign.title}
            </span>
            <span
              className={`text-[10px] font-mono ${
                isLight ? "text-slate-500" : "text-slate-400"
              }`}
            >
              {campaign.actor} &bull; {campaign.year}
            </span>
          </div>
          <ChevronDown
            className={`w-3.5 h-3.5 ml-1 ${
              isLight ? "text-slate-400" : "text-slate-400"
            }`}
          />
        </button>
      </div>

      {/* Center: Stage breadcrumb indicator */}
      <div
        className={`hidden lg:flex items-center gap-2 border px-3 py-1 rounded-full ${
          isLight
            ? "bg-slate-100 border-slate-200"
            : "bg-slate-900/60 border-slate-800/80"
        }`}
      >
        <span
          className={`text-[11px] font-mono ${
            isLight ? "text-slate-500" : "text-slate-400"
          }`}
        >
          Current Phase:
        </span>
        <span
          className={`text-xs font-bold ${
            isRed
              ? isLight
                ? "text-rose-600"
                : "text-rose-400"
              : isLight
              ? "text-cyan-600"
              : "text-cyan-400"
          }`}
        >
          {currentStageDef?.shortTitle}
        </span>
      </div>

      {/* Right Controls: Perspective Toggle, Theme Toggle, Help, Inspector Toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dual Perspective Toggle */}
        <div
          className={`flex items-center p-0.5 rounded-lg border shadow-inner ${
            isLight
              ? "bg-slate-100 border-slate-200"
              : "bg-slate-900 border-slate-800"
          }`}
        >
          <button
            onClick={() => setPerspective("red")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              isRed
                ? isLight
                  ? "bg-rose-50 text-rose-700 border border-rose-200 shadow-sm"
                  : "bg-rose-950/90 text-rose-300 border border-rose-800/80 shadow-[0_0_12px_rgba(244,63,94,0.35)]"
                : isLight
                ? "text-slate-600 hover:text-slate-900"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="Switch to Red Team / Attack Mechanics perspective (Shortcut: R)"
          >
            <Flame
              className={`w-3.5 h-3.5 ${
                isRed
                  ? isLight
                    ? "text-rose-600"
                    : "text-rose-400"
                  : "text-slate-400"
              }`}
            />
            <span className="hidden sm:inline">Attack Mechanics</span>
            <span className="sm:hidden">Red</span>
          </button>

          <button
            onClick={() => setPerspective("blue")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              !isRed
                ? isLight
                  ? "bg-cyan-50 text-cyan-700 border border-cyan-200 shadow-sm"
                  : "bg-cyan-950/90 text-cyan-300 border border-cyan-800/80 shadow-[0_0_12px_rgba(6,182,212,0.35)]"
                : isLight
                ? "text-slate-600 hover:text-slate-900"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="Switch to Blue Team / Detection Anatomy perspective (Shortcut: B)"
          >
            <ShieldCheck
              className={`w-3.5 h-3.5 ${
                !isRed
                  ? isLight
                    ? "text-cyan-600"
                    : "text-cyan-400"
                  : "text-slate-400"
              }`}
            />
            <span className="hidden sm:inline">Detection Anatomy</span>
            <span className="sm:hidden">Blue</span>
          </button>
        </div>

        {/* Theme Mode Toggle */}
        <button
          onClick={toggleTheme}
          className={`p-1.5 rounded-lg border transition-colors ${
            isLight
              ? "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
              : "bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white"
          }`}
          title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
          {isLight ? (
            <Moon className="w-4 h-4 text-slate-700" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>

        {/* Help & Guide Modal Trigger */}
        <button
          onClick={() => setHelpModalOpen(true)}
          className={`p-1.5 rounded-lg border transition-colors ${
            isLight
              ? "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
              : "bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-slate-200"
          }`}
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
                ? isLight
                  ? "bg-rose-50 border-rose-200 text-rose-700"
                  : "bg-rose-950/60 border-rose-800/60 text-rose-300"
                : isLight
                ? "bg-cyan-50 border-cyan-200 text-cyan-700"
                : "bg-cyan-950/60 border-cyan-800/60 text-cyan-300"
              : isLight
              ? "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
              : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
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
