"use client";
import React, { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { isValidLocale } from "@/i18n/config";
import { getArticleById, NewsArticle } from "@/data/newsData";

//============================================================================
// HELPER HOOK
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
// ARTICLE DETAIL COMPONENT
//============================================================================
interface ArticleDetailPageProps {
  params: Promise<{ locale?: string; id: string }>;
}

export default function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const [locale, setLocale] = useState<string | null>(null);
  const [articleId, setArticleId] = useState<string | null>(null);
  const [article, setArticle] = useState<NewsArticle | null>(null);
  
  useEffect(() => {
    params.then(({ locale: paramLocale, id }) => {
      if (!paramLocale || !isValidLocale(paramLocale)) {
        notFound();
      }
      setLocale(paramLocale);
      setArticleId(id);
      
      const foundArticle = getArticleById(parseInt(id));
      if (!foundArticle) {
        notFound();
      }
      setArticle(foundArticle);
    });
  }, [params]);

  useAnimateOnScroll();

  if (!locale || !articleId || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  const getCategoryColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-50 text-blue-700",
      green: "bg-green-50 text-green-700",
      emerald: "bg-emerald-50 text-emerald-700",
      purple: "bg-purple-50 text-purple-700"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

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
        
        .article-content h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 2rem 0 1rem 0;
          color: #1e293b;
        }
        
        .article-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 1.5rem 0 0.75rem 0;
          color: #334155;
        }
        
        .article-content p {
          margin: 1rem 0;
          line-height: 1.75;
          color: #475569;
        }
        
        .article-content ul {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }
        
        .article-content li {
          margin: 0.5rem 0;
          line-height: 1.75;
          color: #475569;
        }
        
        .article-content blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1.5rem;
          margin: 2rem 0;
          font-style: italic;
          color: #64748b;
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 0.5rem;
        }
        
        .article-content strong {
          font-weight: 600;
          color: #1e293b;
        }
      `}</style>

      <main>
        {/* Header */}
        <section className="py-12 md:py-16 bg-slate-50 border-b">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="scroll-animate opacity-0">
              {/* Breadcrumb */}
              <nav className="mb-8">
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <a href={`/${locale}`} className="hover:text-blue-600 transition-colors">
                    Trang chủ
                  </a>
                  <span>›</span>
                  <a href={`/${locale}/news`} className="hover:text-blue-600 transition-colors">
                    Tin tức
                  </a>
                  <span>›</span>
                  <span className="text-slate-900">Bài viết</span>
                </div>
              </nav>

              {/* Article Meta */}
              <div className="flex items-center space-x-4 mb-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColorClasses(article.categoryColor)}`}>
                  {article.category}
                </span>
                <span className="text-slate-500 text-sm">{article.readTime}</span>
                <span className="text-slate-500 text-sm">{article.date}</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                {article.title}
              </h1>

              {/* Author */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {article.author.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{article.author}</div>
                  <div className="text-sm text-slate-600">{article.role}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="scroll-animate opacity-0">
              {/* Featured Image */}
              {article.imageUrl && (
                <div className="mb-12">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg"
                  />
                </div>
              )}

              {/* Excerpt */}
              <div className="text-xl text-slate-600 leading-relaxed mb-12 p-6 bg-slate-50 rounded-2xl border-l-4 border-blue-500">
                {article.excerpt}
              </div>

              {/* Content */}
              <div 
                className="article-content prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Thẻ bài viết:</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm hover:bg-slate-200 transition-colors cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Back to News */}
        <section className="py-12 bg-slate-50">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <div className="scroll-animate opacity-0">
              <a
                href={`/${locale}/news`}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Quay lại tin tức
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
