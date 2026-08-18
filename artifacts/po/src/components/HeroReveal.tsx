"use client";

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
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

const SCROLL_DURATION = {
  min: 520,
  max: 820,
  pixelsPerMillisecond: 2.25,
};

export default function HeroReveal({
  src = "/hero-photo.jpg",
  alt = "",
}: HeroRevealProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!menuOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

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

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const closeMenu = () => {
    // Unlock immediately, not on the next React render. This is important
    // on mobile because the drawer sets body overflow to hidden.
    document.body.style.overflow = "";
    setMenuOpen(false);
  };

  const getScrollTarget = (target: HTMLElement, targetId: string) => {
    const rect = target.getBoundingClientRect();
    const absoluteTop = rect.top + window.scrollY;
    const height = rect.height;
    const viewport = window.innerHeight;

    /*
     * The goal is not a generic "scroll to top" for every section.
     * Each destination gets the most useful reading/viewing position.
     *
     * If a section is taller than the viewport, its beginning is the only
     * position that can reliably show the complete section from its start
     * rather than dropping the user into its middle.
     */
    if (height > viewport) {
      return absoluteTop;
    }

    // Books: center the complete section in the viewport.
    if (targetId === "books") {
      return absoluteTop - Math.max(0, (viewport - height) / 2);
    }

    // About: place the editorial copy at the top with a small breathing room.
    if (targetId === "about") {
      return absoluteTop;
    }

    // Work and booking: center when the full section can fit.
    return absoluteTop - Math.max(0, (viewport - height) / 2);
  };

  const handleNavigation = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href === "/") {
      return;
    }

    event.preventDefault();

    const targetId = href.startsWith("#") ? href.slice(1) : "";
    if (!targetId) return;

    const target = document.getElementById(targetId);

    if (!target) {
      console.warn(`Navigation target "#${targetId}" was not found.`);
      closeMenu();
      return;
    }

    closeMenu();

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    const start = window.scrollY;
    const targetPosition = Math.max(
      0,
      getScrollTarget(target, targetId)
    );
    const distance = targetPosition - start;

    if (Math.abs(distance) < 2) {
      window.scrollTo(0, targetPosition);
      return;
    }

    const duration = Math.min(
      SCROLL_DURATION.max,
      Math.max(
        SCROLL_DURATION.min,
        Math.abs(distance) / SCROLL_DURATION.pixelsPerMillisecond
      )
    );

    const startTime = performance.now();

    const easeInOut = (progress: number) =>
      progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      window.scrollTo(0, targetPosition);
      return;
    }

    const animateScroll = (currentTime: number) => {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      window.scrollTo(
        0,
        start + distance * easeInOut(progress)
      );

      if (progress < 1) {
        animationFrameRef.current =
          requestAnimationFrame(animateScroll);
      } else {
        animationFrameRef.current = null;
      }
    };

    animationFrameRef.current =
      requestAnimationFrame(animateScroll);
  };

  return (
    <div className={styles.hero}>
      <div className={styles.heroMedia}>
        <img
          src={src}
          alt={alt}
          className={styles.heroImage}
        />
      </div>

      <a
        href="/"
        className={styles.logo}
        aria-label="Eman Ali — Home"
      >
        EA
      </a>

      <nav
        className={styles.desktopNavigation}
        aria-label="Main navigation"
      >
        <a href="/">Home</a>

        <a
          href="#books"
          onClick={(event) =>
            handleNavigation(event, "#books")
          }
        >
          Books
        </a>

        <a
          href="#about"
          onClick={(event) =>
            handleNavigation(event, "#about")
          }
        >
          About
        </a>

        <a
          href="#work"
          onClick={(event) =>
            handleNavigation(event, "#work")
          }
        >
          Contact
        </a>

        <a
          href="#booking"
          className={styles.getStartedButton}
          onClick={(event) =>
            handleNavigation(event, "#booking")
          }
        >
          Get Started
        </a>
      </nav>

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

      <button
        type="button"
        className={`${styles.menuBackdrop} ${
          menuOpen ? styles.menuBackdropVisible : ""
        }`}
        onClick={closeMenu}
        aria-label="Close menu"
        tabIndex={menuOpen ? 0 : -1}
      />

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
          <span
            className={styles.drawerCloseIcon}
            aria-hidden="true"
          />
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
                  } as CSSProperties
                }
                tabIndex={menuOpen ? 0 : -1}
                onClick={(event) =>
                  handleNavigation(event, item.href)
                }
              >
                <span className={styles.drawerLinkText}>
                  {item.label}
                </span>

                <span
                  className={styles.drawerArrow}
                  aria-hidden="true"
                >
                  →
                </span>
              </a>
            ))}
          </nav>
        </div>
      </aside>

      <div
        className={styles.heroRole}
        aria-label="Romance Ghostwriter"
      >
        <span>ROMANCE</span>
        <span>GHOSTWRITER</span>
      </div>

      <div className={styles.heroName} aria-label="Eman Ali">
        EMAN ALI
      </div>
    </div>
  );
}
