"use client";
import { useEffect, useRef, useState } from "react";

export default function CallToActionSection() {
  const ctaBackgrounds = [
    "https://placehold.co/1920x1080/FF6347/FFFFFF?text=CTA+Slide+1",
    "https://placehold.co/1920x1080/FFA07A/FFFFFF?text=CTA+Slide+2",
    "https://placehold.co/1920x1080/CD5C5C/FFFFFF?text=CTA+Slide+3",
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const sliderRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const isDraggingRef = useRef(false);

  const totalSlides = ctaBackgrounds.length;
  const AUTO_PLAY_DELAY = 2000; // Slower for background CTA
  const RESUME_DELAY = 2000;
  const SWIPE_THRESHOLD = 50;

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, AUTO_PLAY_DELAY);
      return () => clearInterval(interval);
    }
    return () => {};
  }, [totalSlides, isPaused]);

  const handleInteraction = () => {
    setIsPaused(true);
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current);
    }
    autoPlayTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, RESUME_DELAY);
  };

  const goToNextSlide = () => {
    handleInteraction();
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const goToPrevSlide = () => {
    handleInteraction();
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    handleInteraction();
    setCurrentSlide(index);
  };

  // --- Mouse/Touch Swipe Handlers (adapted for background slider) ---
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    handleInteraction();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // No visual dragging feedback needed for background slider
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const endX = e.clientX;
    const diffX = startXRef.current - endX;

    if (Math.abs(diffX) > SWIPE_THRESHOLD) {
      if (diffX > 0) {
        // Swiped left
        goToNextSlide();
      } else {
        // Swiped right
        goToPrevSlide();
      }
    }
  };

  const handleMouseLeave = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    handleInteraction();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      const currentX = e.touches[0].clientX;
      const diffX = startXRef.current - currentX;
      if (Math.abs(diffX) > 10) {
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    const diffX = startXRef.current - endX;

    if (Math.abs(diffX) > SWIPE_THRESHOLD) {
      if (diffX > 0) {
        // Swiped left
        goToNextSlide();
      } else {
        // Swiped right
        goToPrevSlide();
      }
    }
  };

  return (
    <section
      className="relative py-20 px-4 text-white text-center rounded-3xl overflow-hidden shadow-xl"
      ref={sliderRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Slider */}
      <div
        className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {ctaBackgrounds.map((imgSrc, idx) => (
          <img
            key={idx}
            src={imgSrc}
            alt={`CTA Background ${idx + 1}`}
            className="min-w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/1920x1080/FF6347/FFFFFF?text=CTA+Slide+${
                idx + 1
              }`;
            }}
          />
        ))}
      </div>
      {/* Overlay to make text readable */}
      <div className="absolute inset-0 bg-black opacity-50"></div>{" "}
      {/* Dark overlay */}
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-lg rounded-xl">
          Sẵn Sàng Trải Nghiệm Lalalycheee?
        </h2>
        <p className="text-xl font-light opacity-95 px-4 rounded-xl">
          Khám phá bộ sưu tập sản phẩm làm từ vải thiều độc đáo của chúng tôi
          ngay hôm nay!
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button className="px-8 py-4 bg-white text-pink-600 text-lg font-semibold rounded-full shadow-lg hover:bg-gray-100 hover:shadow-xl transition duration-300 transform hover:scale-105">
            Xem Sản Phẩm
          </button>
          <button className="px-8 py-4 bg-transparent border-2 border-white text-white text-lg font-semibold rounded-full shadow-lg hover:bg-white hover:text-pink-600 transition duration-300 transform hover:scale-105">
            Liên Hệ
          </button>
        </div>
      </div>
      {/* Navigation Buttons for CTA Slider */}
      <button
        onClick={goToPrevSlide}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full shadow-md text-white transition-colors duration-300 z-20"
        aria-label="Previous CTA slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={goToNextSlide}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full shadow-md text-white transition-colors duration-300 z-20"
        aria-label="Next CTA slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      {/* Slide Indicators for CTA Slider */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {ctaBackgrounds.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              currentSlide === idx ? "bg-white w-6" : "bg-white/50"
            }`}
            aria-label={`Go to CTA slide ${idx + 1}`}
          ></button>
        ))}
      </div>
    </section>
  );
}
