"use client";

import React from "react";
import { useAtlasStore } from "@/store/useAtlasStore";
import {
  X,
  HelpCircle,
  Flame,
  ShieldCheck,
  Keyboard,
  Compass,
  GitBranch,
  Terminal,
  Layers,
} from "lucide-react";

export function HelpModal() {
  const isHelpModalOpen = useAtlasStore((state) => state.isHelpModalOpen);
  const setHelpModalOpen = useAtlasStore((state) => state.setHelpModalOpen);

  if (!isHelpModalOpen) return null;

  const shortcuts = [
    { key: "← / →", desc: "Step between attack lifecycle stages" },
    { key: "Space", desc: "Play or pause automatic lifecycle tour" },
    { key: "R", desc: "Switch to Red Team (Attack Mechanics) perspective" },
    { key: "B", desc: "Switch to Blue Team (Detection Anatomy) perspective" },
    { key: "I", desc: "Toggle right-hand Inspector Sidebar" },
    { key: "Esc", desc: "Deselect active node or close open modal" },
    { key: "?", desc: "Open this interactive guide and shortcut cheat sheet" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none animate-in fade-in-50 duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Threat Atlas &bull; User Guide & Concepts
              </h2>
              <p className="text-xs text-slate-400">
                Interactive APT causal provenance, attack anatomy, and detection engineering platform.
              </p>
            </div>
          </div>

          <button
            onClick={() => setHelpModalOpen(false)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 scrollbar-thin">
          {/* Core Concept Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs">
                <GitBranch className="w-4 h-4" />
                <span>1. Causal Provenance</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Visualizes actual process spawns, network connections, memory injections, and file writes linking the attack path.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs">
                <Flame className="w-4 h-4" />
                <span>2. Dual Perspective</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Toggle between <strong>Red Team</strong> (living-off-the-land commands, exploits) and <strong>Blue Team</strong> (Sysmon telemetry, Sigma rules).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                <Terminal className="w-4 h-4" />
                <span>3. Production Rules</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Copy authentic Sigma rules, YARA signatures, and inspect genuine Sysmon XML/JSON logs for each step.
              </p>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Keyboard className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider">
                Keyboard Shortcuts & Navigation
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {shortcuts.map((sc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/80 text-xs"
                >
                  <span className="text-slate-300">{sc.desc}</span>
                  <kbd className="px-2 py-1 rounded bg-slate-800 text-cyan-300 font-mono text-[11px] border border-slate-700 font-semibold shrink-0 ml-2">
                    {sc.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>

          {/* Entity Legend */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
            <h4 className="text-xs font-semibold text-slate-300 uppercase font-mono tracking-wider mb-2.5">
              Entity Legend
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Process (PROC)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                <span>File (FILE)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Network / C2 (NET)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                <span>Registry / Key (REG)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <span>Identity / User (USER)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                <span>Host / Asset (HOST)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/30 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500">
            Threat Atlas &bull; Open-Source Cybersecurity Pedagogical Lab
          </span>
          <button
            onClick={() => setHelpModalOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
