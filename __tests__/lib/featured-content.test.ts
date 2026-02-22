import { describe, it, expect } from "vitest";
import { getFeaturedContent } from "@/lib/featured-content";
import { featuredNotebooks } from "@/lib/featured-notebooks";

describe("getFeaturedContent", () => {
  it("returns content for 'getting-started' slug", () => {
    const content = getFeaturedContent("getting-started");
    expect(content).not.toBeNull();
    expect(content!.files).toBeInstanceOf(Array);
    expect(content!.files.length).toBeGreaterThanOrEqual(3);
    expect(content!.description).toBeTruthy();
    expect(content!.quiz).toBeInstanceOf(Array);
    expect(content!.flashcards).toBeInstanceOf(Array);
    expect(content!.report).toBeInstanceOf(Array);
    expect(content!.mindmap).toHaveProperty("label");
  });

  it("returns null for unknown slug", () => {
    expect(getFeaturedContent("nonexistent")).toBeNull();
  });

  it("has content for all featured notebook slugs", () => {
    for (const nb of featuredNotebooks) {
      const content = getFeaturedContent(nb.slug);
      expect(content, `Missing content for slug: ${nb.slug}`).not.toBeNull();
    }
  });

  it("all notebooks have 3+ files with fileName and content", () => {
    for (const nb of featuredNotebooks) {
      const content = getFeaturedContent(nb.slug);
      if (!content) continue;
      expect(content.files.length, `${nb.slug} should have 3+ files`).toBeGreaterThanOrEqual(3);
      for (const file of content.files) {
        expect(file.fileName, `${nb.slug} file missing fileName`).toBeTruthy();
        expect(file.content, `${nb.slug} file "${file.fileName}" missing content`).toBeTruthy();
        expect(file.content.length, `${nb.slug} file "${file.fileName}" content too short`).toBeGreaterThan(200);
      }
    }
  });

  it("all notebooks have a description", () => {
    for (const nb of featuredNotebooks) {
      const content = getFeaturedContent(nb.slug);
      if (!content) continue;
      expect(content.description, `${nb.slug} missing description`).toBeTruthy();
      expect(content.description.length).toBeGreaterThan(20);
      expect(content.description.length).toBeLessThan(200);
    }
  });

  it("all quiz questions have 4 options and valid correctIndex", () => {
    for (const nb of featuredNotebooks) {
      const content = getFeaturedContent(nb.slug);
      if (!content) continue;
      for (const q of content.quiz) {
        expect(q.options).toHaveLength(4);
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(4);
        expect(q.question).toBeTruthy();
        expect(q.explanation).toBeTruthy();
      }
    }
  });

  it("all flashcards have front and back", () => {
    for (const nb of featuredNotebooks) {
      const content = getFeaturedContent(nb.slug);
      if (!content) continue;
      for (const fc of content.flashcards) {
        expect(fc.front).toBeTruthy();
        expect(fc.back).toBeTruthy();
      }
    }
  });

  it("all reports have heading and content", () => {
    for (const nb of featuredNotebooks) {
      const content = getFeaturedContent(nb.slug);
      if (!content) continue;
      for (const section of content.report) {
        expect(section.heading).toBeTruthy();
        expect(section.content).toBeTruthy();
      }
    }
  });
});
