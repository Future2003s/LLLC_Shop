"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import useTranslations from "@/i18n/useTranslations";
import {
  Leaf,
  ShoppingBag,
  Menu,
  X,
  Star,
  ChevronRight,
  ChevronLeft,
  ArrowUp,
  Heart,
  XCircle,
} from "lucide-react";

// --- TYPE DEFINITIONS (ĐỊNH NGHĨA KIỂU DỮ LIỆU) ---
type Product = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
  longDescription: string;
};

type Testimonial = {
  id: number;
  quote: string;
  author: string;
  role: string;
  avatarUrl: string;
};

type Slide = {
  id: number;
  imageUrl: string;
  title: React.ReactNode;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
};

type CollectionSlide = {
  id: number;
  imageUrl: string;
  title: string;
  category: string;
};

type Partner = {
  id: number;
  name: string;
  logoUrl: string;
};

type CraftStep = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
};

type Experience = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
};

// --- MOCK DATA (DỮ LIỆU MẪU VỚI ẢNH THỰC TẾ) ---
const heroSlides: Slide[] = [
  {
    id: 1,
    imageUrl:
      "https://res.cloudinary.com/duw5dconp/image/upload/v1752657773/banner_1_xqhehz.jpg",
    title: (
      <>
        {/* fallback title in case translation missing */}
        Tinh hoa từ <span className="text-rose-300">Trái Vải</span>
      </>
    ),
    subtitle:
      "Khám phá bộ sưu tập sản phẩm cao cấp được chế tác từ những trái vải tươi ngon và tinh khiết nhất.",
    ctaText: "Khám phá bộ sưu tập",
    ctaLink: "#products",
  },
  {
    id: 2,
    imageUrl:
      "https://res.cloudinary.com/duw5dconp/image/upload/v1752657773/banner_2_uswdjc.jpg",
    title: (
      <>
        {/* static fallback; text below will be overridden by t("home.hero_title") in render */}
        Bộ Sưu Tập <span className="text-rose-300">Quà Tặng Mới</span>
      </>
    ),
    subtitle: "Món quà ý nghĩa và sang trọng cho những người bạn trân quý.",
    ctaText: "Xem ngay",
    ctaLink: "#collections",
  },
  {
    id: 3,
    imageUrl:
      "https://res.cloudinary.com/duw5dconp/image/upload/v1752657773/banner_3_n36dif.jpg",
    title: (
      <>
        Trà Vải <span className="text-rose-300">Thượng Hạng</span>
      </>
    ),
    subtitle: "Trải nghiệm hương vị độc đáo, đánh thức mọi giác quan.",
    ctaText: "Thử ngay",
    ctaLink: "#products",
  },
  {
    id: 4,
    imageUrl:
      "https://res.cloudinary.com/duw5dconp/image/upload/v1752657773/banner_4_dmohbb.jpg",
    title: (
      <>
        Trà Vải <span className="text-rose-300">Thượng Hạng</span>
      </>
    ),
    subtitle: "Trải nghiệm hương vị độc đáo, đánh thức mọi giác quan.",
    ctaText: "Thử ngay",
    ctaLink: "#products",
  },
];

const featuredProducts: Product[] = [
  {
    id: 1,
    name: "Thu Hoạch Trái Vải Tươi",
    description: "Mọi người cùng nhau - vui vẻ thu hoạch.",
    imageUrl:
      "https://images.unsplash.com/photo-1659482633309-ccd1e316c592?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTZ8fGZydWl0c3xlbnwwfHwwfHx8MA%3D%3D",
    price: "120.000đ",
    longDescription:
      "Được ép lạnh từ những trái vải thiều căng mọng nhất, sản phẩm giữ trọn vị ngọt thanh và hàm lượng vitamin C dồi dào. Không thêm đường, không chất bảo quản, mang đến sự sảng khoái thuần khiết.",
  },
  {
    id: 2,
    name: "Thu Hoạch Trái Vải Tươi",
    description:
      "Sự kết hợp tinh tế giữa vị ngọt của vải và ánh sáng của mặt trời.",
    imageUrl:
      "https://images.unsplash.com/photo-1622219750989-f24af3d4a7ca?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTh8fGZydWl0c3xlbnwwfHwwfHx8MA%3D%3D",
    price: "95.000đ",
    longDescription:
      "Trà xanh thượng hạng được ướp hương hoa lài tự nhiên, hòa quyện cùng syrup vải đậm đà. Mỗi ngụm trà là một bản giao hưởng của hương và vị, giúp thư giãn tinh thần và thanh lọc cơ thể.",
  },
  {
    id: 3,
    name: "Mứt Vải Dẻo Cao Cấp",
    description: "Món quà ngọt ngào, đậm đà hương vị truyền thống.",
    imageUrl:
      "https://images.unsplash.com/photo-1623227866882-c005c26dfe41?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTE0fHxmcnVpdHN8ZW58MHx8MHx8fDA%3D",
    price: "180.000đ",
    longDescription:
      "Thịt vải được sên dẻo với đường phèn theo công thức bí truyền, giữ được độ dai mềm và vị ngọt đậm đà. Thích hợp dùng kèm trà chiều hoặc làm quà tặng ý nghĩa cho người thân.",
  },
];

const collectionSlides: CollectionSlide[] = [
  {
    id: 1,
    imageUrl:
      "https://res.cloudinary.com/duw5dconp/image/upload/v1752658344/DO_VAI_l6xevs.jpg",
    title: "Thu Hoạch Vải",
    category: "Năng lượng tích cực cùng mọi người thu hoạch.",
  },
  {
    id: 2,
    imageUrl:
      "https://res.cloudinary.com/duw5dconp/image/upload/v1752658344/HAI_VAI_sxr3qj.jpg",
    title: "Tinh Tế Trong Từng Công Đoạn",
    category: "Lựa chọn những trái vải tốt nhất.",
  },
  {
    id: 3,
    imageUrl:
      "https://res.cloudinary.com/duw5dconp/image/upload/v1752658345/HAI_VAI_ANH_NANG_naxaqz.jpg",
    title: "Kết Hợp Với Ánh Nắng Mặt Trời",
    category: "Phơi khô tự nhiên để giữ trọn hương vị.",
  },
  {
    id: 4,
    imageUrl:
      "https://res.cloudinary.com/duw5dconp/image/upload/v1752658344/THAM_VAI_eirspj.jpg",
    title: "Thành Quả Ngọt Ngào",
    category: "Những trái vải khô mọng, sẵn sàng để chế biến.",
  },
  {
    id: 5,
    imageUrl:
      "https://res.cloudinary.com/duw5dconp/image/upload/v1752658344/DO_VAI_2_j4boul.jpg",
    title: "Đóng Gói",
    category: "Sản phẩm được đóng gói tỉ mỉ và sang trọng.",
  },
];

const partners: Partner[] = [
  {
    id: 1,
    name: "Tomibun Market",
    logoUrl:
      "https://www.tomibun.vn/upload/img/products/06112021/untitled-1.png",
  },
  {
    id: 2,
    name: "EM HÀ NỘI",
    logoUrl:
      "https://www.emhanoi.com/wp-content/uploads/2022/12/%E8%B3%87%E7%94%A2-1.png",
  },
  {
    id: 3,
    name: "The Artistry",
    logoUrl:
      "https://placehold.co/200x100/f1f5f9/94a3b8?text=The+Artistry&font=serif",
  },
  {
    id: 4,
    name: "Elite Events",
    logoUrl:
      "https://placehold.co/200x100/f1f5f9/94a3b8?text=Elite+Events&font=serif",
  },
  {
    id: 5,
    name: "Vinpearl",
    logoUrl:
      "https://placehold.co/200x100/f1f5f9/94a3b8?text=Vinpearl&font=serif",
  },
  {
    id: 6,
    name: "Sofitel",
    logoUrl:
      "https://placehold.co/200x100/f1f5f9/94a3b8?text=Sofitel&font=serif",
  },
  {
    id: 7,
    name: "Golden Spoon",
    logoUrl:
      "https://placehold.co/200x100/f1f5f9/94a3b8?text=Golden+Spoon&font=serif",
  },
  {
    id: 8,
    name: "Prestige Gifts",
    logoUrl:
      "https://placehold.co/200x100/f1f5f9/94a3b8?text=Prestige+Gifts&font=serif",
  },
];

const craftSteps: CraftStep[] = [
  {
    id: 1,
    title: "Tuyển Chọn Tinh Tế",
    description:
      "Từng trái vải được lựa chọn thủ công từ những khu vườn đạt chuẩn, đảm bảo độ chín mọng và hương vị ngọt ngào nhất.",
    imageUrl:
      "https://images.unsplash.com/photo-1552010099-5dc86fcfaa38?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODB8fGZydWl0c3xlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 2,
    title: "Chế Biến Tỉ Mỉ",
    description:
      "Quy trình sản xuất khép kín, ứng dụng công nghệ hiện đại để giữ trọn vẹn dưỡng chất và hương vị tự nhiên của trái vải.",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1700145523324-1da4b9000d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODV8fGZydWl0c3xlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 3,
    title: "Đóng Gói Sang Trọng",
    description:
      "Mỗi sản phẩm là một tác phẩm nghệ thuật, được khoác lên mình bao bì đẳng cấp, tinh xảo trong từng chi tiết.",
    imageUrl:
      "https://images.unsplash.com/photo-1559181567-c3190ca9959b?q=80&w=800&auto=format&fit=crop",
  },
];

const experiences: Experience[] = [
  {
    id: 1,
    title: "Thanh Khiết",
    description:
      "Cảm nhận sự tinh khôi từ những trái vải tươi mọng, được chắt lọc để giữ trọn vị ngọt nguyên bản.",
    imageUrl:
      "https://media.istockphoto.com/id/1158353607/vi/anh/m%E1%BB%99t-l%C6%B0%E1%BB%A3ng-nh%E1%BB%8F-arbutus-v%E1%BB%9Bi-m%E1%BB%99t-chi%E1%BA%BFc-l%C3%A1-m%C3%A0u-xanh-l%C3%A1-c%C3%A2y-tr%C3%AAn-n%E1%BB%81n-tr%E1%BA%AFng.jpg?s=612x612&w=0&k=20&c=LXnz743K7zIWo7ZHpe6RUekc2bR2v23ypDmZThgMPVI=",
  },
  {
    id: 2,
    title: "Ngọt Ngào",
    description:
      "Hòa quyện trong hương vị đậm đà, đánh thức những ký ức và cảm xúc dịu êm nhất.",
    imageUrl:
      "https://media.istockphoto.com/id/1290982323/vi/anh/v%E1%BA%A3i-thi%E1%BB%81u-tr%C3%AAn-n%E1%BB%81n-tr%E1%BA%AFng.jpg?s=612x612&w=0&k=20&c=TA8uNYWCPF2LoSHq7vO2uGrYLGtIZdGwqEPxZQ5vJls=",
  },
  {
    id: 3,
    title: "Sang Trọng",
    description:
      "Một trải nghiệm đẳng cấp, nơi sự tinh tế trong hương vị và thiết kế được nâng tầm nghệ thuật.",
    imageUrl:
      "https://media.istockphoto.com/id/1306979829/vi/anh/m%E1%BB%99t-b%C3%B3-qu%E1%BA%A3-qu%E1%BA%A3-v%E1%BA%A3i-thi%E1%BB%81u-%C4%91%E1%BB%8F-v%C3%A0-l%C3%A1-xanh-%C4%91%C6%B0%E1%BB%A3c-c%C3%B4-l%E1%BA%ADp-tr%C3%AAn-n%E1%BB%81n-tr%E1%BA%AFng-ch%E1%BA%BFt-c%E1%BA%AFt-v%E1%BB%9Bi-%C4%91%C6%B0%E1%BB%9Dng-c%E1%BA%AFt.jpg?s=612x612&w=0&k=20&c=oZkeYelMiRsYbmGHy68wZ8hQDgTChVRU18eUMdFVi7Q=",
  },
];

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      "Sản phẩm của LALA-LYCHEE thực sự khác biệt. Vị ngọt thanh và hương thơm tự nhiên khiến tôi rất ấn tượng. Bao bì cũng rất sang trọng!",
    author: "Ngọc Anh",
    role: "Chuyên gia ẩm thực",
    avatarUrl: "https://placehold.co/100x100/fecdd3/44403c?text=NA&font=lora",
  },
  {
    id: 2,
    quote:
      "Tôi đã dùng trà vải của LALA-LYCHEE để tiếp đãi đối tác và họ rất thích. Một sản phẩm chất lượng, thể hiện được sự tinh tế của người tặng.",
    author: "Minh Tuấn",
    role: "Giám đốc Doanh nghiệp",
    avatarUrl: "https://placehold.co/100x100/fecdd3/44403c?text=MT&font=lora",
  },
  {
    id: 3,
    quote:
      "Chưa bao giờ tôi nghĩ một sản phẩm từ quả vải lại có thể tinh tế đến vậy. Chắc chắn sẽ ủng hộ LALA-LYCHEE dài dài.",
    author: "Phương Linh",
    role: "Blogger Du lịch",
    avatarUrl: "https://placehold.co/100x100/fecdd3/44403c?text=PL&font=lora",
  },
];

// --- UTILITY FUNCTIONS (HÀM TIỆN ÍCH) ---
const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.target as HTMLImageElement;
  target.onerror = null; // Prevent infinite loop if placeholder fails
  target.src = `https://placehold.co/600x400/fecdd3/44403c?text=Lỗi+Tải+Ảnh`;
};

// --- CUSTOM HOOKS (HOOKS TÙY CHỈNH) ---
const useScroll = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return isScrolled;
};

const useIntersectionObserver = (
  options: IntersectionObserverInit & { triggerOnce?: boolean }
) => {
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const [node, setNode] = useState<HTMLElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const { threshold, root, rootMargin, triggerOnce } = options;

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && triggerOnce) {
          observer.current?.unobserve(entry.target);
        }
        setEntry(entry);
      },
      { threshold, root, rootMargin }
    );

    const { current: currentObserver } = observer;
    if (node) currentObserver.observe(node);

    return () => currentObserver.disconnect();
  }, [node, threshold, root, rootMargin, triggerOnce]);

  return [setNode, entry] as const;
};

// --- UI COMPONENTS (CÁC THÀNH PHẦN GIAO DIỆN) ---

const FadeInWhenVisible: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [ref, entry] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  });
  const isVisible = entry?.isIntersecting;

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-in-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {children}
    </div>
  );
};

const InteractiveHeroSlider: React.FC = () => {
  const t = useTranslations();
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const SLIDE_DURATION = 5000; // 5 giây

  const resetTimeout = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % heroSlides.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + heroSlides.length) % heroSlides.length
    );
  }, []);

  useEffect(() => {
    resetTimeout();
    timerRef.current = setTimeout(handleNext, SLIDE_DURATION);
    return () => resetTimeout();
  }, [currentIndex, handleNext, resetTimeout]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleDragStart = (clientX: number) => {
    isDragging.current = true;
    dragStartX.current = clientX;
    resetTimeout();
    document.body.style.cursor = "grabbing";
  };

  const handleDragEnd = (clientX: number) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    document.body.style.cursor = "default";

    const dragDistance = dragStartX.current - clientX;
    if (dragDistance > 50) {
      handleNext();
    } else if (dragDistance < -50) {
      handlePrev();
    } else {
      // If not dragged far enough, restart timer
      timerRef.current = setTimeout(handleNext, SLIDE_DURATION);
    }
  };

  const handleMouseLeave = () => {
    if (isDragging.current) {
      isDragging.current = false;
      document.body.style.cursor = "default";
      timerRef.current = setTimeout(handleNext, SLIDE_DURATION);
    }
  };

  return (
    <section
      className="relative h-screen w-full overflow-hidden text-white cursor-grab active:cursor-grabbing"
      onMouseDown={(e) => handleDragStart(e.clientX)}
      onMouseUp={(e) => handleDragEnd(e.clientX)}
      onMouseLeave={handleMouseLeave}
      onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
      onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX)}
    >
      {/* Main Slides */}
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0"
          }`}
        >
          <div
            className={`absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-1000 ease-in-out ${
              index === currentIndex ? "animate-ken-burns" : ""
            }`}
            style={{ backgroundImage: `url(${slide.imageUrl})` }}
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      ))}

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 h-full flex flex-col justify-center items-center text-center md:items-start md:text-left pointer-events-none">
        <div className="max-w-2xl">
          <div className="overflow-hidden">
            <h1
              key={heroSlides[currentIndex].id}
              className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold animate-slide-up-text leading-tight"
            >
              {/* Prefer translation if present; else fallback to slide.title */}
              {t("home.hero_title") || heroSlides[currentIndex].title}
            </h1>
          </div>
          <div className="overflow-hidden">
            <p
              key={heroSlides[currentIndex].id + "-sub"}
              className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl max-w-xl animate-slide-up-text"
              style={{ animationDelay: "0.2s" }}
            >
              {t("home.hero_subtitle") || heroSlides[currentIndex].subtitle}
            </p>
          </div>
          <div className="overflow-hidden">
            <a
              href={heroSlides[currentIndex].ctaLink}
              key={heroSlides[currentIndex].id + "-cta"}
              className="mt-6 sm:mt-8 inline-block bg-white text-slate-800 font-bold px-6 sm:px-10 py-3 sm:py-4 rounded-full shadow-lg hover:bg-rose-100 transition-all duration-300 transform hover:scale-105 animate-slide-up-text pointer-events-auto text-sm sm:text-base"
              style={{ animationDelay: "0.4s" }}
            >
              {t("site.cta_explore") || heroSlides[currentIndex].ctaText}
            </a>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-0 left-0 right-0 z-30 p-3 sm:p-4 md:p-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
          {/* Thumbnails */}
          <div className="flex items-end gap-1 sm:gap-2 md:gap-3">
            {heroSlides.map((slide, index) => (
              <div
                key={slide.id}
                className="cursor-pointer group relative overflow-hidden rounded-md"
                onClick={(e) => {
                  e.stopPropagation();
                  goToSlide(index);
                }}
              >
                <img
                  src={slide.imageUrl}
                  alt={slide.subtitle}
                  className={`w-12 h-16 sm:w-16 sm:h-20 md:w-20 md:h-24 object-cover transition-all duration-300 ease-in-out ${
                    currentIndex === index
                      ? "sm:w-18 sm:h-22 md:w-24 md:h-32"
                      : "opacity-60 group-hover:opacity-100"
                  }`}
                />
                {currentIndex === index && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-white/30">
                    <div
                      key={currentIndex}
                      className="h-full bg-white animate-progress-bar"
                      style={{ animationDuration: `${SLIDE_DURATION}ms` }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Arrows & Counter */}
          <div className="flex items-center gap-4 md:gap-6">
            <span className="font-mono text-base md:text-lg">
              0{currentIndex + 1} / 0{heroSlides.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="p-3 border border-white/30 rounded-full hover:bg-white/20 transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="p-3 border border-white/30 rounded-full hover:bg-white/20 transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const MarqueeBannerSection: React.FC = () => {
  const bannerItems = [
    "100% Vải Tươi Tuyển Chọn",
    "Công Thức Độc Quyền",
    "Quà Tặng Sang Trọng",
    "Giao Hàng Toàn Quốc",
    "Chất Lượng Hàng Đầu",
  ];
  const marqueeContent = [...bannerItems, ...bannerItems];
  return (
    <section className="bg-rose-50 py-4 border-y border-rose-200/80">
      <div className="relative flex overflow-x-hidden text-rose-800">
        <div className="py-2 animate-marquee whitespace-nowrap flex items-center">
          {marqueeContent.map((item, index) => (
            <div key={index} className="flex items-center">
              <span className="text-base md:text-lg mx-8 font-serif">
                {item}
              </span>
              <Star size={16} className="text-rose-300 fill-current" />
            </div>
          ))}
        </div>
        <div className="absolute top-0 py-2 animate-marquee2 whitespace-nowrap flex items-center">
          {marqueeContent.map((item, index) => (
            <div key={index} className="flex items-center">
              <span className="text-base md:text-lg mx-8 font-serif">
                {item}
              </span>
              <Star size={16} className="text-rose-300 fill-current" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const InteractiveShowcaseSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      id="experience"
      className="relative min-h-screen bg-rose-50 py-24 flex items-center justify-center overflow-hidden"
    >
      <FadeInWhenVisible>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800">
              Trải Nghiệm LALA-LYCHEE
            </h2>
            <p className="mt-3 text-lg text-slate-500 max-w-2xl mx-auto">
              Mỗi sản phẩm là một câu chuyện, một cảm xúc. Hãy chọn trải nghiệm
              của riêng bạn.
            </p>
            <p className="mt-2 text-sm text-slate-400 italic">
              (Nhấp vào một trải nghiệm để xem hình ảnh)
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div
              className="relative w-full rounded-2xl overflow-hidden shadow-xl"
              style={{ paddingBottom: "125%" }}
            >
              {experiences.map((exp, index) => (
                <img
                  key={exp.id}
                  src={exp.imageUrl}
                  alt={exp.title}
                  onError={handleImageError}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                    activeIndex === index ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </div>
            <div className="flex flex-col items-start space-y-8">
              {experiences.map((exp, index) => (
                <div
                  key={exp.id}
                  onClick={() => setActiveIndex(index)}
                  className="cursor-pointer group w-full"
                >
                  <h3
                    className={`font-serif text-4xl md:text-5xl font-bold transition-colors duration-300 ${
                      activeIndex === index
                        ? "text-rose-500"
                        : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  >
                    {exp.title}
                  </h3>
                  <div className="relative h-0.5 mt-2 w-full bg-rose-200/50">
                    <div
                      className={`absolute top-0 left-0 h-full bg-rose-500 transition-all duration-500 ease-out ${
                        activeIndex === index
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      }`}
                    ></div>
                  </div>
                  <p
                    className={`mt-4 text-slate-600 max-w-sm transition-all duration-500 ease-in-out ${
                      activeIndex === index
                        ? "opacity-100 max-h-40"
                        : "opacity-0 max-h-0"
                    }`}
                  >
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeInWhenVisible>
    </section>
  );
};

const AboutSection: React.FC = () => {
  const t = useTranslations();

  return (
    <section id="about" className="py-24 bg-white">
      <FadeInWhenVisible>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
            <div className="rounded-lg overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGZydWl0c3xlbnwwfHwwfHx8MA%3D%3D"
                alt="Vườn vải LALA-LYCHEE"
                onError={handleImageError}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800">
                {t("site.about_title")}
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                LALA-LYCHEE ra đời từ niềm đam mê với trái vải - một loại quả
                đặc sản của Việt Nam. Chúng tôi tin rằng, đằng sau vị ngọt ngào
                ấy là cả một câu chuyện về văn hóa, về sự chăm sóc tỉ mỉ và về
                tinh hoa của đất trời.
              </p>
              <p className="mt-4 text-slate-600">
                Mỗi sản phẩm đều là một tác phẩm nghệ thuật, được tạo ra từ
                nguồn nguyên liệu tuyển chọn khắt khe và quy trình sản xuất hiện
                đại, nhằm mang đến cho bạn trải nghiệm vị giác đẳng cấp và trọn
                vẹn nhất.
              </p>
              <a
                href="#"
                className="mt-6 inline-flex items-center text-rose-600 font-bold group"
              >
                Tìm hiểu thêm
                <ChevronRight className="ml-1 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </FadeInWhenVisible>
    </section>
  );
};

const ProductQuickViewModal: React.FC<{
  product: Product | null;
  onClose: () => void;
}> = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden animate-slide-up-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full md:w-1/2 h-64 md:h-auto">
          <img
            src={product.imageUrl}
            alt={product.name}
            onError={handleImageError}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto">
          <h2 className="font-serif text-3xl font-bold text-slate-800">
            {product.name}
          </h2>
          <span className="text-2xl font-bold text-rose-500 my-4">
            {product.price}
          </span>
          <p className="text-slate-600 mb-6">{product.longDescription}</p>
          <div className="mt-auto pt-6 flex flex-col sm:flex-row gap-4">
            <button className="w-full bg-gradient-to-r from-rose-500 to-red-500 text-white font-bold px-6 py-4 rounded-full text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              Thêm vào giỏ hàng
            </button>
            <button
              onClick={onClose}
              className="w-full bg-slate-100 text-slate-700 font-bold px-6 py-4 rounded-full text-lg hover:bg-slate-200 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-rose-500 transition-colors"
        >
          <X size={28} />
        </button>
      </div>
    </div>
  );
};

const ProductCard: React.FC<{
  product: Product;
  onQuickViewClick: (product: Product) => void;
}> = ({ product, onQuickViewClick }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-all duration-300 hover:shadow-xl">
    <div className="relative overflow-hidden h-72">
      <img
        src={product.imageUrl}
        alt={product.name}
        onError={handleImageError}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <button
          onClick={() => onQuickViewClick(product)}
          className="bg-white text-rose-600 font-bold px-8 py-3 rounded-full shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 text-base hover:bg-rose-50"
        >
          Xem Nhanh
        </button>
      </div>
    </div>
    <div className="p-6 text-center">
      <h3 className="font-serif text-xl font-bold text-slate-800">
        {product.name}
      </h3>
      <p className="mt-2 text-slate-500 text-sm h-10">{product.description}</p>
      <div className="mt-4">
        <span className="text-lg font-bold text-rose-500">{product.price}</span>
      </div>
    </div>
  </div>
);

const FeaturedProductsSection: React.FC = () => {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );
  const t = useTranslations();

  return (
    <>
      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
      <section id="products" className="py-24 bg-rose-50/50">
        <FadeInWhenVisible>
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800">
                {t("site.featured_section")}
              </h2>
              <p className="mt-3 text-lg text-slate-500 max-w-2xl mx-auto">
                Những sáng tạo độc đáo từ LALA-LYCHEE, mang đến hương vị không
                thể nào quên.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickViewClick={setQuickViewProduct}
                />
              ))}
            </div>
          </div>
        </FadeInWhenVisible>
      </section>
    </>
  );
};

const CollectionSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <section id="collections" className="py-24 bg-white overflow-hidden">
      <FadeInWhenVisible>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-800">
              Bộ Sưu Tập Đặc Biệt
            </h2>
            <p className="mt-3 text-lg text-slate-500 max-w-2xl mx-auto">
              Khám phá những dòng sản phẩm độc đáo được sáng tạo dành riêng cho
              bạn.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Stack */}
            <div className="space-y-4">
              {collectionSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`p-6 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                    currentIndex === index
                      ? "bg-rose-50 border-rose-500 shadow-lg"
                      : "bg-slate-50 border-transparent hover:border-rose-200 hover:bg-white"
                  }`}
                  onClick={() => setCurrentIndex(index)}
                >
                  <p className="text-sm font-bold tracking-widest uppercase text-rose-400">
                    {slide.category}
                  </p>
                  <h3 className="text-2xl font-serif font-bold mt-1 text-slate-800">
                    {slide.title}
                  </h3>
                </div>
              ))}
            </div>

            {/* Right Column: Image Display */}
            <div className="relative w-full h-[600px] flex items-center justify-center">
              {collectionSlides.map((slide, index) => {
                return (
                  <div
                    key={slide.id}
                    className={`absolute w-full h-full transition-opacity duration-700 ease-in-out ${
                      currentIndex === index ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <img
                      src={slide.imageUrl}
                      alt={slide.title}
                      onError={handleImageError}
                      className="w-full h-full object-cover rounded-2xl shadow-2xl"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </FadeInWhenVisible>
    </section>
  );
};

const CardStackSection: React.FC = () => {
  const [cards, setCards] = useState(collectionSlides);
  const [dragInfo, setDragInfo] = useState({
    isDragging: false,
    startX: 0,
    currentX: 0,
  });
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(
    null
  );
  const [lastAction, setLastAction] = useState<string | null>(null);

  const handleSwipe = (direction: "left" | "right") => {
    setLastAction(
      direction === "right" ? "Đã thêm vào yêu thích" : "Đã bỏ qua"
    );
    setExitDirection(direction);
    setTimeout(() => {
      setCards((prev) => {
        const newCards = prev.slice(1);
        if (newCards.length === 0) {
          return collectionSlides;
        }
        return newCards;
      });
      setExitDirection(null);
    }, 300); // Match animation duration
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setDragInfo({ isDragging: true, startX: clientX, currentX: clientX });
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragInfo.isDragging) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setDragInfo((prev) => ({ ...prev, currentX: clientX }));
  };

  const handleDragEnd = () => {
    if (!dragInfo.isDragging) return;

    const deltaX = dragInfo.currentX - dragInfo.startX;
    if (Math.abs(deltaX) > 100) {
      // Swipe threshold
      handleSwipe(deltaX > 0 ? "right" : "left");
    }

    setDragInfo({ isDragging: false, startX: 0, currentX: 0 });
  };

  const topCardStyle = () => {
    if (exitDirection === "left")
      return {
        transform: "translateX(-120%) rotate(-18deg)",
        opacity: 0,
        willChange: "transform",
      };
    if (exitDirection === "right")
      return {
        transform: "translateX(120%) rotate(18deg)",
        opacity: 0,
        willChange: "transform",
      };

    if (dragInfo.isDragging) {
      const deltaX = dragInfo.currentX - dragInfo.startX;
      const rotation = deltaX / 20;
      return {
        transform: `translateX(${deltaX}px) rotate(${rotation}deg)`,
        transition: "none",
      };
    }
    return {};
  };

  const displayedCards = cards.slice(0, 3).reverse();

  // Derived values for visual feedback during drag
  const deltaX = dragInfo.isDragging ? dragInfo.currentX - dragInfo.startX : 0;
  const likeOpacity = Math.min(1, Math.max(0, deltaX / 140));
  const nopeOpacity = Math.min(1, Math.max(0, -deltaX / 140));

  return (
    <section id="card-stack" className="py-24 bg-rose-50/50 overflow-x-hidden">
      <style jsx>{`
        .card-shadow {
          box-shadow: 0 20px 60px -20px rgba(2, 6, 23, 0.35);
        }
        .ring-focus:focus-visible {
          outline: none;
          box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.45);
        }
        .swipe-badge {
          letter-spacing: 0.02em;
        }
      `}</style>
      <FadeInWhenVisible>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-800">
              Khám Phá Bộ Sưu Tập
            </h2>
            <p className="mt-3 text-lg text-slate-600 max-w-3xl mx-auto">
              Trượt nhẹ trên điện thoại hoặc dùng các nút bên dưới để khám phá
              những khung hình nổi bật nhất từ LALA‑LYCHEE.
            </p>
            <p className="mt-2 text-sm text-slate-400 max-w-2xl mx-auto hidden sm:block">
              Mẹo: Kéo sang trái để bỏ qua, kéo sang phải để thêm vào mục yêu
              thích.
            </p>
          </div>

          <div
            className="relative w-full max-w-md md:max-w-xl lg:max-w-2xl mx-auto h-[480px] md:h-[560px] cursor-grab active:cursor-grabbing overflow-hidden overscroll-contain rounded-3xl select-none touch-pan-y"
            role="region"
            aria-label="Bộ sưu tập dạng thẻ có thể kéo và vuốt"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") handleSwipe("left");
              if (e.key === "ArrowRight") handleSwipe("right");
            }}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          >
            {cards.length > 0 ? (
              displayedCards.map((card, index) => {
                const isTop = index === 0;
                return (
                  <div
                    key={card.id}
                    className="absolute w-full h-full rounded-2xl bg-white transition-all duration-300 ease-in-out card-shadow ring-focus"
                    style={
                      isTop
                        ? {
                            ...topCardStyle(),
                            zIndex: 10 - index,
                          }
                        : {
                            transform: `scale(${
                              1 - (index + 1) * 0.05
                            }) translateY(${(index + 1) * -10}px)`,
                            zIndex: 10 - index,
                            opacity: 1 - (index + 1) * 0.1,
                          }
                    }
                  >
                    <img
                      src={card.imageUrl}
                      alt={card.title}
                      className="w-full h-full object-cover rounded-2xl select-none"
                      draggable={false}
                      onError={handleImageError}
                    />
                    <div
                      className="absolute inset-0 rounded-2xl ring-1 ring-black/10"
                      aria-hidden
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-7 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-b-2xl text-white">
                      <h3 className="text-xl md:text-2xl font-bold font-serif drop-shadow">
                        {card.title}
                      </h3>
                      <p className="text-xs md:text-sm opacity-90">
                        {card.category}
                      </p>
                    </div>
                    {isTop && (
                      <>
                        <div
                          className="pointer-events-none absolute top-4 left-4 px-3 py-1 rounded-md border-2 border-rose-500 bg-rose-600/10 text-rose-600 font-semibold uppercase text-xs swipe-badge"
                          style={{
                            opacity: nopeOpacity,
                            transform: `rotate(-8deg)`,
                          }}
                          aria-hidden
                        >
                          Bỏ qua
                        </div>
                        <div
                          className="pointer-events-none absolute top-4 right-4 px-3 py-1 rounded-md border-2 border-emerald-500 bg-emerald-600/10 text-emerald-600 font-semibold uppercase text-xs swipe-badge"
                          style={{
                            opacity: likeOpacity,
                            transform: `rotate(8deg)`,
                          }}
                          aria-hidden
                        >
                          Yêu thích
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center text-slate-500">
                Đã xem hết! Bộ sưu tập sẽ được làm mới.
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-5 mt-8">
            <button
              onClick={() => handleSwipe("left")}
              aria-label="Bỏ qua"
              className="inline-flex items-center gap-2 bg-white/90 backdrop-blur rounded-full px-5 py-3 shadow-lg text-rose-700 hover:bg-rose-100 active:scale-95 transition will-change-transform ring-focus"
            >
              <XCircle size={22} />
              <span className="font-medium">Bỏ qua (←)</span>
            </button>
            <button
              onClick={() => handleSwipe("right")}
              aria-label="Yêu thích"
              className="inline-flex items-center gap-2 bg-white/90 backdrop-blur rounded-full px-5 py-3 shadow-lg text-emerald-600 hover:bg-emerald-100 active:scale-95 transition will-change-transform ring-focus"
            >
              <Heart size={22} />
              <span className="font-medium">Yêu thích (→)</span>
            </button>
          </div>

          {lastAction && (
            <div
              role="status"
              aria-live="polite"
              className="mt-4 text-center text-sm text-slate-500"
            >
              {lastAction}
            </div>
          )}
        </div>
      </FadeInWhenVisible>
    </section>
  );
};

const OurCraftSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <section id="craft" className="py-24 bg-rose-50/50">
      <FadeInWhenVisible>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-800">
              Quy Trình Sáng Tạo
            </h2>
            <p className="mt-3 text-lg text-slate-500 max-w-2xl mx-auto">
              Hành trình từ trái vải tươi ngon đến sản phẩm tinh hoa trên tay
              bạn.
            </p>
            <p className="mt-2 text-sm text-slate-400 italic">
              (Nhấp vào từng bước để xem chi tiết)
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-xl">
              {craftSteps.map((step, index) => (
                <img
                  key={step.id}
                  src={step.imageUrl}
                  alt={step.title}
                  onError={handleImageError}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                    index === activeIndex ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </div>
            <div className="flex flex-col space-y-4">
              {craftSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`group p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                    activeIndex === index
                      ? "bg-white shadow-lg"
                      : "bg-transparent hover:bg-white/50 hover:shadow-md"
                  }`}
                  onClick={() => setActiveIndex(index)}
                >
                  <div className="flex items-start">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mr-6 transition-colors flex-shrink-0 ${
                        activeIndex === index
                          ? "bg-rose-500 text-white"
                          : "bg-rose-200 text-rose-600 group-hover:bg-rose-300"
                      }`}
                    >
                      <span className="font-bold text-lg">{`0${
                        index + 1
                      }`}</span>
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-center">
                        <h3 className="font-serif text-2xl font-bold text-slate-800">
                          {step.title}
                        </h3>
                        <ChevronRight
                          className={`transition-transform duration-300 text-rose-400 group-hover:text-rose-600 ${
                            activeIndex === index ? "rotate-90" : ""
                          }`}
                        />
                      </div>
                      <div
                        className={`grid transition-all duration-500 ease-in-out ${
                          activeIndex === index
                            ? "grid-rows-[1fr] opacity-100 pt-1"
                            : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="text-slate-600">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeInWhenVisible>
    </section>
  );
};

const SocialProofSection: React.FC = () => {
  // Logic from TestimonialsSection
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const testimonialTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dragStartX = useRef(0);
  const isDragging = useRef(false);

  const nextTestimonial = useCallback(
    () =>
      setTestimonialIndex((prevIndex) => (prevIndex + 1) % testimonials.length),
    [testimonials.length]
  );

  const prevTestimonial = useCallback(
    () =>
      setTestimonialIndex(
        (prevIndex) =>
          (prevIndex - 1 + testimonials.length) % testimonials.length
      ),
    [testimonials.length]
  );

  const resetTestimonialTimeout = useCallback(() => {
    if (testimonialTimeoutRef.current)
      clearTimeout(testimonialTimeoutRef.current);
  }, []);

  useEffect(() => {
    resetTestimonialTimeout();
    testimonialTimeoutRef.current = setTimeout(nextTestimonial, 5000);
    return () => resetTestimonialTimeout();
  }, [testimonialIndex, nextTestimonial, resetTestimonialTimeout]);

  const handleDragStart = (clientX: number) => {
    resetTestimonialTimeout();
    isDragging.current = true;
    dragStartX.current = clientX;
  };

  const handleDragEnd = (clientX: number) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const dragDistance = dragStartX.current - clientX;
    if (dragDistance > 50) nextTestimonial();
    else if (dragDistance < -50) prevTestimonial();
    testimonialTimeoutRef.current = setTimeout(nextTestimonial, 5000);
  };

  const onMouseDown = (e: React.MouseEvent) => handleDragStart(e.clientX);
  const onTouchStart = (e: React.TouchEvent) =>
    handleDragStart(e.touches[0].clientX);
  const onMouseUp = (e: React.MouseEvent) => handleDragEnd(e.clientX);
  const onTouchEnd = (e: React.TouchEvent) =>
    handleDragEnd(e.changedTouches[0].clientX);

  const onMouseLeave = () => {
    if (isDragging.current) {
      isDragging.current = false;
      testimonialTimeoutRef.current = setTimeout(nextTestimonial, 5000);
    }
  };

  // Logic from PartnerCarouselSection
  const radius = 200;
  const angle = 360 / partners.length;

  return (
    <section id="social-proof" className="py-24 bg-rose-50/50">
      <FadeInWhenVisible>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-800">
              Sự Tin Tưởng Từ Cộng Đồng
            </h2>
            <p className="mt-3 text-lg text-slate-500 max-w-2xl mx-auto">
              Niềm vui của khách hàng và sự đồng hành của các thương hiệu uy tín
              là minh chứng cho chất lượng của chúng tôi.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Testimonials Column */}
            <div id="testimonials">
              <h3 className="font-serif text-2xl font-bold text-slate-700 text-center mb-8">
                Khách Hàng Nói Gì?
              </h3>
              <div
                className="relative max-w-md mx-auto h-80 cursor-grab active:cursor-grabbing"
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseLeave}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
              >
                {testimonials.map((testimonial, index) => (
                  <div
                    key={testimonial.id}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out select-none ${
                      index === testimonialIndex ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <div className="relative bg-white pt-16 pb-8 px-8 rounded-lg shadow-xl h-full flex flex-col justify-center border border-rose-100 pointer-events-none">
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                        <img
                          src={testimonial.avatarUrl}
                          alt={`Avatar của ${testimonial.author}`}
                          onError={handleImageError}
                          className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                        />
                      </div>
                      <div className="flex text-yellow-400 mb-4 justify-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} fill="currentColor" />
                        ))}
                      </div>
                      <p className="text-slate-600 italic text-center text-lg">
                        "{testimonial.quote}"
                      </p>
                      <div className="mt-4 text-center">
                        <p className="font-bold text-slate-800">
                          {testimonial.author}
                        </p>
                        <p className="text-sm text-slate-500">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={prevTestimonial}
                  className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow-md transition z-10"
                  aria-label="Đánh giá trước"
                >
                  <ChevronLeft className="text-slate-600" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow-md transition z-10"
                  aria-label="Đánh giá tiếp theo"
                >
                  <ChevronRight className="text-slate-600" />
                </button>
              </div>
            </div>
            {/* Partners Column */}
            <div id="partners" className="pt-10 lg:pt-0">
              <h3 className="font-serif text-2xl font-bold text-slate-700 text-center mb-12">
                Đối Tác Đồng Hành
              </h3>
              <div className="scene mx-auto h-[200px] w-[200px] flex items-center justify-center">
                <div className="carousel">
                  {partners.map((partner, index) => (
                    <div
                      key={partner.id}
                      className="carousel__cell"
                      style={{
                        transform: `rotateY(${
                          index * angle
                        }deg) translateZ(${radius}px)`,
                      }}
                    >
                      <img
                        src={partner.logoUrl}
                        alt={partner.name}
                        onError={handleImageError}
                        className="w-32 object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeInWhenVisible>
    </section>
  );
};

// const CtaSection: React.FC = () => (
//   <section id="contact" className="bg-rose-500">
//     <div className="container mx-auto px-6 py-20 text-center text-white">
//       <h2 className="font-serif text-3xl md:text-4xl font-bold">
//         Tham Gia Cộng Đồng LALA-LYCHEE
//       </h2>
//       <p className="mt-3 text-lg max-w-2xl mx-auto text-rose-100">
//         Đăng ký để nhận những ưu đãi độc quyền, thông tin sản phẩm mới và những
//         câu chuyện thú vị từ chúng tôi.
//       </p>
//       <form className="mt-8 max-w-md mx-auto flex flex-col sm:flex-row gap-4">
//         <input
//           type="email"
//           placeholder="Nhập email của bạn..."
//           className="w-full px-5 py-3 rounded-full text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white"
//           required
//         />
//         <button
//           type="submit"
//           className="bg-white text-rose-600 font-bold px-10 py-4 rounded-full shadow-lg hover:bg-rose-100 transition-all duration-300 whitespace-nowrap text-lg transform hover:scale-105"
//         >
//           Đăng Ký
//         </button>
//       </form>
//     </div>
//   </section>
// );

const CursorEffect: React.FC = () => {
  const [points, setPoints] = useState<{ x: number; y: number; id: number }[]>(
    []
  );
  const nextId = useRef(0);

  const addPoint = useCallback((x: number, y: number) => {
    const newPoint = { x, y, id: nextId.current++ };
    setPoints((prevPoints) => [...prevPoints, newPoint]);
    setTimeout(() => {
      setPoints((prevPoints) => prevPoints.filter((p) => p.id !== newPoint.id));
    }, 500);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      addPoint(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        addPoint(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [addPoint]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[200] h-screen w-screen overflow-hidden">
      {points.map((point) => (
        <div
          key={point.id}
          className="absolute w-2 h-2 bg-rose-300 rounded-full animate-cursor-sparkle"
          style={{ left: point.x - 4, top: point.y - 4 }}
        />
      ))}
    </div>
  );
};

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 bg-rose-500 text-white p-3 rounded-full shadow-lg hover:bg-rose-600 transition-all duration-300 z-50 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      aria-label="Lên đầu trang"
    >
      <ArrowUp size={24} />
    </button>
  );
};

// --- MAIN APP COMPONENT (COMPONENT CHÍNH) ---
export default function App() {
  const t = useTranslations();
  return (
    <>
      <style>{`
        /* Global font styles */
        body {
            font-family: 'Inter', sans-serif;
            scroll-behavior: smooth;
        }
        .font-serif {
            font-family: 'Lora', serif;
        }

        /* Marquee animation */
        @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-100%); } }
        @keyframes marquee2 { 0% { transform: translateX(100%); } 100% { transform: translateX(0%); } }
        .animate-marquee { animation: marquee 40s linear infinite; }
        .animate-marquee2 { animation: marquee2 40s linear infinite; }
        .group:hover .animate-marquee, .group:hover .animate-marquee2 { animation-play-state: paused; }

        /* Coverflow slider perspective */
        .coverflow-container { perspective: 1200px; }

        /* 3D Partner Carousel */
        .scene { perspective: 1000px; }
        .carousel {
            width: 100%;
            height: 100%;
            position: absolute;
            transform-style: preserve-3d;
            animation: rotate-carousel 25s linear infinite;
        }
        .scene:hover .carousel { animation-play-state: paused; }
        .carousel__cell {
            position: absolute;
            width: 200px;
            height: 100px;
            left: 0;
            top: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(241, 245, 249, 0.8);
            border-radius: 0.5rem;
            border: 1px solid rgba(226, 232, 240, 1);
        }
        @keyframes rotate-carousel {
            from { transform: rotateY(0deg); }
            to { transform: rotateY(360deg); }
        }

        /* Hero Slider Animations */
        @keyframes ken-burns {
            0% { transform: scale(1.05); }
            100% { transform: scale(1.15); }
        }
        .animate-ken-burns {
            animation: ken-burns 7s ease-out forwards;
        }
        @keyframes slide-up-text {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up-text {
            animation: slide-up-text 1s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        @keyframes progress-bar {
            from { width: 0%; }
            to { width: 100%; }
        }
        .animate-progress-bar {
            animation-name: progress-bar;
            animation-timing-function: linear;
            animation-fill-mode: forwards;
        }

        /* Cursor Effect Animation */
        @keyframes cursor-sparkle {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(2); opacity: 0; }
        }
        .animate-cursor-sparkle {
            animation: cursor-sparkle 0.5s forwards ease-out;
        }

        /* Quick View Modal Animations */
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
        }
        @keyframes slide-up-modal {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up-modal {
            animation: slide-up-modal 0.4s ease-out forwards;
        }
      `}</style>
      <div className="bg-white font-sans antialiased">
        <CursorEffect />
        <main>
          <InteractiveHeroSlider />
          <div className="group">
            <MarqueeBannerSection />
          </div>
          <InteractiveShowcaseSection />
          <SocialProofSection />
          <AboutSection />
          <FeaturedProductsSection />
          <CardStackSection />
          <CollectionSection />
          <OurCraftSection />
          {/* <CtaSection /> */}
          <div className="w-full h-full flex justify-around items-center rounded-lg">
            <div></div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d328.8131806159285!2d106.49132371003373!3d20.810141254928457!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x437742396b4f2dcd%3A0xd03a9e098934bdcf!2sLALA-LYCHEEE!5e1!3m2!1svi!2s!4v1755225875310!5m2!1svi!2s"
              className="rounded-lg"
              width="600"
              height="450"
              style={{ border: "0" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </main>

        <ScrollToTopButton />
      </div>
    </>
  );
}
