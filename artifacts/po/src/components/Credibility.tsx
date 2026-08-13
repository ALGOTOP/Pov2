"use client";

import { useEffect, useRef } from "react";
import styles from "./Credibility.module.css";

/**
 * Renders a single 5-star row for a given rating (supports halves).
 * Filled portion uses the accent yellow; the unfilled remainder is a
 * faint outline so it stays visible without a white background.
 */
function StarRating({ rating }: { rating: number }) {
  const stars = [0, 1, 2, 3, 4].map((i) => {
    const fill = Math.min(Math.max(rating - i, 0), 1); // 0, 0.5, or 1
    return fill;
  });

  return (
    <div className={styles.stars} aria-label={`${rating} out of 5 stars`}>
      {stars.map((fill, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={styles.star}
          aria-hidden="true"
        >
          <defs>
            {fill > 0 && fill < 1 && (
              <linearGradient id={`starFill-${i}`}>
                <stop offset={`${fill * 100}%`} stopColor="var(--star-color)" />
                <stop offset={`${fill * 100}%`} stopColor="transparent" />
              </linearGradient>
            )}
          </defs>
          <path
            d="M12 2.5l2.97 6.62 7.03.7-5.3 4.94 1.51 7.24L12 18.35l-6.21 3.65 1.51-7.24-5.3-4.94 7.03-.7L12 2.5z"
            fill={
              fill >= 1
                ? "var(--star-color)"
                : fill <= 0
                ? "none"
                : `url(#starFill-${i})`
            }
            stroke={fill > 0 ? "none" : "var(--star-empty)"}
            strokeWidth={fill > 0 ? 0 : 1}
          />
        </svg>
      ))}
    </div>
  );
}

type StatItemProps = {
  eyebrow: string;
  caption: string;
  children: React.ReactNode;
};

function StatItem({ eyebrow, caption, children }: StatItemProps) {
  return (
    <div className={styles.item}>
      {children}
      <p className={styles.eyebrow}>{eyebrow}</p>
      <p className={styles.caption}>{caption}</p>
    </div>
  );
}

export default function Credibility() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const items = sectionRef.current?.querySelectorAll(`.${styles.item}`);
    if (!items) return;

    if (prefersReducedMotion) {
      items.forEach((el) => el.classList.add(styles.revealed));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.transitionDelay = `${idx * 90}ms`;
            el.classList.add(styles.revealed);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.inner}>
        <StatItem eyebrow="UPWORK" caption="100% job success score">
          <img
            src="/badges/upwork-top-rated-plus.svg"
            alt="Upwork Top Rated Plus badge"
            width={84}
            height={84}
            className={styles.badge}
          />
          <p className={styles.headline}>Top Rated Plus</p>
        </StatItem>

        <StatItem eyebrow="AMAZON" caption="reader rating, pen-name titles">
          <StarRating rating={4.5} />
          <p className={styles.bigStat}>4.5</p>
        </StatItem>

        <StatItem eyebrow="COPIES SOLD" caption="under her own pen name">
          <p className={styles.bigStat}>
            2,000<span className={styles.plus}>+</span>
          </p>
          <div className={styles.rule} />
        </StatItem>
      </div>
    </section>
  );
}
