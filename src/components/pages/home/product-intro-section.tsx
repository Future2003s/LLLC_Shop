import Image1 from "../../../../public/images/AQ0P4338_4-min.jpg";
import Image2 from "../../../../public/images/pha_voi_chanh_2-min.jpg";
import Image3 from "../../../../public/images/mat_ong_voi_pho_mai_3-min.jpg";
import Image4 from "../../../../public/images/AQ0P4338_4-min.jpg";
import Image from "next/image";

export default function ProductIntroSection() {
  const productHoney = {
    name: "Mật Ong Hoa Vải Nguyên Chất",
    nameJp: "ライチ蜂蜜",
    shortDescription:
      "100% tự nhiên, nguyên chất, được thu hoạch trực tiếp từ các tổ ong trên cây vải tại vùng đất Thanh Hà.",
    longDescription:
      "Mật ong hoa vải của chúng tôi mang hương vị ngọt ngào đặc trưng của hoa vải, thanh mát và bổ dưỡng. Sản phẩm không chỉ là một món ăn ngon mà còn là nguồn năng lượng tự nhiên dồi dào, hỗ trợ tiêu hóa và tăng cường sức đề kháng. Mật ong được thu hoạch và đóng gói cẩn thận, đảm bảo giữ trọn vẹn tinh túy từ thiên nhiên, lý tưởng để chăm sóc sức khỏe và làm quà biếu ý nghĩa.",
    features: [
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
    ],
    images: [Image1, Image2, Image3, Image4],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
      {/* Image Gallery */}
      <div className="order-2 lg:order-1">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-6 text-center lg:text-left">
          Hình ảnh sản phẩm Mật Ong
        </h2>
        <div className="grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6">
          {productHoney.images.map((imgSrc, index) => (
            <div
              key={index}
              className="relative aspect-[3/2] rounded-xl overflow-hidden shadow-lg group"
            >
              <Image
                src={imgSrc}
                alt={`Mật Ong Hoa Vải ${index + 1}`}
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500 ease-in-out"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Product Description and Features */}
      <div className="flex flex-col justify-center gap-6 order-1 lg:order-2">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 text-center lg:text-left">
          {productHoney.name}
          <span className="block text-xl sm:text-2xl font-normal text-gray-600 mt-2">
            ({productHoney.nameJp})
          </span>
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed text-justify">
          {productHoney.shortDescription}
        </p>
        <p className="text-base text-gray-600 leading-relaxed text-justify">
          {productHoney.longDescription}
        </p>

        <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
          {productHoney.features.map((feature) => (
            <div key={feature.name} className="border-t border-gray-200 pt-4">
              <dt className="font-semibold text-gray-900 text-xl mb-1">
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
  );
}
