"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./HeroReveal.module.css";

type HeroRevealProps = {
  src?: string;
  alt?: string;
};

const menuItems = [
  { label: "Home", href: "/" },
  { label: "Books", href: "#books" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#work" },
];

export default function HeroReveal({
  src = "/hero-photo.jpg",
  alt = "",
}: HeroRevealProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollAnimationRef = useRef<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);

      if (scrollAnimationRef.current !== null) {
        cancelAnimationFrame(scrollAnimationRef.current);
      }
    };
  }, []);

  const closeMenu = () => {
    // Unlock immediately so the scroll animation can begin on the same click
    // on mobile/tablet, rather than waiting for the React effect to run.
    document.body.style.overflow = "";
    setMenuOpen(false);
  };

  const handleNavigation = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href === "/") {
      closeMenu();
      return;
    }

    const targetId = href.slice(1);
    const target = document.getElementById(targetId);

    if (!target) {
      closeMenu();
      return;
    }

    event.preventDefault();
    closeMenu();

    if (scrollAnimationRef.current !== null) {
      cancelAnimationFrame(scrollAnimationRef.current);
      scrollAnimationRef.current = null;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const start = window.scrollY;
    const targetTop = target.getBoundingClientRect().top + window.scrollY;
    const viewportHeight = window.innerHeight;
    const sectionHeight = target.getBoundingClientRect().height;

    /*
     * Navigation landing rules:
     *
     * Books / Work:
     *   Center the section so the user lands on its strongest overall view.
     *
     * About:
     *   If the editorial copy fits in the viewport, center it. If it is
     *   taller than the viewport (especially on mobile), show its beginning
     *   instead of dropping the user into the middle of the text.
     *
     * Booking:
     *   Land at the beginning of the booking area so the heading and the
     *   start of the Cal.com experience are visible immediately. A booking
     *   section can be taller than a mobile viewport, so attempting to center
     *   the entire section would hide its beginning.
     */
    let targetPosition: number;

    if (targetId === "books" || targetId === "work") {
      targetPosition =
        targetTop + sectionHeight / 2 - viewportHeight / 2;
    } else if (targetId === "about") {
      targetPosition =
        sectionHeight <= viewportHeight * 0.92
          ? targetTop + sectionHeight / 2 - viewportHeight / 2
          : targetTop;
    } else if (targetId === "booking") {
      targetPosition = targetTop;
    } else {
      targetPosition = targetTop;
    }

    const maxScroll = Math.max(
      0,
      document.documentElement.scrollHeight - viewportHeight
    );

    targetPosition = Math.min(Math.max(targetPosition, 0), maxScroll);

    if (prefersReducedMotion) {
      window.scrollTo({ top: targetPosition, behavior: "auto" });
      return;
    }

    const distance = targetPosition - start;

    if (Math.abs(distance) < 2) {
      window.scrollTo({ top: targetPosition, behavior: "auto" });
      return;
    }

    // Medium-speed editorial scroll: quick enough to feel responsive, but
    // long enough to make the destination and section transition readable.
    const duration = Math.min(
      900,
      Math.max(540, 480 + Math.abs(distance) * 0.18)
    );
    const startTime = performance.now();

    const easeInOut = (progress: number) =>
      progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    const animateScroll = (currentTime: number) => {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      window.scrollTo({
        top: start + distance * easeInOut(progress),
        behavior: "auto",
      });

      if (progress < 1) {
        scrollAnimationRef.current = requestAnimationFrame(animateScroll);
      } else {
        scrollAnimationRef.current = null;
      }
    };

    scrollAnimationRef.current = requestAnimationFrame(animateScroll);
  };

  return (
    <div className={styles.hero}>
      <div className={styles.heroMedia}>
        <img src={src} alt={alt} className={styles.heroImage} />
      </div>

      {/* EA HOME BUTTON */}
      <a
        href="/"
        className={styles.logo}
        aria-label="Eman Ali — Home"
      >
        EA
      </a>

      {/* DESKTOP NAVIGATION */}
      <nav className={styles.desktopNavigation} aria-label="Main navigation">
        <a href="/">Home</a>

        <a
          href="#books"
          onClick={(event) => handleNavigation(event, "#books")}
        >
          Books
        </a>

        <a
          href="#about"
          onClick={(event) => handleNavigation(event, "#about")}
        >
          About
        </a>

        <a
          href="#work"
          onClick={(event) => handleNavigation(event, "#work")}
        >
          Contact
        </a>

        <a
          href="#booking"
          className={styles.getStartedButton}
          onClick={(event) => handleNavigation(event, "#booking")}
        >
          Get Started
        </a>
      </nav>

      {/* MOBILE / TABLET MENU BUTTON */}
      <button
        type="button"
        className={`${styles.menuButton} ${
          menuOpen ? styles.menuButtonOpen : ""
        }`}
        onClick={() => setMenuOpen((open) => !open)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="site-navigation"
      >
        <span className={styles.menuIcon} aria-hidden="true">
          <span />
          <span />
        </span>

        <span className={styles.menuLabel}>
          <span className={styles.menuLabelTrack}>
            <span className={styles.menuLabelItem}>MENU</span>
            <span className={styles.menuLabelItem}>MENU</span>
          </span>
        </span>
      </button>

      {/* MENU BACKDROP */}
      <button
        type="button"
        className={`${styles.menuBackdrop} ${
          menuOpen ? styles.menuBackdropVisible : ""
        }`}
        onClick={closeMenu}
        aria-label="Close menu"
        tabIndex={menuOpen ? 0 : -1}
      />

      {/* MENU DRAWER */}
      <aside
        id="site-navigation"
        className={`${styles.menuDrawer} ${
          menuOpen ? styles.menuDrawerOpen : ""
        }`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className={styles.drawerClose}
          onClick={closeMenu}
          aria-label="Close menu"
          tabIndex={menuOpen ? 0 : -1}
        >
          <span className={styles.drawerCloseIcon} aria-hidden="true" />
        </button>

        <div className={styles.drawerInner}>
          <nav
            className={styles.drawerNavigation}
            aria-label="Main navigation"
          >
            {menuItems.map((item, index) => (
              <a
                key={item.label}
                href={item.href}
                className={styles.drawerLink}
                style={
                  {
                    "--menu-index": index,
                  } as React.CSSProperties
                }
                tabIndex={menuOpen ? 0 : -1}
                onClick={(event) => handleNavigation(event, item.href)}
              >
                <span className={styles.drawerLinkText}>
                  {item.label}
                </span>

                <span className={styles.drawerArrow} aria-hidden="true">
                  →
                </span>
              </a>
            ))}
          </nav>
        </div>
      </aside>

      {/* ROLE TEXT */}
      <div className={styles.heroRole} aria-label="Romance Ghostwriter">
        <span>ROMANCE</span>
        <span>GHOSTWRITER</span>
      </div>

      {/* LARGE NAME */}
      <div className={styles.heroName} aria-label="Eman Ali">
        EMAN ALI
      </div>
    </div>
  );
}
