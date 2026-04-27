export interface Palette {
  id: string;
  name: string;
  accent: string;
}

export const PALETTES: Palette[] = [
  { id: "indigo", name: "Indigo", accent: "#4f46e5" },
  { id: "midnight", name: "Midnight", accent: "#0f172a" },
  { id: "emerald", name: "Emerald", accent: "#0f7a47" },
  { id: "rose", name: "Rose", accent: "#be123c" },
  { id: "amber", name: "Amber", accent: "#b45309" },
  { id: "teal", name: "Teal", accent: "#0e7490" },
  { id: "plum", name: "Plum", accent: "#7c3aed" },
  { id: "charcoal", name: "Charcoal", accent: "#1f2937" },
  { id: "copper", name: "Copper", accent: "#b25316" },
  { id: "sky", name: "Sky", accent: "#0369a1" },
];

export interface FontPreset {
  id: string;
  name: string;
  family: string;
  /** Optional separate display family. */
  displayFamily?: string;
}

export const FONT_PRESETS: FontPreset[] = [
  { id: "Inter", name: "Inter", family: '"Inter", system-ui, sans-serif' },
  {
    id: "Manrope",
    name: "Manrope",
    family: '"Manrope", "Inter", sans-serif',
    displayFamily: '"Manrope", sans-serif',
  },
  {
    id: "Source Serif 4",
    name: "Source Serif",
    family: '"Source Serif 4", Georgia, serif',
    displayFamily: '"Source Serif 4", Georgia, serif',
  },
  {
    id: "JetBrains Mono",
    name: "JetBrains Mono",
    family: '"JetBrains Mono", monospace',
  },
];

export function paletteById(id: string): Palette {
  return PALETTES.find((p) => p.id === id) ?? PALETTES[0];
}

export function fontFamilyById(id: string): string {
  return FONT_PRESETS.find((f) => f.id === id)?.family ?? FONT_PRESETS[0].family;
}
