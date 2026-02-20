"use client";

interface InfographicSection {
  heading: string;
  content: string;
}

interface InfographicViewProps {
  data: InfographicSection[];
}

const SECTION_COLORS = [
  "border-l-blue-500 bg-blue-500/5",
  "border-l-emerald-500 bg-emerald-500/5",
  "border-l-violet-500 bg-violet-500/5",
  "border-l-amber-500 bg-amber-500/5",
  "border-l-rose-500 bg-rose-500/5",
  "border-l-cyan-500 bg-cyan-500/5",
];

export function InfographicView({ data }: InfographicViewProps) {
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
}
