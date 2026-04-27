import type { HeaderLayout, ResumeTemplate } from "../types/resume";

export type LayoutId =
  | "sidebar-left"
  | "sidebar-right"
  | "classic"
  | "classic-left"
  | "banner"
  | "banner-solid"
  | "minimal"
  | "two-col"
  | "two-col-accent";

export interface TemplateConfig extends ResumeTemplate {
  layoutId: LayoutId;
  /** Default theme overrides applied when this template is selected. */
  defaults: {
    accentColor: string;
    fontFamily: string;
    pageBackground: string;
    headingStyle: "upper" | "normal";
    spacing: "compact" | "normal" | "relaxed";
    fontSize: "sm" | "md" | "lg";
    lineHeight: "tight" | "normal" | "loose";
    headerLayout: HeaderLayout;
  };
}

function defaultHeaderLayout(layoutId: LayoutId): HeaderLayout {
  switch (layoutId) {
    case "classic":
    case "two-col":
      return "stack-center";
    case "classic-left":
    case "minimal":
      return "stack-left";
    case "banner":
    case "banner-solid":
      return "stack-left";
    case "sidebar-left":
    case "sidebar-right":
    default:
      return "stack-left";
  }
}

type TemplateCategory = ResumeTemplate["category"];

interface Spec {
  name: string;
  layoutId: LayoutId;
  accent: string;
  font: string;
  heading: "upper" | "normal";
  spacing: "compact" | "normal" | "relaxed";
  size: "sm" | "md" | "lg";
  category: TemplateCategory;
  premium?: boolean;
  description: string;
}

const SPECS: Spec[] = [
  // ── Modern (10) ────────────────────────────────────────────────────────────
  { name: "Aurora", layoutId: "sidebar-left", accent: "#4f46e5", font: "Inter", heading: "upper", spacing: "normal", size: "md", category: "modern", description: "Indigo sidebar, clean Inter typography." },
  { name: "Nova", layoutId: "sidebar-right", accent: "#0e7490", font: "Manrope", heading: "upper", spacing: "normal", size: "md", category: "modern", description: "Mirror sidebar with teal accent." },
  { name: "Atlas", layoutId: "sidebar-left", accent: "#0f172a", font: "Inter", heading: "upper", spacing: "normal", size: "md", category: "modern", description: "Heavy navy sidebar, subdued main column." },
  { name: "Stratus", layoutId: "sidebar-left", accent: "#0369a1", font: "Manrope", heading: "upper", spacing: "normal", size: "md", category: "modern", premium: true, description: "Soft blue sidebar with Manrope display type." },
  { name: "Iris", layoutId: "sidebar-right", accent: "#7c3aed", font: "Manrope", heading: "upper", spacing: "normal", size: "md", category: "modern", premium: true, description: "Plum accent, balanced layout." },
  { name: "Glacier", layoutId: "sidebar-left", accent: "#0e7490", font: "Inter", heading: "upper", spacing: "normal", size: "md", category: "modern", description: "Teal sidebar, generous whitespace." },
  { name: "Comet", layoutId: "sidebar-right", accent: "#4f46e5", font: "Inter", heading: "upper", spacing: "compact", size: "md", category: "modern", description: "Compact, indigo, sidebar on the right." },
  { name: "Quartz", layoutId: "sidebar-left", accent: "#1f2937", font: "Manrope", heading: "upper", spacing: "normal", size: "md", category: "modern", description: "Charcoal sidebar — confident and polished." },
  { name: "Lumen", layoutId: "sidebar-left", accent: "#0f7a47", font: "Inter", heading: "upper", spacing: "relaxed", size: "md", category: "modern", premium: true, description: "Calm emerald, relaxed spacing." },
  { name: "Pulse", layoutId: "sidebar-right", accent: "#b45309", font: "Inter", heading: "upper", spacing: "normal", size: "md", category: "modern", description: "Warm copper accent, focus on content." },

  // ── ATS-friendly (8) ───────────────────────────────────────────────────────
  { name: "Standard", layoutId: "classic", accent: "#1f2937", font: "Inter", heading: "upper", spacing: "normal", size: "md", category: "atsFriendly", description: "Single column, no gradients — recruiter & ATS friendly." },
  { name: "Standard Serif", layoutId: "classic", accent: "#1f2937", font: "Source Serif 4", heading: "upper", spacing: "normal", size: "md", category: "atsFriendly", description: "Serif body for professional tone." },
  { name: "Letter", layoutId: "classic", accent: "#0f172a", font: "Inter", heading: "normal", spacing: "normal", size: "md", category: "atsFriendly", description: "Sentence-case headings. Reads like a letter." },
  { name: "Recruiter Pro", layoutId: "classic-left", accent: "#1f2937", font: "Inter", heading: "upper", spacing: "compact", size: "sm", category: "atsFriendly", description: "Left-aligned name, dense info, ATS-tested." },
  { name: "Resumate", layoutId: "classic", accent: "#0e7490", font: "Inter", heading: "upper", spacing: "normal", size: "md", category: "atsFriendly", description: "Subtle teal underline, classic layout." },
  { name: "Sequoia", layoutId: "classic", accent: "#0f7a47", font: "Inter", heading: "upper", spacing: "normal", size: "md", category: "atsFriendly", description: "Calm forest green — reads beautifully." },
  { name: "Slate", layoutId: "classic", accent: "#0f172a", font: "Inter", heading: "upper", spacing: "compact", size: "sm", category: "atsFriendly", description: "Single column, dense, optimized for ATS." },
  { name: "Maestro", layoutId: "classic-left", accent: "#1f2937", font: "Source Serif 4", heading: "upper", spacing: "normal", size: "md", category: "atsFriendly", description: "Serif elegance, recruiter-tested." },

  // ── Creative (8) ───────────────────────────────────────────────────────────
  { name: "Bloom", layoutId: "banner", accent: "#be123c", font: "Manrope", heading: "upper", spacing: "normal", size: "md", category: "creative", premium: true, description: "Rose gradient header, expressive." },
  { name: "Spark", layoutId: "banner", accent: "#b45309", font: "Manrope", heading: "upper", spacing: "normal", size: "md", category: "creative", premium: true, description: "Amber gradient, ideal for creatives." },
  { name: "Prism", layoutId: "banner", accent: "#7c3aed", font: "Manrope", heading: "upper", spacing: "normal", size: "md", category: "creative", premium: true, description: "Violet gradient, modern tone." },
  { name: "Vibe", layoutId: "banner-solid", accent: "#4f46e5", font: "Manrope", heading: "upper", spacing: "normal", size: "md", category: "creative", description: "Solid indigo header, bold contrast." },
  { name: "Spectrum", layoutId: "banner", accent: "#0e7490", font: "Manrope", heading: "upper", spacing: "normal", size: "md", category: "creative", description: "Teal gradient, balanced & approachable." },
  { name: "Marigold", layoutId: "banner-solid", accent: "#b45309", font: "Inter", heading: "upper", spacing: "normal", size: "md", category: "creative", description: "Warm copper header — friendly and bright." },
  { name: "Cinder", layoutId: "banner", accent: "#1f2937", font: "Inter", heading: "upper", spacing: "normal", size: "md", category: "creative", description: "Dark gradient header for high contrast." },
  { name: "Lyric", layoutId: "banner-solid", accent: "#7c3aed", font: "Manrope", heading: "upper", spacing: "relaxed", size: "lg", category: "creative", premium: true, description: "Solid plum header, generous spacing." },

  // ── Minimal (6) ────────────────────────────────────────────────────────────
  { name: "Quiet", layoutId: "minimal", accent: "#0f172a", font: "Source Serif 4", heading: "upper", spacing: "relaxed", size: "md", category: "minimal", premium: true, description: "Whitespace-driven serif resume." },
  { name: "Linen", layoutId: "minimal", accent: "#1f2937", font: "Source Serif 4", heading: "upper", spacing: "relaxed", size: "md", category: "minimal", description: "Subtle accent and serif typography." },
  { name: "Page", layoutId: "minimal", accent: "#0e7490", font: "Source Serif 4", heading: "upper", spacing: "relaxed", size: "md", category: "minimal", description: "Editorial feel with teal accent." },
  { name: "Folio", layoutId: "minimal", accent: "#b25316", font: "Inter", heading: "normal", spacing: "relaxed", size: "md", category: "minimal", description: "Quiet copper, sentence-case headings." },
  { name: "Margin", layoutId: "minimal", accent: "#1f2937", font: "Inter", heading: "normal", spacing: "relaxed", size: "md", category: "minimal", description: "Editorial wide margins, sentence case." },
  { name: "Pristine", layoutId: "minimal", accent: "#0f7a47", font: "Source Serif 4", heading: "upper", spacing: "relaxed", size: "md", category: "minimal", premium: true, description: "Forest green accent, serif body." },

  // ── Corporate (6) ──────────────────────────────────────────────────────────
  { name: "Director", layoutId: "two-col", accent: "#1f2937", font: "Inter", heading: "upper", spacing: "normal", size: "md", category: "corporate", premium: true, description: "Two-column executive layout." },
  { name: "Boardroom", layoutId: "two-col", accent: "#0f172a", font: "Source Serif 4", heading: "upper", spacing: "normal", size: "md", category: "corporate", premium: true, description: "Serif executive, two-column." },
  { name: "Equinox", layoutId: "two-col", accent: "#0369a1", font: "Inter", heading: "upper", spacing: "normal", size: "md", category: "corporate", description: "Two-column, conservative blue." },
  { name: "Charter", layoutId: "two-col", accent: "#0e7490", font: "Inter", heading: "upper", spacing: "compact", size: "sm", category: "corporate", description: "Dense two-column for senior pros." },
  { name: "Senate", layoutId: "two-col", accent: "#1f2937", font: "Manrope", heading: "upper", spacing: "normal", size: "md", category: "corporate", description: "Manrope two-column with charcoal accent." },
  { name: "Capital", layoutId: "two-col", accent: "#0f7a47", font: "Inter", heading: "upper", spacing: "normal", size: "md", category: "corporate", description: "Forest green two-column. Trust-forward." },
  { name: "Enhancv Sky", layoutId: "two-col-accent", accent: "#1d9bf0", font: "Inter", heading: "upper", spacing: "normal", size: "md", category: "modern", premium: true, description: "Bright blue accent, wide column + sidebar, photo-friendly header." },

  // ── Student / Fresher (6) ──────────────────────────────────────────────────
  { name: "Campus", layoutId: "classic", accent: "#0e7490", font: "Inter", heading: "upper", spacing: "normal", size: "md", category: "student", description: "Friendly teal, classic single column." },
  { name: "Onboard", layoutId: "sidebar-left", accent: "#b45309", font: "Manrope", heading: "upper", spacing: "normal", size: "md", category: "student", description: "Warm sidebar, easy to scan." },
  { name: "Launchpad", layoutId: "sidebar-left", accent: "#0369a1", font: "Inter", heading: "upper", spacing: "normal", size: "md", category: "student", description: "Sky-blue sidebar, perfect first resume." },
  { name: "First Draft", layoutId: "classic", accent: "#7c3aed", font: "Inter", heading: "upper", spacing: "normal", size: "md", category: "student", description: "Plum accent, classic layout for freshers." },
  { name: "Campfire", layoutId: "banner-solid", accent: "#be123c", font: "Manrope", heading: "upper", spacing: "normal", size: "md", category: "student", description: "Bold solid header — stand out as a student." },
  { name: "Beacon", layoutId: "minimal", accent: "#0e7490", font: "Inter", heading: "upper", spacing: "normal", size: "md", category: "student", description: "Minimal layout for academic-style resumes." },
];

export const TEMPLATE_CATEGORIES: { id: TemplateCategory; label: string }[] = [
  { id: "modern", label: "Modern" },
  { id: "atsFriendly", label: "ATS-friendly" },
  { id: "creative", label: "Creative" },
  { id: "minimal", label: "Minimal" },
  { id: "corporate", label: "Corporate" },
  { id: "student", label: "Student / Fresher" },
];

function slug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export const TEMPLATES: TemplateConfig[] = SPECS.map((s) => ({
  id: slug(s.name),
  name: s.name,
  description: s.description,
  premium: !!s.premium,
  previewLabel: prettyLayout(s.layoutId),
  category: s.category,
  layoutId: s.layoutId,
  defaults: {
    accentColor: s.accent,
    fontFamily: s.font,
    pageBackground: "#ffffff",
    headingStyle: s.heading,
    spacing: s.spacing,
    fontSize: s.size,
    lineHeight: "normal",
    headerLayout: defaultHeaderLayout(s.layoutId),
  },
}));

export const mockTemplates = TEMPLATES; // backwards-compat re-export

export function templateById(id: string): TemplateConfig | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

function prettyLayout(id: LayoutId): string {
  switch (id) {
    case "sidebar-left":
      return "Two-column · sidebar left";
    case "sidebar-right":
      return "Two-column · sidebar right";
    case "classic":
      return "Single column · centered";
    case "classic-left":
      return "Single column · left-aligned";
    case "banner":
      return "Gradient header";
    case "banner-solid":
      return "Solid header";
    case "minimal":
      return "Minimal · serif";
    case "two-col":
      return "Two-column · executive";
    case "two-col-accent":
      return "Two-column · Enhancv-style";
  }
}
