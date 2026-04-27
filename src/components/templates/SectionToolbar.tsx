import { useState } from "react";
import {
  newAchievement,
  newAward,
  newBook,
  newCertification,
  newCourse,
  newEducation,
  newExperience,
  newGalleryPhoto,
  newInterest,
  newLanguage,
  newProject,
  newPublication,
  newReference,
  newSkill,
  newTimeSegment,
  newWebsite,
} from "../../data/sectionFactories";
import type { ResumeSection, SkillChartStyle } from "../../types/resume";
import { useTemplateBindings } from "./TemplateContext";

interface Props {
  section: ResumeSection;
  pinned?: boolean;
  /** Drag handle props (from useSortable). */
  dragHandleProps?: Record<string, unknown>;
}

/**
 * Floating contextual section toolbar (dark pill) — visible above the
 * currently selected section in edit mode. Inspired by EnhanceCV's
 * "+ Entry / T / 📅 / 🗑 / ⚙" floating bar.
 */
export default function SectionToolbar({ section, pinned, dragHandleProps }: Props) {
  const { resumeId, dispatch } = useTemplateBindings();
  const [styleOpen, setStyleOpen] = useState(false);

  const addLabel = entryLabel(section);

  function addEntry() {
    const sid = section.id;
    switch (section.data.type) {
      case "experience":
      case "volunteering":
        dispatch({ type: "ADD_EXPERIENCE", resumeId, sectionId: sid, item: newExperience() });
        break;
      case "education":
        dispatch({ type: "ADD_EDUCATION", resumeId, sectionId: sid, item: newEducation() });
        break;
      case "skills":
        dispatch({ type: "ADD_SKILL", resumeId, sectionId: sid, item: newSkill() });
        break;
      case "projects":
        dispatch({ type: "ADD_PROJECT", resumeId, sectionId: sid, item: newProject() });
        break;
      case "certifications":
        dispatch({
          type: "ADD_CERTIFICATION",
          resumeId,
          sectionId: sid,
          item: newCertification(),
        });
        break;
      case "achievements":
        dispatch({
          type: "ADD_ACHIEVEMENT",
          resumeId,
          sectionId: sid,
          item: newAchievement(),
        });
        break;
      case "languages":
        dispatch({
          type: "SET_SECTION_DATA",
          resumeId,
          sectionId: sid,
          data: { type: "languages", languages: [...section.data.languages, newLanguage()] },
        });
        break;
      case "courses":
        dispatch({
          type: "SET_SECTION_DATA",
          resumeId,
          sectionId: sid,
          data: { type: "courses", courses: [...section.data.courses, newCourse()] },
        });
        break;
      case "websites":
        dispatch({
          type: "SET_SECTION_DATA",
          resumeId,
          sectionId: sid,
          data: { type: "websites", websites: [...section.data.websites, newWebsite()] },
        });
        break;
      case "awards":
        dispatch({
          type: "SET_SECTION_DATA",
          resumeId,
          sectionId: sid,
          data: { type: "awards", awards: [...section.data.awards, newAward()] },
        });
        break;
      case "references":
        dispatch({
          type: "SET_SECTION_DATA",
          resumeId,
          sectionId: sid,
          data: { type: "references", references: [...section.data.references, newReference()] },
        });
        break;
      case "interests":
        dispatch({
          type: "SET_SECTION_DATA",
          resumeId,
          sectionId: sid,
          data: { type: "interests", interests: [...section.data.interests, newInterest()] },
        });
        break;
      case "books":
        dispatch({
          type: "SET_SECTION_DATA",
          resumeId,
          sectionId: sid,
          data: { type: "books", books: [...section.data.books, newBook()] },
        });
        break;
      case "publications":
        dispatch({
          type: "SET_SECTION_DATA",
          resumeId,
          sectionId: sid,
          data: { type: "publications", publications: [...section.data.publications, newPublication()] },
        });
        break;
      case "photos":
        dispatch({
          type: "SET_SECTION_DATA",
          resumeId,
          sectionId: sid,
          data: { type: "photos", photos: [...section.data.photos, newGalleryPhoto()] },
        });
        break;
      case "strengths":
        dispatch({
          type: "SET_SECTION_DATA",
          resumeId,
          sectionId: sid,
          data: { type: "strengths", strengths: [...section.data.strengths, newAchievement()] },
        });
        break;
      case "timeChart":
        dispatch({
          type: "SET_SECTION_DATA",
          resumeId,
          sectionId: sid,
          data: { type: "timeChart", segments: [...section.data.segments, newTimeSegment("New", 10)] },
        });
        break;
      default:
        break;
    }
  }

  function setSkillsChart(s: SkillChartStyle) {
    dispatch({ type: "SET_SKILLS_CHART", resumeId, sectionId: section.id, chartStyle: s });
    setStyleOpen(false);
  }

  function remove() {
    if (confirm(`Remove "${section.title}"?`)) {
      dispatch({ type: "REMOVE_SECTION", resumeId, sectionId: section.id });
    }
  }

  function toggleVisibility() {
    dispatch({ type: "TOGGLE_SECTION_VISIBILITY", resumeId, sectionId: section.id });
  }

  const canAddEntry = [
    "experience",
    "volunteering",
    "education",
    "skills",
    "projects",
    "certifications",
    "achievements",
    "languages",
    "courses",
    "websites",
    "awards",
    "references",
    "interests",
    "books",
    "publications",
    "photos",
    "strengths",
    "timeChart",
  ].includes(section.data.type);

  return (
    <div
      className="rcp-sectoolbar"
      contentEditable={false}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className="rcp-sectoolbar__handle"
        title="Drag to reorder"
        aria-label="Drag section"
        {...(dragHandleProps ?? {})}
      >
        <Icon path="M9 4v16M15 4v16" />
      </button>
      <Sep />
      {canAddEntry && (
        <button
          type="button"
          className="rcp-sectoolbar__primary"
          onClick={addEntry}
          title={`Add ${addLabel.toLowerCase()}`}
        >
          <Icon path="M12 5v14M5 12h14" /> {addLabel}
        </button>
      )}
      {section.data.type === "skills" && (
        <div className="rcp-sectoolbar__group">
          <button
            type="button"
            className="rcp-sectoolbar__btn"
            onClick={() => setStyleOpen((o) => !o)}
            title="Skills style"
          >
            <Icon path="M3 12a9 9 0 1 0 9-9v9z" /> Style
          </button>
          {styleOpen && (
            <div className="rcp-sectoolbar__menu">
              {(["bars", "donut", "dots", "tags"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  className="rcp-sectoolbar__menu-item"
                  onClick={() => setSkillsChart(s)}
                >
                  {s === "bars" ? "Bars" : s === "donut" ? "Pie / Donut" : s === "dots" ? "Dots" : "Tag cloud"}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      <Sep />
      <button
        type="button"
        className="rcp-sectoolbar__btn"
        onClick={toggleVisibility}
        title={section.visible ? "Hide section" : "Show section"}
      >
        {section.visible ? (
          <Icon path="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" extra={<circle cx="12" cy="12" r="3" />} />
        ) : (
          <Icon path="M3 3l18 18M10.5 6.5A8.7 8.7 0 0 1 12 6c6 0 10 6 10 6a13 13 0 0 1-3.6 4M6 6.6C3.3 8.5 2 12 2 12s4 6 10 6c1.7 0 3.2-.4 4.5-1" />
        )}
      </button>
      {!pinned && (
        <button
          type="button"
          className="rcp-sectoolbar__btn rcp-sectoolbar__btn--danger"
          onClick={remove}
          title="Remove section"
        >
          <Icon path="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14" />
        </button>
      )}
    </div>
  );
}

function entryLabel(section: ResumeSection): string {
  switch (section.data.type) {
    case "experience":
    case "volunteering":
      return "Entry";
    case "education":
      return "Entry";
    case "skills":
      return "Skill";
    case "projects":
      return "Project";
    case "certifications":
      return "Cert";
    case "achievements":
      return "Item";
    case "languages":
      return "Language";
    case "courses":
      return "Course";
    case "websites":
      return "Link";
    case "awards":
      return "Award";
    case "references":
      return "Reference";
    case "interests":
      return "Interest";
    case "books":
      return "Book";
    case "publications":
      return "Publication";
    case "photos":
      return "Photo";
    case "strengths":
      return "Strength";
    case "timeChart":
      return "Segment";
    default:
      return "Entry";
  }
}

function Icon({ path, extra }: { path: string; extra?: React.ReactNode }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
      {extra}
    </svg>
  );
}

function Sep() {
  return <span className="rcp-sectoolbar__sep" aria-hidden="true" />;
}
