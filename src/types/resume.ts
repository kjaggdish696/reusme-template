export type SectionType =
  | "personal"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "achievements"
  | "custom"
  | "languages"
  | "courses"
  | "websites"
  | "awards"
  | "references"
  | "quote"
  | "volunteering"
  | "interests"
  | "books"
  | "publications"
  | "signature"
  | "photos"
  | "strengths"
  | "timeChart";

export type ContactKey =
  | "email"
  | "phone"
  | "location"
  | "website"
  | "linkedin"
  | "github";

export type PhotoShape = "round" | "rounded" | "square";
export type PhotoSize = "sm" | "md" | "lg" | "xl";

export interface PhotoSettings {
  /** Data URL or absolute URL. Empty string = no photo. */
  url: string;
  shape: PhotoShape;
  size: PhotoSize;
  /** Border ring color (CSS), empty = none. */
  border: string;
}

export interface PersonalInfo {
  fullName: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  /** Contact fields the user has explicitly hidden (won't show in edit or print). */
  hiddenContacts?: ContactKey[];
  /** Optional profile photo. */
  photo?: PhotoSettings;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  grade: string;
  bullets: string[];
}

export interface SkillItem {
  id: string;
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
  category: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  link: string;
  techStack: string;
  bullets: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  /** Optional emoji or short glyph shown beside the title (Enhancv-style). */
  icon?: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
  proficiencyLabel: string;
}

/** Optional course row fields that can be hidden from the canvas and exports. Title always shows. */
export type CourseOptionalFieldKey = "provider" | "dateRange" | "description";

export interface CourseItem {
  id: string;
  title: string;
  provider: string;
  dateRange: string;
  description: string;
  /** Per-entry: hide these fields on the resume (sidebar still lists them, disabled when off). */
  hiddenFields?: CourseOptionalFieldKey[];
}

export interface WebsiteItem {
  id: string;
  platform: string;
  username: string;
  url: string;
}

export interface AwardItem {
  id: string;
  title: string;
  issuer: string;
  icon: string;
}

export interface ReferenceItem {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface InterestItem {
  id: string;
  title: string;
  body: string;
  icon: string;
}

export interface BookItem {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
}

export interface PublicationItem {
  id: string;
  title: string;
  publisher: string;
  date: string;
  link: string;
  summary: string;
}

export interface GalleryPhotoItem {
  id: string;
  url: string;
  caption: string;
}

export interface TimeSegment {
  id: string;
  label: string;
  /** 0–100; normalized visually if the total ≠ 100. */
  percent: number;
}

export type SkillChartStyle = "bars" | "tags" | "dots" | "donut";

export type SectionData =
  | { type: "personal"; personal: PersonalInfo }
  | { type: "summary"; summary: string }
  | { type: "experience"; experiences: ExperienceItem[] }
  | { type: "education"; education: EducationItem[] }
  | { type: "skills"; skills: SkillItem[]; chartStyle?: SkillChartStyle }
  | { type: "projects"; projects: ProjectItem[] }
  | { type: "certifications"; certifications: CertificationItem[] }
  | { type: "achievements"; achievements: AchievementItem[] }
  | { type: "custom"; content: string }
  | { type: "languages"; languages: LanguageItem[] }
  | { type: "courses"; courses: CourseItem[] }
  | { type: "websites"; websites: WebsiteItem[] }
  | { type: "awards"; awards: AwardItem[] }
  | { type: "references"; references: ReferenceItem[] }
  | { type: "quote"; quote: string; attribution: string }
  | { type: "volunteering"; experiences: ExperienceItem[] }
  | { type: "interests"; interests: InterestItem[] }
  | { type: "books"; books: BookItem[] }
  | { type: "publications"; publications: PublicationItem[] }
  | { type: "signature"; imageUrl: string; signedName: string }
  | { type: "photos"; photos: GalleryPhotoItem[] }
  | { type: "strengths"; strengths: AchievementItem[] }
  | { type: "timeChart"; segments: TimeSegment[] };

export interface ResumeSection {
  id: string;
  type: SectionType;
  title: string;
  visible: boolean;
  data: SectionData;
}

/**
 * How the personal section header is laid out on the page.
 *  - stack-left: name top, role line under it, contacts under that (left aligned)
 *  - stack-center: name centered, role centered below, contacts centered
 *  - inline: name and role on the same line separated by a divider
 *  - split: name + role on the left, contacts column on the right
 */
export type HeaderLayout = "stack-left" | "stack-center" | "inline" | "split";

export interface ResumeTheme {
  fontFamily: string;
  accentColor: string;
  pageBackground: string;
  headingStyle: "upper" | "normal";
  spacing: "compact" | "normal" | "relaxed";
  fontSize: "sm" | "md" | "lg";
  lineHeight: "tight" | "normal" | "loose";
  headerLayout: HeaderLayout;
}

export interface Resume {
  id: string;
  title: string;
  templateId: string;
  sections: ResumeSection[];
  theme: ResumeTheme;
  updatedAt: string;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  premium: boolean;
  previewLabel: string;
  category: "modern" | "atsFriendly" | "creative" | "minimal" | "corporate" | "student";
}
