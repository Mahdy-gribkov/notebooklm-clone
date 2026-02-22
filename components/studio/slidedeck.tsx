"use client";

import { useState, memo } from "react";

interface Slide {
  heading: string;
  content: string;
}

interface SlideDeckViewProps {
  data: Slide[];
}

export const SlideDeckView = memo(function SlideDeckView({ data }: SlideDeckViewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!Array.isArray(data) || data.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-8">No slides generated.</p>;
  }

  const slide = data[currentSlide];

  return (
    <div className="space-y-4">
      {/* Slide display */}
      <div className="rounded-xl border bg-card p-6 min-h-[240px] flex flex-col justify-center">
        <h3 className="text-base font-bold mb-4 text-center">{slide.heading}</h3>
        <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {slide.content}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentSlide((s) => Math.max(0, s - 1))}
          disabled={currentSlide === 0}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Prev
        </button>
        <span className="text-xs text-muted-foreground">
          {currentSlide + 1} / {data.length}
        </span>
        <button
          onClick={() => setCurrentSlide((s) => Math.min(data.length - 1, s + 1))}
          disabled={currentSlide === data.length - 1}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
        >
          Next
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Slide thumbnails */}
      <div className="flex gap-1 overflow-x-auto scrollbar-thin pb-1">
        {data.map((s, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`shrink-0 rounded-md border px-2 py-1 text-[10px] transition-colors ${
              i === currentSlide
                ? "bg-primary/10 border-primary/30 text-primary font-medium"
                : "text-muted-foreground hover:bg-accent"
            }`}
          >
            {i + 1}. {s.heading.slice(0, 20)}{s.heading.length > 20 ? "..." : ""}
          </button>
        ))}
      </div>
    </div>
  );
});
