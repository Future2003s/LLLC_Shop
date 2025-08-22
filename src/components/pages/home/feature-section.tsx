export default function FeaturesSection() {
  const features = [
    {
      icon: "🌿",
      title: "100% Tự Nhiên",
      description: "Nguyên liệu tinh khiết được chọn lọc từ vùng đất Thanh Hà.",
    },
    {
      icon: "💖",
      title: "An Toàn Cho Sức Khoẻ",
      description:
        "Quy trình sản xuất không hóa chất, đạt chuẩn an toàn thực phẩm.",
    },
    {
      icon: "♻️",
      title: "Thân Thiện Môi Trường",
      description: "Bao bì tái chế, quy trình sản xuất giảm thiểu tác động.",
    },
    {
      icon: "🏆",
      title: "Chất Lượng Hàng Đầu",
      description:
        "Được kiểm định chất lượng nghiêm ngặt trước khi đến tay bạn.",
    },
  ];

  return (
    <section className="py-20 px-4 bg-purple-50">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 rounded-xl">
          Điểm Nổi Bật Của Lalalycheee
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center text-center transition duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3 rounded-xl">
                {feature.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
