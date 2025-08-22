"use client";
import React, { useState, useEffect } from "react";

//============================================================================
// HELPER HOOK - Simplified for better performance
//============================================================================
const useAnimateOnScroll = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            entry.target.classList.remove("opacity-0");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const elements = document.querySelectorAll(".scroll-animate");
    elements.forEach((el) => observer.observe(el));
    return () => elements.forEach((el) => observer.unobserve(el));
  }, []);
};

//============================================================================
// CÁC SECTION CỦA TRANG
//============================================================================

/**
 * HERO SECTION - Enterprise-grade design
 * Professional, sophisticated with strong visual hierarchy
 */
const HeroSection = () => (
  <section className="relative bg-white py-20 md:py-32 overflow-hidden">
    {/* Background Pattern */}
    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50"></div>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]"></div>

    <div className="relative container mx-auto px-6 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Content */}
        <div className="scroll-animate opacity-0">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-full mb-8">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Công ty hàng đầu về nông sản bền vững
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Định hình tương lai
            <span className="block text-blue-600">nông nghiệp Việt Nam</span>
          </h1>

          <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-xl">
            Chúng tôi kết nối tinh hoa nông sản Việt với thị trường toàn cầu,
            tạo ra giá trị bền vững cho nông dân và cộng đồng.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg">
              Khám phá sản phẩm
            </button>
            <button className="px-8 py-4 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-colors">
              Tìm hiểu thêm
            </button>
          </div>
        </div>

        {/* Visual */}
        <div className="scroll-animate opacity-0 lg:order-last">
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl p-8 shadow-xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="text-3xl mb-2">🌱</div>
                  <div className="text-2xl font-bold text-slate-900">500+</div>
                  <div className="text-sm text-slate-600">Nông dân đối tác</div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="text-3xl mb-2">🏆</div>
                  <div className="text-2xl font-bold text-slate-900">15+</div>
                  <div className="text-sm text-slate-600">Giải thưởng</div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="text-3xl mb-2">🌍</div>
                  <div className="text-2xl font-bold text-slate-900">25+</div>
                  <div className="text-sm text-slate-600">Quốc gia</div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="text-3xl mb-2">💚</div>
                  <div className="text-2xl font-bold text-slate-900">100%</div>
                  <div className="text-sm text-slate-600">Bền vững</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/**
 * COMPANY OVERVIEW - Enterprise timeline with professional styling
 */
const CompanyOverviewSection = () => {
  const milestones = [
    {
      year: "2018",
      title: "Thành lập công ty",
      subtitle: "Khởi đầu từ niềm đam mê",
      description:
        "CÔNG TY TNHH LALA - LYCHEEE được thành lập với tầm nhìn kết nối tinh hoa nông sản Việt Nam với thị trường toàn cầu, khởi nguồn từ trái vải thiều Thanh Hà.",
      stats: "1 sản phẩm đầu tiên",
    },
    {
      year: "2020",
      title: "Mở rộng quy mô",
      subtitle: "Phát triển bền vững",
      description:
        "Mở rộng mạng lưới đối tác nông dân, áp dụng công nghệ hiện đại trong quy trình sản xuất và kiểm soát chất lượng, đạt chứng nhận quốc tế.",
      stats: "500+ nông dân đối tác",
    },
    {
      year: "2024",
      title: "Dẫn đầu thị trường",
      subtitle: "Tầm nhìn toàn cầu",
      description:
        "Trở thành công ty hàng đầu trong lĩnh vực nông sản bền vững, xuất khẩu ra 25+ quốc gia, nhận được nhiều giải thưởng uy tín về phát triển bền vững.",
      stats: "25+ quốc gia",
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-slate-50">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-20 scroll-animate opacity-0">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Hành Trình Phát Triển
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Từ một ý tưởng đơn giản đến công ty hàng đầu trong lĩnh vực nông sản
            bền vững
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-blue-200 via-blue-400 to-blue-600 hidden lg:block"></div>

          <div className="space-y-16">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`scroll-animate opacity-0 flex items-center ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Content */}
                <div className="lg:w-5/12">
                  <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200 hover:shadow-2xl transition-shadow duration-300">
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                        {milestone.year}
                      </div>
                      <div className="ml-4 text-blue-600 font-semibold text-sm">
                        {milestone.stats}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      {milestone.title}
                    </h3>
                    <h4 className="text-lg text-blue-600 font-semibold mb-4">
                      {milestone.subtitle}
                    </h4>
                    <p className="text-slate-600 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>

                {/* Timeline dot */}
                <div className="hidden lg:flex lg:w-2/12 justify-center">
                  <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
                </div>

                {/* Spacer */}
                <div className="lg:w-5/12"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * CORE VALUES - Enterprise-grade presentation
 */
const CoreValuesSection = () => {
  const values = [
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Chất Lượng Vượt Trội",
      description:
        "Áp dụng tiêu chuẩn quốc tế ISO 9001:2015 và quy trình kiểm soát chất lượng 6-sigma trong toàn bộ chuỗi sản xuất.",
      metrics: "99.8% đạt chuẩn",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
      title: "Phát Triển Bền Vững",
      description:
        "Cam kết Net Zero 2030, sử dụng 100% năng lượng tái tạo và giảm 50% lượng khí thải carbon so với 2020.",
      metrics: "Carbon neutral",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: "Đổi Mới Sáng Tạo",
      description:
        "Đầu tư 15% doanh thu vào R&D, hợp tác với 5+ trường đại học hàng đầu để phát triển công nghệ tiên tiến.",
      metrics: "25+ bằng sáng chế",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: "Trách Nhiệm Xã Hội",
      description:
        "Tạo việc làm cho 2,000+ lao động, nâng cao thu nhập nông dân 300% và đóng góp 5% lợi nhuận cho cộng đồng.",
      metrics: "2,000+ việc làm",
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-20 scroll-animate opacity-0">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Giá Trị Cốt Lõi
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Những nguyên tắc định hướng và cam kết không thể thay đổi trong mọi
            hoạt động kinh doanh
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="scroll-animate opacity-0 group"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-8 h-full hover:shadow-xl hover:border-blue-200 transition-all duration-300 group-hover:-translate-y-1">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-xl flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                      {value.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-slate-900">
                        {value.title}
                      </h3>
                      <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        {value.metrics}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * DESIGN PHILOSOPHY SECTION - Two-column layout with clean typography
 */
const DesignSection = () => (
  <section className="py-16 md:py-24 bg-white">
    <div className="container mx-auto px-4 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="scroll-animate opacity-0">
          <h2 className="text-3xl md:text-4xl font-normal text-gray-900 mb-6">
            Thiết Kế Từ Thiên Nhiên
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Triết lý thiết kế của chúng tôi là sự giao thoa giữa vẻ đẹp mộc mạc
            của tự nhiên và nét tinh tế của thẩm mỹ hiện đại.
          </p>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Cảm Hứng Tự Nhiên
                </h4>
                <p className="text-gray-600">
                  Màu sắc, hoa văn và chất liệu đều được lấy cảm hứng từ cây
                  vải, trái vải - từ sắc hồng của vỏ đến sự mềm mại của thớ vải.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Tối Giản & Tinh Tế
                </h4>
                <p className="text-gray-600">
                  Chúng tôi tập trung vào sự tối giản trong thiết kế để tôn vinh
                  vẻ đẹp nguyên bản của nguyên liệu.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Công Năng & Bền Vững
                </h4>
                <p className="text-gray-600">
                  Mọi sản phẩm không chỉ đẹp mà còn mang tính ứng dụng cao, được
                  tạo ra từ quy trình thân thiện với môi trường.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="scroll-animate opacity-0">
          <div className="bg-gray-100 rounded-2xl p-8 h-96 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-6xl mb-4">🎨</div>
              <p className="text-lg">Design Inspiration</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/**
 * IMPACT SECTION - Clean two-column layout
 */
const ImpactSection = () => (
  <section className="py-16 md:py-24 bg-gray-50">
    <div className="container mx-auto px-4 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="scroll-animate opacity-0">
          <h2 className="text-3xl md:text-4xl font-normal text-gray-900 mb-6">
            Tác Động & Cam Kết
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Chúng tôi không chỉ mang đến sản phẩm, mà còn là một phần của chuỗi
            giá trị bền vững.
          </p>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Phát Triển Nông Nghiệp Địa Phương
                </h4>
                <p className="text-gray-600">
                  Tạo nguồn thu nhập ổn định cho nông dân và phát triển cộng
                  đồng.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Bảo Vệ Môi Trường
                </h4>
                <p className="text-gray-600">
                  Giảm thiểu rác thải nông nghiệp bằng cách tận dụng mọi bộ phận
                  của cây vải.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Nâng Cao Nhận Thức
                </h4>
                <p className="text-gray-600">
                  Lan tỏa thông điệp về tiêu dùng bền vững và vật liệu thân
                  thiện môi trường.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="scroll-animate opacity-0 lg:order-last">
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 h-96 flex items-center justify-center">
            <div className="text-center text-gray-600">
              <div className="text-6xl mb-4">🌱</div>
              <p className="text-lg">Sustainable Impact</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/**
 * VIDEO SECTION - Simplified with better spacing
 */
const VideoSection = () => (
  <section className="py-16 md:py-24 bg-white">
    <div className="container mx-auto px-4 max-w-4xl text-center">
      <div className="scroll-animate opacity-0 mb-12">
        <h2 className="text-3xl md:text-4xl font-normal text-gray-900 mb-4">
          Tìm Hiểu Thêm
        </h2>
        <p className="text-gray-600">
          Khám phá câu chuyện về vải thiều Thanh Hà
        </p>
      </div>
      <div className="scroll-animate opacity-0">
        <div className="bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
          <div className="relative" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/Rk0E8dK32j0?si=xXvD3x70x0xX_z-Y"
              title="Giới thiệu về Vải Thiều Thanh Hà"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/**
 * CALL TO ACTION SECTION - Enterprise partnership focus
 */
const CallToActionSection = () => (
  <section className="py-20 md:py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
    {/* Background Pattern */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.1),transparent_50%)]"></div>

    <div className="relative container mx-auto px-6 max-w-6xl">
      <div className="text-center scroll-animate opacity-0">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
          Hợp Tác Cùng Chúng Tôi
        </h2>
        <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Tham gia cùng hơn 500 đối tác toàn cầu trong hành trình xây dựng tương
          lai bền vững cho nông nghiệp Việt Nam
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">24/7</div>
            <div className="text-slate-300">Hỗ trợ khách hàng</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">48h</div>
            <div className="text-slate-300">Thời gian phản hồi</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">99.9%</div>
            <div className="text-slate-300">Độ tin cậy dịch vụ</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-xl">
            Khám Phá Sản Phẩm
          </button>
          <button className="px-8 py-4 bg-transparent border-2 border-slate-400 text-white font-semibold rounded-lg hover:bg-white hover:text-slate-900 transition-colors">
            Liên Hệ Đối Tác
          </button>
          <button className="px-8 py-4 bg-transparent border-2 border-slate-400 text-white font-semibold rounded-lg hover:bg-white hover:text-slate-900 transition-colors">
            Tải Brochure
          </button>
        </div>
      </div>
    </div>
  </section>
);

//============================================================================
// MAIN COMPONENT - Google Material Design inspired
//============================================================================
export default function AboutUsPage() {
  useAnimateOnScroll();

  return (
    <div className="bg-white min-h-screen">
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-in {
          animation: slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .scroll-animate {
          transition: all 0.3s ease;
        }
      `}</style>

      <main>
        <HeroSection />
        <CompanyOverviewSection />
        <CoreValuesSection />
        <DesignSection />
        <ImpactSection />
        <VideoSection />
        <CallToActionSection />
      </main>
    </div>
  );
}
