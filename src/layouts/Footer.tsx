import React from "react";

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-blue-600 to-blue-500 dark:from-gray-800 dark:to-gray-900 text-white py-16 px-4 rounded-t-sm shadow-lg">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left">
        {/* Company Logo & Description */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left lg:col-span-1">
          {/* Company Name as a stylish text logo */}
          <h3 className="text-4xl font-extrabold text-white mb-4 tracking-wider">
            Lalalycheee
          </h3>
          <p className="text-blue-100 dark:text-gray-300 leading-relaxed mb-6">
            Chúng tôi tự hào mang đến những sản phẩm vải thiều chất lượng cao,
            bền vững và thân thiện môi trường, góp phần nâng tầm giá trị nông
            sản Việt.
          </p>
          <div className="flex space-x-6">
            {/* Social Media Icons */}
            <a
              href="#"
              className="text-blue-200 dark:text-gray-400 hover:text-white transition duration-200 transform hover:scale-110"
            >
              {/* Facebook Icon */}
              <svg
                fill="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-7 h-7"
                viewBox="0 0 24 24"
              >
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
              </svg>
            </a>

            <a
              href="#"
              className="text-blue-200 hover:text-white transition duration-200 transform hover:scale-110"
            >
              {/* Instagram Icon */}
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-7 h-7"
                viewBox="0 0 24 24"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
              </svg>
            </a>
          </div>
        </div>

        {/* Contact Info */}
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold text-white mb-4 rounded-xl">
            Liên hệ chúng tôi
          </h3>
          <address className="not-italic space-y-2">
            <a href="https://maps.app.goo.gl/tKcvMmRWo9zHdDAR7" target="_blank">
              <p className="text-blue-200">
                <span className="font-semibold text-blue-300">Địa chỉ: </span>
                thôn Tú Y, xã Hà Đông, Thành Phố Hải Phòng.
              </p>
            </a>

            <p className="text-blue-200">
              <span className="font-semibold text-blue-300">Email:</span>{" "}
              <a
                href="mailto:lalalycheee1@gmail.com"
                className="hover:text-white transition duration-200"
              >
                lalalycheee1@gmail.com
              </a>
            </p>
            <p className="text-blue-200">
              <span className="font-semibold text-blue-300">Điện thoại:</span>{" "}
              <a
                href="tel:+840962215666"
                className="hover:text-white transition duration-200"
              >
                (+84) 0962-215-666
              </a>
            </p>
          </address>
        </div>

        {/* Quick Links */}
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold text-white mb-4 rounded-xl">
            Liên kết nhanh
          </h3>
          <nav className="flex flex-col space-y-2">
            <a
              href="#"
              className="text-blue-200 hover:text-white transition duration-200 rounded-xl"
            >
              Trang chủ
            </a>
            <a
              href="#"
              className="text-blue-200 hover:text-white transition duration-200 rounded-xl"
            >
              Sản phẩm
            </a>
            <a
              href="#"
              className="text-blue-200 hover:text-white transition duration-200 rounded-xl"
            >
              Về chúng tôi
            </a>
            <a
              href="#"
              className="text-blue-200 hover:text-white transition duration-200 rounded-xl"
            >
              Liên hệ
            </a>
            <a
              href="#"
              className="text-blue-200 hover:text-white transition duration-200 rounded-xl"
            >
              Tin tức & Sự kiện
            </a>
          </nav>
        </div>

        {/* Newsletter Signup */}
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold text-white mb-4 rounded-xl">
            CÔNG TY TNHH LALA - LYCHEEE
          </h3>
          <p className=" font-bold mb-4">Mã Số Thuế: 0801381660</p>
          <p className="italic">
            Quản Lý Bởi Thanh Hà - Thuế cơ sở 14 Thành Phố Hải Phòng
          </p>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Legal Links */}
      <div className="mt-12 pt-8 border-t border-blue-700 text-center text-black text-sm font-bold">
        <p className="mb-2">
          &copy; {new Date().getFullYear()} Lalalycheee. Bảo lưu mọi quyền.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
