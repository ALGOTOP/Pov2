"use client";

import { useEffect, useState, type CSSProperties, type MouseEvent } from "react";
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

function scrollToSection(id: string) {
  const target = document.getElementById(id);

  if (!target) {
    console.warn(`[HeroReveal] Navigation target #${id} was not found.`);
    return false;
  }

  const viewportHeight = window.innerHeight;
  const targetHeight = target.getBoundingClientRect().height;

  /*
   * A section taller than the viewport cannot be shown completely.
   * In that case, start at its beginning.
   *
   * For shorter sections, center the whole section in the viewport.
   * About is intentionally aligned to the beginning because it is a
   * reading section and the user should see its first line immediately.
   */
  const block =
    id === "about" || targetHeight > viewportHeight
      ? "start"
      : "center";

  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    target.scrollIntoView({
      behavior: "auto",
      block,
      inline: "nearest",
    });
  } else {
    target.scrollIntoView({
      behavior: "smooth",
      block,
      inline: "nearest",
    });
  }

  /*
   * Keep the URL useful without allowing the browser to perform a second
   * native hash jump. The scroll above is the only navigation movement.
   */
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${window.location.search}#${id}`
  );

  return true;
}

export default function HeroReveal({
  src = "/hero-photo.jpg",
  alt = "",
}: HeroRevealProps) {
  const [menuOpen, setMenuOpen] = useState(false);

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
    };
  }, []);

  const closeMenuForNavigation = () => {
    /*
     * Release the mobile drawer's scroll lock synchronously.
     * React state updates are asynchronous; waiting for the effect here can
     * otherwise leave the document locked while scrollIntoView runs.
     */
    document.body.style.overflow = "";
    setMenuOpen(false);
  };

  const handleNavigation = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (!href.startsWith("#")) {
      return;
    }

    event.preventDefault();

    const id = href.slice(1);

    closeMenuForNavigation();

    /*
     * Wait one frame after closing the drawer so its fixed overlay/drawer
     * cannot interfere with the scroll operation on mobile.
     */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToSection(id);
      });
    });
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
        onClick={() => setMenuOpen(false)}
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
          onClick={() => setMenuOpen(false)}
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
