"use client";

import { useState, useRef } from "react";
import { PdfViewerModal } from "@/components/pdf-viewer-modal";
import { Button } from "@/components/ui/button";
import type { NotebookFile } from "@/types";

interface NotebookFileListProps {
  notebookId: string;
  initialFiles: NotebookFile[];
}

export function NotebookFileList({ notebookId, initialFiles }: NotebookFileListProps) {
  const [files, setFiles] = useState<NotebookFile[]>(initialFiles);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    setError(null);
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`/api/notebooks/${notebookId}/files`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Upload failed");
      }

      const notebookFile = await res.json();
      setFiles((prev) => [notebookFile, ...prev]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(fileId: string) {
    try {
      const res = await fetch(`/api/notebooks/${notebookId}/files/${fileId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setFiles((prev) => prev.filter((f) => f.id !== fileId));
      }
    } catch {
      // Silently fail, file will remain in list
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    e.target.value = "";
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(!open)}
        className="gap-1.5 text-xs"
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        Sources ({files.length})
      </Button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-1.5 w-72 bg-card border rounded-xl shadow-lg z-50 overflow-hidden">
            <div className="p-3 border-b flex items-center justify-between">
              <span className="text-xs font-semibold">Source Files</span>
              <div>
                <input
                  ref={inputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => inputRef.current?.click()}
                  disabled={uploading}
                  className="h-7 text-xs gap-1"
                >
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {uploading ? "Uploading..." : "Add"}
                </Button>
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {files.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-xs text-muted-foreground">No source files yet.</p>
                  <p className="text-xs text-muted-foreground mt-1">Add a PDF to start chatting.</p>
                </div>
              ) : (
                files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-accent/50 group"
                  >
                    <svg className="h-4 w-4 shrink-0 text-muted-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{file.file_name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {file.status === "ready" && file.page_count
                          ? `${file.page_count} pages`
                          : file.status === "processing"
                          ? "Processing..."
                          : file.status === "error"
                          ? "Failed"
                          : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {file.status === "ready" && (
                        <PdfViewerModal
                          notebookId={notebookId}
                          fileId={file.id}
                          trigger={
                            <button
                              className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-accent"
                              aria-label="View PDF"
                            >
                              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                          }
                        />
                      )}
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        aria-label="Delete file"
                      >
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {error && (
              <div className="px-3 py-2 border-t">
                <p className="text-xs text-destructive">{error}</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
