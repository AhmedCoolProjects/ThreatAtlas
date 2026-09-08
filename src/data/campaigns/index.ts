import { Campaign } from "@/types/campaign";
import { SUNBURST_CAMPAIGN } from "./sunburst";
import { SANDWORM_CAMPAIGN } from "./sandworm";
import { COZYBEAR_CAMPAIGN } from "./cozybear";

export const CAMPAIGNS: Campaign[] = [
  SUNBURST_CAMPAIGN,
  SANDWORM_CAMPAIGN,
  COZYBEAR_CAMPAIGN,
];

export const CAMPAIGNS_BY_ID: Record<string, Campaign> = {
  [SUNBURST_CAMPAIGN.id]: SUNBURST_CAMPAIGN,
  [SANDWORM_CAMPAIGN.id]: SANDWORM_CAMPAIGN,
  [COZYBEAR_CAMPAIGN.id]: COZYBEAR_CAMPAIGN,
};

export function getCampaignById(id: string): Campaign {
  return CAMPAIGNS_BY_ID[id] ?? SUNBURST_CAMPAIGN;
}

export { SUNBURST_CAMPAIGN, SANDWORM_CAMPAIGN, COZYBEAR_CAMPAIGN };
