"use client";

import { memo } from "react";

interface InfographicSection {
  heading: string;
  content: string;
}

interface InfographicViewProps {
  data: InfographicSection[];
}

const SECTION_COLORS = [
  "border-l-[#CC785C] bg-[#CC785C]/5",
  "border-l-[#D4A27F] bg-[#D4A27F]/5",
  "border-l-[#6B8F71] bg-[#6B8F71]/5",
  "border-l-[#8B7355] bg-[#8B7355]/5",
  "border-l-[#BF4D43] bg-[#BF4D43]/5",
  "border-l-[#91918D] bg-[#91918D]/5",
];

export const InfographicView = memo(function InfographicView({ data }: InfographicViewProps) {
  if (!Array.isArray(data) || data.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-8">No infographic data generated.</p>;
  }

  return (
    <div className="space-y-4">
      {data.map((section, i) => (
        <div
          key={i}
          className={`rounded-xl border border-l-4 p-4 ${SECTION_COLORS[i % SECTION_COLORS.length]}`}
        >
          <h3 className="text-sm font-bold mb-2">{section.heading}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {section.content}
          </p>
        </div>
      ))}
    </div>
  );
});
