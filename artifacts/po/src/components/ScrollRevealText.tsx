"use client";

import { useEffect, useMemo, useRef } from "react";
import styles from "./ScrollRevealText.module.css";

type ScrollRevealTextProps = {
  /**
   * The copy to render. Separate paragraphs with a blank line ("\n\n").
   * Wrap a phrase in single asterisks -- *like this* -- to italicize it.
   */
  text: string;
  className?: string;
  /** Total cascade duration per paragraph, ms. Kept under 700ms. Default 650. */
  durationMs?: number;
};

type Word = {
  text: string;
  italic: boolean;
};

/** Splits "text" into paragraphs, then words, tracking *italic* spans. */
function parseParagraphs(text: string): Word[][] {
  const paragraphs = text.trim().split(/\n\s*\n/);
  return paragraphs.map((paragraph) => {
    const tokens = paragraph.trim().split(/\s+/);
    const words: Word[] = [];
    let italicOpen = false;
    for (const rawToken of tokens) {
      let token = rawToken;
      let startsItalic = false;
      let endsItalic = false;

      if (token.startsWith("*")) {
        startsItalic = true;
        token = token.slice(1);
      }
      if (token.endsWith("*") && token.length > 1) {
        endsItalic = true;
        token = token.slice(0, -1);
      }

      const isItalic = italicOpen || startsItalic;
      words.push({ text: token, italic: isItalic });

      if (startsItalic && !endsItalic) italicOpen = true;
      if (endsItalic) italicOpen = false;
    }
    return words;
  });
}

export default function ScrollRevealText({
  text,
  className,
  durationMs = 1200,
}: ScrollRevealTextProps) {
  const paragraphs = useMemo(() => parseParagraphs(text), [text]);

  const paragraphElRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const wordRefsByParagraph = useRef<HTMLSpanElement[][]>([]);

  // --- Measure real rendered lines and assign each word a stagger delay ---
  useEffect(() => {
    const assignLineDelays = () => {
      wordRefsByParagraph.current.forEach((wordSpans) => {
        if (!wordSpans || wordSpans.length === 0) return;

        // Group words by their rendered top offset -> a visual line.
        const tops: number[] = [];
        wordSpans.forEach((el) => {
          const top = Math.round(el.offsetTop);
          if (!tops.includes(top)) tops.push(top);
        });
        tops.sort((a, b) => a - b);

        const totalLines = tops.length;
        const perWordDuration = Math.round(durationMs * 0.55); // each word's own fade
        const maxStagger = durationMs - perWordDuration; // spread across lines

        wordSpans.forEach((el) => {
          const top = Math.round(el.offsetTop);
          const lineIndex = tops.indexOf(top);
          const delay =
            totalLines <= 1
              ? 0
              : Math.round((lineIndex / (totalLines - 1)) * maxStagger);
          el.style.setProperty("--delay", `${delay}ms`);
          el.style.setProperty("--dur", `${perWordDuration}ms`);
        });
      });
    };

    assignLineDelays();

    let resizeFrame: number;
    const onResize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(assignLineDelays);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(resizeFrame);
    };
  }, [durationMs, paragraphs]);

  // --- Reveal / instant-hide behavior on scroll direction ---
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      paragraphElRefs.current.forEach((el) => {
        if (el) el.dataset.revealed = "true";
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLParagraphElement;
          if (entry.isIntersecting) {
            el.dataset.revealed = "true";
          }
        });
      },
      {
        threshold: 0,
        // Trigger the reveal slightly before the paragraph is fully on
        // screen ("just a bit before" it's reached).
        rootMargin: "0px 0px -15% 0px",
      }
    );

    // Separate observer, default rootMargin/threshold: isIntersecting only
    // goes false once the paragraph has left the viewport COMPLETELY (both
    // edges outside), not as soon as it starts exiting. Only hide when it
    // went fully off-screen through the BOTTOM edge (top >= viewport height)
    // -- that only happens when scrolling back up toward the hero. If it
    // exited fully through the TOP (scrolled further down past it), leave
    // it revealed.
    const hideObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLParagraphElement;
          if (entry.isIntersecting) return;

          const fullyBelowViewport =
            entry.boundingClientRect.top >= window.innerHeight;

          if (fullyBelowViewport) {
            el.classList.add(styles.noTransition);
            el.dataset.revealed = "false";
            // force reflow so the "no transition" hide applies instantly
            void el.offsetHeight;
            requestAnimationFrame(() => {
              el.classList.remove(styles.noTransition);
            });
          }
        });
      },
      { threshold: 0 }
    );

    paragraphElRefs.current.forEach((el) => {
      if (el) {
        observer.observe(el);
        hideObserver.observe(el);
      }
    });

    return () => {
      observer.disconnect();
      hideObserver.disconnect();
    };
  }, [paragraphs]);

  return (
    <section className={`${styles.section} ${className ?? ""}`}>
      <div className={styles.inner}>
        {paragraphs.map((words, pIdx) => {
          wordRefsByParagraph.current[pIdx] = [];
          return (
            <p
              key={pIdx}
              ref={(el) => {
                paragraphElRefs.current[pIdx] = el;
              }}
              className={styles.paragraph}
              data-revealed="false"
            >
              {words.map((w, wIdx) => (
                <span
                  key={wIdx}
                  ref={(el) => {
                    if (el) wordRefsByParagraph.current[pIdx][wIdx] = el;
                  }}
                  className={`${styles.word} ${w.italic ? styles.italic : ""}`}
                >
                  {w.text}{" "}
                </span>
              ))}
            </p>
          );
        })}
      </div>
    </section>
  );
}
