/**
 * Strips obvious XSS vectors while keeping execCommand / editor tags (b, ul, a, …).
 * Used for summary & custom section HTML in local state.
 */
export function sanitizeResumeHtml(input: string): string {
  if (!input) return "";
  const t = document.createElement("template");
  t.innerHTML = input;
  t.content.querySelectorAll("script,style,iframe,object,embed,form").forEach((n) => n.remove());
  t.content.querySelectorAll("*").forEach((el) => {
    for (const a of Array.from(el.attributes)) {
      const n = a.name.toLowerCase();
      if (n.startsWith("on") || n === "onerror" || n === "onload") el.removeAttribute(a.name);
    }
    const href = el.getAttribute("href");
    if (href && /^\s*javascript:/i.test(href)) el.removeAttribute("href");
  });
  return t.innerHTML;
}

export function isProbablyHtmlString(s: string): boolean {
  return /<[a-z][\s\S]*?>/i.test(s);
}

/**
 * Puts plain-text legacy content into a node without double-escaping.
 */
export function setRichTextContent(el: HTMLElement, value: string, sanitize: (h: string) => string) {
  if (!value) {
    el.innerHTML = "";
    return;
  }
  if (isProbablyHtmlString(value)) {
    el.innerHTML = sanitize(value);
  } else {
    el.textContent = value;
  }
}
