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

    const [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });

    const isRed = perspective === "red";
    const isActive = !data?.stage || data.stage === activeStage;

    const strokeColor = selected
      ? isRed
        ? "#f43f5e"
        : "#22d3ee"
      : isActive
      ? isRed
        ? "#ef4444"
        : "#06b6d4"
      : "#334155";

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
            opacity: isActive ? 0.9 : 0.25,
            filter: isActive
              ? isRed
                ? "drop-shadow(0 0 4px rgba(239, 68, 68, 0.4))"
                : "drop-shadow(0 0 4px rgba(6, 182, 212, 0.4))"
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
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium transition-all duration-200 cursor-pointer border select-none ${
                selected
                  ? isRed
                    ? "bg-rose-950 border-rose-500 text-rose-200 shadow-[0_0_10px_rgba(244,63,94,0.4)]"
                    : "bg-cyan-950 border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(34,211,238,0.4)]"
                  : isActive
                  ? isRed
                    ? "bg-slate-950/90 border-rose-900/60 text-rose-400 hover:border-rose-500"
                    : "bg-slate-950/90 border-cyan-900/60 text-cyan-400 hover:border-cyan-400"
                  : "bg-slate-950/60 border-slate-800 text-slate-500 opacity-40"
              }`}
            >
              <span>{data.label}</span>
              {data.protocol && (
                <span className="ml-1 opacity-70 text-[9px] font-normal">
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
