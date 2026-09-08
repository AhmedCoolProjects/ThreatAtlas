"use client";

import React from "react";
import { useAtlasStore } from "@/store/useAtlasStore";
import { CAMPAIGNS } from "@/data/campaigns";
import {
  X,
  FolderKanban,
  ShieldAlert,
  Calendar,
  Crosshair,
  Layers,
  ArrowRight,
  Flame,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none animate-in fade-in-50 duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                APT Campaign Library
                <span className="text-xs font-mono font-normal text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {CAMPAIGNS.length} In-Depth Datasets
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Select an Advanced Persistent Threat (APT) lifecycle to inspect provenance causal nodes, Sysmon telemetry, and Sigma rules.
              </p>
            </div>
          </div>

          <button
            onClick={() => setCampaignDrawerOpen(false)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
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
                    ? "bg-slate-900/80 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/50"
                    : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-950/70 border border-rose-800/60 text-rose-300">
                        {c.actor}
                      </span>
                      <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {c.year}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Building className="w-3.5 h-3.5" />
                        {c.targetSector}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {c.title}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {c.summary}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono text-slate-400">
                      <div className="flex items-center gap-1 text-slate-300">
                        <Crosshair className="w-3.5 h-3.5 text-rose-400" />
                        <span>Vector:</span>
                        <span className="text-slate-400">{c.attackVector}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-300">
                        <Layers className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{c.nodes.length} Graph Nodes</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    {isSelected ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-semibold">
                        <Check className="w-3.5 h-3.5" />
                        <span>Active Campaign</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 group-hover:bg-cyan-600 text-slate-300 group-hover:text-white text-xs font-medium transition-colors">
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
