"use client";

import React, { useEffect } from "react";
import { Header } from "@/components/Header/Header";
import { AtlasCanvas } from "@/components/Canvas/AtlasCanvas";
import { StageScrubber } from "@/components/Timeline/StageScrubber";
import { InspectorPanel } from "@/components/Inspector/InspectorPanel";
import { CampaignLibraryModal } from "@/components/Modals/CampaignLibraryModal";
import { HelpModal } from "@/components/Modals/HelpModal";
import { useAtlasStore } from "@/store/useAtlasStore";

export default function ThreatAtlasPage() {
  const nextStage = useAtlasStore((state) => state.nextStage);
  const prevStage = useAtlasStore((state) => state.prevStage);
  const setPerspective = useAtlasStore((state) => state.setPerspective);
  const toggleInspector = useAtlasStore((state) => state.toggleInspector);
  const selectNode = useAtlasStore((state) => state.selectNode);
  const setHelpModalOpen = useAtlasStore((state) => state.setHelpModalOpen);
  const isHelpModalOpen = useAtlasStore((state) => state.isHelpModalOpen);
  const isCampaignDrawerOpen = useAtlasStore(
    (state) => state.isCampaignDrawerOpen
  );
  const setCampaignDrawerOpen = useAtlasStore(
    (state) => state.setCampaignDrawerOpen
  );
  const isPlayingTimeline = useAtlasStore((state) => state.isPlayingTimeline);
  const setIsPlayingTimeline = useAtlasStore(
    (state) => state.setIsPlayingTimeline
  );
  const theme = useAtlasStore((state) => state.theme);

  // Sync theme to root html element class
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(theme);
    }
  }, [theme]);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keystrokes when typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          nextStage();
          break;
        case "ArrowLeft":
          e.preventDefault();
          prevStage();
          break;
        case " ":
          e.preventDefault();
          setIsPlayingTimeline(!isPlayingTimeline);
          break;
        case "r":
        case "R":
          setPerspective("red");
          break;
        case "b":
        case "B":
          setPerspective("blue");
          break;
        case "i":
        case "I":
          toggleInspector();
          break;
        case "Escape":
          if (isHelpModalOpen) {
            setHelpModalOpen(false);
          } else if (isCampaignDrawerOpen) {
            setCampaignDrawerOpen(false);
          } else {
            selectNode(null);
          }
          break;
        case "?":
          e.preventDefault();
          setHelpModalOpen(true);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    nextStage,
    prevStage,
    setPerspective,
    toggleInspector,
    selectNode,
    setHelpModalOpen,
    isHelpModalOpen,
    isCampaignDrawerOpen,
    setCampaignDrawerOpen,
    isPlayingTimeline,
    setIsPlayingTimeline,
  ]);

  const isLight = theme === "light";

  return (
    <main
      className={`flex flex-col w-screen h-screen overflow-hidden font-sans transition-colors duration-200 ${
        isLight ? "bg-slate-100 text-slate-900" : "bg-slate-950 text-slate-100"
      }`}
    >
      {/* Top Navigation Header */}
      <Header />

      {/* Main Workspace Area: Canvas + Collapsible Inspector */}
      <div className="flex-1 flex w-full h-[calc(100vh-3.5rem)] overflow-hidden relative">
        {/* Interactive Canvas Viewport */}
        <div className="flex-1 h-full relative overflow-hidden">
          <AtlasCanvas />
          <StageScrubber />
        </div>

        {/* Right Inspector Panel */}
        <InspectorPanel />
      </div>

      {/* Modals */}
      <CampaignLibraryModal />
      <HelpModal />
    </main>
  );
}
