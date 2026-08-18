"use client";

import { useEffect, useState } from "react";
import styles from "./HeroReveal.module.css";

type HeroRevealProps = {
  src?: string;
  alt?: string;
};

const menuItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Books",
    href: "#books",
  },
  {
    label: "About",
    href: "#about",
  },
  {
    label: "Contact",
    href: "#work",
  },
];

export default function HeroReveal({
  src = "/hero-photo.jpg",
  alt = "",
}: HeroRevealProps) {
  const [menuOpen, setMenuOpen] = useState(false);

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
    };
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleNavigation = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (!href.startsWith("#")) {
      return;
    }

    event.preventDefault();

    const targetId = href.substring(1);
    const target = document.getElementById(targetId);

    if (!target) {
      console.warn(`Navigation target not found: #${targetId}`);
      return;
    }

    closeMenu();

    const startY = window.scrollY;
    const rect = target.getBoundingClientRect();
    const absoluteTop = rect.top + startY;
    const sectionHeight = target.offsetHeight;
    const viewportHeight = window.innerHeight;

    let targetY = absoluteTop;

    // About: begin at the start so the editorial text can be read from top.
    if (targetId === "about") {
      targetY = absoluteTop;
    }
    // Books, Work and Booking: center the complete section when it fits.
    else if (sectionHeight <= viewportHeight) {
      targetY = absoluteTop - (viewportHeight - sectionHeight) / 2;
    }

    targetY = Math.max(0, targetY);

    const distance = targetY - startY;
    const duration = Math.min(
      800,
      Math.max(500, Math.abs(distance) * 0.3)
    );

    const startTime = performance.now();

    const ease = (t: number) =>
      t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      window.scrollTo(0, targetY);
      return;
    }

    const animate = (now: number) => {
      const progress = Math.min(
        1,
        (now - startTime) / duration
      );

      window.scrollTo(
        0,
        startY + distance * ease(progress)
      );

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);

    // Keep the correct section in the URL without allowing the browser
    // to perform its own abrupt anchor jump.
    window.history.replaceState(null, "", `#${targetId}`);
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

      {/* ROLE TEXT */}
      <div
        className={styles.heroRole}
        aria-label="Romance Ghostwriter"
      >
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
