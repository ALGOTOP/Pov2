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
    label: "About",
    href: "#about",
  },
  {
    label: "Books",
    href: "#books",
  },
  {
    label: "Work",
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
        <a href="#work">Work</a>
        <a href="#services">Services</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
        <a href="#contact" className={styles.getStartedButton}>
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
                onClick={closeMenu}
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
