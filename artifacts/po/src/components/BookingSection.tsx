import { useEffect, useRef } from "react";
import styles from "./BookingSection.module.css";

export const CAL_BOOKING_LINK = "pehchaan-media/15min";

const CAL_EMBED_SCRIPT = "https://app.cal.com/embed/embed.js";

type CalApi = {
  (action: string, ...args: any[]): void;
  loaded?: boolean;
  q?: any[];
  ns?: Record<string, any>;
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

    // Cal.com's embed.js is NOT a self-contained script — it expects
    // window.Cal to already exist as this exact "stub" function before it
    // loads. The stub does two things: (1) it appends the embed.js script
    // tag itself the first time it's called, and (2) it queues up every
    // Cal(...) call made before the real script finishes loading, so calls
    // never get lost. This is Cal.com's official loader snippet — do not
    // replace it with a plain <script src="..."> tag + onload handler, that
    // throws "Cal is not defined. This shouldn't happen." because embed.js
    // reads from the queue this stub sets up.
    (function (C: any, A: string, L: string) {
      const p = (a: any, ar: any) => {
        a.q.push(ar);
      };
      const d = C.document;
      C.Cal =
        C.Cal ||
        function (...args: any[]) {
          const cal = C.Cal;
          const ar = args;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            d.head.appendChild(d.createElement("script")).src = A;
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api: any = (...apiArgs: any[]) => p(api, apiArgs);
            const namespace = ar[1];
            api.q = api.q || [];
            if (typeof namespace === "string") {
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], ar);
              p(cal, ["initNamespace", namespace]);
            } else {
              p(cal, ar);
            }
            return;
          }
          p(cal, ar);
        };
    })(window, CAL_EMBED_SCRIPT, "init");

    const Cal = window.Cal!;

    Cal("init", {
      origin: "https://app.cal.com",
    });

    Cal("inline", {
      elementOrSelector: `#${elementId}`,
      calLink: CAL_BOOKING_LINK,
      config: {
        layout: "month_view",
        theme: "dark",
      },
    });

    Cal("ui", {
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

    return () => {
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
