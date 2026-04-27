import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { EditorAction } from "../../store/editorReducer";

export type EditMode = "edit" | "preview";

interface TemplateContextValue {
  mode: EditMode;
  resumeId: string;
  dispatch: (a: EditorAction) => void;
  selectedSectionId: string | null;
  setSelectedSectionId: (id: string | null) => void;
}

const Ctx = createContext<TemplateContextValue | null>(null);

/**
 * `true` when the resume is in Preview mode (formatting is display-only on the canvas).
 * `false` when not inside a template provider (e.g. details sidebar) unless overridden via props.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useTemplateReadOnly(): boolean {
  const ctx = useContext(Ctx);
  if (!ctx) return false;
  return ctx.mode === "preview";
}

export function TemplateBindingsProvider({
  value,
  children,
}: {
  value: TemplateContextValue;
  children: ReactNode;
}) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTemplateBindings(): TemplateContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) {
    return {
      mode: "edit",
      resumeId: "",
      dispatch: () => undefined,
      selectedSectionId: null,
      setSelectedSectionId: () => undefined,
    };
  }
  return ctx;
}
