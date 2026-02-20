"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ChatInterface } from "@/components/chat-interface";
import { SourcesPanel } from "@/components/sources-panel";

const StudioPanel = dynamic(
  () => import("@/components/studio-panel").then((m) => ({ default: m.StudioPanel })),
  {
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    ),
  }
);
import { ThemeToggle } from "@/components/theme-toggle";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type { Message, NotebookFile } from "@/types";

interface NotebookLayoutProps {
  notebookId: string;
  notebookTitle: string;
  notebookFiles: NotebookFile[];
  initialMessages: Message[];
}

export function NotebookLayout({ notebookId, notebookTitle, notebookFiles, initialMessages }: NotebookLayoutProps) {
  const [sourcesOpen, setSourcesOpen] = useState(true);
  const [studioOpen, setStudioOpen] = useState(false);
  // Track which mobile overlay is open (mutual exclusion)
  const [mobilePanel, setMobilePanel] = useState<"sources" | "studio" | null>(null);
  const t = useTranslations("notebook");

  const toggleSources = useCallback(() => {
    setSourcesOpen((prev) => !prev);
  }, []);

  const toggleStudio = useCallback(() => {
    setStudioOpen((prev) => !prev);
  }, []);

  const closeMobilePanel = useCallback(() => {
    setMobilePanel(null);
  }, []);

  const openMobileSources = useCallback(() => {
    setMobilePanel("sources");
  }, []);

  const openMobileStudio = useCallback(() => {
    setMobilePanel("studio");
  }, []);

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2 px-3 sm:px-5 py-2.5">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground h-8 px-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline text-xs">{t("dashboard")}</span>
            </Button>
          </Link>

          {/* Desktop sources toggle */}
          <button
            onClick={toggleSources}
            className={`hidden lg:flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
              sourcesOpen
                ? "bg-primary/10 text-primary border border-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            {t("sources")}
          </button>

          <div className="h-4 w-px bg-border hidden sm:block" />
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold truncate">{notebookTitle}</h1>
          </div>

          {/* Desktop studio toggle */}
          <button
            onClick={toggleStudio}
            className={`hidden lg:flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
              studioOpen
                ? "bg-primary/10 text-primary border border-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47 2.47a2.25 2.25 0 00-.659 1.59v1.69m-11.742 0A2.923 2.923 0 005 19.748V21" />
            </svg>
            {t("studio")}
          </button>

          <ThemeToggle />
        </div>
      </header>

      {/* Main content: three-panel layout */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Left: Sources panel (desktop lg+) */}
        <div
          className={`hidden lg:flex flex-col border-r bg-background shrink-0 transition-[width] duration-300 ease-in-out overflow-hidden ${
            sourcesOpen ? "w-[280px]" : "w-0 border-r-0"
          }`}
        >
          <div className="w-[280px] h-full min-w-[280px]">
            <SourcesPanel notebookId={notebookId} initialFiles={notebookFiles} />
          </div>
        </div>

        {/* Center: Chat (always visible) */}
        <div className="flex-1 min-w-0 min-h-0">
          <ChatInterface notebookId={notebookId} initialMessages={initialMessages} />
        </div>

        {/* Right: Studio panel (desktop lg+) */}
        <div
          className={`hidden lg:flex flex-col border-l bg-background shrink-0 transition-[width] duration-300 ease-in-out overflow-hidden ${
            studioOpen ? "w-[400px]" : "w-0 border-l-0"
          }`}
        >
          <div className="w-[400px] h-full min-w-[400px]">
            <StudioPanel notebookId={notebookId} />
          </div>
        </div>

        {/* Mobile: Sources slide-over (from left) */}
        {mobilePanel === "sources" && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
              onClick={closeMobilePanel}
            />
            <div className="absolute left-0 top-0 bottom-0 w-[90vw] max-w-[320px] bg-background border-r shadow-2xl animate-slide-in-left">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <h2 className="text-sm font-semibold">{t("sources")}</h2>
                <button
                  onClick={closeMobilePanel}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="h-[calc(100%-49px)] overflow-hidden">
                <SourcesPanel notebookId={notebookId} initialFiles={notebookFiles} />
              </div>
            </div>
          </div>
        )}

        {/* Mobile: Studio slide-over (from right) */}
        {mobilePanel === "studio" && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
              onClick={closeMobilePanel}
            />
            <div className="absolute right-0 top-0 bottom-0 w-[90vw] max-w-[420px] bg-background border-l shadow-2xl animate-slide-in-right">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <h2 className="text-sm font-semibold">{t("studio")}</h2>
                <button
                  onClick={closeMobilePanel}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="h-[calc(100%-49px)] overflow-hidden">
                <StudioPanel notebookId={notebookId} />
              </div>
            </div>
          </div>
        )}

        {/* Mobile FABs (only when no overlay is open) */}
        {mobilePanel === null && (
          <>
            {/* Sources FAB - bottom left */}
            <button
              onClick={openMobileSources}
              className="lg:hidden fixed bottom-24 left-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
              aria-label={t("sources")}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </button>

            {/* Studio FAB - bottom right */}
            <button
              onClick={openMobileStudio}
              className="lg:hidden fixed bottom-24 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
              aria-label={t("studio")}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47 2.47a2.25 2.25 0 00-.659 1.59v1.69m-11.742 0A2.923 2.923 0 005 19.748V21" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
