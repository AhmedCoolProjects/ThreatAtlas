import type { Node, Edge } from "@xyflow/react";

export type StageId =
  | "initial_access"
  | "persistence_evasion"
  | "lateral_movement"
  | "exfiltration";

export type PerspectiveMode = "red" | "blue";

export type EntityType =
  | "process"
  | "file"
  | "registry"
  | "network"
  | "user"
  | "host";

export interface TelemetryArtifact {
  source: "Sysmon" | "Windows Security" | "Linux Auditd" | "Zeek" | "EDR" | "eBPF";
  eventId?: number | string;
  description: string;
  rawSample: string;
  format?: "xml" | "json" | "syslog" | "text";
}
export interface DetectionRule {
  format: "Sigma" | "YARA" | "Splunk SPL" | "Suricata" | "Snort";
  title: string;
  ruleContent: string;
  explanation?: string;
  severity?: "low" | "medium" | "high" | "critical";
  mitreRef?: string;
}
export interface GraphNodeData extends Record<string, unknown> {
  id: string;
  label: string;
  subLabel?: string;
  entityType: EntityType;
  techniqueId?: string;
  techniqueName?: string;
  stage: StageId;
  redDetails: {
    summary: string;
    commandLine?: string;
    mechanics: string[];
    attackerIntent?: string;
    toolOrMalware?: string;
    parentProcess?: string;
  };
  blueDetails: {
    summary: string;
    telemetry: TelemetryArtifact[];
    rules: DetectionRule[];
    detectionPitfalls: string[];
    recommendations?: string[];
  };
}

export type AtlasNode = Node<GraphNodeData, "custom">;

export interface AtlasEdgeData extends Record<string, unknown> {
  relation: string;
  label?: string;
  stage?: StageId;
  protocol?: string;
  isCausal?: boolean;
}

export type AtlasEdge = Edge<AtlasEdgeData>;

export interface StageDefinition {
  id: StageId;
  title: string;
  shortTitle: string;
  description: string;
  keyObjectives: string[];
  order: number;
}

export interface Campaign {
  id: string;
  title: string;
  actor: string;
  actorAliases?: string[];
  year: string;
  targetSector: string;
  summary: string;
  attackVector: string;
  impact: string;
  stages: StageDefinition[];
  nodes: AtlasNode[];
  edges: AtlasEdge[];
}
