export interface FeaturedNotebook {
  titleKey: string;
  descriptionKey: string;
  gradient: string;
  icon: string;
}

export const featuredNotebooks: FeaturedNotebook[] = [
  {
    titleKey: "gettingStarted",
    descriptionKey: "gettingStartedDesc",
    gradient: "from-blue-500/20 to-cyan-500/20 dark:from-blue-500/10 dark:to-cyan-500/10",
    icon: "rocket",
  },
  {
    titleKey: "researchAnalysis",
    descriptionKey: "researchAnalysisDesc",
    gradient: "from-violet-500/20 to-purple-500/20 dark:from-violet-500/10 dark:to-purple-500/10",
    icon: "research",
  },
  {
    titleKey: "meetingOrganizer",
    descriptionKey: "meetingOrganizerDesc",
    gradient: "from-emerald-500/20 to-teal-500/20 dark:from-emerald-500/10 dark:to-teal-500/10",
    icon: "meeting",
  },
  {
    titleKey: "studyGuide",
    descriptionKey: "studyGuideDesc",
    gradient: "from-amber-500/20 to-orange-500/20 dark:from-amber-500/10 dark:to-orange-500/10",
    icon: "study",
  },
];
