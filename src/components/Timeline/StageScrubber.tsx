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
      <div className="bg-card/95 backdrop-blur-lg border border-border text-card-foreground rounded-2xl p-3 shadow-xl flex flex-col gap-2.5 transition-colors">
        {/* Navigation bar & stage items */}
        <div className="flex items-center justify-between gap-2">
          {/* Controls: Prev, Play/Pause, Next */}
          <div className="flex items-center gap-1 p-1 rounded-xl border border-border bg-secondary/80 shrink-0">
            <button
              onClick={prevStage}
              className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              title="Previous Stage (Left Arrow)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlayingTimeline(!isPlayingTimeline)}
              className={`p-1.5 rounded-lg transition-all ${
                isPlayingTimeline
                  ? isRed
                    ? "bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                    : "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800"
                  : "hover:bg-secondary text-foreground"
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
              className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
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
                        ? "bg-rose-500/15 border-rose-300 dark:border-rose-600/80 shadow-sm"
                        : "bg-cyan-500/15 border-cyan-300 dark:border-cyan-500/80 shadow-sm"
                      : isPast
                      ? "bg-secondary/60 border-border hover:border-muted-foreground/30 text-muted-foreground"
                      : "bg-secondary/30 border-border/50 hover:border-muted-foreground/30 text-muted-foreground/70"
                  }`}
                >
                  {/* Step Number Bubble */}
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 transition-colors ${
                      isActive
                        ? isRed
                          ? "bg-rose-500 text-white"
                          : "bg-cyan-500 text-white"
                        : isPast
                        ? "bg-muted text-foreground"
                        : "bg-muted/60 text-muted-foreground"
                    }`}
                  >
                    {idx + 1}
                  </div>

                  <div className="min-w-0 flex-1 truncate">
                    <div
                      className={`text-xs font-semibold truncate transition-colors ${
                        isActive
                          ? isRed
                            ? "text-rose-700 dark:text-rose-200"
                            : "text-cyan-700 dark:text-cyan-200"
                          : isPast
                          ? "text-foreground"
                          : "text-muted-foreground group-hover:text-foreground"
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
            className="p-2 rounded-xl border border-border bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors shrink-0"
            title="Reset to Stage 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Stage Objectives Summary Sub-bar */}
        <div className="px-2 pt-1 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5 truncate">
            {isRed ? (
              <Flame className="w-3.5 h-3.5 shrink-0 text-rose-500" />
            ) : (
              <Shield className="w-3.5 h-3.5 shrink-0 text-cyan-500" />
            )}
            <span className="font-semibold text-foreground">
              Phase Objective:
            </span>
            <span className="truncate text-foreground/80">
              {stages[currentStageIndex]?.keyObjectives[0]}
            </span>
          </div>

          <span className="text-[10px] font-mono shrink-0 ml-2 hidden sm:inline text-muted-foreground">
            Use &larr; &rarr; to scrub &bull; Space to play
          </span>
        </div>
      </div>
    </div>
  );
}
