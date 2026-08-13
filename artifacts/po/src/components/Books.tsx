"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Books.module.css";

type Book = {
  title: string;
  image: string;
};

const books: Book[] = [
  {
    title: "WE ARE AS GODS",
    image: "/books/we-are-as-gods.jpg",
  },
  {
    title: "ABUNDANCE",
    image: "/books/abundance.webp",
  },
  {
    title: "BOLD",
    image: "/books/bold.webp",
  },
  {
    title: "THE RISE OF SUPERMAN",
    image: "/books/the-rise-of-superman.webp",
  },
  {
    title: "TOMORROWLAND",
    image: "/books/tomorrowland.webp",
  },
];

export default function Books() {
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const dragState = useRef({
    startX: 0,
    startScrollLeft: 0,
  });

  /*
   * Update the active pagination indicator based
   * on the current horizontal scroll position.
   */
  useEffect(() => {
    const carousel = carouselRef.current;

    if (!carousel) return;

    const handleScroll = () => {
      const cards = Array.from(
        carousel.querySelectorAll<HTMLElement>(
          `.${styles.bookCard}`
        )
      );

      if (!cards.length) return;

      const scrollPosition = carousel.scrollLeft;

      let closestIndex = 0;
      let closestDistance = Infinity;

      cards.forEach((card, index) => {
        const distance = Math.abs(card.offsetLeft - scrollPosition);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    };

    carousel.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    handleScroll();

    return () => {
      carousel.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /*
   * Mouse wheel becomes horizontal scrolling when
   * the cursor is over the books carousel.
   */
  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current;

    if (!carousel) return;

    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.preventDefault();

      carousel.scrollLeft += event.deltaY;
    }
  };

  /*
   * Mouse drag support for desktop.
   */
  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    const carousel = carouselRef.current;

    if (!carousel) return;

    setIsDragging(true);

    dragState.current.startX = event.clientX;
    dragState.current.startScrollLeft = carousel.scrollLeft;

    carousel.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    const carousel = carouselRef.current;

    if (!carousel || !isDragging) return;

    const distance =
      event.clientX - dragState.current.startX;

    carousel.scrollLeft =
      dragState.current.startScrollLeft - distance;
  };

  const handlePointerUp = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    const carousel = carouselRef.current;

    setIsDragging(false);

    if (
      carousel &&
      carousel.hasPointerCapture(event.pointerId)
    ) {
      carousel.releasePointerCapture(event.pointerId);
    }
  };

  /*
   * Clicking a pagination dot scrolls to the
   * corresponding book.
   */
  const scrollToBook = (index: number) => {
    const carousel = carouselRef.current;

    if (!carousel) return;

    const cards = carousel.querySelectorAll<HTMLElement>(
      `.${styles.bookCard}`
    );

    const card = cards[index];

    if (!card) return;

    carousel.scrollTo({
      left: card.offsetLeft,
      behavior: "smooth",
    });
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>BOOKS</h2>
      </div>

      <div
        ref={carouselRef}
        className={`${styles.carousel} ${
          isDragging ? styles.dragging : ""
        }`}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className={styles.track}>
          {books.map((book, index) => (
            <article
              className={styles.bookCard}
              key={`${book.title}-${index}`}
            >
              <div className={styles.imageFrame}>
                <img
                  src={book.image}
                  alt={book.title}
                  className={styles.bookImage}
                  draggable={false}
                />
              </div>

              <h3 className={styles.bookTitle}>
                {book.title}
              </h3>
            </article>
          ))}
        </div>
      </div>

      <div className={styles.pagination}>
        {Array.from({ length: 5 }).map((_, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={index}
              type="button"
              aria-label={`Go to book ${index + 1}`}
              className={`${styles.dot} ${
                isActive ? styles.activeDot : ""
              }`}
              onClick={() => scrollToBook(index)}
              />
          );
        })}
      </div>
    </section>
  );
}
