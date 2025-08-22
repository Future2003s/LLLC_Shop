import Link from "next/link";
import { Home, LifeBuoy } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 px-6 py-20">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-pink-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-purple-600/30 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 h-56 w-56 rounded-full bg-fuchsia-500/20 blur-3xl" />

      <div className="relative z-10 w-full max-w-2xl">
        <div className="text-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-2xl p-10">
          <div className="mb-4">
            <span className="inline-block text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent tracking-tight">
              404
            </span>
          </div>
          <h1 className="text-white text-2xl md:text-3xl font-bold mb-2">
            Oops! Trang không tồn tại
          </h1>
          <p className="text-gray-300 mb-8">
            Đường dẫn bạn truy cập có thể đã bị thay đổi hoặc không còn khả
            dụng.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-3 text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-colors"
            >
              <Home className="h-5 w-5" />
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
