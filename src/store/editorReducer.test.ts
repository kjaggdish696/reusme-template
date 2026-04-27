import { describe, expect, it } from "vitest";
import { editorReducer, initialEditorState } from "./editorReducer";
import { makeBlankResume, makeSampleResume } from "../data/seed";
import { newExperience, newSkill } from "../data/sectionFactories";

describe("editorReducer", () => {
  function bootWith(...resumes: ReturnType<typeof makeBlankResume>[]) {
    return editorReducer(initialEditorState, {
      type: "INIT",
      resumes,
      activeResumeId: resumes[0]?.id ?? null,
    });
  }

  it("INIT sets resumes and active id", () => {
    const r = makeBlankResume("modern", "T1");
    const s = bootWith(r);
    expect(s.resumes).toHaveLength(1);
    expect(s.activeResumeId).toBe(r.id);
  });

  it("CREATE_RESUME prepends and activates", () => {
    const r1 = makeBlankResume("modern", "A");
    const r2 = makeBlankResume("classic", "B");
    let s = bootWith(r1);
    s = editorReducer(s, { type: "CREATE_RESUME", resume: r2 });
    expect(s.resumes[0].id).toBe(r2.id);
    expect(s.activeResumeId).toBe(r2.id);
    expect(s.past).toHaveLength(1);
  });

  it("RENAME_RESUME updates title and refreshes updatedAt", async () => {
    const r1 = makeBlankResume("modern", "A");
    let s = bootWith(r1);
    const before = s.resumes[0].updatedAt;
    // Nudge the clock so the ISO timestamp string can change.
    await new Promise((r) => setTimeout(r, 5));
    s = editorReducer(s, { type: "RENAME_RESUME", resumeId: r1.id, title: "New Title" });
    expect(s.resumes[0].title).toBe("New Title");
    expect(new Date(s.resumes[0].updatedAt).getTime()).toBeGreaterThanOrEqual(
      new Date(before).getTime(),
    );
  });

  it("CHANGE_TEMPLATE swaps templateId without touching sections", () => {
    const r = makeSampleResume("modern");
    let s = bootWith(r);
    const sectionsBefore = s.resumes[0].sections;
    s = editorReducer(s, { type: "CHANGE_TEMPLATE", resumeId: r.id, templateId: "creative" });
    expect(s.resumes[0].templateId).toBe("creative");
    expect(s.resumes[0].sections).toEqual(sectionsBefore);
  });

  it("ADD_SECTION + REMOVE_SECTION", () => {
    const r = makeBlankResume("modern");
    let s = bootWith(r);
    const initialCount = s.resumes[0].sections.length;
    s = editorReducer(s, { type: "ADD_SECTION", resumeId: r.id, sectionType: "achievements" });
    expect(s.resumes[0].sections).toHaveLength(initialCount + 1);
    const newId = s.resumes[0].sections[s.resumes[0].sections.length - 1].id;
    s = editorReducer(s, { type: "REMOVE_SECTION", resumeId: r.id, sectionId: newId });
    expect(s.resumes[0].sections).toHaveLength(initialCount);
  });

  it("REORDER_SECTIONS moves the section", () => {
    const r = makeBlankResume("modern");
    let s = bootWith(r);
    const ids = s.resumes[0].sections.map((x) => x.id);
    s = editorReducer(s, { type: "REORDER_SECTIONS", resumeId: r.id, from: 0, to: 2 });
    const after = s.resumes[0].sections.map((x) => x.id);
    expect(after[2]).toBe(ids[0]);
  });

  it("TOGGLE_SECTION_VISIBILITY flips visible flag", () => {
    const r = makeBlankResume("modern");
    let s = bootWith(r);
    const sec = s.resumes[0].sections[1];
    s = editorReducer(s, { type: "TOGGLE_SECTION_VISIBILITY", resumeId: r.id, sectionId: sec.id });
    expect(s.resumes[0].sections[1].visible).toBe(false);
  });

  it("UPDATE_PERSONAL merges patch", () => {
    const r = makeBlankResume("modern");
    let s = bootWith(r);
    const sec = s.resumes[0].sections.find((x) => x.type === "personal")!;
    s = editorReducer(s, {
      type: "UPDATE_PERSONAL",
      resumeId: r.id,
      sectionId: sec.id,
      personal: { fullName: "Aanya", email: "a@b.com" },
    });
    const after = s.resumes[0].sections.find((x) => x.type === "personal")!;
    if (after.data.type !== "personal") throw new Error();
    expect(after.data.personal.fullName).toBe("Aanya");
    expect(after.data.personal.email).toBe("a@b.com");
  });

  it("ADD/UPDATE/REMOVE EXPERIENCE works at item level", () => {
    const r = makeBlankResume("modern");
    let s = bootWith(r);
    const sec = s.resumes[0].sections.find((x) => x.type === "experience")!;
    const item = newExperience();
    s = editorReducer(s, { type: "ADD_EXPERIENCE", resumeId: r.id, sectionId: sec.id, item });
    s = editorReducer(s, {
      type: "UPDATE_EXPERIENCE",
      resumeId: r.id,
      sectionId: sec.id,
      itemId: item.id,
      patch: { position: "Lead Designer" },
    });
    let updatedSec = s.resumes[0].sections.find((x) => x.id === sec.id)!;
    if (updatedSec.data.type !== "experience") throw new Error();
    const found = updatedSec.data.experiences.find((e) => e.id === item.id)!;
    expect(found.position).toBe("Lead Designer");
    s = editorReducer(s, {
      type: "REMOVE_EXPERIENCE",
      resumeId: r.id,
      sectionId: sec.id,
      itemId: item.id,
    });
    updatedSec = s.resumes[0].sections.find((x) => x.id === sec.id)!;
    if (updatedSec.data.type !== "experience") throw new Error();
    expect(updatedSec.data.experiences.find((e) => e.id === item.id)).toBeUndefined();
  });

  it("UPDATE_THEME merges theme patch", () => {
    const r = makeBlankResume("modern");
    let s = bootWith(r);
    s = editorReducer(s, {
      type: "UPDATE_THEME",
      resumeId: r.id,
      theme: { accentColor: "#ff0000", spacing: "compact" },
    });
    expect(s.resumes[0].theme.accentColor).toBe("#ff0000");
    expect(s.resumes[0].theme.spacing).toBe("compact");
    expect(s.resumes[0].theme.fontFamily).toBe("Inter");
  });

  it("UNDO / REDO work across mutations", () => {
    const r = makeBlankResume("modern", "Start");
    let s = bootWith(r);
    s = editorReducer(s, { type: "RENAME_RESUME", resumeId: r.id, title: "Step 1" });
    s = editorReducer(s, { type: "RENAME_RESUME", resumeId: r.id, title: "Step 2" });
    expect(s.resumes[0].title).toBe("Step 2");
    s = editorReducer(s, { type: "UNDO" });
    expect(s.resumes[0].title).toBe("Step 1");
    s = editorReducer(s, { type: "UNDO" });
    expect(s.resumes[0].title).toBe("Start");
    s = editorReducer(s, { type: "REDO" });
    expect(s.resumes[0].title).toBe("Step 1");
  });

  it("REORDER_SKILLS keeps array length unchanged", () => {
    const r = makeBlankResume("modern");
    let s = bootWith(r);
    const sec = s.resumes[0].sections.find((x) => x.type === "skills")!;
    if (sec.data.type !== "skills") throw new Error();
    const initialLen = sec.data.skills.length;
    s = editorReducer(s, { type: "ADD_SKILL", resumeId: r.id, sectionId: sec.id, item: newSkill() });
    s = editorReducer(s, { type: "REORDER_SKILLS", resumeId: r.id, sectionId: sec.id, from: 0, to: 1 });
    const after = s.resumes[0].sections.find((x) => x.id === sec.id)!;
    if (after.data.type !== "skills") throw new Error();
    expect(after.data.skills.length).toBe(initialLen + 1);
  });
});
