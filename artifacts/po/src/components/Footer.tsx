"use client";

import styles from "./Footer.module.css";

const navigation = [
  {
    label: "HOME",
    href: "/",
  },
  {
    label: "ABOUT",
    href: "/#about",
  },
  {
    label: "BOOKS",
    href: "/#books",
  },
  {
    label: "WORK",
    href: "/#work",
  },
];

export default function Footer() {
  return (
    <footer id="contact" className={styles.footer}>
      <div className={styles.footerMain}>
        {/* NEWSLETTER */}
        <div className={styles.newsletter}>
          <h2 className={styles.newsletterTitle}>
            Subscribe to Eman Ali&apos;s
            <br />
            newsletter
          </h2>

          <form className={styles.subscribeForm}>
            <div className={styles.emailField}>
              <input
                type="email"
                name="email"
                placeholder="ENTER YOUR EMAIL"
                aria-label="Email address"
                autoComplete="email"
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              aria-label="Subscribe"
            >
              <svg
                viewBox="0 0 28 28"
                aria-hidden="true"
              >
                <path d="M5 14h17M15 7l7 7-7 7" />
              </svg>
            </button>
          </form>
        </div>

        {/* NAVIGATION */}
        <nav
          className={styles.navigation}
          aria-label="Footer navigation"
        >
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={styles.navLink}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* SOCIALS */}
        <div className={styles.socials}>
          <a
            href="#"
            className={styles.socialLink}
            aria-label="YouTube"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M21.2 7.2a2.7 2.7 0 0 0-1.9-1.9C17.6 4.8 12 4.8 12 4.8s-5.6 0-7.3.5a2.7 2.7 0 0 0-1.9 1.9c-.5 1.7-.5 5.2-.5 5.2s0 3.5.5 5.2a2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.3.5 7.3.5s5.6 0 7.3-.5a2.7 2.7 0 0 0 1.9-1.9c.5-1.7.5-5.2.5-5.2s0-3.5-.5-5.2Z"
                fill="none"
              />
              <path d="m10 9 5 3-5 3V9Z" />
            </svg>
          </a>

          <a
            href="#"
            className={styles.socialLink}
            aria-label="Instagram"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <rect
                x="4"
                y="4"
                width="16"
                height="16"
                rx="4"
                fill="none"
              />
              <circle
                cx="12"
                cy="12"
                r="3.5"
                fill="none"
              />
              <circle
                cx="17.2"
                cy="6.8"
                r="1"
              />
            </svg>
          </a>

          <a
            href="#"
            className={styles.socialLink}
            aria-label="X"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M5 4 19 20M19 4 5 20" />
            </svg>
          </a>

          <a
            href="#"
            className={styles.socialLink}
            aria-label="Facebook"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M14 20v-7h2.5l.5-3H14V8.2c0-.9.3-1.5 1.6-1.5H17V4.1c-.5-.1-1.4-.1-2.3-.1-2.3 0-3.8 1.4-3.8 4v2H8.5v3h2.4v7H14Z" />
            </svg>
          </a>

          <a
            href="#"
            className={styles.socialLink}
            aria-label="LinkedIn"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M6.5 8.5H3.5V20h3V8.5ZM5 4a1.8 1.8 0 1 0 0 3.6A1.8 1.8 0 0 0 5 4ZM20.5 13.4c0-3.5-1.9-5.1-4.5-5.1-2.1 0-3 .9-3.5 1.6V8.5h-3V20h3v-5.7c0-1.5.3-2.9 2.1-2.9 1.7 0 1.8 1.5 1.8 3V20h3v-6.6Z" />
            </svg>
          </a>
        </div>
      </div>

      {/* BOTTOM */}
      <div className={styles.footerBottom}>
        <span className={styles.copyright}>
          © 2026 Eman Ali. All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}
