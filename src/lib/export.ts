/**
 * PDF export
 * ─────────
 * 1) Print-based: opens the browser print dialog. Vector text, real fonts,
 *    perfect colors. User picks "Save as PDF" → identical to preview.
 * 2) Raster: html-to-image (SVG foreignObject) + jsPDF, with html2canvas fallback.
 */

export function printToPDF() {
  // Defer to next frame so any selection/blur completes.
  requestAnimationFrame(() => {
    window.print();
  });
}

async function domToPngDataUrl(element: HTMLElement): Promise<string> {
  if (document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      /* ignore */
    }
  }

  try {
    const { toPng } = await import("html-to-image");
    return await toPng(element, {
      pixelRatio: 2,
      backgroundColor: "#ffffff",
      cacheBust: true,
      skipAutoScale: true,
      filter: (node) => {
        if (!(node instanceof HTMLElement)) return true;
        if (node.classList?.contains("no-print")) return false;
        return true;
      },
    });
  } catch (e) {
    console.warn("html-to-image failed, falling back to html2canvas", e);
    const { default: html2canvas } = await import("html2canvas");
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
      scrollX: 0,
      scrollY: 0,
      onclone: (_doc, cloned) => {
        cloned.style.borderRadius = "0";
        const page = cloned.querySelector(".resume-page") as HTMLElement | null;
        if (page) page.style.boxShadow = "none";
      },
    });
    return canvas.toDataURL("image/png");
  }
}

export async function rasterizeToPDF(element: HTMLElement, fileName = "resume.pdf") {
  const imgData = await domToPngDataUrl(element);

  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Could not decode export image"));
    img.src = imgData;
  });

  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const imgAspect = iw / ih;
  const fullHeight = pageWidth / imgAspect;

  if (fullHeight <= pageHeight) {
    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, fullHeight);
  } else {
    let position = 0;
    let remaining = fullHeight;
    while (remaining > 0) {
      pdf.addImage(imgData, "PNG", 0, position, pageWidth, fullHeight);
      remaining -= pageHeight;
      position -= pageHeight;
      if (remaining > 0) pdf.addPage();
    }
  }

  pdf.save(fileName);
}
