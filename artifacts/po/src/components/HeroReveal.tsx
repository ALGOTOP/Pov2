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

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export default function HeroReveal({
  src = "/hero-photo.jpg",
  alt = "",
}: HeroRevealProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollFrame = useRef<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);

      if (scrollFrame.current !== null) {
        cancelAnimationFrame(scrollFrame.current);
      }
    };
  }, []);

  const closeMenuImmediately = () => {
    // Do this synchronously so the drawer cannot keep body scrolling locked
    // while the destination animation starts.
    document.body.style.overflow = "";
    setMenuOpen(false);
  };

  const getDestination = (id: string, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const absoluteTop = rect.top + window.scrollY;
    const sectionHeight = rect.height;
    const viewportHeight = window.innerHeight;

    // If the complete section cannot fit in the viewport, show its beginning.
    if (sectionHeight >= viewportHeight) {
      return absoluteTop;
    }

    const freeSpace = viewportHeight - sectionHeight;

    // About/editorial: start at the beginning so the copy is read from start.
    if (id === "about") {
      return absoluteTop;
    }

    // Books, Work and Booking: center the complete section.
    return absoluteTop - freeSpace / 2;
  };

  const handleNavigation = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (!href.startsWith("#")) {
      return;
    }

    event.preventDefault();

    const id = href.substring(1);
    const target = document.getElementById(id);

    if (!target) {
      console.warn(`[Navigation] Missing target: #${id}`);
      closeMenuImmediately();
      return;
    }

    closeMenuImmediately();

    if (scrollFrame.current !== null) {
      cancelAnimationFrame(scrollFrame.current);
      scrollFrame.current = null;
    }

    const startY = window.scrollY;
    const destination = Math.max(0, getDestination(id, target));
    const distance = destination - startY;

    if (Math.abs(distance) < 2) {
      window.scrollTo(0, destination);
      return;
    }

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      window.scrollTo(0, destination);
      return;
    }

    // Medium speed: short enough to feel responsive, long enough to feel
    // deliberate. Never becomes a slow cinematic scroll.
    const duration = clamp(
      Math.abs(distance) * 0.28,
      420,
      760
    );

    const startTime = performance.now();

    const ease = (t: number) =>
      t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const animate = (now: number) => {
      const progress = Math.min(
        1,
        (now - startTime) / duration
      );

      window.scrollTo(
        0,
        startY + (destination - startY) * ease(progress)
      );

      if (progress < 1) {
        scrollFrame.current =
          requestAnimationFrame(animate);
      } else {
        scrollFrame.current = null;

        // Keep the final position exact after the animation.
        window.scrollTo(0, destination);
      }
    };

    scrollFrame.current = requestAnimationFrame(animate);
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
        onClick={closeMenuImmediately}
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
          onClick={closeMenuImmediately}
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
