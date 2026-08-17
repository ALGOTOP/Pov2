"use client";

import { useEffect, useRef } from "react";
import styles from "./BookingSection.module.css";

// Temporary development link. Replace only this value when the client's
// real Cal.com event link is available.
export const CAL_BOOKING_LINK = "pehchaan-media/15min";

const CAL_EMBED_SCRIPT = "https://app.cal.com/embed/embed.js";

export default function BookingSection() {
  const calendarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const calendarElement = calendarRef.current;
    if (!calendarElement) return;

    const win = window as typeof window & {
      Cal?: any;
    };

    let cancelled = false;

    const initializeCalendar = () => {
      if (cancelled || !win.Cal || !calendarElement) return;

      // Clear any previous embed before initializing again.
      calendarElement.replaceChildren();

      // Cal.com's current inline embed API. Using the global inline call
      // avoids relying on a namespace-specific method that can vary between
      // embed SDK versions.
      win.Cal("inline", {
        elementOrSelector: calendarElement,
        calLink: CAL_BOOKING_LINK,
        config: {
          layout: "month_view",
          theme: "dark",
        },
      });

      win.Cal("ui", {
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

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${CAL_EMBED_SCRIPT}"]`,
    );

    if (existingScript) {
      if (win.Cal) {
        initializeCalendar();
      } else {
        existingScript.addEventListener("load", initializeCalendar, {
          once: true,
        });
      }

      return () => {
        cancelled = true;
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
      cancelled = true;
      script.onload = null;
      calendarElement.replaceChildren();
    };
  }, []);

  return (
    <section
      id="booking"
      className={styles.section}
      aria-label="Book a 15 minute call"
    >
      <div ref={calendarRef} className={styles.calendar} />
    </section>
  );
}
