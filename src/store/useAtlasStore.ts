import { create } from "zustand";
import { Campaign, EntityType, PerspectiveMode, StageId } from "@/types/campaign";
import { CAMPAIGNS_BY_ID, SUNBURST_CAMPAIGN } from "@/data/campaigns";

interface AtlasState {
  activeCampaignId: string;
  activeStage: StageId;
  perspective: PerspectiveMode;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  isInspectorOpen: boolean;
  isCampaignDrawerOpen: boolean;
  isHelpModalOpen: boolean;
  isPlayingTimeline: boolean;
  searchQuery: string;
  entityFilter: EntityType | "all";
  inspectorTab: "anatomy" | "telemetry" | "rules";
  theme: "dark" | "light";

  setTheme: (theme: "dark" | "light") => void;
  toggleTheme: () => void;
  // Actions
  setCampaign: (campaignId: string) => void;
  setStage: (stage: StageId) => void;
  nextStage: () => void;
  prevStage: () => void;
  setPerspective: (perspective: PerspectiveMode) => void;
  togglePerspective: () => void;
  selectNode: (nodeId: string | null) => void;
  selectEdge: (edgeId: string | null) => void;
  setInspectorOpen: (open: boolean) => void;
  toggleInspector: () => void;
  setCampaignDrawerOpen: (open: boolean) => void;
  setHelpModalOpen: (open: boolean) => void;
  setIsPlayingTimeline: (playing: boolean) => void;
  setSearchQuery: (query: string) => void;
  setEntityFilter: (filter: EntityType | "all") => void;
  setInspectorTab: (tab: "anatomy" | "telemetry" | "rules") => void;

  // Getters
  getCurrentCampaign: () => Campaign;
}

const STAGE_ORDER: StageId[] = [
  "initial_access",
  "persistence_evasion",
  "lateral_movement",
  "exfiltration",
];

export const useAtlasStore = create<AtlasState>((set, get) => ({
  activeCampaignId: SUNBURST_CAMPAIGN.id,
  activeStage: "initial_access",
  perspective: "red",
  selectedNodeId: "node-build-pipeline",
  selectedEdgeId: null,
  isInspectorOpen: true,
  isCampaignDrawerOpen: false,
  isHelpModalOpen: false,
  isPlayingTimeline: false,
  searchQuery: "",
  entityFilter: "all",
  inspectorTab: "anatomy",
  theme: "dark",

  setTheme: (theme: "dark" | "light") => set({ theme }),

  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
  getCurrentCampaign: () => {
    const campaignId = get().activeCampaignId;
    return CAMPAIGNS_BY_ID[campaignId] ?? SUNBURST_CAMPAIGN;
  },

  setCampaign: (campaignId: string) => {
    const campaign = CAMPAIGNS_BY_ID[campaignId] ?? SUNBURST_CAMPAIGN;
    const firstNode = campaign.nodes[0]?.id ?? null;
    set({
      activeCampaignId: campaign.id,
      activeStage: "initial_access",
      selectedNodeId: firstNode,
      selectedEdgeId: null,
      isPlayingTimeline: false,
    });
  },

  setStage: (stage: StageId) => {
    const campaign = get().getCurrentCampaign();
    const currentSelected = campaign.nodes.find((n) => n.id === get().selectedNodeId);

    // If selected node is not in this stage, auto-select the first node of the target stage
    let nextSelectedId = get().selectedNodeId;
    if (!currentSelected || currentSelected.data.stage !== stage) {
      const stageNode = campaign.nodes.find((n) => n.data.stage === stage);
      if (stageNode) {
        nextSelectedId = stageNode.id;
      }
    }

    set({
      activeStage: stage,
      selectedNodeId: nextSelectedId,
    });
  },

  nextStage: () => {
    const currentStage = get().activeStage;
    const currentIndex = STAGE_ORDER.indexOf(currentStage);
    const nextIndex = (currentIndex + 1) % STAGE_ORDER.length;
    const targetStage = STAGE_ORDER[nextIndex];
    if (targetStage) {
      get().setStage(targetStage);
    }
  },

  prevStage: () => {
    const currentStage = get().activeStage;
    const currentIndex = STAGE_ORDER.indexOf(currentStage);
    const prevIndex = (currentIndex - 1 + STAGE_ORDER.length) % STAGE_ORDER.length;
    const targetStage = STAGE_ORDER[prevIndex];
    if (targetStage) {
      get().setStage(targetStage);
    }
  },

  setPerspective: (perspective: PerspectiveMode) => set({ perspective }),

  togglePerspective: () =>
    set((state) => ({
      perspective: state.perspective === "red" ? "blue" : "red",
    })),

  selectNode: (nodeId: string | null) =>
    set({
      selectedNodeId: nodeId,
      selectedEdgeId: null,
      isInspectorOpen: nodeId !== null ? true : get().isInspectorOpen,
    }),

  selectEdge: (edgeId: string | null) =>
    set({
      selectedEdgeId: edgeId,
      selectedNodeId: null,
    }),

  setInspectorOpen: (open: boolean) => set({ isInspectorOpen: open }),

  toggleInspector: () =>
    set((state) => ({ isInspectorOpen: !state.isInspectorOpen })),

  setCampaignDrawerOpen: (open: boolean) =>
    set({ isCampaignDrawerOpen: open }),

  setHelpModalOpen: (open: boolean) => set({ isHelpModalOpen: open }),

  setIsPlayingTimeline: (playing: boolean) =>
    set({ isPlayingTimeline: playing }),

  setSearchQuery: (searchQuery: string) => set({ searchQuery }),

  setEntityFilter: (entityFilter: EntityType | "all") =>
    set({ entityFilter }),

  setInspectorTab: (inspectorTab: "anatomy" | "telemetry" | "rules") =>
    set({ inspectorTab }),
}));
