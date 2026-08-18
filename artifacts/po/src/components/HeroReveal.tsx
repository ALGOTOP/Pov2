"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
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

const SCROLL_MIN_MS = 520;
const SCROLL_MAX_MS = 820;
const SCROLL_PX_PER_MS = 2.2;

export default function HeroReveal({
  src = "/hero-photo.jpg",
  alt = "",
}: HeroRevealProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

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

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const closeMenu = () => {
    // Unlock scrolling immediately before starting a navigation.
    document.body.style.overflow = "";
    setMenuOpen(false);
  };

  const getTargetPosition = (
    target: HTMLElement,
    targetId: string
  ) => {
    const rect = target.getBoundingClientRect();
    const absoluteTop = rect.top + window.scrollY;
    const sectionHeight = rect.height;
    const viewportHeight = window.innerHeight;

    // If the destination is taller than the viewport, start at its top.
    // This guarantees the user sees the section from its beginning.
    if (sectionHeight >= viewportHeight) {
      return absoluteTop;
    }

    // Books and Work: center the complete section.
    if (targetId === "books" || targetId === "work") {
      return absoluteTop - (viewportHeight - sectionHeight) / 2;
    }

    // About and Booking: also center when the full destination fits.
    // Otherwise the top of the section is the most useful position.
    if (targetId === "about" || targetId === "booking") {
      return absoluteTop - (viewportHeight - sectionHeight) / 2;
    }

    return absoluteTop;
  };

  const handleNavigation = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href === "/") {
      return;
    }

    event.preventDefault();

    const targetId = href.startsWith("#")
      ? href.substring(1)
      : "";

    if (!targetId) return;

    const target = document.getElementById(targetId);

    if (!target) {
      console.warn(
        `[HeroReveal] Navigation target not found: #${targetId}`
      );
      closeMenu();
      return;
    }

    closeMenu();

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    const startPosition = window.scrollY;
    const targetPosition = Math.max(
      0,
      getTargetPosition(target, targetId)
    );
    const distance = targetPosition - startPosition;

    if (Math.abs(distance) < 2) {
      window.scrollTo({
        top: targetPosition,
        left: 0,
        behavior: "auto",
      });
      return;
    }

    const duration = Math.min(
      SCROLL_MAX_MS,
      Math.max(
        SCROLL_MIN_MS,
        Math.abs(distance) / SCROLL_PX_PER_MS
      )
    );

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      window.scrollTo({
        top: targetPosition,
        left: 0,
        behavior: "auto",
      });
      return;
    }

    const startTime = performance.now();

    const easeInOut = (progress: number) =>
      progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    const animate = (currentTime: number) => {
      const progress = Math.min(
        1,
        (currentTime - startTime) / duration
      );

      window.scrollTo({
        top:
          startPosition +
          distance * easeInOut(progress),
        left: 0,
        behavior: "auto",
      });

      if (progress < 1) {
        animationFrameRef.current =
          requestAnimationFrame(animate);
      } else {
        animationFrameRef.current = null;
      }
    };

    animationFrameRef.current =
      requestAnimationFrame(animate);
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
