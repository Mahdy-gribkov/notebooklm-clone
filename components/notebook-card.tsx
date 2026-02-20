"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type { Notebook, NotebookFile } from "@/types";

interface NotebookCardProps {
  notebook: Notebook;
  files?: NotebookFile[];
  timedOut?: boolean;
  onDelete: (id: string) => void;
}

const statusConfig: Record<Notebook["status"], { label: string; icon: string; className: string; dotClass?: string }> = {
  processing: {
    label: "processing",
    icon: "spinner",
    className: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20",
    dotClass: "bg-amber-500 animate-pulse",
  },
  ready: {
    label: "ready",
    icon: "check",
    className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20",
  },
  error: {
    label: "failed",
    icon: "x",
    className: "bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20",
  },
};

const timedOutConfig = {
  label: "timedOut",
  icon: "clock",
  className: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-500/20",
};

function relativeTime(dateStr: string): string {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function NotebookCard({ notebook, files = [], timedOut = false, onDelete }: NotebookCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const t = useTranslations("notebookCard");
  const tc = useTranslations("common");
  const status = timedOut ? timedOutConfig : statusConfig[notebook.status];
  const isClickable = notebook.status === "ready" && !timedOut;

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch(`/api/notebooks/${notebook.id}`, {
        method: "DELETE",
      });
      if (res.ok) onDelete(notebook.id);
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  function handleCancelDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setConfirmDelete(false);
  }

  return (
    <div className={`group relative rounded-xl border bg-card overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 border-s-[3px] ${
      notebook.status === "ready" ? "border-s-emerald-500" :
      notebook.status === "processing" ? "border-s-amber-500" :
      notebook.status === "error" ? "border-s-red-500" : "border-s-transparent"
    }`}>
      <Link
        href={isClickable ? `/notebook/${notebook.id}` : "#"}
        className={`block p-3 ${!isClickable ? "pointer-events-none" : ""}`}
        aria-disabled={!isClickable}
      >
        {/* Title row + time */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-semibold leading-snug line-clamp-1 pr-6">
            {notebook.title}
          </h3>
          <span className="text-[10px] text-muted-foreground/60 shrink-0 pt-0.5">
            {relativeTime(notebook.created_at)}
          </span>
        </div>

        {/* Description */}
        {notebook.description && (
          <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
            {notebook.description}
          </p>
        )}

        {/* Bottom row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {/* Status pill */}
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${status.className}`}>
              {status.icon === "spinner" && (
                <span className={`h-1.5 w-1.5 rounded-full ${(status as typeof statusConfig.processing).dotClass}`} />
              )}
              {status.icon === "check" && (
                <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {status.icon === "x" && (
                <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {status.icon === "clock" && (
                <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {t(status.label)}
            </span>

            {/* File count */}
            {files.length > 0 && (
              <span className="text-[10px] text-muted-foreground">
                {t("files", { count: files.length })}
              </span>
            )}
            {notebook.page_count && (
              <span className="text-[10px] text-muted-foreground">
                {t("pages", { count: notebook.page_count })}
              </span>
            )}
          </div>

          {(notebook.status === "error" || timedOut) && (
            <span className="text-[10px] text-muted-foreground">
              {timedOut ? t("reUpload") : t("uploadFailed")}
            </span>
          )}
        </div>
      </Link>

      {/* Delete button / confirmation */}
      {confirmDelete ? (
        <div className="absolute inset-0 flex items-center justify-center bg-card/95 backdrop-blur-sm animate-fade-in z-10 rounded-xl">
          <div className="text-center space-y-3">
            <p className="text-sm font-medium">{t("deleteTitle")}</p>
            <p className="text-xs text-muted-foreground">{t("cannotUndo")}</p>
            <div className="flex items-center gap-2 justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelDelete}
                className="h-8 text-xs"
              >
                {tc("cancel")}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={deleting}
                className="h-8 text-xs"
              >
                {deleting ? t("deleting") : tc("delete")}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={deleting}
          className="absolute right-2 top-3 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
          aria-label={`Delete ${notebook.title}`}
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </Button>
      )}
    </div>
  );
}
