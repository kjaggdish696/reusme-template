import type { KeyboardEvent as ReactKeyEvent } from "react";
import { getContentEditableHost } from "./richTextCommands";

/**
 * If the user types Space at the end of a "line" where the line is only
 * `*`, `-` (markdown bullets), or `1.` / `1)` (numbered), delete that token
 * and run insertUnorderedList / insertOrderedList — same idea as Notion/Confluence.
 */
export function tryMarkdownListOnSpace(root: HTMLElement, e: ReactKeyEvent<HTMLElement>): boolean {
  if (e.key !== " " || e.defaultPrevented || e.nativeEvent.isComposing) return false;
  if (e.metaKey || e.ctrlKey) return false;

  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) return false;
  const r = sel.getRangeAt(0);
  if (!r.collapsed) return false;

  const r2 = document.createRange();
  r2.setStart(root, 0);
  r2.setEnd(r.endContainer, r.endOffset);
  const before = r2.toString();
  const lastLine = before.split(/\r?\n/).pop() ?? "";

  let listCmd: "insertUnorderedList" | "insertOrderedList" | null = null;
  let toDelete = "";

  if (lastLine === "*" || lastLine === "-") {
    listCmd = "insertUnorderedList";
    toDelete = lastLine;
  } else if (/^\d+\.$/.test(lastLine) || /^\d+\)$/.test(lastLine)) {
    listCmd = "insertOrderedList";
    toDelete = lastLine;
  } else {
    return false;
  }

  if (r.endContainer.nodeType !== Node.TEXT_NODE) return false;
  const t = r.endContainer as Text;
  const o = r.endOffset;
  if (o < toDelete.length) return false;
  if (t.data.slice(o - toDelete.length, o) !== toDelete) return false;

  e.preventDefault();

  const del = document.createRange();
  del.setStart(t, o - toDelete.length);
  del.setEnd(t, o);
  del.deleteContents();

  const host = getContentEditableHost(root) ?? getContentEditableHost(t);
  host?.focus({ preventScroll: true });
  try {
    document.execCommand(listCmd, false);
  } catch {
    return false;
  }
  // Some browsers are flaky about input events after execCommand; nudge React commit.
  root.dispatchEvent(new Event("input", { bubbles: true }));
  return true;
}
