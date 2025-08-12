"use client";

import { useEffect, useRef } from "react";
import * as pdfjs from "pdfjs-dist";

// Nastavíme worker z CDN (jednoduché riešenie)
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PdfViewer({ src, onEndVisible }) {
  const wrapRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const pdf = await pdfjs.getDocument(src).promise;
      if (cancelled) return;

      const container = wrapRef.current;
      container.innerHTML = ""; // vyčisti

      for (let n = 1; n <= pdf.numPages; n++) {
        const page = await pdf.getPage(n);
        const viewport = page.getViewport({ scale: 1.2 });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.display = "block";
        canvas.style.margin = "0 auto 12px auto";
        canvas.style.maxWidth = "100%";

        container.appendChild(canvas);
        await page.render({ canvasContext: ctx, viewport }).promise;
      }

      // sledujeme koniec PDF
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            onEndVisible?.();
          }
        },
        { root: null, threshold: 0.3 }
      );
      if (endRef.current) io.observe(endRef.current);

      return () => io.disconnect();
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [src, onEndVisible]);

  return (
    <div>
      <div ref={wrapRef} />
      {/* sentinel na úplnom konci PDF */}
      <div ref={endRef} style={{ height: 1 }} />
    </div>
  );
}
