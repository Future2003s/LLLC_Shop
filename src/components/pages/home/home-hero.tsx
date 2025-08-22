"use client";
import Image1 from "../../../../public/images/mat_ong_1-min.jpg";
import Image2 from "../../../../public/images/pha_voi_chanh_2-min.jpg";
import Image3 from "../../../../public/images/mat_ong_voi_pho_mai_3-min.jpg";
import Image4 from "../../../../public/images/AQ0P4338_4-min.jpg";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function HeroSection() {
  const heroProduct = {
    name: "Vải Thiều Chính Vụ Lalalycheee",
    nameJp: "タンハーライチ",
    description:
      "Khám phá hương vị ngọt ngào, thanh mát của Vải Thiều chính vụ. Những trái vải căng mọng, đỏ hồng, được thu hoạch tươi ngon từ vườn, mang đến trải nghiệm mùa hè đích thực. Cùi vải dày, trắng trong, mọng nước, vị ngọt đậm đà khó quên. Lalalycheee mang đến chất liệu vải mềm mại, thoáng mát và bền vững.",
    highlights: [
      "Sản xuất từ sợi vải thiều tự nhiên, thân thiện môi trường.",
      "Độ mềm mại vượt trội, thoáng khí, không gây kích ứng da.",
      "Màu sắc tự nhiên, bền đẹp theo thời gian.",
      "Phù hợp cho trang phục hàng ngày và các sản phẩm gia dụng.",
    ],
    // Using placeholder images for the slider
    images: [Image1, Image2, Image3, Image4],
  };

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false); // State to control autoplay pause
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref to store autoplay timer ID

  const sliderRef = useRef<HTMLDivElement>(null); // Ref for the slider container
  const startXRef = useRef(0); // Stores the starting X position for swipe
  const isDraggingRef = useRef(false); // Tracks if a drag is in progress

  const totalSlides = heroProduct.images.length;
  const AUTO_PLAY_DELAY = 2000; // Auto-advance slide every 5 seconds
  const RESUME_DELAY = 1500; // Resume autoplay after 3 seconds of user inactivity
  const SWIPE_THRESHOLD = 50; // Minimum pixel distance to register a swipe

  // Effect for autoplay logic
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, AUTO_PLAY_DELAY);
      return () => clearInterval(interval);
    }
    return () => {};
  }, [totalSlides, isPaused]);

  // Function to handle user interaction: pause autoplay and set a timer to resume
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

  // --- Mouse/Touch Swipe Handlers ---

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    handleInteraction(); // Pause autoplay on interaction
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    // Optional: Add visual feedback for dragging here if desired
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const endX = e.clientX;
    const diffX = startXRef.current - endX; // Positive for left swipe, negative for right swipe

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
    // If dragging started and mouse leaves, treat as an end of drag
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      // No slide change here, as swipe needs mouseUp to finish
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    handleInteraction(); // Pause autoplay on interaction
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Prevent default scroll behavior while swiping horizontally
    // Only if a swipe is detected or ongoing
    if (e.touches.length > 0) {
      const currentX = e.touches[0].clientX;
      const diffX = startXRef.current - currentX;
      if (Math.abs(diffX) > 10) {
        // Small threshold to detect horizontal scroll
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    // Touchend doesn't provide clientX, so we use the last known position or assume a quick tap
    // The previous touchmove might have already prevented default scrolling for longer swipes
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
    <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen flex items-center justify-center">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
        {/* Product Info & Highlights */}
        <div className="lg:col-span-2 text-center lg:text-left order-2 lg:order-1 p-6 bg-white rounded-3xl shadow-xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600">
            {heroProduct.name}
            <span className="block text-2xl sm:text-3xl font-normal text-gray-600 mt-2">
              ({heroProduct.nameJp})
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-6 text-justify">
            {heroProduct.description}
          </p>

          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Điểm nổi bật:
            </h3>
            <ul role="list" className="space-y-3 text-gray-700 text-lg">
              {heroProduct.highlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-pink-500 mr-3 flex-shrink-0 mt-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-6">
            <button className="px-8 py-4 bg-pink-600 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-pink-700 hover:shadow-xl transition duration-300 transform hover:scale-105 cursor-pointer">
              Mua Ngay
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-pink-600 text-pink-600 text-lg font-semibold rounded-full shadow-lg hover:bg-pink-600 hover:text-white transition duration-300 transform hover:scale-105 cursor-pointer">
              Tìm Hiểu Thêm
            </button>
          </div>
        </div>

        {/* Image Slider - with swipe events and slide transition */}
        <div
          ref={sliderRef}
          className="lg:col-span-1 order-1 lg:order-2 relative w-full h-[24rem] sm:h-[30rem] lg:h-[40rem] rounded-3xl overflow-hidden shadow-2xl"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex h-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {heroProduct.images.map((imgSrc, idx) => (
              <Image
                key={idx}
                src={imgSrc}
                alt={`${heroProduct.name} ${idx + 1}`}
                className="min-w-full h-full object-cover" // min-w-full ensures each image takes up 100% width of flex container
                onError={(e) => {
                  e.currentTarget.src = `https://placehold.co/1000x800/FF6347/FFFFFF?text=Lalalycheee+Vải+${
                    idx + 1
                  }`;
                }}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={goToPrevSlide}
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/50 hover:bg-white/75 p-2 rounded-full shadow-md text-gray-800 transition-colors duration-300"
            aria-label="Previous slide"
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
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/50 hover:bg-white/75 p-2 rounded-full shadow-md text-gray-800 transition-colors duration-300"
            aria-label="Next slide"
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {heroProduct.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? "bg-white w-6" : "bg-white/50"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
