export const CATEGORIES = [
  "Market",
  "Business",
  "Advertising",
  "Creative",
  "Media",
  "Technology",
  "AI",
  "Consumer",
  "Culture",
  "Innovation",
  "Social",
  "Brand",
  "PR",
  "Digital",
  "E-commerce",
  "Creator Economy",
  "Sustainability",
  "Regulation",
  "Sports",
  "Finance",
] as const;

export const MARKET_LEVELS = ["Tanzania", "East Africa", "Africa", "Global"] as const;

export const INDUSTRIES = [
  "Banking",
  "Insurance",
  "FMCG",
  "Telecom",
  "Energy",
  "Oil & Gas",
  "Retail",
  "E-commerce",
  "Technology",
  "Financial Services",
  "Automotive",
  "Tourism",
  "Hospitality",
  "Real Estate",
  "Healthcare",
  "Pharmaceuticals",
  "Agriculture",
  "Manufacturing",
  "Logistics",
  "Sports",
  "Government",
  "B2B",
  "Media",
] as const;

export const SOURCE_TYPES = ["primary", "industry", "specialist", "community"] as const;

export const CREDIBILITY_BY_TYPE: Record<(typeof SOURCE_TYPES)[number], number> = {
  primary: 95,
  industry: 75,
  specialist: 65,
  community: 45,
};

export function classifySignalStrength(score: number) {
  if (score >= 80) return "MAJOR SIGNAL";
  if (score >= 65) return "IMPORTANT";
  if (score >= 50) return "WATCH";
  return "BACKGROUND";
}
