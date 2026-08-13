"use client";

import { useEffect, useRef } from "react";
import styles from "./Speaking.module.css";

const speakingText =
  "Eman Ali is a professional ghostwriter specializing in contemporary romance, historical romance, and historical fiction. She works with publishers, packagers, serialized fiction platforms, and authors who need a reliable long-form writing partner behind the scenes. Her work spans everything from emotionally driven contemporary stories to richly detailed historical worlds and fast-moving serialized fiction, always shaped around the brief, voice, and audience of the project. With years of experience delivering complete manuscripts under tight creative and commercial requirements, Eman brings the craft, consistency, and range needed to take a story from an initial idea to a finished book.";

function splitWords(text: string) {
  return text.split(/\s+/);
}

export default function Speaking() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const paragraphRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const paragraph = paragraphRef.current;

    if (!section || !heading || !paragraph) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      section.dataset.revealed = "true";
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.dataset.revealed = "true";
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -12% 0px",
      }
    );

    const hideObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) return;

          const fullyBelowViewport =
            entry.boundingClientRect.top >= window.innerHeight;

          if (fullyBelowViewport) {
            section.classList.add(styles.noTransition);
            section.dataset.revealed = "false";

            void section.offsetHeight;

            requestAnimationFrame(() => {
              section.classList.remove(styles.noTransition);
            });
          }
        });
      },
      {
        threshold: 0,
      }
    );

    revealObserver.observe(section);
    hideObserver.observe(section);

    return () => {
      revealObserver.disconnect();
      hideObserver.disconnect();
    };
  }, []);

  const words = splitWords(speakingText);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      data-revealed="false"
      aria-labelledby="speaking-title"
    >
      <div className={styles.background} aria-hidden="true" />
      <div className={styles.overlay} aria-hidden="true" />

      <div className={styles.content}>
        <h2
          ref={headingRef}
          id="speaking-title"
          className={styles.heading}
        >
          {"WORK WITH EMAN".split("").map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              className={`${styles.headingLetter} ${
                letter === " " ? styles.headingSpace : ""
              }`}
              style={{
                transitionDelay: `${index * 28}ms`,
              }}
            >
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </h2>

        <p
          ref={paragraphRef}
          className={styles.paragraph}
        >
          {words.map((word, index) => (
            <span
              key={`${word}-${index}`}
              className={styles.word}
              style={{
                transitionDelay: `${120 + index * 13}ms`,
              }}
            >
              {word}
              {index < words.length - 1 ? " " : ""}
            </span>
          ))}
        </p>

        <a
          href="#contact"
          className={styles.button}
        >
          <span>Contact Eman</span>

          <svg
            className={styles.buttonArrow}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M4 12h15" />
            <path d="m13 5 7 7-7 7" />
          </svg>
        </a>
      </div>
    </section>
  );
}
