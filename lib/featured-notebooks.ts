export interface FeaturedNotebook {
  slug: string;
  titleKey: string;
  descriptionKey: string;
  bgClass: string;
  icon: string;
  author: string;
  date: string;
  sourceCount: number;
  /** Decorative SVG pattern key for the card background */
  pattern: "circles" | "grid" | "waves" | "dots" | "hexagons" | "triangles" | "lines" | "diamond";
}

export const featuredNotebooks: FeaturedNotebook[] = [
  {
    slug: "getting-started",
    titleKey: "gettingStarted",
    descriptionKey: "gettingStartedDesc",
    bgClass: "bg-[#191919] text-[#FAFAF7]", // Slate Dark
    icon: "rocket",
    author: "DocChat Team",
    date: "Feb 2026",
    sourceCount: 1,
    pattern: "circles",
  },
  {
    slug: "research-analysis",
    titleKey: "researchAnalysis",
    descriptionKey: "researchAnalysisDesc",
    bgClass: "bg-[#CC785C] text-[#FAFAF7]", // Book Cloth
    icon: "research",
    author: "DocChat Team",
    date: "Feb 2026",
    sourceCount: 1,
    pattern: "hexagons",
  },
  {
    slug: "meeting-organizer",
    titleKey: "meetingOrganizer",
    descriptionKey: "meetingOrganizerDesc",
    bgClass: "bg-[#D4A27F] text-[#191919]", // Kraft
    icon: "meeting",
    author: "DocChat Team",
    date: "Feb 2026",
    sourceCount: 1,
    pattern: "grid",
  },
  {
    slug: "study-guide",
    titleKey: "studyGuide",
    descriptionKey: "studyGuideDesc",
    bgClass: "bg-[#40403E] text-[#FAFAF7]", // Slate Light
    icon: "study",
    author: "DocChat Team",
    date: "Feb 2026",
    sourceCount: 1,
    pattern: "waves",
  },
  {
    slug: "data-analysis",
    titleKey: "dataAnalysis",
    descriptionKey: "dataAnalysisDesc",
    bgClass: "bg-[#FAFAF7] text-[#191919] border border-black/5 dark:bg-[#262626] dark:text-[#FAFAF7] dark:border-white/5", // Ivory Light
    icon: "data",
    author: "DocChat Team",
    date: "Feb 2026",
    sourceCount: 1,
    pattern: "dots",
  },
  {
    slug: "legal-review",
    titleKey: "legalReview",
    descriptionKey: "legalReviewDesc",
    bgClass: "bg-[#262626] text-[#FAFAF7]", // Slate Medium
    icon: "legal",
    author: "DocChat Team",
    date: "Feb 2026",
    sourceCount: 1,
    pattern: "triangles",
  },
  {
    slug: "product-specs",
    titleKey: "productSpecs",
    descriptionKey: "productSpecsDesc",
    bgClass: "bg-[#666666] text-[#FAFAF7]", // Cloud Dark
    icon: "product",
    author: "DocChat Team",
    date: "Feb 2026",
    sourceCount: 1,
    pattern: "lines",
  },
  {
    slug: "literature-review",
    titleKey: "literatureReview",
    descriptionKey: "literatureReviewDesc",
    bgClass: "bg-[#E5E4DF] text-[#191919] dark:bg-[#40403E] dark:text-[#FAFAF7]", // Ivory Dark
    icon: "literature",
    author: "DocChat Team",
    date: "Feb 2026",
    sourceCount: 1,
    pattern: "diamond",
  },
];

export function getFeaturedBySlug(slug: string): FeaturedNotebook | undefined {
  return featuredNotebooks.find((fn) => fn.slug === slug);
}
