import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import type { Resume, ResumeSection } from "../types/resume";

function htmlToPlainBlocks(html: string): string[] {
  if (!html?.trim()) return [];
  const cleaned = html
    .replace(/<\/(p|div)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(li)>/gi, "\n")
    .replace(/<[^>]+>/g, " ");
  return cleaned
    .split("\n")
    .map((s) => s.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function p(text: string, opts: { bold?: boolean; heading?: (typeof HeadingLevel)[keyof typeof HeadingLevel] } = {}) {
  if (opts.heading) {
    return new Paragraph({ text, heading: opts.heading });
  }
  if (opts.bold) {
    return new Paragraph({ children: [new TextRun({ text, bold: true })] });
  }
  return new Paragraph({ text });
}

function buildSectionBlocks(section: ResumeSection): Paragraph[] {
  const out: Paragraph[] = [];
  if (!section.visible) return out;
  if (section.data.type === "personal") return out;

  out.push(
    p(section.title, {
      heading: HeadingLevel.HEADING_2,
    }),
  );

  const data = section.data;
  switch (data.type) {
    case "summary": {
      for (const line of htmlToPlainBlocks(data.summary)) {
        out.push(p(line));
      }
      return out;
    }
    case "custom": {
      for (const line of htmlToPlainBlocks(data.content)) {
        out.push(p(line));
      }
      return out;
    }
    case "experience": {
      for (const it of data.experiences) {
        out.push(
          p(`${it.position} — ${it.company} (${it.startDate} – ${it.endDate || (it.current ? "Present" : "")})`, {
            bold: true,
          }),
        );
        if (it.location) out.push(p(it.location));
        for (const b of it.bullets) {
          for (const line of htmlToPlainBlocks(b)) {
            out.push(p(`• ${line}`));
          }
        }
        out.push(p(""));
      }
      return out;
    }
    case "education": {
      for (const it of data.education) {
        out.push(
          p(`${it.degree} — ${it.field}`, { bold: true }),
          p(it.institution),
          p(`${it.startDate} – ${it.endDate}`),
        );
        for (const b of it.bullets) {
          for (const line of htmlToPlainBlocks(b)) {
            out.push(p(`• ${line}`));
          }
        }
        out.push(p(""));
      }
      return out;
    }
    case "skills": {
      for (const s of data.skills) {
        out.push(p(`${s.name} (${s.level}/5)${s.category ? ` · ${s.category}` : ""}`));
      }
      return out;
    }
    case "projects": {
      for (const it of data.projects) {
        out.push(p(it.name, { bold: true }));
        if (it.link) out.push(p(it.link));
        if (it.techStack) out.push(p(it.techStack));
        for (const b of it.bullets) {
          for (const line of htmlToPlainBlocks(b)) {
            out.push(p(`• ${line}`));
          }
        }
        out.push(p(""));
      }
      return out;
    }
    case "certifications": {
      for (const it of data.certifications) {
        out.push(
          p(it.name, { bold: true }),
          p([it.issuer, it.date, it.link].filter(Boolean).join(" · ")),
        );
        out.push(p(""));
      }
      return out;
    }
    case "achievements": {
      for (const it of data.achievements) {
        out.push(p(`• ${it.title}${it.description ? ` — ${it.description}` : ""}`));
      }
      return out;
    }
    case "volunteering": {
      for (const it of data.experiences) {
        out.push(
          p(`${it.position} — ${it.company} (${it.startDate} – ${it.endDate || (it.current ? "Present" : "")})`, {
            bold: true,
          }),
        );
        if (it.location) out.push(p(it.location));
        for (const b of it.bullets) {
          for (const line of htmlToPlainBlocks(b)) {
            out.push(p(`• ${line}`));
          }
        }
        out.push(p(""));
      }
      return out;
    }
    case "languages": {
      for (const it of data.languages) {
        out.push(p(`${it.name} — ${it.proficiencyLabel} (${it.level}/5)`));
      }
      return out;
    }
    case "courses": {
      for (const it of data.courses) {
        const hide = new Set(it.hiddenFields ?? []);
        out.push(p(it.title, { bold: true }));
        const meta = [
          hide.has("provider") ? "" : it.provider,
          hide.has("dateRange") ? "" : it.dateRange,
        ]
          .filter(Boolean)
          .join(" · ");
        if (meta) out.push(p(meta));
        if (!hide.has("description") && it.description?.trim()) {
          for (const line of htmlToPlainBlocks(it.description)) out.push(p(line));
        }
        out.push(p(""));
      }
      return out;
    }
    case "websites": {
      for (const it of data.websites) {
        out.push(p(`${it.platform}: ${it.username}${it.url ? ` — ${it.url}` : ""}`));
      }
      return out;
    }
    case "awards": {
      for (const it of data.awards) {
        out.push(p(`${it.title} — ${it.issuer}`));
      }
      return out;
    }
    case "references": {
      for (const it of data.references) {
        out.push(p(it.name, { bold: true }), p([it.role, it.email, it.phone].filter(Boolean).join(" · ")));
        out.push(p(""));
      }
      return out;
    }
    case "quote": {
      out.push(p(`“${data.quote}”`));
      if (data.attribution) out.push(p(`— ${data.attribution}`));
      return out;
    }
    case "interests": {
      for (const it of data.interests) {
        out.push(p(`${it.title}: ${it.body}`));
      }
      return out;
    }
    case "books": {
      for (const it of data.books) {
        out.push(p(`${it.title} — ${it.author}`));
      }
      return out;
    }
    case "publications": {
      for (const it of data.publications) {
        out.push(p(it.title, { bold: true }), p([it.publisher, it.date, it.link].filter(Boolean).join(" · ")));
        if (it.summary?.trim()) {
          for (const line of htmlToPlainBlocks(it.summary)) out.push(p(line));
        }
        out.push(p(""));
      }
      return out;
    }
    case "signature": {
      if (data.signedName) out.push(p(data.signedName));
      if (data.imageUrl) out.push(p("[Signature image]"));
      return out;
    }
    case "photos": {
      for (const it of data.photos) {
        out.push(p(it.caption || "Photo"));
      }
      return out;
    }
    case "strengths": {
      for (const it of data.strengths) {
        out.push(p(`• ${it.title}${it.description ? ` — ${it.description}` : ""}`));
      }
      return out;
    }
    case "timeChart": {
      for (const it of data.segments) {
        out.push(p(`${it.label}: ${it.percent}%`));
      }
      return out;
    }
    default:
      return out;
  }
}

/**
 * Exports a Word document with the same *content* as the resume. Basic HTML in
 * summary/custom is converted to plain paragraphs (formatting in .docx is text-only
 * in this v1; bold in canvas still appears as plain text here — use PDF for WYSIWYG).
 */
export async function resumeToDocxBlob(resume: Resume): Promise<Blob> {
  const children: Paragraph[] = [];

  children.push(
    p(resume.title, { heading: HeadingLevel.TITLE }),
    p(""),
  );

  const personalSec = resume.sections.find((s) => s.data.type === "personal" && s.visible);
  if (personalSec?.data.type === "personal") {
    const p0 = personalSec.data.personal;
    children.push(
      p(p0.fullName, { bold: true }),
      p(p0.role),
    );
    const contacts = [
      p0.email,
      p0.phone,
      p0.location,
      p0.website,
      p0.linkedin,
      p0.github,
    ]
      .map((c) => c?.trim())
      .filter(Boolean) as string[];
    if (contacts.length) {
      children.push(p(contacts.join(" · ")));
    }
    children.push(p(""));
  }

  for (const sec of resume.sections) {
    children.push(...buildSectionBlocks(sec));
  }

  const doc = new Document({
    sections: [
      {
        children,
      },
    ],
  });

  return Packer.toBlob(doc);
}

export async function downloadDocx(resume: Resume): Promise<void> {
  const name = (resume.title || "resume").replace(/[/\\?%*:|"<>]/g, "-") + ".docx";
  const blob = await resumeToDocxBlob(resume);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.rel = "noopener";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  requestAnimationFrame(() => URL.revokeObjectURL(url));
}
