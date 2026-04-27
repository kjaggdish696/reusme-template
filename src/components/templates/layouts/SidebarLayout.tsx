import type { Resume } from "../../../types/resume";
import SectionFrame from "../SectionFrame";
import { PersonalHeader } from "../sharedBlocks";
import { SectionBlock, SectionTitle } from "../renderHelpers";
import { pageVars } from "./layoutCommon";
import { cn } from "../../../lib/classnames";

interface Props {
  resume: Resume;
  shadowless?: boolean;
  side: "left" | "right";
}

const SIDE_TYPES = new Set([
  "personal",
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
  "summary",
  "custom",
]);

export default function SidebarLayout({ resume, shadowless, side }: Props) {
  const accent = resume.theme.accentColor;
  const personalSec = resume.sections.find((s) => s.type === "personal");
  const personal = personalSec?.data.type === "personal" ? personalSec.data.personal : null;

  const visibleSections = resume.sections.filter((s) => s.visible);
  const sideSections = visibleSections.filter((s) => s.type !== "personal" && SIDE_TYPES.has(s.type));
  const mainSections = visibleSections.filter((s) => !SIDE_TYPES.has(s.type));

  const renderSide = (
    <aside className="rcp-side" style={{ background: accent }}>
      {personalSec && (
        <SectionFrame section={personalSec} pinned wrapperClass="rcp-section">
          {/* Sidebar columns are too narrow for inline / split — always stack-left
              and force contacts to render one-per-line. */}
          <PersonalHeader
            sectionId={personalSec.id}
            personal={personal!}
            layout={resume.theme.headerLayout}
            forceLayout="stack-left"
            contactLayout="stacked"
            light
            className="rcp-header-shell--light"
          />
        </SectionFrame>
      )}
      {sideSections.map((section) => (
        <SectionFrame key={section.id} section={section} wrapperClass="rcp-section">
          <SectionTitle section={section} className="rcp-h" />
          <SectionBlock
            section={section}
            options={{
              accent: "#ffffff",
              light: true,
              skillStyle: section.type === "skills" ? "bars" : "bars",
            }}
          />
        </SectionFrame>
      ))}
    </aside>
  );

  const renderMain = (
    <main className="rcp-main">
      {mainSections.map((section) => (
        <SectionFrame key={section.id} section={section} wrapperClass="rcp-section">
          <SectionTitle section={section} className="rcp-h" />
          <SectionBlock section={section} options={{ accent }} />
        </SectionFrame>
      ))}
    </main>
  );

  return (
    <div
      className={cn(
        "resume-page rcp-page rcp-sidebar",
        side === "right" && "rcp-sidebar--right",
        shadowless && "resume-page--shadowless",
      )}
      style={pageVars(resume)}
    >
      {side === "left" ? (
        <>
          {renderSide}
          {renderMain}
        </>
      ) : (
        <>
          {renderMain}
          {renderSide}
        </>
      )}
    </div>
  );
}

