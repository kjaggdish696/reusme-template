import type { CSSProperties } from "react";
import type { Resume } from "../../../types/resume";
import { fontFamilyById } from "../palettes";

export function fontSizeScale(s: Resume["theme"]["fontSize"]) {
  switch (s) {
    case "sm":
      return { body: "11.5px", heading: "10.5px", title: "26px" };
    case "lg":
      return { body: "13.5px", heading: "12.5px", title: "32px" };
    default:
      return { body: "12.5px", heading: "11.5px", title: "28px" };
  }
}

export function spacingScale(s: Resume["theme"]["spacing"]) {
  switch (s) {
    case "compact":
      return { pad: "26px 30px", gapY: "14px", itemGap: "10px" };
    case "relaxed":
      return { pad: "44px 48px", gapY: "26px", itemGap: "18px" };
    default:
      return { pad: "34px 38px", gapY: "20px", itemGap: "14px" };
  }
}

export function lineHeightScale(s: Resume["theme"]["lineHeight"]) {
  switch (s) {
    case "tight":
      return 1.32;
    case "loose":
      return 1.7;
    default:
      return 1.5;
  }
}

export function pageVars(resume: Resume): CSSProperties {
  const fz = fontSizeScale(resume.theme.fontSize);
  const sp = spacingScale(resume.theme.spacing);
  const headingTransform = resume.theme.headingStyle === "upper" ? "uppercase" : "none";
  const lh = lineHeightScale(resume.theme.lineHeight);
  return {
    ["--rcp-accent" as string]: resume.theme.accentColor,
    ["--rcp-page-bg" as string]: resume.theme.pageBackground || "#ffffff",
    ["--rcp-body" as string]: fz.body,
    ["--rcp-heading" as string]: fz.heading,
    ["--rcp-title" as string]: fz.title,
    ["--rcp-pad" as string]: sp.pad,
    ["--rcp-gap" as string]: sp.gapY,
    ["--rcp-item-gap" as string]: sp.itemGap,
    ["--rcp-line-height" as string]: String(lh),
    ["--rcp-heading-transform" as string]: headingTransform,
    ["--rcp-font" as string]: fontFamilyById(resume.theme.fontFamily),
    fontFamily: fontFamilyById(resume.theme.fontFamily),
    backgroundColor: resume.theme.pageBackground || "#ffffff",
  };
}

export function shade(hex: string, percent: number): string {
  const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex);
  if (!m) return hex;
  const adj = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v + (percent / 100) * 255)));
  const r = adj(parseInt(m[1], 16));
  const g = adj(parseInt(m[2], 16));
  const b = adj(parseInt(m[3], 16));
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}
