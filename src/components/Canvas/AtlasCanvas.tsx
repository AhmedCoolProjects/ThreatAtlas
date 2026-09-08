"use client";

import React, { useEffect, useMemo, useCallback, useState } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useReactFlow,
  ReactFlowProvider,
  NodeMouseHandler,
  EdgeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { CustomNode } from "./CustomNode";
import { CustomEdge } from "./CustomEdge";
import { useAtlasStore } from "@/store/useAtlasStore";
import { AtlasNode, AtlasEdge, EntityType } from "@/types/campaign";
import { useTheme } from "next-themes";
import {
  Search,
  Shield,
  Crosshair,
  Map,
} from "lucide-react";

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  default: CustomEdge,
};

function CanvasInner() {
  const { fitView, fitBounds } = useReactFlow();

  const campaign = useAtlasStore((state) => state.getCurrentCampaign());
  const activeStage = useAtlasStore((state) => state.activeStage);
  const perspective = useAtlasStore((state) => state.perspective);
  const selectedNodeId = useAtlasStore((state) => state.selectedNodeId);
  const selectNode = useAtlasStore((state) => state.selectNode);
  const selectEdge = useAtlasStore((state) => state.selectEdge);
  const searchQuery = useAtlasStore((state) => state.searchQuery);
  const setSearchQuery = useAtlasStore((state) => state.setSearchQuery);
  const entityFilter = useAtlasStore((state) => state.entityFilter);
  const setEntityFilter = useAtlasStore((state) => state.setEntityFilter);
  const { resolvedTheme } = useTheme();

  const [showMiniMap, setShowMiniMap] = useState(false);

  const isLight = resolvedTheme === "light";
  const isRed = perspective === "red";

  // Sync selected state into nodes
  const nodes: AtlasNode[] = useMemo(() => {
    return campaign.nodes.map((node) => ({
      ...node,
      selected: node.id === selectedNodeId,
    }));
  }, [campaign.nodes, selectedNodeId]);

  const edges: AtlasEdge[] = useMemo(() => {
    return campaign.edges;
  }, [campaign.edges]);

  // Stage transition camera adjustment with generous bounding box
  useEffect(() => {
    const stageNodes = campaign.nodes.filter((n) => n.data.stage === activeStage);
    if (stageNodes.length > 0) {
      const minX = Math.min(...stageNodes.map((n) => n.position.x));
      const maxX = Math.max(...stageNodes.map((n) => n.position.x + 360));
      const minY = Math.min(...stageNodes.map((n) => n.position.y));
      const maxY = Math.max(...stageNodes.map((n) => n.position.y + 200));

      const padding = 160;
      fitBounds(
        {
          x: minX - padding,
          y: minY - padding,
          width: Math.max(maxX - minX + padding * 2, 850),
          height: Math.max(maxY - minY + padding * 2, 550),
        },
        { duration: 600 }
      );
    } else {
      fitView({ duration: 500, padding: 0.2 });
    }
  }, [activeStage, campaign.id, campaign.nodes, fitBounds, fitView]);

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const handleEdgeClick: EdgeMouseHandler = useCallback(
    (_, edge) => {
      selectEdge(edge.id);
    },
    [selectEdge]
  );

  const handlePaneClick = useCallback(() => {
    selectNode(null);
    selectEdge(null);
  }, [selectNode, selectEdge]);

  const currentStageDef = campaign.stages.find((s) => s.id === activeStage);
  const activeNodesCount = campaign.nodes.filter((n) => n.data.stage === activeStage).length;

  const filterOptions: { label: string; value: EntityType | "all" }[] = [
    { label: "All Entities", value: "all" },
    { label: "Process", value: "process" },
    { label: "File", value: "file" },
    { label: "Network", value: "network" },
    { label: "Registry", value: "registry" },
    { label: "User", value: "user" },
    { label: "Host", value: "host" },
  ];

  return (
    <div className="relative w-full h-full overflow-hidden bg-background text-foreground transition-colors">
      {/* HUD Bar - Top Left */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 max-w-md pointer-events-none">
        <div className="flex items-center gap-2.5 pointer-events-auto backdrop-blur-md px-3.5 py-2 rounded-xl border border-border bg-card/95 text-card-foreground shadow-sm">
          <div
            className={`p-1.5 rounded-lg ${
              isRed
                ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                : "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400"
            }`}
          >
            {isRed ? <Crosshair className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground">
                {currentStageDef?.shortTitle || "Stage Overview"}
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-medium bg-muted text-muted-foreground border border-border">
                {activeNodesCount} active node{activeNodesCount === 1 ? "" : "s"}
              </span>
            </div>
            <p className="text-[11px] truncate max-w-xs mt-0.5 text-muted-foreground">
              {currentStageDef?.title}
            </p>
          </div>
        </div>

        {/* Quick Filter & Search Bar */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search MITRE, process, or artifact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 backdrop-blur-md border border-border bg-card/95 text-card-foreground placeholder-muted-foreground rounded-xl text-xs transition-colors focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
            />
          </div>

          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value as EntityType | "all")}
            className="px-2.5 py-1.5 backdrop-blur-md border border-border bg-card/95 text-card-foreground rounded-xl text-xs transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
          >
            {filterOptions.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="bg-card text-card-foreground"
              >
                {opt.label}
              </option>
            ))}
          </select>

          {/* MiniMap Toggle Button */}
          <button
            onClick={() => setShowMiniMap(!showMiniMap)}
            className={`p-2 rounded-xl border border-border backdrop-blur-md transition-all ${
              showMiniMap
                ? "bg-primary/15 border-primary/40 text-primary shadow-sm"
                : "bg-card/95 text-muted-foreground hover:text-foreground shadow-sm"
            }`}
            title="Toggle MiniMap Overview"
          >
            <Map className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ReactFlow Interactive Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        onPaneClick={handlePaneClick}
        minZoom={0.2}
        maxZoom={2.0}
        defaultViewport={{ x: 100, y: 100, zoom: 0.85 }}
        attributionPosition="bottom-left"
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={18}
          size={1.2}
          color={isLight ? "#94a3b8" : "#334155"}
          className={isLight ? "opacity-45" : "opacity-75"}
        />

        {/* Viewport Controls - clean positioning on bottom-left above scrubber */}
        <Controls
          position="bottom-left"
          style={{ bottom: "5.5rem", left: "1.25rem" }}
          showInteractive={false}
          className="!backdrop-blur-md !rounded-xl !shadow-sm !bg-card/95 !border-border [&>button]:!bg-transparent [&>button]:!border-border [&>button]:!text-card-foreground hover:[&>button]:!bg-muted"
        />

        {/* MiniMap - optional toggle in top-right */}
        {showMiniMap && (
          <MiniMap
            position="top-right"
            style={{ top: "1rem", right: "1rem", width: 190, height: 120 }}
            nodeColor={(n) => {
              const data = (n as AtlasNode).data;
              if (data?.stage !== activeStage) return isLight ? "#cbd5e1" : "#1e293b";
              if (data?.entityType === "process") return "#f59e0b";
              if (data?.entityType === "network") return "#10b981";
              if (data?.entityType === "file") return "#3b82f6";
              if (data?.entityType === "user") return "#f43f5e";
              if (data?.entityType === "registry") return "#a855f7";
              return "#06b6d4";
            }}
            maskColor={isLight ? "rgba(226, 232, 240, 0.75)" : "rgba(5, 8, 17, 0.85)"}
            className="!backdrop-blur-md !border !border-border !rounded-xl !overflow-hidden !shadow-lg !bg-card"
            zoomable
            pannable
          />
        )}
      </ReactFlow>
    </div>
  );
}

export function AtlasCanvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}
