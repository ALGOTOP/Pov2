import { useEffect, useRef } from "react";
import styles from "./BookingSection.module.css";

// Temporary development link. Replace only this value when the client's
// real Cal.com event link is available.
export const CAL_BOOKING_LINK = "pehchaan-media/15min";

const CAL_EMBED_SCRIPT = "https://app.cal.com/embed/embed.js";

// Cal.com exposes a global API from its embed script. Keep the type local so
// this component does not require another npm dependency.
type CalApi = {
  (action: string, ...args: any[]): void;
  loaded?: boolean;
  q?: unknown[];
};

declare global {
  interface Window {
    Cal?: CalApi;
  }
}

export default function BookingSection() {
  const calendarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = calendarRef.current;
    if (!element) return;

    let disposed = false;
    let pollId: number | undefined;

    const mountCalendar = () => {
      if (disposed || !element || !window.Cal) return;

      // Clear anything left by a previous React mount before initializing.
      element.replaceChildren();

      // Cal.com's official embed flow: initialize the SDK, create an inline
      // embed in this element, then configure its UI.
      window.Cal("init", { origin: "https://app.cal.com" });

      window.Cal("inline", {
        elementOrSelector: element,
        calLink: CAL_BOOKING_LINK,
        config: {
          layout: "month_view",
          theme: "dark",
        },
      });

      window.Cal("ui", {
        styles: {
          body: {
            background: "transparent",
          },
          eventTypeListItem: {
            background: "transparent",
          },
        },
        hideEventTypeDetails: false,
      });
    };

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${CAL_EMBED_SCRIPT}"]`,
    );

    if (window.Cal) {
      mountCalendar();
    } else if (existing) {
      existing.addEventListener("load", mountCalendar, { once: true });

      // The script may already have loaded before this component mounted.
      pollId = window.setInterval(() => {
        if (window.Cal) {
          window.clearInterval(pollId);
          pollId = undefined;
          mountCalendar();
        }
      }, 100);
    } else {
      const script = document.createElement("script");
      script.src = CAL_EMBED_SCRIPT;
      script.async = true;
      script.addEventListener("load", mountCalendar, { once: true });
      document.head.appendChild(script);
    }

    return () => {
      disposed = true;
      if (pollId !== undefined) window.clearInterval(pollId);
      element.replaceChildren();
    };
  }, []);

  return (
    <section
      id="booking"
      className={styles.section}
      aria-labelledby="booking-title"
    >
      <div className={styles.inner}>
        <div className={styles.copyColumn}>
          <h2 id="booking-title" className={styles.heading}>
            See if Eman is the right fit
            <span className={styles.headingAccent}>for you</span>
          </h2>

          <p className={styles.description}>
            Schedule a quick, 15 minute guided call with Eman to see if the
            project, process, and creative fit make sense.
          </p>

          <p className={styles.supportingText}>
            We work with publishers, packagers, authors, and teams looking for
            a reliable long-form writing partner behind the scenes.
          </p>

          <a
            className={styles.emailPill}
            href="mailto:infopehchaanmedia@gmail.com"
          >
            <span className={styles.emailIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="3.5" y="5" width="17" height="14" rx="3" />
                <path d="m5.5 7.5 6.5 5 6.5-5" />
              </svg>
            </span>
            <span>infopehchaanmedia@gmail.com</span>
          </a>
        </div>

        <div className={styles.calendarColumn}>
          <div
            ref={calendarRef}
            className={styles.calendar}
            aria-label="Book a 15 minute call"
          />
        </div>
      </div>
    </section>
  );
}
