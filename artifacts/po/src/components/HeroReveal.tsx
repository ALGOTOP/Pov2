import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
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

const getText = (element: Element) =>
  (element.textContent || "").replace(/\s+/g, " ").trim().toUpperCase();

function findNavigationTarget(id: string): HTMLElement | null {
  const byId = document.getElementById(id);
  if (byId instanceof HTMLElement) return byId;

  const sections = Array.from(
    document.querySelectorAll<HTMLElement>("main section, section")
  );

  if (id === "books") {
    return (
      sections.find((section) =>
        getText(section.querySelector("h1, h2")) === "BOOKS"
      ) || null
    );
  }

  if (id === "about") {
    return (
      sections.find((section) =>
        getText(section).startsWith("EMAN ALI IS A WORKING GHOSTWRITER")
      ) || null
    );
  }

  if (id === "work") {
    return (
      sections.find((section) =>
        getText(section.querySelector("h1, h2")).includes("WORK WITH EMAN")
      ) || null
    );
  }

  if (id === "booking") {
    return (
      sections.find((section) =>
        getText(section.querySelector("h1, h2")).includes(
          "SEE IF EMAN IS THE RIGHT FIT"
        )
      ) || null
    );
  }

  return null;
}

function scrollToSection(id: string, target: HTMLElement) {
  const startY = window.scrollY;
  const rect = target.getBoundingClientRect();
  const absoluteTop = rect.top + startY;
  const height = rect.height;
  const viewport = window.innerHeight;

  let destination: number;

  if (height >= viewport) {
    // For a section taller than the viewport, always show its beginning.
    destination = absoluteTop;
  } else if (id === "about") {
    // About is editorial copy: start reading from the beginning.
    destination = absoluteTop;
  } else {
    // For Books / Work / Booking, center the complete section when possible.
    destination = absoluteTop - (viewport - height) / 2;
  }

  destination = Math.max(0, destination);

  const distance = destination - startY;

  if (Math.abs(distance) < 2) {
    window.scrollTo(0, destination);
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo(0, destination);
    return;
  }

  const duration = Math.min(
    780,
    Math.max(440, Math.abs(distance) * 0.26)
  );

  const startedAt = performance.now();

  const ease = (t: number) =>
    t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;

  let frame = 0;

  const tick = (now: number) => {
    const progress = Math.min(1, (now - startedAt) / duration);

    window.scrollTo(
      0,
      startY + distance * ease(progress)
    );

    if (progress < 1) {
      frame = requestAnimationFrame(tick);
    } else {
      window.scrollTo(0, destination);
    }
  };

  frame = requestAnimationFrame(tick);

  return () => cancelAnimationFrame(frame);
}

export default function HeroReveal({
  src = "/hero-photo.jpg",
  alt = "",
}: HeroRevealProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollingRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    /*
     * FOUNDATION-LEVEL NAVIGATION HANDLER
     *
     * We listen at document level in capture phase instead of relying only
     * on React's individual anchor onClick handlers. This means navigation
     * still works if a visual overlay/animation/stacking layer gets between
     * the pointer and the link.
     */
    const handleDocumentClick = (event: Event) => {
      const target = event.target;

      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;

      const rawHref = anchor.getAttribute("href");
      if (!rawHref || !rawHref.startsWith("#")) return;

      const id = rawHref.slice(1);
      if (!id) return;

      const destination = findNavigationTarget(id);

      // If the target genuinely does not exist, allow the browser's normal
      // hash behavior rather than swallowing the click.
      if (!destination) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (scrollingRef.current) {
        scrollingRef.current();
        scrollingRef.current = null;
      }

      // Release the mobile drawer's scroll lock synchronously.
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";

      setMenuOpen(false);

      scrollingRef.current =
        scrollToSection(id, destination) || null;

      // Keep the URL/hash in sync without allowing the browser to perform
      // its own instant jump on top of our controlled animation.
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}#${id}`
      );
    };

    document.addEventListener("click", handleDocumentClick, true);

    return () => {
      document.removeEventListener(
        "click",
        handleDocumentClick,
        true
      );

      if (scrollingRef.current) {
        scrollingRef.current();
        scrollingRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    document.documentElement.style.overflow = menuOpen
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
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
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    setMenuOpen(false);
  };

  const handleDirectNavigation = (
    event: ReactMouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    // The document-level capture handler is the single source of truth.
    // This fallback intentionally does not prevent default.
    if (!href.startsWith("#")) return;
    event.currentTarget.dataset.navigationRequested = "true";
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
            handleDirectNavigation(event, "#books")
          }
        >
          Books
        </a>

        <a
          href="#about"
          onClick={(event) =>
            handleDirectNavigation(event, "#about")
          }
        >
          About
        </a>

        <a
          href="#work"
          onClick={(event) =>
            handleDirectNavigation(event, "#work")
          }
        >
          Contact
        </a>

        <a
          href="#booking"
          className={styles.getStartedButton}
          onClick={(event) =>
            handleDirectNavigation(event, "#booking")
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
