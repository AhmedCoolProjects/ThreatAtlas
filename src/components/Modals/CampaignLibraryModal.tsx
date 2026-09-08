"use client";

import React from "react";
import { useAtlasStore } from "@/store/useAtlasStore";
import { CAMPAIGNS } from "@/data/campaigns";
import {
  X,
  FolderKanban,
  Calendar,
  Crosshair,
  Layers,
  ArrowRight,
  Check,
  Building,
} from "lucide-react";

export function CampaignLibraryModal() {
  const isCampaignDrawerOpen = useAtlasStore(
    (state) => state.isCampaignDrawerOpen
  );
  const setCampaignDrawerOpen = useAtlasStore(
    (state) => state.setCampaignDrawerOpen
  );
  const activeCampaignId = useAtlasStore((state) => state.activeCampaignId);
  const setCampaign = useAtlasStore((state) => state.setCampaign);

  if (!isCampaignDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md select-none animate-in fade-in-50 duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-card text-card-foreground border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl border border-border bg-secondary text-primary">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                APT Campaign Library
                <span className="text-xs font-mono font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border">
                  {CAMPAIGNS.length} In-Depth Datasets
                </span>
              </h2>
              <p className="text-xs text-muted-foreground">
                Select an Advanced Persistent Threat (APT) lifecycle to inspect provenance causal nodes, Sysmon telemetry, and Sigma rules.
              </p>
            </div>
          </div>

          <button
            onClick={() => setCampaignDrawerOpen(false)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Campaign Cards Grid */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 scrollbar-thin">
          {CAMPAIGNS.map((c) => {
            const isSelected = c.id === activeCampaignId;

            return (
              <div
                key={c.id}
                onClick={() => {
                  setCampaign(c.id);
                  setCampaignDrawerOpen(false);
                }}
                className={`group relative p-5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-primary/10 border-primary shadow-md ring-1 ring-primary/40"
                    : "bg-card border-border hover:border-primary/50 hover:bg-secondary/50 shadow-sm"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-500/15 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300">
                        {c.actor}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {c.year}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Building className="w-3.5 h-3.5" />
                        {c.targetSector}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {c.title}
                    </h3>

                    <p className="text-xs text-foreground/80 leading-relaxed">
                      {c.summary}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono text-muted-foreground">
                      <div className="flex items-center gap-1 text-foreground">
                        <Crosshair className="w-3.5 h-3.5 text-rose-500" />
                        <span className="text-muted-foreground">Vector:</span>
                        <span>{c.attackVector}</span>
                      </div>
                      <div className="flex items-center gap-1 text-foreground">
                        <Layers className="w-3.5 h-3.5 text-cyan-500" />
                        <span>{c.nodes.length} Graph Nodes</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    {isSelected ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/20 border border-primary/40 text-primary text-xs font-semibold">
                        <Check className="w-3.5 h-3.5" />
                        <span>Active Campaign</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary group-hover:bg-primary group-hover:text-primary-foreground text-foreground text-xs font-medium transition-colors border border-border">
                        <span>Load Atlas</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
