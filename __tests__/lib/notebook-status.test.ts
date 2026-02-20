import { describe, it, expect, vi, beforeEach } from "vitest";

const mockUpdate = vi.fn().mockReturnValue({ eq: vi.fn() });
const mockSelect = vi.fn();
const mockEq = vi.fn();

vi.mock("@/lib/supabase/service", () => ({
  getServiceClient: vi.fn(() => ({
    from: vi.fn((table: string) => {
      if (table === "notebook_files") {
        return { select: mockSelect };
      }
      return { update: mockUpdate };
    }),
  })),
}));

import { updateNotebookStatus } from "@/lib/notebook-status";

describe("updateNotebookStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSelect.mockReturnValue({
      eq: mockEq,
    });
  });

  it("sets 'ready' when no files exist", async () => {
    mockEq.mockResolvedValue({ data: [] });
    await updateNotebookStatus("notebook-1");
    expect(mockUpdate).toHaveBeenCalledWith({ status: "ready" });
  });

  it("sets 'ready' when all files are ready", async () => {
    mockEq.mockResolvedValue({
      data: [{ status: "ready" }, { status: "ready" }],
    });
    await updateNotebookStatus("notebook-1");
    expect(mockUpdate).toHaveBeenCalledWith({ status: "ready" });
  });

  it("sets 'processing' when any file is processing", async () => {
    mockEq.mockResolvedValue({
      data: [{ status: "ready" }, { status: "processing" }],
    });
    await updateNotebookStatus("notebook-1");
    expect(mockUpdate).toHaveBeenCalledWith({ status: "processing" });
  });

  it("sets 'error' when mix of ready and error (no processing)", async () => {
    mockEq.mockResolvedValue({
      data: [{ status: "ready" }, { status: "error" }],
    });
    await updateNotebookStatus("notebook-1");
    expect(mockUpdate).toHaveBeenCalledWith({ status: "error" });
  });

  it("sets 'ready' when data is null", async () => {
    mockEq.mockResolvedValue({ data: null });
    await updateNotebookStatus("notebook-1");
    expect(mockUpdate).toHaveBeenCalledWith({ status: "ready" });
  });
});
