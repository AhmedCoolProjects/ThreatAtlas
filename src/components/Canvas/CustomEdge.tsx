"use client";

import React, { memo } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  EdgeProps,
} from "@xyflow/react";
import { AtlasEdge } from "@/types/campaign";
import { useAtlasStore } from "@/store/useAtlasStore";

export const CustomEdge = memo(
  ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    selected,
  }: EdgeProps<AtlasEdge>) => {
    const activeStage = useAtlasStore((state) => state.activeStage);
    const perspective = useAtlasStore((state) => state.perspective);
    const selectEdge = useAtlasStore((state) => state.selectEdge);
    const theme = useAtlasStore((state) => state.theme);

    const isLight = theme === "light";
    const isRed = perspective === "red";
    const isActive = !data?.stage || data.stage === activeStage;

    const [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });

    const strokeColor = selected
      ? isRed
        ? isLight ? "#e11d48" : "#f43f5e"
        : isLight ? "#0284c7" : "#22d3ee"
      : isActive
      ? isRed
        ? isLight ? "#e11d48" : "#ef4444"
        : isLight ? "#0284c7" : "#06b6d4"
      : isLight ? "#cbd5e1" : "#334155";

    const strokeWidth = selected ? 2.5 : isActive ? 2 : 1.2;

    return (
      <>
        <BaseEdge
          id={id}
          path={edgePath}
          style={{
            stroke: strokeColor,
            strokeWidth,
            strokeDasharray: isActive ? "5 5" : "none",
            animation: isActive ? "dashdraw 1.5s linear infinite" : "none",
            opacity: isActive ? 1 : 0.25,
            filter: isActive
              ? isRed
                ? isLight
                  ? "drop-shadow(0 2px 4px rgba(225, 29, 72, 0.25))"
                  : "drop-shadow(0 0 6px rgba(239, 68, 68, 0.45))"
                : isLight
                ? "drop-shadow(0 2px 4px rgba(2, 132, 199, 0.25))"
                : "drop-shadow(0 0 6px rgba(6, 182, 212, 0.45))"
              : "none",
          }}
        />

        {data?.label && (
          <EdgeLabelRenderer>
            <div
              style={{
                position: "absolute",
                transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                pointerEvents: "all",
              }}
              onClick={(e) => {
                e.stopPropagation();
                selectEdge(id);
              }}
              className={`px-2.5 py-1 rounded-full text-[10.5px] font-mono font-semibold transition-all duration-200 cursor-pointer border select-none ${
                selected
                  ? isRed
                    ? isLight
                      ? "bg-rose-50 border-rose-400 text-rose-800 shadow-md"
                      : "bg-rose-950 border-rose-500 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.4)]"
                    : isLight
                    ? "bg-cyan-50 border-cyan-400 text-cyan-800 shadow-md"
                    : "bg-cyan-950 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.4)]"
                  : isActive
                  ? isRed
                    ? isLight
                      ? "bg-white/95 border-rose-300 text-rose-700 shadow-sm hover:border-rose-400"
                      : "bg-slate-950/95 border-rose-900/80 text-rose-300 hover:border-rose-500 shadow-md"
                    : isLight
                    ? "bg-white/95 border-cyan-300 text-cyan-700 shadow-sm hover:border-cyan-400"
                    : "bg-slate-950/95 border-cyan-900/80 text-cyan-300 hover:border-cyan-400 shadow-md"
                  : isLight
                  ? "bg-white/80 border-slate-200 text-slate-400 opacity-50"
                  : "bg-slate-950/60 border-slate-800 text-slate-500 opacity-40"
              }`}
            >
              <span>{data.label}</span>
              {data.protocol && (
                <span className="ml-1 opacity-75 text-[9.5px] font-normal">
                  ({data.protocol})
                </span>
              )}
            </div>
          </EdgeLabelRenderer>
        )}
      </>
    );
  }
);

CustomEdge.displayName = "CustomEdge";
