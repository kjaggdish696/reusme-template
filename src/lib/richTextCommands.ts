import { useCallback, useRef } from "react";

/** Walk up to the nearest contenteditable host (the element with contentEditable=true). */
export function getContentEditableHost(node: Node | null): HTMLElement | null {
  if (!node) return null;
  let el: Element | null = node.nodeType === Node.TEXT_NODE ? node.parentElement : (node as Element);
  while (el) {
    if (el instanceof HTMLElement && el.isContentEditable) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

/**
 * Browsers need the contenteditable to be the active element; restoring the
 * range alone is not always enough for insertUnorderedList / bold, etc.
 */
export function focusAndExecCommand(
  range: Range | null,
  command: string,
  value: string | undefined = undefined,
): boolean {
  if (range) {
    try {
      const host = getContentEditableHost(range.commonAncestorContainer);
      if (host) {
        host.focus({ preventScroll: true });
      }
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    } catch {
      /* range may be invalid */
    }
  }
  try {
    const ok = document.execCommand(command, false, value);
    if (ok) {
      const sel = window.getSelection();
      const anchor = sel?.anchorNode ?? null;
      getContentEditableHost(anchor)?.dispatchEvent(new Event("input", { bubbles: true }));
    }
    return ok;
  } catch {
    return false;
  }
}

/** Prefer the current selection if it still lives in a contenteditable (toolbar mousedown + preventDefault keeps it). */
export function rangeForRichCommand(fallback: Range | null): Range | null {
  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0) {
    const live = sel.getRangeAt(0);
    const host = getContentEditableHost(live.commonAncestorContainer);
    if (host && host.isConnected) {
      return live;
    }
  }
  return fallback;
}

/**
 * useRichTextCommandExecutor() — one instance per toolbar; keeps the last
 * good selection in mousedown (capture) so click can apply a command.
 */
export function useRichTextCommandExecutor() {
  const savedRange = useRef<Range | null>(null);

  const captureSelection = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const r = sel.getRangeAt(0);
    if (getContentEditableHost(r.commonAncestorContainer)) {
      savedRange.current = r.cloneRange();
    }
  }, []);

  const exec = useCallback((command: string, valueArg?: string) => {
    return focusAndExecCommand(rangeForRichCommand(savedRange.current), command, valueArg);
  }, []);

  return { savedRange, captureSelection, exec };
}
