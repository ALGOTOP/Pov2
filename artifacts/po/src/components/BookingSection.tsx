"use client";

import { useEffect, useRef } from "react";
import styles from "./BookingSection.module.css";

// Temporary development link. Replace only this value when the client's
// real Cal.com event link is available.
export const CAL_BOOKING_LINK = "pehchaan-media/15min";

const CAL_EMBED_SCRIPT = "https://app.cal.com/embed/embed.js";
const CAL_NAMESPACE = "emanBooking";

export default function BookingSection() {
  const calendarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const calendarElement = calendarRef.current;
    if (!calendarElement) return;

    const win = window as typeof window & {
      Cal?: any;
    };

    const initializeCalendar = () => {
      if (!win.Cal) return;

      win.Cal("init", CAL_NAMESPACE, {
        origin: "https://cal.com",
      });

      win.Cal.ns?.[CAL_NAMESPACE]?.("inline", {
        elementOrSelector: calendarElement,
        calLink: CAL_BOOKING_LINK,
        layout: "month_view",
      });

      win.Cal.ns?.[CAL_NAMESPACE]?.("ui", {
        styles: {
          branding: {
            brandColor: "#ffffff",
          },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    };

    if (win.Cal?.loaded) {
      initializeCalendar();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${CAL_EMBED_SCRIPT}"]`,
    );

    if (existingScript) {
      existingScript.addEventListener("load", initializeCalendar, {
        once: true,
      });

      return () => {
        existingScript.removeEventListener("load", initializeCalendar);
        calendarElement.replaceChildren();
      };
    }

    const script = document.createElement("script");
    script.src = CAL_EMBED_SCRIPT;
    script.async = true;

    script.onload = initializeCalendar;
    document.head.appendChild(script);

    return () => {
      script.onload = null;
      calendarElement.replaceChildren();
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
          <p className={styles.eyebrow}>LET&apos;S TALK</p>

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
          <div className={styles.calendarShell}>
            <div
              ref={calendarRef}
              className={styles.calendar}
              aria-label="Book a 15 minute call"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
