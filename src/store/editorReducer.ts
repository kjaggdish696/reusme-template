import type {
  AchievementItem,
  CertificationItem,
  CourseItem,
  CourseOptionalFieldKey,
  EducationItem,
  ExperienceItem,
  PersonalInfo,
  PhotoShape,
  PhotoSize,
  ProjectItem,
  Resume,
  ResumeSection,
  ResumeTheme,
  SectionData,
  SectionType,
  SkillChartStyle,
  SkillItem,
} from "../types/resume";
import { buildSection } from "../data/sectionFactories";
import { templateById } from "../data/mockTemplates";

export interface EditorState {
  resumes: Resume[];
  activeResumeId: string | null;
  past: Resume[][];
  future: Resume[][];
}

export type EditorAction =
  | { type: "INIT"; resumes: Resume[]; activeResumeId: string | null }
  | { type: "SET_ACTIVE"; resumeId: string }
  | { type: "CREATE_RESUME"; resume: Resume }
  | { type: "DUPLICATE_RESUME"; resumeId: string; newResume: Resume }
  | { type: "DELETE_RESUME"; resumeId: string }
  | { type: "RENAME_RESUME"; resumeId: string; title: string }
  | { type: "CHANGE_TEMPLATE"; resumeId: string; templateId: string }
  | { type: "UPDATE_THEME"; resumeId: string; theme: Partial<ResumeTheme> }
  | { type: "ADD_SECTION"; resumeId: string; sectionType: SectionType; title?: string }
  | { type: "REMOVE_SECTION"; resumeId: string; sectionId: string }
  | { type: "RENAME_SECTION"; resumeId: string; sectionId: string; title: string }
  | { type: "TOGGLE_SECTION_VISIBILITY"; resumeId: string; sectionId: string }
  | { type: "REORDER_SECTIONS"; resumeId: string; from: number; to: number }
  | { type: "UPDATE_PERSONAL"; resumeId: string; sectionId: string; personal: Partial<PersonalInfo> }
  | { type: "UPDATE_SUMMARY"; resumeId: string; sectionId: string; summary: string }
  | { type: "UPDATE_CUSTOM"; resumeId: string; sectionId: string; content: string }
  | { type: "ADD_EXPERIENCE"; resumeId: string; sectionId: string; item: ExperienceItem }
  | { type: "UPDATE_EXPERIENCE"; resumeId: string; sectionId: string; itemId: string; patch: Partial<ExperienceItem> }
  | { type: "REMOVE_EXPERIENCE"; resumeId: string; sectionId: string; itemId: string }
  | { type: "REORDER_EXPERIENCES"; resumeId: string; sectionId: string; from: number; to: number }
  | { type: "ADD_EDUCATION"; resumeId: string; sectionId: string; item: EducationItem }
  | { type: "UPDATE_EDUCATION"; resumeId: string; sectionId: string; itemId: string; patch: Partial<EducationItem> }
  | { type: "REMOVE_EDUCATION"; resumeId: string; sectionId: string; itemId: string }
  | { type: "REORDER_EDUCATION"; resumeId: string; sectionId: string; from: number; to: number }
  | { type: "ADD_SKILL"; resumeId: string; sectionId: string; item: SkillItem }
  | { type: "UPDATE_SKILL"; resumeId: string; sectionId: string; itemId: string; patch: Partial<SkillItem> }
  | { type: "REMOVE_SKILL"; resumeId: string; sectionId: string; itemId: string }
  | { type: "REORDER_SKILLS"; resumeId: string; sectionId: string; from: number; to: number }
  | { type: "SET_SKILLS_CHART"; resumeId: string; sectionId: string; chartStyle: SkillChartStyle }
  | { type: "ADD_PROJECT"; resumeId: string; sectionId: string; item: ProjectItem }
  | { type: "UPDATE_PROJECT"; resumeId: string; sectionId: string; itemId: string; patch: Partial<ProjectItem> }
  | { type: "REMOVE_PROJECT"; resumeId: string; sectionId: string; itemId: string }
  | { type: "REORDER_PROJECTS"; resumeId: string; sectionId: string; from: number; to: number }
  | { type: "ADD_CERTIFICATION"; resumeId: string; sectionId: string; item: CertificationItem }
  | { type: "UPDATE_CERTIFICATION"; resumeId: string; sectionId: string; itemId: string; patch: Partial<CertificationItem> }
  | { type: "REMOVE_CERTIFICATION"; resumeId: string; sectionId: string; itemId: string }
  | { type: "REORDER_CERTIFICATIONS"; resumeId: string; sectionId: string; from: number; to: number }
  | { type: "ADD_ACHIEVEMENT"; resumeId: string; sectionId: string; item: AchievementItem }
  | { type: "UPDATE_ACHIEVEMENT"; resumeId: string; sectionId: string; itemId: string; patch: Partial<AchievementItem> }
  | { type: "REMOVE_ACHIEVEMENT"; resumeId: string; sectionId: string; itemId: string }
  | { type: "REORDER_ACHIEVEMENTS"; resumeId: string; sectionId: string; from: number; to: number }
  | { type: "SET_SECTION_DATA"; resumeId: string; sectionId: string; data: SectionData }
  | { type: "UNDO" }
  | { type: "REDO" };

const HISTORY_LIMIT = 50;

function moveItem<T>(arr: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= arr.length || to >= arr.length) return arr;
  const next = arr.slice();
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

function touch(resume: Resume): Resume {
  return { ...resume, updatedAt: new Date().toISOString() };
}

function mapResume(state: EditorState, resumeId: string, fn: (r: Resume) => Resume): EditorState {
  const target = state.resumes.find((r) => r.id === resumeId);
  if (!target) return state;
  const updated = touch(fn(target));
  const past = [...state.past, state.resumes].slice(-HISTORY_LIMIT);
  return {
    ...state,
    past,
    future: [],
    resumes: state.resumes.map((r) => (r.id === resumeId ? updated : r)),
  };
}

function migrateResume(r: Resume): Resume {
  const theme = r.theme ?? ({} as ResumeTheme);
  return {
    ...r,
    theme: {
      fontFamily: theme.fontFamily ?? "Inter",
      accentColor: theme.accentColor ?? "#4f46e5",
      pageBackground: theme.pageBackground ?? "#ffffff",
      headingStyle: theme.headingStyle ?? "upper",
      spacing: theme.spacing ?? "normal",
      fontSize: theme.fontSize ?? "md",
      lineHeight: theme.lineHeight ?? "normal",
      headerLayout: theme.headerLayout ?? "stack-left",
    },
    sections: r.sections.map((s) => {
      if (s.data.type === "courses") {
        const raw = s.data as {
          type: "courses";
          courses: CourseItem[];
          hiddenCourseFields?: CourseOptionalFieldKey[];
        };
        const legacy = raw.hiddenCourseFields?.length ? raw.hiddenCourseFields : undefined;
        const courses = raw.courses.map((c) => {
          if ((c.hiddenFields?.length ?? 0) > 0) return c;
          if (legacy) return { ...c, hiddenFields: [...legacy] };
          return c;
        });
        return { ...s, data: { type: "courses", courses } };
      }
      if (s.data.type !== "personal") return s;
      const p = s.data.personal;
      const photo = p.photo ?? { url: "", shape: "round", size: "md", border: "" };
      return {
        ...s,
        data: {
          type: "personal",
          personal: {
            ...p,
            photo: {
              url: photo.url ?? "",
              shape: (photo.shape as PhotoShape) ?? "round",
              size: (photo.size as PhotoSize) ?? "md",
              border: photo.border ?? "",
            },
          },
        },
      };
    }),
  };
}

function isExperienceBlock(
  d: ResumeSection["data"],
): d is { type: "experience" | "volunteering"; experiences: ExperienceItem[] } {
  return d.type === "experience" || d.type === "volunteering";
}

function mapSection(
  resume: Resume,
  sectionId: string,
  fn: (s: ResumeSection) => ResumeSection,
): Resume {
  return {
    ...resume,
    sections: resume.sections.map((s) => (s.id === sectionId ? fn(s) : s)),
  };
}

export const initialEditorState: EditorState = {
  resumes: [],
  activeResumeId: null,
  past: [],
  future: [],
};

export function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "INIT":
      return {
        resumes: action.resumes.map(migrateResume),
        activeResumeId: action.activeResumeId,
        past: [],
        future: [],
      };
    case "SET_ACTIVE":
      return { ...state, activeResumeId: action.resumeId };
    case "CREATE_RESUME": {
      const past = [...state.past, state.resumes].slice(-HISTORY_LIMIT);
      return {
        ...state,
        past,
        future: [],
        resumes: [action.resume, ...state.resumes],
        activeResumeId: action.resume.id,
      };
    }
    case "DUPLICATE_RESUME": {
      const past = [...state.past, state.resumes].slice(-HISTORY_LIMIT);
      const idx = state.resumes.findIndex((r) => r.id === action.resumeId);
      if (idx === -1) return state;
      const next = state.resumes.slice();
      next.splice(idx + 1, 0, action.newResume);
      return { ...state, past, future: [], resumes: next };
    }
    case "DELETE_RESUME": {
      const past = [...state.past, state.resumes].slice(-HISTORY_LIMIT);
      const remaining = state.resumes.filter((r) => r.id !== action.resumeId);
      return {
        ...state,
        past,
        future: [],
        resumes: remaining,
        activeResumeId:
          state.activeResumeId === action.resumeId
            ? remaining[0]?.id ?? null
            : state.activeResumeId,
      };
    }
    case "RENAME_RESUME":
      return mapResume(state, action.resumeId, (r) => ({ ...r, title: action.title }));
    case "CHANGE_TEMPLATE":
      return mapResume(state, action.resumeId, (r) => {
        const cfg = templateById(action.templateId);
        if (!cfg) return { ...r, templateId: action.templateId };
        return {
          ...r,
          templateId: action.templateId,
          theme: {
            ...r.theme,
            accentColor: cfg.defaults.accentColor,
            fontFamily: cfg.defaults.fontFamily,
            headingStyle: cfg.defaults.headingStyle,
            headerLayout: cfg.defaults.headerLayout,
          },
        };
      });
    case "UPDATE_THEME":
      return mapResume(state, action.resumeId, (r) => ({
        ...r,
        theme: { ...r.theme, ...action.theme },
      }));
    case "ADD_SECTION": {
      const section = buildSection(action.sectionType);
      if (action.title) section.title = action.title;
      return mapResume(state, action.resumeId, (r) => ({
        ...r,
        sections: [...r.sections, section],
      }));
    }
    case "REMOVE_SECTION":
      return mapResume(state, action.resumeId, (r) => ({
        ...r,
        sections: r.sections.filter((s) => s.id !== action.sectionId),
      }));
    case "RENAME_SECTION":
      return mapResume(state, action.resumeId, (r) =>
        mapSection(r, action.sectionId, (s) => ({ ...s, title: action.title })),
      );
    case "TOGGLE_SECTION_VISIBILITY":
      return mapResume(state, action.resumeId, (r) =>
        mapSection(r, action.sectionId, (s) => ({ ...s, visible: !s.visible })),
      );
    case "REORDER_SECTIONS":
      return mapResume(state, action.resumeId, (r) => ({
        ...r,
        sections: moveItem(r.sections, action.from, action.to),
      }));
    case "UPDATE_PERSONAL":
      return mapResume(state, action.resumeId, (r) =>
        mapSection(r, action.sectionId, (s) => {
          if (s.data.type !== "personal") return s;
          return { ...s, data: { type: "personal", personal: { ...s.data.personal, ...action.personal } } };
        }),
      );
    case "UPDATE_SUMMARY":
      return mapResume(state, action.resumeId, (r) =>
        mapSection(r, action.sectionId, (s) => {
          if (s.data.type !== "summary") return s;
          return { ...s, data: { type: "summary", summary: action.summary } };
        }),
      );
    case "UPDATE_CUSTOM":
      return mapResume(state, action.resumeId, (r) =>
        mapSection(r, action.sectionId, (s) => {
          if (s.data.type !== "custom") return s;
          return { ...s, data: { type: "custom", content: action.content } };
        }),
      );
    case "ADD_EXPERIENCE":
      return mapResume(state, action.resumeId, (r) =>
        mapSection(r, action.sectionId, (s) => {
          if (!isExperienceBlock(s.data)) return s;
          return {
            ...s,
            data: { ...s.data, experiences: [...s.data.experiences, action.item] },
          };
        }),
      );
    case "UPDATE_EXPERIENCE":
      return mapResume(state, action.resumeId, (r) =>
        mapSection(r, action.sectionId, (s) => {
          if (!isExperienceBlock(s.data)) return s;
          return {
            ...s,
            data: {
              ...s.data,
              experiences: s.data.experiences.map((e) =>
                e.id === action.itemId ? { ...e, ...action.patch } : e,
              ),
            },
          };
        }),
      );
    case "REMOVE_EXPERIENCE":
      return mapResume(state, action.resumeId, (r) =>
        mapSection(r, action.sectionId, (s) => {
          if (!isExperienceBlock(s.data)) return s;
          return {
            ...s,
            data: {
              ...s.data,
              experiences: s.data.experiences.filter((e) => e.id !== action.itemId),
            },
          };
        }),
      );
    case "REORDER_EXPERIENCES":
      return mapResume(state, action.resumeId, (r) =>
        mapSection(r, action.sectionId, (s) => {
          if (!isExperienceBlock(s.data)) return s;
          return {
            ...s,
            data: {
              ...s.data,
              experiences: moveItem(s.data.experiences, action.from, action.to),
            },
          };
        }),
      );
    case "ADD_EDUCATION":
      return mapResume(state, action.resumeId, (r) =>
        mapSection(r, action.sectionId, (s) => {
          if (s.data.type !== "education") return s;
          return { ...s, data: { type: "education", education: [...s.data.education, action.item] } };
        }),
      );
    case "UPDATE_EDUCATION":
      return mapResume(state, action.resumeId, (r) =>
        mapSection(r, action.sectionId, (s) => {
          if (s.data.type !== "education") return s;
          return {
            ...s,
            data: {
              type: "education",
              education: s.data.education.map((e) =>
                e.id === action.itemId ? { ...e, ...action.patch } : e,
              ),
            },
          };
        }),
      );
    case "REMOVE_EDUCATION":
      return mapResume(state, action.resumeId, (r) =>
        mapSection(r, action.sectionId, (s) => {
          if (s.data.type !== "education") return s;
          return {
            ...s,
            data: { type: "education", education: s.data.education.filter((e) => e.id !== action.itemId) },
          };
        }),
      );
    case "REORDER_EDUCATION":
      return mapResume(state, action.resumeId, (r) =>
        mapSection(r, action.sectionId, (s) => {
          if (s.data.type !== "education") return s;
          return {
            ...s,
            data: { type: "education", education: moveItem(s.data.education, action.from, action.to) },
          };
        }),
      );
    case "ADD_SKILL":
      return mapResume(state, action.resumeId, (r) =>
        mapSection(r, action.sectionId, (s) => {
          if (s.data.type !== "skills") return s;
          return { ...s, data: { type: "skills", skills: [...s.data.skills, action.item] } };
        }),
      );
    case "UPDATE_SKILL":
      return mapResume(state, action.resumeId, (r) =>
        mapSection(r, action.sectionId, (s) => {
          if (s.data.type !== "skills") return s;
          return {
            ...s,
            data: {
              type: "skills",
              skills: s.data.skills.map((sk) => (sk.id === action.itemId ? { ...sk, ...action.patch } : sk)),
            },
          };
        }),
      );
    case "REMOVE_SKILL":
      return mapResume(state, action.resumeId, (r) =>
        mapSection(r, action.sectionId, (s) => {
          if (s.data.type !== "skills") return s;
          return { ...s, data: { type: "skills", skills: s.data.skills.filter((sk) => sk.id !== action.itemId) } };
        }),
      );
    case "REORDER_SKILLS":
      return mapResume(state, action.resumeId, (r) =>
        mapSection(r, action.sectionId, (s) => {
          if (s.data.type !== "skills") return s;
          return {
            ...s,
            data: {
              type: "skills",
              skills: moveItem(s.data.skills, action.from, action.to),
              chartStyle: s.data.chartStyle,
            },
          };
        }),
      );
    case "SET_SKILLS_CHART":
      return mapResume(state, action.resumeId, (r) =>
        mapSection(r, action.sectionId, (s) => {
          if (s.data.type !== "skills") return s;
          return {
            ...s,
            data: { type: "skills", skills: s.data.skills, chartStyle: action.chartStyle },
          };
        }),
      );
    case "ADD_PROJECT":
      return mapResume(state, action.resumeId, (r) =>
        mapSection(r, action.sectionId, (s) => {
          if (s.data.type !== "projects") return s;
          return { ...s, data: { type: "projects", projects: [...s.data.projects, action.item] } };
        }),
      );
    case "UPDATE_PROJECT":
      return mapResume(state, action.resumeId, (r) =>
        mapSection(r, action.sectionId, (s) => {
          if (s.data.type !== "projects") return s;
          return {
            ...s,
            data: {
              type: "projects",
              projects: s.data.projects.map((p) =>
                p.id === action.itemId ? { ...p, ...action.patch } : p,
              ),
            },
          };
        }),
      );
    case "REMOVE_PROJECT":
      return mapResume(state, action.resumeId, (r) =>
        mapSection(r, action.sectionId, (s) => {
          if (s.data.type !== "projects") return s;
          return {
            ...s,
            data: { type: "projects", projects: s.data.projects.filter((p) => p.id !== action.itemId) },
          };
        }),
      );
    case "REORDER_PROJECTS":
      return mapResume(state, action.resumeId, (r) =>
        mapSection(r, action.sectionId, (s) => {
          if (s.data.type !== "projects") return s;
          return {
            ...s,
            data: { type: "projects", projects: moveItem(s.data.projects, action.from, action.to) },
          };
        }),
      );
    case "ADD_CERTIFICATION":
      return mapResume(state, action.resumeId, (r) =>
        mapSection(r, action.sectionId, (s) => {
          if (s.data.type !== "certifications") return s;
          return { ...s, data: { type: "certifications", certifications: [...s.data.certifications, action.item] } };
        }),
      );
    case "UPDATE_CERTIFICATION":
      return mapResume(state, action.resumeId, (r) =>
        mapSection(r, action.sectionId, (s) => {
          if (s.data.type !== "certifications") return s;
          return {
            ...s,
            data: {
              type: "certifications",
              certifications: s.data.certifications.map((c) =>
                c.id === action.itemId ? { ...c, ...action.patch } : c,
              ),
            },
          };
        }),
      );
    case "REMOVE_CERTIFICATION":
      return mapResume(state, action.resumeId, (r) =>
        mapSection(r, action.sectionId, (s) => {
          if (s.data.type !== "certifications") return s;
          return {
            ...s,
            data: { type: "certifications", certifications: s.data.certifications.filter((c) => c.id !== action.itemId) },
          };
        }),
      );
    case "REORDER_CERTIFICATIONS":
      return mapResume(state, action.resumeId, (r) =>
        mapSection(r, action.sectionId, (s) => {
          if (s.data.type !== "certifications") return s;
          return {
            ...s,
            data: { type: "certifications", certifications: moveItem(s.data.certifications, action.from, action.to) },
          };
        }),
      );
    case "ADD_ACHIEVEMENT":
      return mapResume(state, action.resumeId, (r) =>
        mapSection(r, action.sectionId, (s) => {
          if (s.data.type !== "achievements") return s;
          return { ...s, data: { type: "achievements", achievements: [...s.data.achievements, action.item] } };
        }),
      );
    case "UPDATE_ACHIEVEMENT":
      return mapResume(state, action.resumeId, (r) =>
        mapSection(r, action.sectionId, (s) => {
          if (s.data.type !== "achievements") return s;
          return {
            ...s,
            data: {
              type: "achievements",
              achievements: s.data.achievements.map((a) =>
                a.id === action.itemId ? { ...a, ...action.patch } : a,
              ),
            },
          };
        }),
      );
    case "REMOVE_ACHIEVEMENT":
      return mapResume(state, action.resumeId, (r) =>
        mapSection(r, action.sectionId, (s) => {
          if (s.data.type !== "achievements") return s;
          return {
            ...s,
            data: { type: "achievements", achievements: s.data.achievements.filter((a) => a.id !== action.itemId) },
          };
        }),
      );
    case "REORDER_ACHIEVEMENTS":
      return mapResume(state, action.resumeId, (r) =>
        mapSection(r, action.sectionId, (s) => {
          if (s.data.type !== "achievements") return s;
          return {
            ...s,
            data: { type: "achievements", achievements: moveItem(s.data.achievements, action.from, action.to) },
          };
        }),
      );
    case "SET_SECTION_DATA":
      return mapResume(state, action.resumeId, (r) =>
        mapSection(r, action.sectionId, (s) => {
          if (s.data.type === "personal" || action.data.type === "personal") return s;
          return { ...s, type: action.data.type, data: action.data };
        }),
      );
    case "UNDO": {
      if (!state.past.length) return state;
      const previous = state.past[state.past.length - 1];
      return {
        ...state,
        resumes: previous,
        past: state.past.slice(0, -1),
        future: [state.resumes, ...state.future],
      };
    }
    case "REDO": {
      if (!state.future.length) return state;
      const [next, ...rest] = state.future;
      return {
        ...state,
        resumes: next,
        past: [...state.past, state.resumes],
        future: rest,
      };
    }
    default:
      return state;
  }
}
