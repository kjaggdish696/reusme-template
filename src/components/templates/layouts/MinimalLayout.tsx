import type { Resume } from "../../../types/resume";
import SectionFrame from "../SectionFrame";
import { PersonalHeader } from "../sharedBlocks";
import { SectionBlock, SectionTitle } from "../renderHelpers";
import { pageVars } from "./layoutCommon";
import { cn } from "../../../lib/classnames";

interface Props {
  resume: Resume;
  shadowless?: boolean;
}

export default function MinimalLayout({ resume, shadowless }: Props) {
  const accent = resume.theme.accentColor;
  const personalSec = resume.sections.find((s) => s.type === "personal");
  const personal = personalSec?.data.type === "personal" ? personalSec.data.personal : null;
  const others = resume.sections.filter((s) => s.visible && s.type !== "personal");

  return (
    <div
      className={cn(
        "resume-page rcp-page rcp-minimal",
        shadowless && "resume-page--shadowless",
      )}
      style={pageVars(resume)}
    >
      {personalSec && (
        <SectionFrame section={personalSec} pinned wrapperClass="rcp-section">
          <PersonalHeader
            sectionId={personalSec.id}
            personal={personal!}
            layout={resume.theme.headerLayout}
          />
        </SectionFrame>
      )}
      <div className="rcp-divider" />
      {others.map((section) => (
        <SectionFrame key={section.id} section={section} wrapperClass="rcp-section">
          <SectionTitle
            section={section}
            className="rcp-h"
            style={{ borderBottom: `1px solid ${accent}50` }}
          />
          <SectionBlock
            section={section}
            options={{
              accent,
              skillStyle: section.type === "skills" ? "tags" : "bars",
            }}
          />
        </SectionFrame>
      ))}
    </div>
  );
}
