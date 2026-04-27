import type { ResumeSection, SkillChartStyle } from "../../types/resume";
import {
  AchievementList,
  CertificationList,
  EducationList,
  ExperienceList,
  ProjectList,
  Skills,
} from "./sharedBlocks";
import {
  AwardsBlock,
  BooksBlock,
  CoursesBlock,
  InterestsBlock,
  LanguagesBlock,
  PhotosBlock,
  PublicationsBlock,
  QuoteBlock,
  ReferencesBlock,
  SignatureBlock,
  StrengthsBlock,
  TimeChartBlock,
  WebsitesBlock,
} from "./extraSectionBlocks";
import EditableText from "../editor/EditableText";
import { useTemplateBindings } from "./TemplateContext";

interface Options {
  accent: string;
  light?: boolean;
  /** Default chart style if section data does not specify one. */
  skillStyle?: SkillChartStyle;
}

export function SectionBlock({
  section,
  options,
}: {
  section: ResumeSection;
  options: Options;
}) {
  const { resumeId, dispatch } = useTemplateBindings();
  const { accent, light, skillStyle = "bars" } = options;
  switch (section.data.type) {
    case "summary":
      return (
        <EditableText
          as="div"
          richText
          className="rcp-summary"
          value={section.data.summary}
          placeholder="Senior product designer with 7+ years experience…"
          multiline
          onCommit={(v) =>
            dispatch({ type: "UPDATE_SUMMARY", resumeId, sectionId: section.id, summary: v })
          }
        />
      );
    case "experience":
    case "volunteering":
      return (
        <ExperienceList sectionId={section.id} items={section.data.experiences} accent={accent} />
      );
    case "education":
      return <EducationList sectionId={section.id} items={section.data.education} accent={accent} />;
    case "skills": {
      const chart = section.data.chartStyle ?? skillStyle ?? "bars";
      return (
        <Skills
          sectionId={section.id}
          items={section.data.skills}
          accent={accent}
          light={light}
          chartStyle={chart}
        />
      );
    }
    case "projects":
      return <ProjectList sectionId={section.id} items={section.data.projects} accent={accent} />;
    case "certifications":
      return (
        <CertificationList
          sectionId={section.id}
          items={section.data.certifications}
          accent={accent}
        />
      );
    case "achievements":
      return <AchievementList sectionId={section.id} items={section.data.achievements} />;
    case "custom":
      return (
        <EditableText
          as="div"
          richText
          className="rcp-summary"
          multiline
          value={section.data.content}
          placeholder="Write anything — languages, hobbies, publications…"
          onCommit={(v) =>
            dispatch({ type: "UPDATE_CUSTOM", resumeId, sectionId: section.id, content: v })
          }
        />
      );
    case "languages":
      return <LanguagesBlock section={section} />;
    case "courses":
      return <CoursesBlock section={section} accent={accent} />;
    case "websites":
      return <WebsitesBlock section={section} accent={accent} />;
    case "awards":
      return <AwardsBlock section={section} accent={accent} />;
    case "references":
      return <ReferencesBlock section={section} />;
    case "quote":
      return <QuoteBlock section={section} accent={accent} />;
    case "interests":
      return <InterestsBlock section={section} accent={accent} />;
    case "books":
      return <BooksBlock section={section} />;
    case "publications":
      return <PublicationsBlock section={section} accent={accent} />;
    case "signature":
      return <SignatureBlock section={section} />;
    case "photos":
      return <PhotosBlock section={section} />;
    case "strengths":
      return <StrengthsBlock section={section} />;
    case "timeChart":
      return <TimeChartBlock section={section} accent={accent} />;
    case "personal":
      return null;
  }
}

export function SectionTitle({
  section,
  className,
  style,
}: {
  section: ResumeSection;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { resumeId, dispatch } = useTemplateBindings();
  return (
    <EditableText
      as="div"
      className={className}
      style={style}
      value={section.title}
      placeholder="Section title"
      onCommit={(v) =>
        dispatch({ type: "RENAME_SECTION", resumeId, sectionId: section.id, title: v })
      }
    />
  );
}
