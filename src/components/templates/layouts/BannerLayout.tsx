import type { Resume } from "../../../types/resume";
import SectionFrame from "../SectionFrame";
import { PersonalHeader } from "../sharedBlocks";
import { SectionBlock, SectionTitle } from "../renderHelpers";
import { pageVars, shade } from "./layoutCommon";
import { cn } from "../../../lib/classnames";

interface Props {
  resume: Resume;
  shadowless?: boolean;
  /** Use solid color instead of gradient for header. */
  solid?: boolean;
}

const RIGHT_TYPES = new Set(["skills", "certifications", "achievements"]);

export default function BannerLayout({ resume, shadowless, solid }: Props) {
  const accent = resume.theme.accentColor;
  const personalSec = resume.sections.find((s) => s.type === "personal");
  const personal = personalSec?.data.type === "personal" ? personalSec.data.personal : null;
  const visibleSections = resume.sections.filter((s) => s.visible);
  const right = visibleSections.filter((s) => RIGHT_TYPES.has(s.type));
  const left = visibleSections.filter((s) => s.type !== "personal" && !RIGHT_TYPES.has(s.type));

  const bg = solid
    ? accent
    : `linear-gradient(135deg, ${accent} 0%, ${shade(accent, -18)} 100%)`;

  return (
    <div
      className={cn(
        "resume-page rcp-page rcp-creative",
        shadowless && "resume-page--shadowless",
      )}
      style={pageVars(resume)}
    >
      {personalSec && (
        <SectionFrame section={personalSec} pinned wrapperClass="rcp-header">
          <header
            className="rcp-header-shell--light"
            style={{ background: bg, color: "#fff", padding: "36px 40px 28px" }}
          >
            <PersonalHeader
              sectionId={personalSec.id}
              personal={personal!}
              layout={resume.theme.headerLayout}
              light
            />
          </header>
        </SectionFrame>
      )}
      <div className="rcp-body">
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
