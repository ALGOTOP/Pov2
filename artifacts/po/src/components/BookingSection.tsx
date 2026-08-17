"use client";

import Cal from "@calcom/embed-react";
import styles from "./BookingSection.module.css";

// Temporary development link. Replace only this value when the client's
// real Cal.com event link is available.
export const CAL_BOOKING_LINK = "pehchaan-media/15min";

export default function BookingSection() {
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
          <div className={styles.calendar} aria-label="Book a 15 minute call">
            <Cal
              calLink={CAL_BOOKING_LINK}
              style={{
                width: "100%",
                height: "100%",
                overflow: "auto",
              }}
              config={{
                layout: "month_view",
                theme: "dark",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
