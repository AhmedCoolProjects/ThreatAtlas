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
      return <Binary className="w-4 h-4 text-muted-foreground" />;
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

  const isRed = perspective === "red";

  if (!isInspectorOpen) return null;

  const node = campaign.nodes.find((n) => n.id === selectedNodeId);

  // Empty state if nothing selected
  if (!node) {
    return (
      <aside className="w-full lg:w-[420px] h-full border-l border-border bg-card text-card-foreground flex flex-col z-20 select-none transition-colors">
        <div className="flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-bold text-foreground">
              Entity Inspector
            </h3>
          </div>
          <button
            onClick={() => setInspectorOpen(false)}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-card">
          <div className="w-12 h-12 rounded-2xl border border-border bg-secondary flex items-center justify-center mb-3">
            <Layers className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-bold text-foreground">
            No Entity Selected
          </p>
          <p className="text-xs mt-1 max-w-xs text-muted-foreground">
            Click any node in the causal graph to inspect execution mechanics, raw Sysmon logs, and Sigma detection rules.
          </p>
        </div>
      </aside>
    );
  }

  const { data } = node;

  return (
    <aside className="w-full lg:w-[460px] h-full border-l border-border bg-card text-card-foreground flex flex-col z-20 overflow-hidden select-text transition-colors shadow-xl">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl border border-border bg-secondary shadow-inner shrink-0">
              {getEntityIcon(data.entityType)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-1.5 py-0.2 rounded border border-border bg-muted text-muted-foreground">
                  {data.entityType}
                </span>
                {data.techniqueId && (
                  <a
                    href={`https://attack.mitre.org/techniques/${data.techniqueId.replace(".", "/")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded border border-cyan-300 dark:border-cyan-800 bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 hover:opacity-80 transition-colors"
                    title="View technique on MITRE ATT&CK"
                  >
                    <span>{data.techniqueId}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
              <h3 className="text-base font-bold mt-1 leading-snug break-words text-foreground">
                {data.label}
              </h3>
              {data.subLabel && (
                <p className="text-xs font-mono mt-0.5 break-words text-muted-foreground">
                  {data.subLabel}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => setInspectorOpen(false)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="grid grid-cols-3 gap-1 mt-4 p-1 rounded-xl border border-border bg-secondary/70 select-none">
          <button
            onClick={() => setInspectorTab("anatomy")}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              inspectorTab === "anatomy"
                ? "bg-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>Anatomy</span>
          </button>

          <button
            onClick={() => setInspectorTab("telemetry")}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              inspectorTab === "telemetry"
                ? "bg-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-500" />
            <span>Telemetry</span>
          </button>

          <button
            onClick={() => setInspectorTab("rules")}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              inspectorTab === "rules"
                ? "bg-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>Sigma / Rules</span>
          </button>
        </div>
      </div>

      {/* Content Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin bg-card">
        {/* TAB 1: ANATOMY & ATTACK MECHANICS */}
        {inspectorTab === "anatomy" && (
          <div className="space-y-4 animate-in fade-in-50 duration-200">
            {/* Summary card */}
            <div className="p-3.5 rounded-xl border border-border bg-card shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider font-mono mb-1.5 text-foreground">
                Technical Anatomy
              </h4>
              <p className="text-xs leading-relaxed text-foreground/80">
                {data.redDetails.summary}
              </p>
            </div>

            {/* Parent-child & tool metadata */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {data.redDetails.toolOrMalware && (
                <div className="p-2.5 rounded-lg border border-border bg-card shadow-sm">
                  <span className="text-[10px] font-mono uppercase block text-muted-foreground">
                    Tool / Malware
                  </span>
                  <span className="font-bold text-rose-600 dark:text-rose-400 break-words leading-tight block mt-1">
                    {data.redDetails.toolOrMalware}
                  </span>
                </div>
              )}

              {data.redDetails.parentProcess && (
                <div className="p-2.5 rounded-lg border border-border bg-card shadow-sm">
                  <span className="text-[10px] font-mono uppercase block text-muted-foreground">
                    Parent Process
                  </span>
                  <span className="font-mono break-words leading-tight block mt-1 text-foreground">
                    {data.redDetails.parentProcess}
                  </span>
                </div>
              )}
            </div>

            {/* Command Line Box */}
            {data.redDetails.commandLine && (
              <div>
                <span className="text-xs font-bold uppercase tracking-wider font-mono block mb-1.5 text-foreground">
                  Execution Payload / Command Line
                </span>
                <CodeBlock
                  code={data.redDetails.commandLine}
                  language="bash"
                  title="Execution Command / Network Signature"
                  maxHeight="max-h-48"
                />
              </div>
            )}

            {/* Attack Mechanics Steps */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider font-mono block mb-2 text-foreground">
                Execution Mechanics Breakdown
              </span>
              <ul className="space-y-2">
                {data.redDetails.mechanics.map((step, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 p-2.5 rounded-lg border border-border bg-card text-xs text-foreground/90 shadow-sm"
                  >
                    <div className="w-5 h-5 rounded-md font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 border border-rose-300 dark:border-rose-800 bg-rose-500/15 text-rose-700 dark:text-rose-300">
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
            <div className="p-3.5 rounded-xl border border-border bg-card shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider font-mono mb-1.5 text-foreground">
                Blue Team Telemetry Footprint
              </h4>
              <p className="text-xs leading-relaxed text-foreground/80">
                {data.blueDetails.summary}
              </p>
            </div>

            {/* Telemetry Artifacts */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider font-mono block mb-2 text-foreground">
                Authentic Raw Telemetry Samples
              </span>

              {data.blueDetails.telemetry.map((art, idx) => (
                <div key={idx} className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold border border-cyan-300 dark:border-cyan-800 bg-cyan-500/15 text-cyan-700 dark:text-cyan-300">
                        {art.source}
                      </span>
                      {art.eventId && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono border border-border bg-muted text-muted-foreground">
                          EventID {art.eventId}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs mb-1.5 text-muted-foreground">
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
              <div className="p-3.5 rounded-xl border border-amber-300 dark:border-amber-800/60 bg-amber-500/10">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-amber-800 dark:text-amber-300">
                    Detection Blind Spots & Pitfalls
                  </h4>
                </div>
                <ul className="space-y-1.5">
                  {data.blueDetails.detectionPitfalls.map((pitfall, idx) => (
                    <li
                      key={idx}
                      className="text-xs leading-relaxed list-disc list-inside text-amber-900 dark:text-amber-200/90"
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
              <span className="text-xs font-bold uppercase tracking-wider font-mono block mb-2 text-foreground">
                Production Detection Rules ({data.blueDetails.rules.length})
              </span>

              {data.blueDetails.rules.map((rule, idx) => (
                <div key={idx} className="mb-4">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold border border-emerald-300 dark:border-emerald-800 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                        {rule.format}
                      </span>
                      {rule.severity && (
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono uppercase font-semibold border ${
                            rule.severity === "critical"
                              ? "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800"
                              : rule.severity === "high"
                              ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800"
                              : "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800"
                          }`}
                        >
                          {rule.severity}
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="text-xs font-bold mb-1 text-foreground">
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
            <div className="p-3.5 rounded-xl border border-border bg-card shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-foreground">
                  Detection Engineering Advice
                </h4>
              </div>
              <ul className="space-y-1.5 text-xs text-foreground/80">
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
