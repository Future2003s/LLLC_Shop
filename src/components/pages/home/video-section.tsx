"use client";
import React, { useState } from "react";

function VideoSection() {
  const [playVideo, setPlayVideo] = useState(false);
  const videoId = "zZaav6omxko"; // Thay thế bằng ID video của bạn
  const startTime = 337;

  return (
    <section className="py-20 bg-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 scroll-animate opacity-0">
          <h2 className="text-4xl font-extrabold text-gray-800">
            Hành Trình Của Trái Vải
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Cùng xem quy trình chăm sóc và thu hoạch để tạo ra sản phẩm chất
            lượng.
          </p>
        </div>
        <div
          className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl relative aspect-video cursor-pointer group scroll-animate opacity-0"
          onClick={() => setPlayVideo(true)}
        >
          {playVideo ? (
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?si=ripNjVylKCrxDxm-&amp;start=${startTime}&autoplay=1`}
              title="Giới thiệu về Vải Thiều Thanh Hà"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          ) : (
            <>
              <img
                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                alt="Video Thumbnail"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:bg-black/20"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-20 h-20 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <svg
                    className="w-10 h-10 text-white ml-1"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default VideoSection;
