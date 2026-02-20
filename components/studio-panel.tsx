"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FlashcardsView } from "@/components/studio/flashcards";
import { QuizView } from "@/components/studio/quiz";
import { ReportView } from "@/components/studio/report";
import { MindMapView } from "@/components/studio/mindmap";
import { DataTableView } from "@/components/studio/datatable";

type StudioAction = "flashcards" | "quiz" | "report" | "mindmap" | "datatable" | "infographic" | "slidedeck";
type StubAction = "audio" | "video";

interface StudioPanelProps {
  notebookId: string;
}

interface Flashcard { front: string; back: string }
interface QuizQuestion { question: string; options: string[]; correctIndex: number; explanation: string }
interface ReportSection { heading: string; content: string }
interface MindMapNode { label: string; children?: MindMapNode[] }
interface DataTableData { columns: string[]; rows: string[][] }

type StudioResult = Flashcard[] | QuizQuestion[] | ReportSection[] | MindMapNode | DataTableData;

function parseStudioResult(_action: StudioAction, text: string): StudioResult {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }
  return JSON.parse(cleaned) as StudioResult;
}

export function StudioPanel({ notebookId }: StudioPanelProps) {
  const t = useTranslations("studio");
  const tc = useTranslations("common");
  const [selectedAction, setSelectedAction] = useState<StudioAction | null>(null);
  const [result, setResult] = useState<StudioResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generated, setGenerated] = useState<Set<StudioAction>>(new Set());

  const features: { action: StudioAction; label: string; description: string; icon: string; color: string }[] = [
    { action: "flashcards", label: t("flashcards"), description: t("flashcardsDesc"), icon: "cards", color: "bg-blue-500/15 text-blue-600 dark:text-blue-400" },
    { action: "quiz", label: t("quiz"), description: t("quizDesc"), icon: "quiz", color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" },
    { action: "report", label: t("report"), description: t("reportDesc"), icon: "report", color: "bg-violet-500/15 text-violet-600 dark:text-violet-400" },
    { action: "mindmap", label: t("mindmap"), description: t("mindmapDesc"), icon: "mindmap", color: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
    { action: "datatable", label: t("datatable"), description: t("datatableDesc"), icon: "table", color: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400" },
    { action: "infographic", label: t("infographic"), description: t("infographicDesc"), icon: "infographic", color: "bg-rose-500/15 text-rose-600 dark:text-rose-400" },
    { action: "slidedeck", label: t("slidedeck"), description: t("slidedeckDesc"), icon: "slides", color: "bg-orange-500/15 text-orange-600 dark:text-orange-400" },
  ];

  const stubs: { action: StubAction; label: string; description: string; icon: string; color: string }[] = [
    { action: "audio", label: t("audioOverview"), description: t("audioOverviewDesc"), icon: "audio", color: "bg-pink-500/15 text-pink-600 dark:text-pink-400" },
    { action: "video", label: t("videoOverview"), description: t("videoOverviewDesc"), icon: "video", color: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400" },
  ];

  const actionLabel = selectedAction ? t(selectedAction) : "";

  const generate = useCallback(
    async (action: StudioAction) => {
      setSelectedAction(action);
      setResult(null);
      setError(null);
      setLoading(true);

      try {
        const res = await fetch("/api/studio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notebookId, action }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `Request failed (${res.status})`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let fullText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullText += decoder.decode(value, { stream: true });
        }

        const textParts: string[] = [];
        for (const line of fullText.split("\n")) {
          if (line.startsWith("0:")) {
            try {
              textParts.push(JSON.parse(line.slice(2)));
            } catch {
              // skip malformed lines
            }
          }
        }
        const combinedText = textParts.join("");

        if (!combinedText.trim()) {
          throw new Error("Empty response from AI");
        }

        const parsed = parseStudioResult(action, combinedText);
        setResult(parsed);
        setGenerated((prev) => new Set(prev).add(action));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Generation failed");
      } finally {
        setLoading(false);
      }
    },
    [notebookId]
  );

  function goBack() {
    setSelectedAction(null);
    setResult(null);
    setError(null);
  }

  // Result view
  if (selectedAction && (result || loading || error)) {
    return (
      <div className="flex h-full flex-col">
        <div className="border-b px-4 py-3 flex items-center gap-3 shrink-0">
          <button
            onClick={goBack}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-xs"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {tc("back")}
          </button>
          <span className="text-sm font-semibold flex-1">{actionLabel}</span>
          {(result || error) && !loading && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => generate(selectedAction)}
              className="gap-1.5 text-xs"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {t("regenerate")}
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin">
          <div className="max-w-2xl mx-auto">
            {loading && (
              <div className="flex flex-col items-center py-16 text-center animate-fade-in">
                <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4" />
                <p className="text-sm font-medium">{t("generating", { type: actionLabel })}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("generatingNote")}
                </p>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-center">
                <p className="text-sm text-destructive mb-3">{error}</p>
                <Button variant="outline" size="sm" onClick={() => generate(selectedAction)}>
                  {tc("tryAgain")}
                </Button>
              </div>
            )}

            {result && selectedAction === "flashcards" && <FlashcardsView data={result as Flashcard[]} />}
            {result && selectedAction === "quiz" && <QuizView data={result as QuizQuestion[]} />}
            {result && selectedAction === "report" && <ReportView data={result as ReportSection[]} />}
            {result && selectedAction === "mindmap" && <MindMapView data={result as MindMapNode} />}
            {result && selectedAction === "datatable" && <DataTableView data={result as DataTableData} />}
            {result && selectedAction === "infographic" && <ReportView data={result as ReportSection[]} />}
            {result && selectedAction === "slidedeck" && <ReportView data={result as ReportSection[]} />}
          </div>
        </div>
      </div>
    );
  }

  // Feature grid
  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <div className="px-4 py-8 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-lg font-semibold tracking-tight mb-1">{t("title")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {features.map((feature) => {
            const hasResult = generated.has(feature.action);
            return (
              <button
                key={feature.action}
                onClick={() => generate(feature.action)}
                className="group relative flex flex-col items-start gap-2 rounded-xl border bg-card p-3 text-left transition-all hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5"
              >
                {hasResult && (
                  <span className="absolute top-2 right-2 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                )}
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${feature.color} transition-colors`}>
                  <FeatureIcon type={feature.icon} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold mb-0.5">{feature.label}</p>
                  <p className="text-[10px] text-muted-foreground leading-snug line-clamp-2">{feature.description}</p>
                </div>
              </button>
            );
          })}
          {/* Disabled stubs */}
          {stubs.map((stub) => (
            <div
              key={stub.action}
              className="relative flex flex-col items-start gap-2 rounded-xl border bg-card p-3 text-left opacity-50 cursor-not-allowed"
              title={t("comingSoon")}
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${stub.color}`}>
                <FeatureIcon type={stub.icon} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold mb-0.5">{stub.label}</p>
                <p className="text-[10px] text-muted-foreground leading-snug">{t("comingSoon")}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-[11px] text-muted-foreground/50 mt-8">
          {t("disclaimer")}
        </p>
      </div>
    </div>
  );
}

function FeatureIcon({ type }: { type: string }) {
  const cls = "h-4 w-4";
  switch (type) {
    case "cards":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      );
    case "quiz":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      );
    case "report":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case "mindmap":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      );
    case "table":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      );
    case "infographic":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3v18h18M7 16V8m4 8v-5m4 5V5m4 11v-3" />
        </svg>
      );
    case "slides":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm9 12v4m-4 0h8" />
        </svg>
      );
    case "audio":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m-4 0h8M12 15a3 3 0 003-3V6a3 3 0 00-6 0v6a3 3 0 003 3z" />
        </svg>
      );
    case "video":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      );
    default:
      return null;
  }
}
