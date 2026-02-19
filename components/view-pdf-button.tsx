"use client";

interface ViewPdfButtonProps {
  notebookId: string;
}

export function ViewPdfButton({ notebookId }: ViewPdfButtonProps) {
  async function handleClick() {
    try {
      const res = await fetch(`/api/notebooks/${notebookId}/pdf`);
      if (!res.ok) return;
      const { url } = await res.json();
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      // silently fail. PDF view is supplementary
    }
  }

  return (
    <button
      onClick={handleClick}
      className="text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
      aria-label="View PDF in new tab"
    >
      View PDF
    </button>
  );
}
