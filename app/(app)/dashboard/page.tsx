"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { UploadZone } from "@/components/upload-zone";
import { NotebookCard } from "@/components/notebook-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserDropdown } from "@/components/user-dropdown";
import type { Notebook, NotebookFile } from "@/types";
import { useTranslations } from "next-intl";

const PROCESSING_TIMEOUT_MS = 5 * 60 * 1000;
const POLL_DELAYS = [5000, 10000, 20000, 30000];

type SortKey = "newest" | "oldest" | "az" | "za" | "files";
type StatusFilter = "all" | "ready" | "processing" | "error";

function isTimedOut(notebook: Notebook): boolean {
  return (
    notebook.status === "processing" &&
    Date.now() - new Date(notebook.created_at).getTime() > PROCESSING_TIMEOUT_MS
  );
}

function getFirstName(email: string): string {
  const local = email.split("@")[0];
  const name = local.replace(/[._-]/g, " ").split(" ")[0];
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

export default function DashboardPage() {
  const router = useRouter();
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [notebookFiles, setNotebookFiles] = useState<Record<string, NotebookFile[]>>({});
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [creatingNotebook, setCreatingNotebook] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("newest");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const pollAttemptRef = useRef(0);
  const t = useTranslations("dashboard");

  useEffect(() => {
    fetch("/api/notebooks?include=files")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          if (data.notebooks) {
            setNotebooks(data.notebooks);
            setNotebookFiles(data.filesByNotebook ?? {});
          } else {
            setNotebooks(data);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });
  }, []);

  async function handleCreateNotebook() {
    setCreatingNotebook(true);
    try {
      const res = await fetch("/api/notebooks/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Untitled Notebook" }),
      });
      if (res.ok) {
        const notebook = await res.json();
        router.push(`/notebook/${notebook.id}`);
      }
    } finally {
      setCreatingNotebook(false);
    }
  }

  function handleNotebookCreated(notebook: Notebook) {
    setNotebooks((prev) => [notebook, ...prev]);
  }

  function handleNotebookDeleted(id: string) {
    setNotebooks((prev) => prev.filter((n) => n.id !== id));
    setNotebookFiles((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  useEffect(() => {
    const processing = notebooks.filter(
      (n) => n.status === "processing" && !isTimedOut(n)
    );

    if (processing.length === 0) {
      pollAttemptRef.current = 0;
      return;
    }

    const delay = POLL_DELAYS[Math.min(pollAttemptRef.current, POLL_DELAYS.length - 1)];

    const timeout = setTimeout(() => {
      pollAttemptRef.current++;
      Promise.all(
        processing.map((n) =>
          fetch(`/api/notebooks/${n.id}`).then((r) => r.json())
        )
      ).then((updates) => {
        setNotebooks((prev) =>
          prev.map((n) => {
            const updated = updates.find((u: Notebook) => u.id === n.id);
            return updated ?? n;
          })
        );
      });
    }, delay);

    return () => clearTimeout(timeout);
  }, [notebooks]);

  // Computed stats
  const stats = useMemo(() => {
    const totalFiles = Object.values(notebookFiles).reduce((sum, files) => sum + files.length, 0);
    const totalPages = notebooks.reduce((sum, n) => sum + (n.page_count ?? 0), 0);
    const readyCount = notebooks.filter((n) => n.status === "ready").length;
    const processingCount = notebooks.filter((n) => n.status === "processing").length;
    const errorCount = notebooks.filter((n) => n.status === "error").length;
    return { totalFiles, totalPages, readyCount, processingCount, errorCount };
  }, [notebooks, notebookFiles]);

  // Filtered + sorted notebooks
  const filteredNotebooks = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return notebooks
      .filter((n) => {
        if (statusFilter === "ready") return n.status === "ready";
        if (statusFilter === "processing") return n.status === "processing";
        if (statusFilter === "error") return n.status === "error";
        return true;
      })
      .filter((n) => {
        if (!query) return true;
        return (
          n.title.toLowerCase().includes(query) ||
          (n.description?.toLowerCase().includes(query) ?? false)
        );
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "oldest":
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          case "az":
            return a.title.localeCompare(b.title);
          case "za":
            return b.title.localeCompare(a.title);
          case "files":
            return (notebookFiles[b.id]?.length ?? 0) - (notebookFiles[a.id]?.length ?? 0);
          case "newest":
          default:
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
      });
  }, [notebooks, notebookFiles, searchQuery, sortBy, statusFilter]);

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: "newest", label: t("sortNewest") },
    { key: "oldest", label: t("sortOldest") },
    { key: "az", label: t("sortAZ") },
    { key: "za", label: t("sortZA") },
    { key: "files", label: t("sortFiles") },
  ];

  const filterOptions: { key: StatusFilter; label: string; count: number }[] = [
    { key: "all", label: t("filterAll"), count: notebooks.length },
    { key: "ready", label: t("filterReady"), count: stats.readyCount },
    { key: "processing", label: t("filterProcessing"), count: stats.processingCount },
    { key: "error", label: t("filterError"), count: stats.errorCount },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-base font-semibold tracking-tight">DocChat</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {userEmail && <UserDropdown email={userEmail} />}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-6 space-y-5 flex-1 w-full">
        {/* Welcome + Actions */}
        <section className="animate-slide-up [animation-delay:100ms]">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                {userEmail ? t("welcomeBack", { name: getFirstName(userEmail) }) : t("welcomeBackGeneric")}
              </h1>
              {!loading && notebooks.length > 0 && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t("readyCount", { count: stats.readyCount })}
                </p>
              )}
            </div>
            <Button
              variant="default"
              size="sm"
              onClick={handleCreateNotebook}
              disabled={creatingNotebook}
              className="gap-1.5 shrink-0"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {creatingNotebook ? t("creating") : t("newNotebook")}
            </Button>
          </div>
          <UploadZone onNotebookCreated={handleNotebookCreated} onNavigate={(path) => router.push(path)} />
        </section>

        {/* Stats bar */}
        {!loading && notebooks.length > 0 && (
          <section className="grid grid-cols-3 gap-3 animate-slide-up [animation-delay:150ms]">
            <div className="rounded-xl border bg-card p-3 text-center">
              <p className="text-lg font-bold">{notebooks.length}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("totalNotebooks")}</p>
            </div>
            <div className="rounded-xl border bg-card p-3 text-center">
              <p className="text-lg font-bold">{stats.totalFiles}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("totalFiles")}</p>
            </div>
            <div className="rounded-xl border bg-card p-3 text-center">
              <p className="text-lg font-bold">{stats.totalPages}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("totalPages")}</p>
            </div>
          </section>
        )}

        {/* Search + Sort + Filters */}
        {!loading && notebooks.length > 0 && (
          <section className="space-y-3 animate-slide-up [animation-delay:200ms]">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("search")}
                  className="h-9 ps-9 text-xs"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="h-9 rounded-lg border bg-background px-2.5 text-xs text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.key} value={opt.key}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Status filter pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {filterOptions.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setStatusFilter(f.key)}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                    statusFilter === f.key
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent border border-transparent"
                  }`}
                >
                  {f.label}
                  <span className={`text-[10px] ${statusFilter === f.key ? "text-primary/60" : "text-muted-foreground/50"}`}>
                    {f.count}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Notebooks grid */}
        <section className="animate-slide-up [animation-delay:250ms]">
          {loading ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-[88px] rounded-xl border bg-card animate-shimmer"
                  style={{ animationDelay: `${(i - 1) * 150}ms` }}
                />
              ))}
            </div>
          ) : notebooks.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center py-16 text-center animate-fade-in">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/5">
                <svg className="h-10 w-10 text-primary/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-base font-semibold mb-1">{t("emptyTitle")}</h2>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                {t("emptyDescription")}
              </p>
              <Button onClick={handleCreateNotebook} disabled={creatingNotebook} className="gap-1.5">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t("newNotebook")}
              </Button>
            </div>
          ) : filteredNotebooks.length === 0 ? (
            /* No results for search/filter */
            <div className="flex flex-col items-center py-12 text-center animate-fade-in">
              <svg className="h-10 w-10 text-muted-foreground/20 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-sm text-muted-foreground">{t("noResults")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredNotebooks.map((notebook, i) => (
                <div
                  key={notebook.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <NotebookCard
                    notebook={notebook}
                    files={notebookFiles[notebook.id] ?? []}
                    timedOut={isTimedOut(notebook)}
                    onDelete={handleNotebookDeleted}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t py-4">
        <p className="text-center text-xs text-muted-foreground/40">
          Built by{" "}
          <a href="https://medygribkov.vercel.app" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-muted-foreground transition-colors">
            Medy Gribkov
          </a>
        </p>
      </footer>
    </div>
  );
}
