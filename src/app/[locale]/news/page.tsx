import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidLocale } from "@/i18n/config";

//============================================================================
// HERO SECTION
//============================================================================
const HeroSection = () => (
  <section className="relative bg-white py-16 md:py-24 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50"></div>

    <div className="relative container mx-auto px-6 max-w-7xl">
      <div className="text-center">
        <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-full mb-8">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          Tin tức & Thông tin ngành
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Trung tâm
          <span className="block text-blue-600">Tin tức & Nghiên cứu</span>
        </h1>

        <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-3xl mx-auto">
          Cập nhật những xu hướng mới nhất trong ngành nông nghiệp bền vững,
          nghiên cứu khoa học và thông tin thị trường toàn cầu
        </p>
      </div>
    </div>
  </section>
);

//============================================================================
// FEATURED ARTICLE SECTION
//============================================================================
const FeaturedArticleSection = ({ locale }: { locale: string }) => {
  const featuredArticle = {
    id: 1,
    title:
      "Breakthrough trong công nghệ chế biến vải thiều: Tăng giá trị xuất khẩu 300%",
    excerpt:
      "Nghiên cứu mới của chúng tôi đã phát triển thành công quy trình chế biến vải thiều tiên tiến, giúp nâng cao chất lượng sản phẩm và mở rộng thị trường xuất khẩu.",
    author: "Dr. Nguyễn Minh Hạnh",
    role: "Giám đốc R&D",
    date: "15 Tháng 8, 2024",
    readTime: "8 phút đọc",
    category: "Nghiên cứu & Phát triển",
    categoryColor: "blue",
    tags: ["Công nghệ", "Xuất khẩu", "R&D"],
    featured: true,
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="scroll-animate animate-in">
          <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Image */}
              <div className="relative h-64 lg:h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                  <div className="text-center text-slate-600">
                    <div className="text-6xl mb-4">📰</div>
                    <p className="text-lg">Featured Article Image</p>
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Bài viết nổi bật
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 lg:p-12">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {featuredArticle.category}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600 text-sm">
                    {featuredArticle.readTime}
                  </span>
                </div>

                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4 leading-tight">
                  {featuredArticle.title}
                </h2>

                <p className="text-slate-600 mb-6 leading-relaxed">
                  {featuredArticle.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {featuredArticle.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">
                        {featuredArticle.author}
                      </div>
                      <div className="text-sm text-slate-600">
                        {featuredArticle.role}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-slate-600">
                      {featuredArticle.date}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <a
                    href={`/${locale}/news/${featuredArticle.id}`}
                    className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Đọc toàn bộ bài viết
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

//============================================================================
// NEWS CATEGORIES SECTION
//============================================================================
const NewsCategoriesSection = () => {
  const categories = [
    {
      id: 1,
      name: "Nghiên cứu & Phát triển",
      description: "Những đột phá khoa học và công nghệ mới nhất",
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
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
      count: 24,
      color: "blue",
    },
    {
      id: 2,
      name: "Thị trường & Xuất khẩu",
      description: "Phân tích thị trường và cơ hội kinh doanh",
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
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
      count: 18,
      color: "green",
    },
    {
      id: 3,
      name: "Bền vững & Môi trường",
      description: "Cam kết phát triển bền vững và bảo vệ môi trường",
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
      count: 15,
      color: "emerald",
    },
    {
      id: 4,
      name: "Đối tác & Cộng đồng",
      description: "Tin tức về đối tác và hoạt động cộng đồng",
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
      count: 12,
      color: "purple",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100",
      green: "bg-green-50 text-green-600 border-green-200 hover:bg-green-100",
      emerald:
        "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100",
      purple:
        "bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16 scroll-animate animate-in">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Danh Mục Tin Tức
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Khám phá các chủ đề đa dạng từ nghiên cứu khoa học đến phát triển
            bền vững
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="scroll-animate animate-in group cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`border-2 rounded-2xl p-6 h-full transition-all duration-300 group-hover:-translate-y-1 ${getColorClasses(
                  category.color
                )}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    {category.icon}
                  </div>
                  <span className="text-sm font-semibold bg-white px-2 py-1 rounded-full">
                    {category.count} bài viết
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {category.name}
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed">
                  {category.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

//============================================================================
// LATEST ARTICLES SECTION
//============================================================================
const LatestArticlesSection = ({ locale }: { locale: string }) => {
  const articles = [
    {
      id: 2,
      title:
        "Hợp tác chiến lược với 5 trường đại học hàng đầu về nghiên cứu nông nghiệp",
      excerpt:
        "Chương trình hợp tác nghiên cứu mới sẽ tập trung vào phát triển giống cây trồng bền vững và công nghệ chế biến tiên tiến.",
      author: "Phòng Truyền thông",
      date: "12 Tháng 8, 2024",
      readTime: "5 phút đọc",
      category: "Đối tác & Cộng đồng",
      categoryColor: "purple",
    },
    {
      id: 3,
      title:
        "Báo cáo ESG 2024: Cam kết Net Zero và tác động tích cực đến cộng đồng",
      excerpt:
        "Báo cáo chi tiết về các hoạt động phát triển bền vững, giảm thiểu carbon và đóng góp xã hội trong năm 2024.",
      author: "Ban Phát triển Bền vững",
      date: "10 Tháng 8, 2024",
      readTime: "12 phút đọc",
      category: "Bền vững & Môi trường",
      categoryColor: "emerald",
    },
    {
      id: 4,
      title: "Mở rộng thị trường châu Âu: Xuất khẩu tăng 250% trong quý 2/2024",
      excerpt:
        "Phân tích chi tiết về chiến lược mở rộng thị trường và những thành công đạt được tại các quốc gia châu Âu.",
      author: "Phòng Xuất khẩu",
      date: "8 Tháng 8, 2024",
      readTime: "7 phút đọc",
      category: "Thị trường & Xuất khẩu",
      categoryColor: "green",
    },
    {
      id: 5,
      title:
        "Công nghệ AI trong nông nghiệp: Ứng dụng machine learning để tối ưu hóa năng suất",
      excerpt:
        "Giới thiệu hệ thống AI mới giúp dự đoán thời tiết, tối ưu hóa tưới tiêu và phát hiện sớm bệnh cây trồng.",
      author: "Đội ngũ AI & Data Science",
      date: "5 Tháng 8, 2024",
      readTime: "10 phút đọc",
      category: "Nghiên cứu & Phát triển",
      categoryColor: "blue",
    },
    {
      id: 6,
      title:
        "Chương trình đào tạo nông dân: 1000+ nông dân được đào tạo kỹ thuật mới",
      excerpt:
        "Kết quả ấn tượng từ chương trình đào tạo kỹ thuật canh tác bền vững và ứng dụng công nghệ hiện đại.",
      author: "Phòng Đào tạo",
      date: "3 Tháng 8, 2024",
      readTime: "6 phút đọc",
      category: "Đối tác & Cộng đồng",
      categoryColor: "purple",
    },
  ];

  const getCategoryColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-50 text-blue-700",
      green: "bg-green-50 text-green-700",
      emerald: "bg-emerald-50 text-emerald-700",
      purple: "bg-purple-50 text-purple-700",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex items-center justify-between mb-16 scroll-animate animate-in">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Tin Tức Mới Nhất
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              Cập nhật những thông tin quan trọng nhất từ công ty và ngành
            </p>
          </div>
          <button className="px-6 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-colors">
            Xem tất cả
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <div
              key={article.id}
              className="scroll-animate animate-in group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <a
                href={`/${locale}/news/${article.id}`}
                className="block bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300 group-hover:-translate-y-1 h-full"
              >
                {/* Image placeholder */}
                <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <div className="text-center text-slate-500">
                    <div className="text-4xl mb-2">📄</div>
                    <p className="text-sm">Article Image</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColorClasses(
                        article.categoryColor
                      )}`}
                    >
                      {article.category}
                    </span>
                    <span className="text-slate-500 text-xs">
                      {article.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-slate-600 text-sm mb-4 leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{article.author}</span>
                    <span className="text-slate-500">{article.date}</span>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

//============================================================================
// NEWSLETTER SECTION
//============================================================================
const NewsletterSection = () => (
  <section className="py-16 md:py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white relative overflow-hidden">
    {/* Background Pattern */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>

    <div className="relative container mx-auto px-6 max-w-4xl text-center">
      <div className="scroll-animate animate-in">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
          Đăng Ký Nhận Tin
        </h2>
        <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
          Nhận những thông tin mới nhất về nghiên cứu, thị trường và xu hướng
          nông nghiệp bền vững
        </p>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="email"
              placeholder="Nhập địa chỉ email của bạn"
              className="flex-1 px-6 py-4 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
              Đăng Ký Ngay
            </button>
          </div>

          <div className="flex items-center justify-center mt-6 space-x-6 text-sm text-slate-600">
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Miễn phí</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Hủy đăng ký bất kỳ lúc nào</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Không spam</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

//============================================================================
// MAIN COMPONENT (server component, no hooks)
//============================================================================
export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locale || !isValidLocale(locale)) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen">
      <style>{`
        @keyframes slideInUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation: slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .scroll-animate { transition: all 0.3s ease; }
      `}</style>
      <main>
        <HeroSection />
        <FeaturedArticleSection locale={locale} />
        <NewsCategoriesSection />
        <LatestArticlesSection locale={locale} />
        <NewsletterSection />
      </main>
    </div>
  );
}
