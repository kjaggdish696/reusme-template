import type { Resume } from "../../../types/resume";
import SectionFrame from "../SectionFrame";
import { PersonalHeader } from "../sharedBlocks";
import { SectionBlock, SectionTitle } from "../renderHelpers";
import { pageVars } from "./layoutCommon";
import { cn } from "../../../lib/classnames";

interface Props {
  resume: Resume;
  shadowless?: boolean;
  /** Forces a header style if the user picks an explicit-variant template. */
  variant?: "centered" | "left";
  /** Skills as tag cloud instead of bars in classic. */
  skillsAsTags?: boolean;
}

export default function ClassicLayout({
  resume,
  shadowless,
  variant,
  skillsAsTags = true,
}: Props) {
  const accent = resume.theme.accentColor;
  const personalSec = resume.sections.find((s) => s.type === "personal");
  const personal = personalSec?.data.type === "personal" ? personalSec.data.personal : null;
  const others = resume.sections.filter((s) => s.visible && s.type !== "personal");
  const headerLayout =
    variant === "left"
      ? "stack-left"
      : variant === "centered"
        ? "stack-center"
        : resume.theme.headerLayout;

  return (
    <div
      className={cn(
        "resume-page rcp-page rcp-classic",
        shadowless && "resume-page--shadowless",
      )}
      style={pageVars(resume)}
    >
      {personalSec && (
        <SectionFrame section={personalSec} pinned wrapperClass="rcp-classic-header">
          <PersonalHeader
            sectionId={personalSec.id}
            personal={personal!}
            layout={headerLayout}
          />
        </SectionFrame>
      )}
      <div className="rcp-divider" />
      {others.map((section) => (
        <SectionFrame key={section.id} section={section} wrapperClass="rcp-section">
          <SectionTitle section={section} className="rcp-h" />
          <SectionBlock
            section={section}
            options={{
              accent,
              skillStyle: section.type === "skills" && skillsAsTags ? "tags" : "bars",
            }}
          />
        </SectionFrame>
      ))}
    </div>
  );
}
