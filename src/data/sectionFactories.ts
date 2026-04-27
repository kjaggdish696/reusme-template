import { uid } from "../lib/id";
import type {
  AchievementItem,
  AwardItem,
  BookItem,
  CertificationItem,
  CourseItem,
  EducationItem,
  ExperienceItem,
  GalleryPhotoItem,
  InterestItem,
  LanguageItem,
  PersonalInfo,
  ProjectItem,
  PublicationItem,
  ReferenceItem,
  ResumeSection,
  SectionType,
  SkillItem,
  TimeSegment,
  WebsiteItem,
} from "../types/resume";

export const SECTION_LABELS: Record<SectionType, string> = {
  personal: "Personal Info",
  summary: "Professional Summary",
  experience: "Work Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
  achievements: "Key Achievements",
  custom: "Custom Section",
  languages: "Languages",
  courses: "Training / Courses",
  websites: "Find Me Online",
  awards: "Awards",
  references: "References",
  quote: "My Life Philosophy",
  volunteering: "Volunteering",
  interests: "Interests",
  books: "Books",
  publications: "Publications",
  signature: "Signature",
  photos: "Photos",
  strengths: "Strengths",
  timeChart: "My Time",
};

export const SECTION_ICONS: Record<SectionType, string> = {
  personal: "👤",
  summary: "📝",
  experience: "💼",
  education: "🎓",
  skills: "🛠️",
  projects: "🚀",
  certifications: "📜",
  achievements: "🏆",
  custom: "✨",
  languages: "🌐",
  courses: "📚",
  websites: "🔗",
  awards: "🎖️",
  references: "📇",
  quote: "💬",
  volunteering: "🤝",
  interests: "❤️",
  books: "📖",
  publications: "📰",
  signature: "✍️",
  photos: "🖼️",
  strengths: "📈",
  timeChart: "⏱️",
};

export function emptyPersonal(): PersonalInfo {
  return {
    fullName: "",
    role: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
    photo: { url: "", shape: "round", size: "md", border: "" },
  };
}

export function newExperience(): ExperienceItem {
  return {
    id: uid("exp"),
    company: "",
    position: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    bullets: [""],
  };
}

export function newEducation(): EducationItem {
  return {
    id: uid("edu"),
    institution: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    grade: "",
    bullets: [],
  };
}

export function newSkill(): SkillItem {
  return { id: uid("skl"), name: "", level: 3, category: "Core" };
}

export function newProject(): ProjectItem {
  return {
    id: uid("prj"),
    name: "",
    link: "",
    techStack: "",
    bullets: [""],
  };
}

export function newCertification(): CertificationItem {
  return {
    id: uid("cer"),
    name: "",
    issuer: "",
    date: "",
    link: "",
  };
}

export function newAchievement(): AchievementItem {
  return { id: uid("ach"), title: "", description: "", icon: "" };
}

export function newLanguage(): LanguageItem {
  return { id: uid("lng"), name: "", level: 4, proficiencyLabel: "Proficient" };
}

export function newCourse(): CourseItem {
  return { id: uid("crs"), title: "", provider: "", dateRange: "", description: "" };
}

export function newWebsite(): WebsiteItem {
  return { id: uid("web"), platform: "LinkedIn", username: "", url: "" };
}

export function newAward(): AwardItem {
  return { id: uid("awr"), title: "", issuer: "", icon: "🏅" };
}

export function newReference(): ReferenceItem {
  return { id: uid("ref"), name: "", role: "", email: "", phone: "" };
}

export function newInterest(): InterestItem {
  return { id: uid("int"), title: "", body: "", icon: "❤️" };
}

export function newBook(): BookItem {
  return { id: uid("bok"), title: "", author: "", coverUrl: "" };
}

export function newPublication(): PublicationItem {
  return { id: uid("pub"), title: "", publisher: "", date: "", link: "", summary: "" };
}

export function newGalleryPhoto(): GalleryPhotoItem {
  return { id: uid("gph"), url: "", caption: "" };
}

export function newTimeSegment(label: string, percent: number): TimeSegment {
  return { id: uid("tim"), label, percent };
}

export function buildSection(type: SectionType): ResumeSection {
  const base = {
    id: uid("sec"),
    type,
    title: SECTION_LABELS[type],
    visible: true,
  };
  switch (type) {
    case "personal":
      return { ...base, data: { type, personal: emptyPersonal() } };
    case "summary":
      return { ...base, data: { type, summary: "" } };
    case "experience":
      return { ...base, data: { type, experiences: [newExperience()] } };
    case "education":
      return { ...base, data: { type, education: [newEducation()] } };
    case "skills":
      return { ...base, data: { type, skills: [newSkill(), newSkill(), newSkill()] } };
    case "projects":
      return { ...base, data: { type, projects: [newProject()] } };
    case "certifications":
      return { ...base, data: { type, certifications: [newCertification()] } };
    case "achievements":
      return { ...base, data: { type, achievements: [newAchievement()] } };
    case "custom":
      return { ...base, data: { type, content: "" } };
    case "languages":
      return {
        ...base,
        data: {
          type,
          languages: [
            { ...newLanguage(), name: "English", level: 5, proficiencyLabel: "Native" },
            { ...newLanguage(), name: "Spanish", level: 4, proficiencyLabel: "Advanced" },
          ],
        },
      };
    case "courses":
      return { ...base, data: { type, courses: [newCourse()] } };
    case "websites":
      return { ...base, data: { type, websites: [newWebsite()] } };
    case "awards":
      return { ...base, data: { type, awards: [newAward()] } };
    case "references":
      return { ...base, data: { type, references: [newReference()] } };
    case "quote":
      return {
        ...base,
        data: {
          type,
          quote: "Be the change you wish to see in the world.",
          attribution: "Mahatma Gandhi",
        },
      };
    case "volunteering":
      return { ...base, data: { type, experiences: [newExperience()] } };
    case "interests":
      return { ...base, data: { type, interests: [newInterest()] } };
    case "books":
      return { ...base, data: { type, books: [newBook()] } };
    case "publications":
      return { ...base, data: { type, publications: [newPublication()] } };
    case "signature":
      return { ...base, data: { type, imageUrl: "", signedName: "" } };
    case "photos":
      return { ...base, data: { type, photos: [newGalleryPhoto()] } };
    case "strengths":
      return {
        ...base,
        data: {
          type,
          strengths: [
            { ...newAchievement(), title: "Go-getter", icon: "📈", description: "Persistence and follow-through." },
          ],
        },
      };
    case "timeChart":
      return {
        ...base,
        data: {
          type,
          segments: [
            newTimeSegment("Designing", 35),
            newTimeSegment("Collaboration", 25),
            newTimeSegment("Learning", 20),
            newTimeSegment("Rest", 20),
          ],
        },
      };
  }
}
