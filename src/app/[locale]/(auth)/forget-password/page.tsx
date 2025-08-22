import type { NextPage } from "next";
import Link from "next/link";

// Component Icon SVG cho gọn gàng
const LycheeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 20.5a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-1.28a1 1 0 01.3-.7l5.2-5.2a5.5 5.5 0 00-7.78-7.78l-5.2 5.2a1 1 0 01-.7.3v1.28a.5.5 0 00.5.5h3v-1a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.5 5.5a2 2 0 100-4 2 2 0 000 4z"
    />
  </svg>
);

const ForgotPasswordPage: NextPage = () => {
  return (
    // Container chính với nền gradient và các khối phát sáng
    <main className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden bg-gray-900">
      {/* Nền động */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-pink-500 to-purple-700">
        <div className="glow-blob w-96 h-96 bg-red-400 -top-20 -left-20"></div>
        <div className="glow-blob w-80 h-80 bg-pink-400 -bottom-20 -right-10"></div>
        <div className="glow-blob w-72 h-72 bg-purple-400 top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Thẻ quên mật khẩu hiệu ứng Glassmorphism */}
      <div className="relative z-10 bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl p-8 md:p-12 w-full max-w-md border border-white/20">
        {/* Phần Header với Logo và Tiêu đề */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-white/20 rounded-full mb-3">
            <LycheeIcon />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-wider">
            Quên Mật Khẩu
          </h1>
          <p className="text-white/80 mt-2">
            Nhập email của bạn để nhận liên kết khôi phục.
          </p>
        </div>

        {/* Form quên mật khẩu */}
        <form action="#" method="POST">
          {/* Ô nhập Email */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-white/90"
            >
              Địa chỉ Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 text-sm focus:ring-pink-500 focus:border-pink-500 transition duration-300"
              placeholder="bạn@email.com"
              required
            />
          </div>

          {/* Nút Gửi */}
          <button
            type="submit"
            className="w-full text-white bg-pink-500/80 hover:bg-pink-500 focus:ring-4 focus:outline-none focus:ring-pink-300/50 font-bold rounded-lg text-base px-5 py-3.5 text-center transition-all transform hover:scale-105 duration-300 border border-white/20"
          >
            Gửi Liên Kết Khôi Phục
          </button>

          {/* Liên kết quay lại Đăng nhập */}
          <p className="text-sm font-light text-white/80 text-center mt-8">
            Nhớ mật khẩu rồi?
            <Link
              href="/login"
              className="font-bold text-white hover:underline"
            >
              Quay lại Đăng nhập
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
};

export default ForgotPasswordPage;
