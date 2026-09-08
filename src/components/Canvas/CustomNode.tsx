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
      return <Terminal className="w-4 h-4 text-amber-500" />;
    case "file":
      return <FileCode className="w-4 h-4 text-blue-500" />;
    case "registry":
      return <Database className="w-4 h-4 text-purple-500" />;
    case "network":
      return <Globe className="w-4 h-4 text-emerald-500" />;
    case "user":
      return <User className="w-4 h-4 text-rose-500" />;
    case "host":
      return <Server className="w-4 h-4 text-indigo-500" />;
    default:
      return <Binary className="w-4 h-4 text-muted-foreground" />;
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

  const glowBorderClass = selected
    ? isRed
      ? "ring-2 ring-rose-500 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.35)]"
      : "ring-2 ring-cyan-500 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.35)]"
    : isActiveStage
    ? isRed
      ? "border-rose-400 dark:border-rose-500/70 shadow-[0_4px_16px_rgba(244,63,94,0.15)] hover:border-rose-500"
      : "border-cyan-400 dark:border-cyan-500/70 shadow-[0_4px_16px_rgba(6,182,212,0.15)] hover:border-cyan-500"
    : "border-border hover:border-muted-foreground/40 shadow-sm";

  return (
    <div
      className={`relative group rounded-xl bg-card/95 backdrop-blur-md border transition-all duration-300 min-w-[290px] max-w-[340px] p-4 select-none text-card-foreground ${glowBorderClass} ${
        isDimmed ? "opacity-35 grayscale-[50%]" : "opacity-100"
      }`}
    >
      {/* ReactFlow connection handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2.5 !h-2.5 !border-2 !bg-muted-foreground/60 !border-card group-hover:!bg-cyan-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2.5 !h-2.5 !border-2 !bg-muted-foreground/60 !border-card group-hover:!bg-rose-500"
      />

      {/* Header: Type icon & MITRE ID badge */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5">
          <div className="p-1.5 rounded-lg border border-border bg-muted/70">
            {getEntityIcon(data.entityType)}
          </div>
          <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-muted-foreground">
            {getEntityTypeLabel(data.entityType)}
          </span>
        </div>

        {data.techniqueId && (
          <div
            className={`px-2 py-0.5 rounded text-[10.5px] font-mono font-bold tracking-tight border ${
              isRed
                ? "bg-rose-500/15 border-rose-200 dark:border-rose-800/70 text-rose-700 dark:text-rose-300"
                : "bg-cyan-500/15 border-cyan-200 dark:border-cyan-800/70 text-cyan-700 dark:text-cyan-300"
            }`}
          >
            {data.techniqueId}
          </div>
        )}
      </div>

      {/* Primary Label - cleanly wrapped, never truncated */}
      <div className="mb-2.5">
        <h4 className="text-[13.5px] font-bold tracking-tight leading-snug break-words text-foreground">
          {data.label}
        </h4>
        {data.subLabel && (
          <p className="text-[11px] font-mono mt-0.5 break-words text-muted-foreground">
            {data.subLabel}
          </p>
        )}
      </div>

      {/* Perspective Info Pill - Full text, never ellipsis */}
      <div className="mt-2.5 pt-2.5 border-t border-border flex items-start justify-between gap-2 text-[11px]">
        {isRed ? (
          <div className="flex items-start gap-1.5 flex-1 min-w-0">
            <Flame className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
            <span className="text-[11px] font-medium leading-tight text-rose-700 dark:text-rose-300/90">
              {data.redDetails.attackerIntent || "Offensive Execution"}
            </span>
          </div>
        ) : (
          <div className="flex items-start gap-1.5 flex-1 min-w-0">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
            <span className="text-[11px] font-medium leading-tight text-cyan-800 dark:text-cyan-300/90">
              {data.blueDetails.rules.length} Rule(s) &bull; {data.blueDetails.telemetry.length} Log(s)
            </span>
          </div>
        )}

        {isActiveStage && (
          <span className="relative flex h-2 w-2 shrink-0 mt-1">
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
