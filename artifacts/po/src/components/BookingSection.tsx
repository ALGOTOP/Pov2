import { useEffect, useRef } from "react";
import styles from "./BookingSection.module.css";

export const CAL_BOOKING_LINK = "pehchaan-media/15min";

const CAL_EMBED_SCRIPT = "https://app.cal.com/embed/embed.js";

type CalApi = {
  (action: string, ...args: any[]): void;
  loaded?: boolean;
  q?: any[];
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

    const elementId = "pehchaan-cal-inline";
    element.id = elementId;

    let disposed = false;
    let pollId: number | undefined;
    let initialized = false;

    const mountCalendar = () => {
      if (disposed || initialized || !window.Cal) return;

      initialized = true;

      // Cal.com's inline embed API expects a selector string for the
      // element/target. Using a stable ID avoids passing a DOM node directly.
      window.Cal("init", {
        origin: "https://app.cal.com",
      });

      window.Cal("inline", {
        elementOrSelector: `#${elementId}`,
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
        theme: "dark",
      });
    };

    const waitForCal = () => {
      if (disposed) return;

      if (window.Cal) {
        mountCalendar();
        if (pollId !== undefined) {
          window.clearInterval(pollId);
          pollId = undefined;
        }
      }
    };

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${CAL_EMBED_SCRIPT}"]`,
    );

    if (window.Cal) {
      mountCalendar();
    } else if (existing) {
      existing.addEventListener("load", waitForCal, { once: true });
      pollId = window.setInterval(waitForCal, 100);
    } else {
      const script = document.createElement("script");
      script.src = CAL_EMBED_SCRIPT;
      script.async = true;
      script.addEventListener("load", waitForCal, { once: true });
      document.head.appendChild(script);

      pollId = window.setInterval(waitForCal, 100);
    }

    return () => {
      disposed = true;

      if (pollId !== undefined) {
        window.clearInterval(pollId);
      }

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
