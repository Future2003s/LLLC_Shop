// components/HomeIntroduceProducts.tsx
import React from "react";
import Image from "next/image";
import HomeImg3 from "../../../../public/images/AQ0P4307.jpg";
import HomeImg4 from "../../../../public/images/AQ0P4410.jpg";
import HomeImg2 from "../../../../public/images/AQ0P4348.jpg";
import HomeImg1 from "../../../../public/images/hero/AQ0P0240.jpg";

const features = [
  {
    name: "Nguồn gốc",
    description:
      "Sản phẩm được nuôi trồng tại trang trại riêng của chúng tôi ở Thanh Hà, Hải Dương.",
  },
  {
    name: "Nguyên liệu",
    description:
      "100% mật ong hoa vải tự nhiên, không pha chế, không chất bảo quản.",
  },
  {
    name: "Quy cách",
    description:
      "Đóng gói trong chai thủy tinh cao cấp, dung tích 165g và 435g.",
  },
  {
    name: "Chất lượng",
    description:
      "Đảm bảo đạt tiêu chuẩn an toàn vệ sinh thực phẩm, giữ trọn hương vị và dưỡng chất tự nhiên.",
  },
  {
    name: "Đặc điểm",
    description:
      "Màu vàng sánh, mùi thơm nhẹ đặc trưng của hoa vải, vị ngọt dịu thanh mát.",
  },
  {
    name: "Lưu ý",
    description:
      "Sản phẩm tự nhiên, màu sắc và độ sánh có thể thay đổi nhẹ theo mùa và điều kiện bảo quản.",
  },
];

export default function HomeIntroduceProducts() {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-6 sm:p-8 lg:p-12 transition-all duration-300 hover:shadow-2xl">
      <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-y-12 lg:max-w-7xl lg:grid-cols-2 lg:gap-x-16">
        {/* Image Gallery */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mb-6 text-center lg:text-left">
            Hình ảnh sản phẩm
          </h2>
          <div className="grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6">
            <div className="relative aspect-[3/2] rounded-lg overflow-hidden shadow-md group">
              <Image
                src={HomeImg2}
                alt="Mật Ong Hoa Vải 1"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-0 transition-opacity duration-300"></div>
            </div>
            <div className="relative aspect-[3/2] rounded-lg overflow-hidden shadow-md group">
              <Image
                src={HomeImg3}
                alt="Mật Ong Hoa Vải 2"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-0 transition-opacity duration-300"></div>
            </div>
            <div className="relative aspect-[3/2] rounded-lg overflow-hidden shadow-md group">
              <Image
                src={HomeImg1}
                alt="Mật Ong Hoa Vải 3"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-0 transition-opacity duration-300"></div>
            </div>
            <div className="relative aspect-[3/2] rounded-lg overflow-hidden shadow-md group">
              <Image
                src={HomeImg4}
                alt="Mật Ong Hoa Vải 4"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-0 transition-opacity duration-300"></div>
            </div>
          </div>
        </div>

        {/* Product Description and Features */}
        <div className="flex flex-col justify-center gap-6 pt-8 lg:pt-0 lg:pl-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 text-center lg:text-left">
            Mật Ong Hoa Vải Nguyên Chất
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed text-justify">
            100% tự nhiên, nguyên chất, được thu hoạch trực tiếp từ các tổ ong
            trên cây vải tại vùng đất Thanh Hà. Sản phẩm mang hương vị ngọt ngào
            đặc trưng của hoa vải, thanh mát và bổ dưỡng, lý tưởng để chăm sóc
            sức khỏe và làm quà biếu.
          </p>

          <dl className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.name} className="border-t border-gray-200 pt-4">
                <dt className="font-semibold text-gray-900 text-lg mb-1">
                  {feature.name}
                </dt>
                <dd className="text-base text-gray-600 leading-relaxed">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
