"use client";

import { useRef, useState } from "react";
import styles from "./Testimonials.module.css";

type Testimonial = {
  review: string;
  name: string;
  role: string;
  image: string;
};

const testimonials: Testimonial[] = [
  {
    review:
      "It’s difficult to think of a writer more invigorating and tuned-in than her. Tomorrowland is like taking a shot of caffeine. It allows you to see into the future and to realize that you’re already there.",
    name: "ALEX MORGAN",
    role: "Author, researcher and futurist",
    image: "/testimonials/profile-1.svg",
  },
  {
    review:
      "she does a masterful job of explaining why we are at the start of a new era of radically increasing standards of living throughout the world. This is essential reading for anyone looking for a better tomorrow.",
    name: "MICHAEL CARTER",
    role: "Founder and technology entrepreneur",
    image: "/testimonials/profile-2.svg",
  },
  {
    review:
      "Every coach in the world should know this stuff. eman has a rare ability to turn complicated ideas about human performance into something practical and exciting.",
    name: "JORDAN LEE",
    role: "Performance coach and author",
    image: "/testimonials/profile-3.svg",
  },
  {
    review:
      "A sharp, accessible look at what happens when curiosity, science and human potential collide. The ideas stay with you long after you finish reading.",
    name: "RILEY KENT",
    role: "Neuroscience writer",
    image: "/testimonials/profile-4.svg",
  },
  {
    review:
      "Few writers can make emerging stories feel this immediate. The work is ambitious, optimistic and grounded in questions that matter right now.",
    name: "SAM BROOKS",
    role: "Creative director and speaker",
    image: "/testimonials/profile-5.svg",
  },
  {
    review:
      "The combination of research and storytelling makes these ideas unusually easy to understand. It is the kind of work that changes how you think about what is possible.",
    name: "NOAH THOMAS",
    role: "Author and innovation consultant",
    image: "/testimonials/profile-6.svg",
  },
];

export default function Testimonials() {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const dragState = useRef({
    startX: 0,
    startScrollLeft: 0,
  });

  const scrollByCard = (direction: -1 | 1) => {
    const carousel = carouselRef.current;

    if (!carousel) return;

    const card = carousel.querySelector<HTMLElement>(
      `.${styles.card}`
    );

    if (!card) return;

    carousel.scrollBy({
      left: direction * card.offsetWidth,
      behavior: "smooth",
    });
  };

  const handleWheel = (
    event: React.WheelEvent<HTMLDivElement>
  ) => {
    const carousel = carouselRef.current;

    if (!carousel) return;

    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.preventDefault();
      carousel.scrollLeft += event.deltaY;
    }
  };

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    const carousel = carouselRef.current;

    if (!carousel || event.pointerType === "touch") return;

    setIsDragging(true);

    dragState.current.startX = event.clientX;
    dragState.current.startScrollLeft =
      carousel.scrollLeft;

    carousel.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    const carousel = carouselRef.current;

    if (!carousel || !isDragging) return;

    carousel.scrollLeft =
      dragState.current.startScrollLeft -
      (event.clientX - dragState.current.startX);
  };

  const handlePointerUp = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    const carousel = carouselRef.current;

    setIsDragging(false);

    if (
      carousel?.hasPointerCapture(event.pointerId)
    ) {
      carousel.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <section
      className={styles.section}
      aria-labelledby="testimonials-title"
    >
      <div className={styles.header}>
        <div
          className={styles.controls}
          aria-label="Testimonials navigation"
        >
          <button
            type="button"
            className={styles.arrowButton}
            aria-label="Previous testimonials"
            onClick={() => scrollByCard(-1)}
          >
            <svg
              viewBox="0 0 28 28"
              aria-hidden="true"
            >
              <path d="M23 14H5M12 7l-7 7 7 7" />
            </svg>
          </button>

          <button
            type="button"
            className={styles.arrowButton}
            aria-label="Next testimonials"
            onClick={() => scrollByCard(1)}
          >
            <svg
              viewBox="0 0 28 28"
              aria-hidden="true"
            >
              <path d="M5 14h18m-7-7 7 7-7 7" />
            </svg>
          </button>
        </div>

        <h2
          id="testimonials-title"
          className={styles.title}
        >
          WHAT OTHERS SAY
        </h2>
      </div>

      <div
        ref={carouselRef}
        className={`${styles.viewport} ${
          isDragging ? styles.dragging : ""
        }`}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className={styles.track}>
          {testimonials.map((testimonial, index) => (
            <article
              className={styles.card}
              key={`${testimonial.name}-${index}`}
            >
              <p className={styles.review}>
                “{testimonial.review}”
              </p>

              <div className={styles.person}>
                <img
                  src={testimonial.image}
                  alt=""
                  width={96}
                  height={96}
                  className={styles.avatar}
                  draggable={false}
                />

                <div className={styles.personCopy}>
                  <h3 className={styles.name}>
                    {testimonial.name}
                  </h3>

                  <p className={styles.role}>
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
