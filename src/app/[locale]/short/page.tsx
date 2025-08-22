"use client";
import React, { useRef, useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  ChevronUp,
  ChevronDown,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";

// Giả lập các component từ project của bạn
const HeroSection = () => (
  <div className="p-16 text-center bg-red-100 rounded-2xl">Hero Section</div>
);

// =======================================================================
// === BẮT ĐẦU: MÃ NGUỒN CHO GIAO DIỆN CUỘN VIDEO (TIKTOK FEED) ===
// =======================================================================

// Định nghĩa kiểu dữ liệu cho một video
interface MockVideo {
  id: number;
  username: string;
  description: string;
  likes: string;
  comments: string;
  shares: string;
  videoSrc: string;
}

// Dữ liệu người dùng và mô tả
const userAndDescData = [
  {
    id: 1,
    username: "@vaithieulucngan",
    description:
      "Vải thiều Lục Ngạn chính gốc, mọng nước, ngọt thơm! #vaithieu #lucngan",
    likes: "1.2M",
    comments: "45.3K",
    shares: "20.1K",
  },
  {
    id: 2,
    username: "@dacsanviet",
    description: "Khám phá đặc sản Việt Nam cùng chúng tôi. #amthucviet",
    likes: "890K",
    comments: "22.7K",
    shares: "15.9K",
  },
  {
    id: 3,
    username: "@nongsanxanh",
    description:
      "Nông sản sạch từ trang trại đến bàn ăn. #organic #healthyfood",
    likes: "2.5M",
    comments: "102K",
    shares: "88.4K",
  },
  {
    id: 4,
    username: "@madeinvietnam",
    description: "Tự hào hàng Việt Nam chất lượng cao. #vietnam",
    likes: "950K",
    comments: "30.1K",
    shares: "18.2K",
  },
];

// Nguồn video
const videoSources = [
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
];

// Kết hợp dữ liệu để tạo danh sách video
const mockVideos: MockVideo[] = userAndDescData.map((data, index) => ({
  ...data,
  videoSrc: videoSources[index % videoSources.length],
}));

// Thành phần VideoItem để hiển thị từng video
const VideoItem: React.FC<{ video: MockVideo; isVisible: boolean }> = ({
  video,
  isVisible,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isVisible) {
      videoElement
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      videoElement.pause();
      videoElement.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isVisible]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsMuted((prev) => !prev);
  };

  return (
    <div
      className="relative w-full h-full bg-black flex items-center justify-center"
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={video.videoSrc}
        loop
        playsInline
        className="w-full h-full object-cover"
      />
      {!isPlaying && isVisible && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Play
            size={80}
            className="text-white text-opacity-70 drop-shadow-lg"
            fill="currentColor"
          />
        </div>
      )}
      <div className="absolute top-5 right-5 z-20">
        <button
          onClick={toggleMute}
          className="w-10 h-10 flex items-center justify-center bg-black bg-opacity-50 rounded-full text-white"
          aria-label={isMuted ? "Bật tiếng" : "Tắt tiếng"}
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      </div>
      <div className="absolute bottom-0 left-0 p-4 md:p-6 text-white z-20 w-full pointer-events-none">
        <div className="flex justify-between items-end">
          <div className="max-w-[70%]">
            <h3 className="font-bold text-lg">@{video.username}</h3>
            <p className="text-sm mt-1">{video.description}</p>
          </div>
          <div className="flex flex-col items-center space-y-4 pointer-events-auto">
            <button className="flex flex-col items-center group">
              <div className="w-12 h-12 flex items-center justify-center bg-gray-800 bg-opacity-50 rounded-full transition-transform transform group-hover:scale-110">
                <Heart size={28} />
              </div>
              <span className="text-xs font-semibold mt-1">{video.likes}</span>
            </button>
            <button className="flex flex-col items-center group">
              <div className="w-12 h-12 flex items-center justify-center bg-gray-800 bg-opacity-50 rounded-full transition-transform transform group-hover:scale-110">
                <MessageCircle size={28} />
              </div>
              <span className="text-xs font-semibold mt-1">
                {video.comments}
              </span>
            </button>
            <button className="flex flex-col items-center group">
              <div className="w-12 h-12 flex items-center justify-center bg-gray-800 bg-opacity-50 rounded-full transition-transform transform group-hover:scale-110">
                <Share2 size={28} />
              </div>
              <span className="text-xs font-semibold mt-1">{video.shares}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Thành phần Giao diện cuộn video
const TiktokFeed: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Không cần videoRefs nữa khi sử dụng `scrollTo`
  const [currentIndex, setCurrentIndex] = useState(0);

  // FIX: Thay thế `scrollIntoView` bằng `scrollTo` để cuộn mượt hơn và chính xác hơn.
  // Hàm này giờ sẽ tính toán vị trí `scrollTop` và áp dụng trực tiếp cho container.
  const scrollToVideo = (index: number) => {
    const container = containerRef.current;
    if (container && index >= 0 && index < mockVideos.length) {
      const videoHeight = container.clientHeight;
      container.scrollTo({
        top: index * videoHeight,
        behavior: "smooth",
      });
      // Cập nhật chỉ số ngay lập tức để UI (nút bị vô hiệu hóa) phản ứng nhanh.
      setCurrentIndex(index);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const newIndex = Math.round(
          container.scrollTop / container.clientHeight
        );
        if (newIndex !== currentIndex) setCurrentIndex(newIndex);
      }, 150);
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [currentIndex]);

  return (
    <div className="flex items-center justify-center gap-4">
      <div className="relative h-[85vh] w-[420px] max-w-full max-h-[900px] rounded-2xl shadow-2xl overflow-hidden">
        <main
          ref={containerRef}
          className="h-full w-full overflow-y-scroll snap-y snap-mandatory relative bg-black"
        >
          {/* Không cần ref cho mỗi item video nữa */}
          {mockVideos.map((video, index) => (
            <div
              key={video.id}
              className="h-full w-full snap-start flex-shrink-0"
            >
              <VideoItem video={video} isVisible={currentIndex === index} />
            </div>
          ))}
        </main>
      </div>
      <div className="flex-col space-y-4 hidden md:flex">
        <button
          onClick={() => scrollToVideo(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-md rounded-full flex items-center justify-center text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:bg-opacity-30"
          aria-label="Video trước"
        >
          <ChevronUp size={24} />
        </button>
        <button
          onClick={() => scrollToVideo(currentIndex + 1)}
          disabled={currentIndex === mockVideos.length - 1}
          className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-md rounded-full flex items-center justify-center text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:bg-opacity-30"
          aria-label="Video tiếp theo"
        >
          <ChevronDown size={24} />
        </button>
      </div>
    </div>
  );
};

// =======================================================================
// === KẾT THÚC: MÃ NGUỒN CHO GIAO DIỆN CUỘN VIDEO (TIKTOK FEED) ===
// =======================================================================

// Component trang chủ chính đã được tích hợp
export default function HomePage() {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen font-sans antialiased text-gray-800">
      <article className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 space-y-16 sm:space-y-24 lg:space-y-32">
        {/* --- PHẦN TÍCH HỢP VIDEO MỚI --- */}
        <section className="container mx-auto p-6 sm:p-8 lg:p-12 bg-gray-900 rounded-3xl shadow-2xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white">
              Trải nghiệm Video
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Cuộn để xem các video nổi bật về sản phẩm của chúng tôi.
            </p>
          </div>
          <TiktokFeed />
        </section>
      </article>

      {/* Các kiểu CSS cần thiết cho Giao diện cuộn video */}
      <style>
        {`
          .snap-y {
              scrollbar-width: none; /* Firefox */
              -ms-overflow-style: none; /* IE 10+ */
          }
          .snap-y::-webkit-scrollbar {
              display: none; /* Safari, Chrome */
          }
        `}
      </style>
    </div>
  );
}
