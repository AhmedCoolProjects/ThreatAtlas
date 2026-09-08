"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import {
  Terminal,
  FileCode,
  Database,
  Globe,
  User,
  Server,
  ShieldCheck,
  Flame,
  Binary,
} from "lucide-react";
import { AtlasNode, EntityType } from "@/types/campaign";
import { useAtlasStore } from "@/store/useAtlasStore";

function getEntityIcon(type: EntityType) {
  switch (type) {
    case "process":
      return <Terminal className="w-4 h-4 text-amber-400" />;
    case "file":
      return <FileCode className="w-4 h-4 text-blue-400" />;
    case "registry":
      return <Database className="w-4 h-4 text-purple-400" />;
    case "network":
      return <Globe className="w-4 h-4 text-emerald-400" />;
    case "user":
      return <User className="w-4 h-4 text-rose-400" />;
    case "host":
      return <Server className="w-4 h-4 text-indigo-400" />;
    default:
      return <Binary className="w-4 h-4 text-slate-400" />;
  }
}

function getEntityTypeLabel(type: EntityType) {
  switch (type) {
    case "process":
      return "PROC";
    case "file":
      return "FILE";
    case "registry":
      return "REG";
    case "network":
      return "NET";
    case "user":
      return "USER";
    case "host":
      return "HOST";
    default:
      return "ENTITY";
  }
}

export const CustomNode = memo(({ data, selected }: NodeProps<AtlasNode>) => {
  const activeStage = useAtlasStore((state) => state.activeStage);
  const perspective = useAtlasStore((state) => state.perspective);
  const entityFilter = useAtlasStore((state) => state.entityFilter);
  const searchQuery = useAtlasStore((state) => state.searchQuery);
  const theme = useAtlasStore((state) => state.theme);

  const isActiveStage = data.stage === activeStage;
  const matchesFilter =
    entityFilter === "all" || data.entityType === entityFilter;
  const matchesSearch =
    !searchQuery ||
    data.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    data.subLabel?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    data.techniqueId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    data.techniqueName?.toLowerCase().includes(searchQuery.toLowerCase());

  const isDimmed = !isActiveStage || !matchesFilter || !matchesSearch;
  const isRed = perspective === "red";
  const isLight = theme === "light";

  const glowBorderClass = selected
    ? isRed
      ? "ring-2 ring-red-500 border-red-400 shadow-[0_0_25px_rgba(239,68,68,0.55)]"
      : "ring-2 ring-cyan-400 border-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.55)]"
    : isActiveStage
    ? isRed
      ? isLight
        ? "border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.2)] hover:border-red-600"
        : "border-red-500/60 shadow-[0_0_14px_rgba(239,68,68,0.3)] hover:border-red-400"
      : isLight
      ? "border-cyan-600 shadow-[0_0_12px_rgba(6,182,212,0.2)] hover:border-cyan-700"
      : "border-cyan-500/60 shadow-[0_0_14px_rgba(6,182,212,0.3)] hover:border-cyan-400"
    : isLight
    ? "border-slate-200 hover:border-slate-300"
    : "border-slate-800 hover:border-slate-700";

  return (
    <div
      className={`relative group rounded-xl backdrop-blur-md border transition-all duration-300 min-w-[280px] max-w-[320px] p-4 select-none ${
        isLight ? "bg-white/95 text-slate-900 shadow-lg" : "bg-slate-950/95 text-slate-100"
      } ${glowBorderClass} ${
        isDimmed ? (isLight ? "opacity-40 grayscale-[40%]" : "opacity-35 grayscale-[50%]") : "opacity-100"
      }`}
    >
      {/* ReactFlow connection handles */}
      <Handle
        type="target"
        position={Position.Left}
        className={`!w-2.5 !h-2.5 !border-2 ${
          isLight
            ? "!bg-slate-400 !border-white group-hover:!bg-cyan-600"
            : "!bg-slate-500 !border-slate-900 group-hover:!bg-cyan-400"
        }`}
      />
      <Handle
        type="source"
        position={Position.Right}
        className={`!w-2.5 !h-2.5 !border-2 ${
          isLight
            ? "!bg-slate-400 !border-white group-hover:!bg-red-600"
            : "!bg-slate-500 !border-slate-900 group-hover:!bg-red-400"
        }`}
      />
      <Handle
        type="target"
        position={Position.Top}
        className={`!w-2.5 !h-2.5 !border-2 ${
          isLight ? "!bg-slate-400 !border-white" : "!bg-slate-500 !border-slate-900"
        }`}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className={`!w-2.5 !h-2.5 !border-2 ${
          isLight ? "!bg-slate-400 !border-white" : "!bg-slate-500 !border-slate-900"
        }`}
      />

      {/* Header: Type icon & MITRE ID badge */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5">
          <div
            className={`p-1 rounded-md border ${
              isLight ? "bg-slate-100 border-slate-200" : "bg-slate-900/90 border-slate-800"
            }`}
          >
            {getEntityIcon(data.entityType)}
          </div>
          <span
            className={`text-[10px] font-mono font-bold tracking-wider uppercase ${
              isLight ? "text-slate-600" : "text-slate-400"
            }`}
          >
            {getEntityTypeLabel(data.entityType)}
          </span>
        </div>

        {data.techniqueId && (
          <div
            className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold tracking-tight border ${
              isRed
                ? isLight
                  ? "bg-rose-50 border-rose-200 text-rose-700"
                  : "bg-rose-950/60 border-rose-800/60 text-rose-300"
                : isLight
                ? "bg-cyan-50 border-cyan-200 text-cyan-700"
                : "bg-cyan-950/60 border-cyan-800/60 text-cyan-300"
            }`}
          >
            {data.techniqueId}
          </div>
        )}
      </div>

      {/* Primary Label - cleanly wrapped, never truncated */}
      <div className="mb-2">
        <h4
          className={`text-[13.5px] font-bold tracking-tight leading-snug [overflow-wrap:anywhere] ${
            isLight ? "text-slate-900" : "text-slate-100"
          }`}
        >
          {data.label}
        </h4>
        {data.subLabel && (
          <p
            className={`text-[11px] font-mono mt-0.5 [overflow-wrap:anywhere] ${
              isLight ? "text-slate-600" : "text-slate-400"
            }`}
          >
            {data.subLabel}
          </p>
        )}
      </div>

      {/* Perspective Info Pill */}
      <div
        className={`mt-2 pt-2 border-t flex items-center justify-between text-[11px] ${
          isLight ? "border-slate-200" : "border-slate-900/80"
        }`}
      >
        {isRed ? (
          <div className="flex items-center gap-1.5 flex-1 min-w-0 pr-2">
            <Flame className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span
              className={`text-[11px] font-medium truncate ${
                isLight ? "text-rose-700" : "text-rose-300/90"
              }`}
            >
              {data.redDetails.attackerIntent || "Offensive Execution"}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 flex-1 min-w-0 pr-2">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
            <span
              className={`text-[11px] font-medium truncate ${
                isLight ? "text-cyan-800" : "text-cyan-300/90"
              }`}
            >
              {data.blueDetails.rules.length} Rule(s) &bull; {data.blueDetails.telemetry.length} Log(s)
            </span>
          </div>
        )}

        {isActiveStage && (
          <span className="relative flex h-2 w-2 shrink-0">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isRed ? "bg-rose-400" : "bg-cyan-400"
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isRed ? "bg-rose-500" : "bg-cyan-500"
              }`}
            />
          </span>
        )}
      </div>
    </div>
  );
});

CustomNode.displayName = "CustomNode";
