"use client";

import React from "react";
import { useAtlasStore } from "@/store/useAtlasStore";
import { CodeBlock } from "@/components/Common/CodeBlock";
import {
  X,
  ExternalLink,
  Terminal,
  Shield,
  Flame,
  AlertTriangle,
  FileCode,
  CheckCircle2,
  Database,
  Globe,
  User,
  Server,
  Binary,
  Layers,
  Info,
} from "lucide-react";
import { EntityType } from "@/types/campaign";

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
      return <Binary className="w-4 h-4 text-slate-500" />;
  }
}

export function InspectorPanel() {
  const campaign = useAtlasStore((state) => state.getCurrentCampaign());
  const selectedNodeId = useAtlasStore((state) => state.selectedNodeId);
  const isInspectorOpen = useAtlasStore((state) => state.isInspectorOpen);
  const setInspectorOpen = useAtlasStore((state) => state.setInspectorOpen);
  const perspective = useAtlasStore((state) => state.perspective);
  const inspectorTab = useAtlasStore((state) => state.inspectorTab);
  const setInspectorTab = useAtlasStore((state) => state.setInspectorTab);
  const theme = useAtlasStore((state) => state.theme);

  const isLight = theme === "light";
  const isRed = perspective === "red";

  if (!isInspectorOpen) return null;

  const node = campaign.nodes.find((n) => n.id === selectedNodeId);

  // Empty state if nothing selected
  if (!node) {
    return (
      <aside
        className={`w-full lg:w-[420px] h-full border-l flex flex-col z-20 backdrop-blur-md select-none transition-colors ${
          isLight
            ? "bg-white/98 border-slate-200 text-slate-900"
            : "bg-slate-950/95 border-slate-800/90 text-slate-100"
        }`}
      >
        <div
          className={`flex items-center justify-between p-4 border-b ${
            isLight ? "border-slate-200" : "border-slate-800/80"
          }`}
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-400" />
            <h3
              className={`text-sm font-bold ${
                isLight ? "text-slate-800" : "text-slate-200"
              }`}
            >
              Entity Inspector
            </h3>
          </div>
          <button
            onClick={() => setInspectorOpen(false)}
            className={`p-1 rounded-md transition-colors ${
              isLight
                ? "hover:bg-slate-100 text-slate-500 hover:text-slate-800"
                : "hover:bg-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div
            className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-3 ${
              isLight
                ? "bg-slate-100 border-slate-200"
                : "bg-slate-900 border-slate-800"
            }`}
          >
            <Layers className="w-6 h-6 text-slate-400" />
          </div>
          <p
            className={`text-sm font-bold ${
              isLight ? "text-slate-800" : "text-slate-300"
            }`}
          >
            No Entity Selected
          </p>
          <p
            className={`text-xs mt-1 max-w-xs ${
              isLight ? "text-slate-500" : "text-slate-500"
            }`}
          >
            Click any node in the causal graph to inspect execution mechanics, raw Sysmon logs, and Sigma detection rules.
          </p>
        </div>
      </aside>
    );
  }

  const { data } = node;

  return (
    <aside
      className={`w-full lg:w-[450px] h-full border-l flex flex-col z-20 backdrop-blur-md overflow-hidden select-text transition-colors ${
        isLight
          ? "bg-white/98 border-slate-200 text-slate-900 shadow-xl"
          : "bg-slate-950/95 border-slate-800/90 text-slate-100"
      }`}
    >
      {/* Header */}
      <div
        className={`p-4 border-b ${
          isLight ? "bg-slate-50/80 border-slate-200" : "bg-slate-900/40 border-slate-800/80"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`p-2 rounded-xl border shrink-0 ${
                isLight ? "bg-white border-slate-200 shadow-sm" : "bg-slate-900 border-slate-800"
              }`}
            >
              {getEntityIcon(data.entityType)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-mono uppercase font-bold tracking-wider px-1.5 py-0.2 rounded border ${
                    isLight
                      ? "bg-slate-200 text-slate-700 border-slate-300"
                      : "bg-slate-900 text-slate-400 border-slate-800"
                  }`}
                >
                  {data.entityType}
                </span>
                {data.techniqueId && (
                  <a
                    href={`https://attack.mitre.org/techniques/${data.techniqueId.replace(".", "/")}`}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center gap-1 text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded border transition-colors ${
                      isLight
                        ? "bg-cyan-50 border-cyan-200 text-cyan-800 hover:bg-cyan-100"
                        : "bg-cyan-950/70 border-cyan-800 text-cyan-300 hover:bg-cyan-900"
                    }`}
                    title="View technique on MITRE ATT&CK"
                  >
                    <span>{data.techniqueId}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
              <h3
                className={`text-base font-bold mt-1 leading-snug break-words ${
                  isLight ? "text-slate-900" : "text-slate-100"
                }`}
              >
                {data.label}
              </h3>
              {data.subLabel && (
                <p
                  className={`text-xs font-mono mt-0.5 break-words ${
                    isLight ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  {data.subLabel}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => setInspectorOpen(false)}
            className={`p-1.5 rounded-lg transition-colors shrink-0 ${
              isLight
                ? "hover:bg-slate-200 text-slate-500 hover:text-slate-900"
                : "hover:bg-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab navigation */}
        <div
          className={`grid grid-cols-3 gap-1 mt-4 p-1 rounded-xl border select-none ${
            isLight
              ? "bg-slate-100 border-slate-200"
              : "bg-slate-900/80 border-slate-800"
          }`}
        >
          <button
            onClick={() => setInspectorTab("anatomy")}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              inspectorTab === "anatomy"
                ? isLight
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                  : "bg-slate-800 text-white shadow-sm border border-slate-700"
                : isLight
                ? "text-slate-600 hover:text-slate-900"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>Anatomy</span>
          </button>

          <button
            onClick={() => setInspectorTab("telemetry")}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              inspectorTab === "telemetry"
                ? isLight
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                  : "bg-slate-800 text-white shadow-sm border border-slate-700"
                : isLight
                ? "text-slate-600 hover:text-slate-900"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-500" />
            <span>Telemetry</span>
          </button>

          <button
            onClick={() => setInspectorTab("rules")}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              inspectorTab === "rules"
                ? isLight
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                  : "bg-slate-800 text-white shadow-sm border border-slate-700"
                : isLight
                ? "text-slate-600 hover:text-slate-900"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>Sigma / Rules</span>
          </button>
        </div>
      </div>

      {/* Content Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {/* TAB 1: ANATOMY & ATTACK MECHANICS */}
        {inspectorTab === "anatomy" && (
          <div className="space-y-4 animate-in fade-in-50 duration-200">
            {/* Summary card */}
            <div
              className={`p-3.5 rounded-xl border ${
                isLight
                  ? "bg-slate-50 border-slate-200"
                  : "bg-slate-900/60 border-slate-800/80"
              }`}
            >
              <h4
                className={`text-xs font-bold uppercase tracking-wider font-mono mb-1.5 ${
                  isLight ? "text-slate-700" : "text-slate-300"
                }`}
              >
                Technical Anatomy
              </h4>
              <p
                className={`text-xs leading-relaxed ${
                  isLight ? "text-slate-700" : "text-slate-300"
                }`}
              >
                {data.redDetails.summary}
              </p>
            </div>

            {/* Parent-child & tool metadata */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {data.redDetails.toolOrMalware && (
                <div
                  className={`p-2.5 rounded-lg border ${
                    isLight
                      ? "bg-slate-50 border-slate-200"
                      : "bg-slate-900/50 border-slate-800/80"
                  }`}
                >
                  <span
                    className={`text-[10px] font-mono uppercase block ${
                      isLight ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    Tool / Malware
                  </span>
                  <span className="font-bold text-rose-600 dark:text-rose-300 truncate block mt-0.5">
                    {data.redDetails.toolOrMalware}
                  </span>
                </div>
              )}

              {data.redDetails.parentProcess && (
                <div
                  className={`p-2.5 rounded-lg border ${
                    isLight
                      ? "bg-slate-50 border-slate-200"
                      : "bg-slate-900/50 border-slate-800/80"
                  }`}
                >
                  <span
                    className={`text-[10px] font-mono uppercase block ${
                      isLight ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    Parent Process
                  </span>
                  <span
                    className={`font-mono truncate block mt-0.5 ${
                      isLight ? "text-slate-800" : "text-slate-200"
                    }`}
                  >
                    {data.redDetails.parentProcess}
                  </span>
                </div>
              )}
            </div>

            {/* Command Line Box */}
            {data.redDetails.commandLine && (
              <div>
                <span
                  className={`text-xs font-bold uppercase tracking-wider font-mono block mb-1.5 ${
                    isLight ? "text-slate-700" : "text-slate-300"
                  }`}
                >
                  Execution Payload / Command Line
                </span>
                <CodeBlock
                  code={data.redDetails.commandLine}
                  language="bash"
                  title="Execution Command / Network Signature"
                  maxHeight="max-h-44"
                />
              </div>
            )}

            {/* Attack Mechanics Steps */}
            <div>
              <span
                className={`text-xs font-bold uppercase tracking-wider font-mono block mb-2 ${
                  isLight ? "text-slate-700" : "text-slate-300"
                }`}
              >
                Execution Mechanics Breakdown
              </span>
              <ul className="space-y-2">
                {data.redDetails.mechanics.map((step, idx) => (
                  <li
                    key={idx}
                    className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs ${
                      isLight
                        ? "bg-slate-50 border-slate-200 text-slate-700"
                        : "bg-slate-900/40 border-slate-800/60 text-slate-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 border ${
                        isLight
                          ? "bg-rose-100 border-rose-200 text-rose-700"
                          : "bg-rose-950/70 border-rose-800/60 text-rose-300"
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* TAB 2: TELEMETRY & LOGS */}
        {inspectorTab === "telemetry" && (
          <div className="space-y-4 animate-in fade-in-50 duration-200">
            {/* Telemetry overview */}
            <div
              className={`p-3.5 rounded-xl border ${
                isLight
                  ? "bg-slate-50 border-slate-200"
                  : "bg-slate-900/60 border-slate-800/80"
              }`}
            >
              <h4
                className={`text-xs font-bold uppercase tracking-wider font-mono mb-1.5 ${
                  isLight ? "text-slate-700" : "text-slate-300"
                }`}
              >
                Blue Team Telemetry Footprint
              </h4>
              <p
                className={`text-xs leading-relaxed ${
                  isLight ? "text-slate-700" : "text-slate-300"
                }`}
              >
                {data.blueDetails.summary}
              </p>
            </div>

            {/* Telemetry Artifacts */}
            <div>
              <span
                className={`text-xs font-bold uppercase tracking-wider font-mono block mb-2 ${
                  isLight ? "text-slate-700" : "text-slate-300"
                }`}
              >
                Authentic Raw Telemetry Samples
              </span>

              {data.blueDetails.telemetry.map((art, idx) => (
                <div key={idx} className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                          isLight
                            ? "bg-cyan-100 text-cyan-800 border-cyan-200"
                            : "bg-cyan-950 text-cyan-300 border border-cyan-800"
                        }`}
                      >
                        {art.source}
                      </span>
                      {art.eventId && (
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                            isLight
                              ? "bg-slate-200 text-slate-700 border-slate-300"
                              : "bg-slate-800 text-slate-300 border-slate-700"
                          }`}
                        >
                          EventID {art.eventId}
                        </span>
                      )}
                    </div>
                  </div>
                  <p
                    className={`text-xs mb-1.5 ${
                      isLight ? "text-slate-600" : "text-slate-400"
                    }`}
                  >
                    {art.description}
                  </p>
                  <CodeBlock
                    code={art.rawSample}
                    language={art.format || "xml"}
                    title={`${art.source} Log Sample`}
                    maxHeight="max-h-72"
                  />
                </div>
              ))}
            </div>

            {/* Detection Pitfalls & Blind Spots */}
            {data.blueDetails.detectionPitfalls.length > 0 && (
              <div
                className={`p-3.5 rounded-xl border ${
                  isLight
                    ? "bg-amber-50 border-amber-200"
                    : "bg-amber-950/30 border-amber-800/50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <h4
                    className={`text-xs font-bold uppercase font-mono tracking-wider ${
                      isLight ? "text-amber-800" : "text-amber-300"
                    }`}
                  >
                    Detection Blind Spots & Pitfalls
                  </h4>
                </div>
                <ul className="space-y-1.5">
                  {data.blueDetails.detectionPitfalls.map((pitfall, idx) => (
                    <li
                      key={idx}
                      className={`text-xs leading-relaxed list-disc list-inside ${
                        isLight ? "text-amber-900" : "text-amber-200/90"
                      }`}
                    >
                      {pitfall}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DETECTION RULES & SIGMA */}
        {inspectorTab === "rules" && (
          <div className="space-y-4 animate-in fade-in-50 duration-200">
            {/* Rules list */}
            <div>
              <span
                className={`text-xs font-bold uppercase tracking-wider font-mono block mb-2 ${
                  isLight ? "text-slate-700" : "text-slate-300"
                }`}
              >
                Production Detection Rules ({data.blueDetails.rules.length})
              </span>

              {data.blueDetails.rules.map((rule, idx) => (
                <div key={idx} className="mb-4">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                          isLight
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : "bg-emerald-950 text-emerald-300 border-emerald-800"
                        }`}
                      >
                        {rule.format}
                      </span>
                      {rule.severity && (
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                            rule.severity === "critical"
                              ? isLight
                                ? "bg-rose-100 text-rose-800 border border-rose-200"
                                : "bg-rose-950 text-rose-300 border border-rose-800"
                              : rule.severity === "high"
                              ? isLight
                                ? "bg-amber-100 text-amber-800 border border-amber-200"
                                : "bg-amber-950 text-amber-300 border border-amber-800"
                              : isLight
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : "bg-blue-950 text-blue-300 border border-blue-800"
                          }`}
                        >
                          {rule.severity}
                        </span>
                      )}
                    </div>
                  </div>

                  <h4
                    className={`text-xs font-bold mb-1 ${
                      isLight ? "text-slate-900" : "text-slate-200"
                    }`}
                  >
                    {rule.title}
                  </h4>

                  <CodeBlock
                    code={rule.ruleContent}
                    language={rule.format.toLowerCase().includes("sigma") ? "sigma" : "yaml"}
                    title={`${rule.format} Rule Definition`}
                    maxHeight="max-h-80"
                  />
                </div>
              ))}
            </div>

            {/* Defense In Depth Checklist */}
            <div
              className={`p-3.5 rounded-xl border ${
                isLight
                  ? "bg-slate-50 border-slate-200"
                  : "bg-slate-900/60 border-slate-800/80"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <h4
                  className={`text-xs font-bold uppercase font-mono tracking-wider ${
                    isLight ? "text-slate-800" : "text-slate-200"
                  }`}
                >
                  Detection Engineering Advice
                </h4>
              </div>
              <ul
                className={`space-y-1.5 text-xs ${
                  isLight ? "text-slate-700" : "text-slate-300"
                }`}
              >
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">&bull;</span>
                  <span>Deploy Sysmon with SwiftOnSecurity or Modular configuration.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">&bull;</span>
                  <span>Forward Windows Security Event 4688 with full command line auditing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">&bull;</span>
                  <span>Enforce AppLocker / WDAC application control on critical servers.</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
