"use client";

import React, { useEffect } from "react";
import { useAtlasStore } from "@/store/useAtlasStore";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Shield,
  Flame,
} from "lucide-react";

export function StageScrubber() {
  const campaign = useAtlasStore((state) => state.getCurrentCampaign());
  const activeStage = useAtlasStore((state) => state.activeStage);
  const setStage = useAtlasStore((state) => state.setStage);
  const nextStage = useAtlasStore((state) => state.nextStage);
  const prevStage = useAtlasStore((state) => state.prevStage);
  const perspective = useAtlasStore((state) => state.perspective);
  const isPlayingTimeline = useAtlasStore((state) => state.isPlayingTimeline);
  const setIsPlayingTimeline = useAtlasStore(
    (state) => state.setIsPlayingTimeline
  );
  const theme = useAtlasStore((state) => state.theme);

  const isLight = theme === "light";
  const isRed = perspective === "red";
  const stages = campaign.stages;
  const currentStageIndex = stages.findIndex((s) => s.id === activeStage);

  // Auto-play timeline timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlayingTimeline) {
      timer = setInterval(() => {
        nextStage();
      }, 5000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlayingTimeline, nextStage]);

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-[95%] max-w-4xl select-none">
      <div
        className={`backdrop-blur-lg border rounded-2xl p-3 shadow-2xl flex flex-col gap-2.5 transition-colors ${
          isLight
            ? "bg-white/95 border-slate-200 text-slate-900"
            : "bg-slate-950/95 border-slate-800/90 text-slate-100"
        }`}
      >
        {/* Navigation bar & stage items */}
        <div className="flex items-center justify-between gap-2">
          {/* Controls: Prev, Play/Pause, Next */}
          <div
            className={`flex items-center gap-1 p-1 rounded-xl border shrink-0 ${
              isLight
                ? "bg-slate-100 border-slate-200"
                : "bg-slate-900/80 border-slate-800"
            }`}
          >
            <button
              onClick={prevStage}
              className={`p-1.5 rounded-lg transition-colors ${
                isLight
                  ? "hover:bg-slate-200 text-slate-600 hover:text-slate-900"
                  : "hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
              title="Previous Stage (Left Arrow)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlayingTimeline(!isPlayingTimeline)}
              className={`p-1.5 rounded-lg transition-all ${
                isPlayingTimeline
                  ? isRed
                    ? isLight
                      ? "bg-rose-100 text-rose-700 border border-rose-200"
                      : "bg-rose-950 text-rose-300 border border-rose-800"
                    : isLight
                    ? "bg-cyan-100 text-cyan-700 border border-cyan-200"
                    : "bg-cyan-950 text-cyan-300 border border-cyan-800"
                  : isLight
                  ? "hover:bg-slate-200 text-slate-700"
                  : "hover:bg-slate-800 text-slate-300"
              }`}
              title={
                isPlayingTimeline
                  ? "Pause Tour (Space)"
                  : "Auto-Play Lifecycle Tour (Space)"
              }
            >
              {isPlayingTimeline ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={nextStage}
              className={`p-1.5 rounded-lg transition-colors ${
                isLight
                  ? "hover:bg-slate-200 text-slate-600 hover:text-slate-900"
                  : "hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
              title="Next Stage (Right Arrow)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Stepper Buttons */}
          <div className="grid grid-cols-4 gap-1.5 flex-1 min-w-0">
            {stages.map((stage, idx) => {
              const isActive = stage.id === activeStage;
              const isPast = idx < currentStageIndex;

              return (
                <button
                  key={stage.id}
                  onClick={() => setStage(stage.id)}
                  className={`group relative flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-left transition-all border ${
                    isActive
                      ? isRed
                        ? isLight
                          ? "bg-rose-50 border-rose-300 shadow-sm"
                          : "bg-rose-950/70 border-rose-600/80 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                        : isLight
                        ? "bg-cyan-50 border-cyan-300 shadow-sm"
                        : "bg-cyan-950/70 border-cyan-500/80 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                      : isPast
                      ? isLight
                        ? "bg-slate-100/70 border-slate-200 hover:border-slate-300 text-slate-700"
                        : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700 text-slate-400"
                      : isLight
                      ? "bg-slate-50 border-slate-200/60 hover:border-slate-300 text-slate-500"
                      : "bg-slate-900/40 border-slate-800/50 hover:border-slate-700/80 text-slate-500"
                  }`}
                >
                  {/* Step Number Bubble */}
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 transition-colors ${
                      isActive
                        ? isRed
                          ? "bg-rose-500 text-white"
                          : isLight
                          ? "bg-cyan-600 text-white"
                          : "bg-cyan-400 text-slate-950"
                        : isPast
                        ? isLight
                          ? "bg-slate-300 text-slate-800"
                          : "bg-slate-800 text-slate-300"
                        : isLight
                        ? "bg-slate-200 text-slate-500"
                        : "bg-slate-800/60 text-slate-500"
                    }`}
                  >
                    {idx + 1}
                  </div>

                  <div className="min-w-0 flex-1 truncate">
                    <div
                      className={`text-xs font-semibold truncate transition-colors ${
                        isActive
                          ? isRed
                            ? isLight
                              ? "text-rose-800"
                              : "text-rose-200"
                            : isLight
                            ? "text-cyan-800"
                            : "text-cyan-200"
                          : isPast
                          ? isLight
                            ? "text-slate-800 group-hover:text-slate-900"
                            : "text-slate-300 group-hover:text-white"
                          : isLight
                          ? "text-slate-600 group-hover:text-slate-800"
                          : "text-slate-400 group-hover:text-slate-300"
                      }`}
                    >
                      {stage.shortTitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Reset button */}
          <button
            onClick={() => setStage("initial_access")}
            className={`p-2 rounded-xl border transition-colors shrink-0 ${
              isLight
                ? "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600 hover:text-slate-900"
                : "bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
            title="Reset to Stage 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Stage Objectives Summary Sub-bar */}
        <div
          className={`px-2 pt-1 border-t flex items-center justify-between text-[11px] ${
            isLight
              ? "border-slate-200 text-slate-600"
              : "border-slate-900/80 text-slate-400"
          }`}
        >
          <div className="flex items-center gap-1.5 truncate">
            {isRed ? (
              <Flame
                className={`w-3.5 h-3.5 shrink-0 ${
                  isLight ? "text-rose-600" : "text-rose-500"
                }`}
              />
            ) : (
              <Shield
                className={`w-3.5 h-3.5 shrink-0 ${
                  isLight ? "text-cyan-600" : "text-cyan-400"
                }`}
              />
            )}
            <span
              className={`font-semibold ${
                isLight ? "text-slate-800" : "text-slate-300"
              }`}
            >
              Phase Objective:
            </span>
            <span
              className={`truncate ${
                isLight ? "text-slate-700" : "text-slate-400"
              }`}
            >
              {stages[currentStageIndex]?.keyObjectives[0]}
            </span>
          </div>

          <span
            className={`text-[10px] font-mono shrink-0 ml-2 hidden sm:inline ${
              isLight ? "text-slate-500" : "text-slate-500"
            }`}
          >
            Use &larr; &rarr; to scrub &bull; Space to play
          </span>
        </div>
      </div>
    </div>
  );
}
