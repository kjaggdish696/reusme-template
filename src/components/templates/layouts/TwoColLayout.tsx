import type { Resume, SectionType } from "../../../types/resume";
import { templateById } from "../../../data/mockTemplates";
import SectionFrame from "../SectionFrame";
import { PersonalHeader } from "../sharedBlocks";
import { SectionBlock, SectionTitle } from "../renderHelpers";
import { pageVars } from "./layoutCommon";
import { cn } from "../../../lib/classnames";

interface Props {
  resume: Resume;
  shadowless?: boolean;
}

/** Sidebar column — education & main narrative stay in the wide column. */
const RIGHT_TYPES = new Set<SectionType>([
  "skills",
  "certifications",
  "achievements",
  "strengths",
  "languages",
  "websites",
  "awards",
  "references",
  "interests",
  "photos",
  "signature",
  "timeChart",
  "custom",
]);

export default function TwoColLayout({ resume, shadowless }: Props) {
  const accent = resume.theme.accentColor;
  const enhancv = templateById(resume.templateId)?.layoutId === "two-col-accent";
  const personalSec = resume.sections.find((s) => s.type === "personal");
  const personal = personalSec?.data.type === "personal" ? personalSec.data.personal : null;
  const visibleSections = resume.sections.filter((s) => s.visible);
  const right = visibleSections.filter((s) => RIGHT_TYPES.has(s.type));
  const left = visibleSections.filter((s) => s.type !== "personal" && !RIGHT_TYPES.has(s.type));

  return (
    <div
      className={cn(
        "resume-page rcp-page rcp-twocol",
        enhancv && "rcp-twocol--accent",
        shadowless && "resume-page--shadowless",
      )}
      style={pageVars(resume)}
    >
      {personalSec && (
        <SectionFrame section={personalSec} pinned wrapperClass="rcp-twocol-header">
          <PersonalHeader
            sectionId={personalSec.id}
            personal={personal!}
            layout={resume.theme.headerLayout}
            showRule
            ruleColor={accent}
          />
        </SectionFrame>
      )}
      <div className="rcp-twocol-grid">
        <div>
          {left.map((section) => (
            <SectionFrame key={section.id} section={section} wrapperClass="rcp-section">
              <SectionTitle section={section} className="rcp-h" />
              <SectionBlock section={section} options={{ accent }} />
            </SectionFrame>
          ))}
        </div>
        <div>
          {right.map((section) => (
            <SectionFrame key={section.id} section={section} wrapperClass="rcp-section">
              <SectionTitle section={section} className="rcp-h" />
              <SectionBlock
                section={section}
                options={{ accent, skillStyle: section.type === "skills" ? "tags" : "bars" }}
              />
            </SectionFrame>
          ))}
        </div>
      </div>
    </div>
  );
}
