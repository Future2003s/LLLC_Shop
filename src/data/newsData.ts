export interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  role: string;
  date: string;
  readTime: string;
  category: string;
  categoryColor: string;
  tags: string[];
  featured: boolean;
  imageUrl?: string;
}

export const newsArticles: NewsArticle[] = [
  {
    id: 1,
    title: "Breakthrough trong công nghệ chế biến vải thiều: Tăng giá trị xuất khẩu 300%",
    excerpt: "Nghiên cứu mới của chúng tôi đã phát triển thành công quy trình chế biến vải thiều tiên tiến, giúp nâng cao chất lượng sản phẩm và mở rộng thị trường xuất khẩu.",
    content: `
      <h2>Đột phá công nghệ chế biến vải thiều</h2>
      <p>Sau 3 năm nghiên cứu và phát triển, đội ngũ R&D của LALA-LYCHEEE đã thành công trong việc phát triển quy trình chế biến vải thiều hoàn toàn mới, sử dụng công nghệ nano và enzyme tự nhiên.</p>
      
      <h3>Những cải tiến đột phá:</h3>
      <ul>
        <li><strong>Tăng thời gian bảo quản:</strong> Từ 3-5 ngày lên 15-20 ngày</li>
        <li><strong>Giữ nguyên dinh dưỡng:</strong> 95% vitamin C và chất chống oxi hóa</li>
        <li><strong>Chất lượng xuất khẩu:</strong> Đạt tiêu chuẩn EU và Mỹ</li>
        <li><strong>Giảm lãng phí:</strong> Từ 30% xuống còn 5%</li>
      </ul>
      
      <h3>Tác động kinh tế:</h3>
      <p>Công nghệ mới đã giúp tăng giá trị xuất khẩu vải thiều lên 300%, từ 50 triệu USD lên 200 triệu USD trong năm 2024. Điều này không chỉ mang lại lợi nhuận cho công ty mà còn tăng thu nhập cho hơn 2,000 hộ nông dân đối tác.</p>
      
      <blockquote>
        "Đây là bước đột phá quan trọng giúp vải thiều Việt Nam cạnh tranh trên thị trường quốc tế" - Dr. Nguyễn Minh Hạnh, Giám đốc R&D
      </blockquote>
    `,
    author: "Dr. Nguyễn Minh Hạnh",
    role: "Giám đốc R&D",
    date: "15 Tháng 8, 2024",
    readTime: "8 phút đọc",
    category: "Nghiên cứu & Phát triển",
    categoryColor: "blue",
    tags: ["Công nghệ", "Xuất khẩu", "R&D"],
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 2,
    title: "Hợp tác chiến lược với 5 trường đại học hàng đầu về nghiên cứu nông nghiệp",
    excerpt: "Chương trình hợp tác nghiên cứu mới sẽ tập trung vào phát triển giống cây trồng bền vững và công nghệ chế biến tiên tiến.",
    content: `
      <h2>Mạng lưới hợp tác học thuật mở rộng</h2>
      <p>LALA-LYCHEEE vừa ký kết thỏa thuận hợp tác chiến lược với 5 trường đại học hàng đầu Việt Nam trong lĩnh vực nghiên cứu nông nghiệp và công nghệ thực phẩm.</p>
      
      <h3>Các đối tác học thuật:</h3>
      <ul>
        <li>Đại học Nông nghiệp Hà Nội</li>
        <li>Đại học Bách khoa Hà Nội</li>
        <li>Đại học Quốc gia TP.HCM</li>
        <li>Đại học Cần Thơ</li>
        <li>Đại học Huế</li>
      </ul>
      
      <h3>Các dự án nghiên cứu chính:</h3>
      <p><strong>1. Phát triển giống vải thiều mới:</strong> Tạo ra giống vải có khả năng chống chịu thời tiết và năng suất cao hơn 40%.</p>
      <p><strong>2. Công nghệ chế biến thông minh:</strong> Ứng dụng AI và IoT trong quy trình sản xuất.</p>
      <p><strong>3. Bao bì sinh học:</strong> Phát triển vật liệu bao bì từ phụ phẩm nông nghiệp.</p>
    `,
    author: "Phòng Truyền thông",
    role: "LALA-LYCHEEE",
    date: "12 Tháng 8, 2024",
    readTime: "5 phút đọc",
    category: "Đối tác & Cộng đồng",
    categoryColor: "purple",
    tags: ["Hợp tác", "Đại học", "Nghiên cứu"],
    featured: false
  },
  {
    id: 3,
    title: "Báo cáo ESG 2024: Cam kết Net Zero và tác động tích cực đến cộng đồng",
    excerpt: "Báo cáo chi tiết về các hoạt động phát triển bền vững, giảm thiểu carbon và đóng góp xã hội trong năm 2024.",
    content: `
      <h2>Cam kết phát triển bền vững</h2>
      <p>Báo cáo ESG (Environmental, Social, Governance) năm 2024 của LALA-LYCHEEE cho thấy những tiến bộ đáng kể trong việc thực hiện cam kết Net Zero vào năm 2030.</p>
      
      <h3>Thành tựu môi trường (Environmental):</h3>
      <ul>
        <li>Giảm 35% lượng khí thải carbon so với năm 2020</li>
        <li>100% năng lượng tái tạo trong các nhà máy chính</li>
        <li>Tái chế 90% chất thải sản xuất</li>
        <li>Tiết kiệm 40% lượng nước sử dụng</li>
      </ul>
      
      <h3>Tác động xã hội (Social):</h3>
      <ul>
        <li>Tạo việc làm cho 2,000+ lao động</li>
        <li>Tăng thu nhập nông dân 300%</li>
        <li>Đào tạo 1,000+ nông dân kỹ thuật mới</li>
        <li>Đóng góp 5% lợi nhuận cho cộng đồng</li>
      </ul>
      
      <h3>Quản trị doanh nghiệp (Governance):</h3>
      <p>Áp dụng các tiêu chuẩn quản trị quốc tế, minh bạch trong báo cáo tài chính và cam kết đạo đức kinh doanh.</p>
    `,
    author: "Ban Phát triển Bền vững",
    role: "LALA-LYCHEEE",
    date: "10 Tháng 8, 2024",
    readTime: "12 phút đọc",
    category: "Bền vững & Môi trường",
    categoryColor: "emerald",
    tags: ["ESG", "Net Zero", "Bền vững"],
    featured: false
  },
  {
    id: 4,
    title: "Mở rộng thị trường châu Âu: Xuất khẩu tăng 250% trong quý 2/2024",
    excerpt: "Phân tích chi tiết về chiến lược mở rộng thị trường và những thành công đạt được tại các quốc gia châu Âu.",
    content: `
      <h2>Thành công vượt bậc tại thị trường châu Âu</h2>
      <p>Quý 2/2024 đánh dấu cột mốc quan trọng khi xuất khẩu sang châu Âu tăng 250% so với cùng kỳ năm trước, đạt 75 triệu USD.</p>
      
      <h3>Các thị trường chính:</h3>
      <ul>
        <li><strong>Đức:</strong> 25 triệu USD (+300%)</li>
        <li><strong>Pháp:</strong> 20 triệu USD (+280%)</li>
        <li><strong>Hà Lan:</strong> 15 triệu USD (+200%)</li>
        <li><strong>Ý:</strong> 10 triệu USD (+150%)</li>
        <li><strong>Tây Ban Nha:</strong> 5 triệu USD (+100%)</li>
      </ul>
      
      <h3>Yếu tố thành công:</h3>
      <p><strong>1. Chất lượng vượt trội:</strong> Sản phẩm đạt tiêu chuẩn EU nghiêm ngặt về an toàn thực phẩm.</p>
      <p><strong>2. Đối tác phân phối mạnh:</strong> Hợp tác với 15+ nhà phân phối lớn tại châu Âu.</p>
      <p><strong>3. Marketing hiệu quả:</strong> Chiến dịch "Taste of Vietnam" thu hút người tiêu dùng châu Âu.</p>
      
      <blockquote>
        "Thành công này khẳng định vị thế của vải thiều Việt Nam trên bản đồ thực phẩm toàn cầu" - Nguyễn Văn Minh, Giám đốc Xuất khẩu
      </blockquote>
    `,
    author: "Phòng Xuất khẩu",
    role: "LALA-LYCHEEE",
    date: "8 Tháng 8, 2024",
    readTime: "7 phút đọc",
    category: "Thị trường & Xuất khẩu",
    categoryColor: "green",
    tags: ["Xuất khẩu", "Châu Âu", "Tăng trưởng"],
    featured: false
  },
  {
    id: 5,
    title: "Công nghệ AI trong nông nghiệp: Ứng dụng machine learning để tối ưu hóa năng suất",
    excerpt: "Giới thiệu hệ thống AI mới giúp dự đoán thời tiết, tối ưu hóa tưới tiêu và phát hiện sớm bệnh cây trồng.",
    content: `
      <h2>Cách mạng AI trong nông nghiệp</h2>
      <p>Hệ thống AI "SmartFarm" của LALA-LYCHEEE đã được triển khai thành công tại 50+ trang trại đối tác, mang lại hiệu quả đáng kể.</p>
      
      <h3>Các tính năng chính:</h3>
      <p><strong>1. Dự đoán thời tiết:</strong> Độ chính xác 95% trong vòng 7 ngày, giúp nông dân lên kế hoạch canh tác.</p>
      <p><strong>2. Tối ưu tưới tiêu:</strong> Tiết kiệm 40% lượng nước, tăng 25% năng suất.</p>
      <p><strong>3. Phát hiện bệnh cây:</strong> Nhận diện sớm 15+ loại bệnh phổ biến qua hình ảnh.</p>
      <p><strong>4. Quản lý dinh dưỡng:</strong> Tự động tính toán lượng phân bón tối ưu.</p>
      
      <h3>Kết quả thực tế:</h3>
      <ul>
        <li>Tăng năng suất trung bình 30%</li>
        <li>Giảm chi phí sản xuất 20%</li>
        <li>Giảm 50% tỷ lệ cây bị bệnh</li>
        <li>Tiết kiệm 40% thời gian quản lý</li>
      </ul>
    `,
    author: "Đội ngũ AI & Data Science",
    role: "LALA-LYCHEEE",
    date: "5 Tháng 8, 2024",
    readTime: "10 phút đọc",
    category: "Nghiên cứu & Phát triển",
    categoryColor: "blue",
    tags: ["AI", "Machine Learning", "Smart Farm"],
    featured: false
  },
  {
    id: 6,
    title: "Chương trình đào tạo nông dân: 1000+ nông dân được đào tạo kỹ thuật mới",
    excerpt: "Kết quả ấn tượng từ chương trình đào tạo kỹ thuật canh tác bền vững và ứng dụng công nghệ hiện đại.",
    content: `
      <h2>Nâng cao năng lực cho nông dân</h2>
      <p>Chương trình "Nông dân 4.0" của LALA-LYCHEEE đã hoàn thành đợt đào tạo đầu tiên với 1,000+ nông dân tham gia từ 5 tỉnh thành.</p>
      
      <h3>Nội dung đào tạo:</h3>
      <ul>
        <li>Kỹ thuật canh tác bền vững</li>
        <li>Sử dụng công nghệ IoT trong nông nghiệp</li>
        <li>Quản lý chất lượng và an toàn thực phẩm</li>
        <li>Kỹ năng kinh doanh và tiếp thị</li>
        <li>Ứng dụng smartphone trong nông nghiệp</li>
      </ul>
      
      <h3>Kết quả đạt được:</h3>
      <ul>
        <li>95% nông dân hoàn thành khóa học</li>
        <li>Tăng thu nhập trung bình 40%</li>
        <li>Giảm 30% chi phí sản xuất</li>
        <li>100% áp dụng ít nhất 3 kỹ thuật mới</li>
      </ul>
      
      <p>Chương trình sẽ mở rộng ra 10 tỉnh thành khác trong năm 2024 với mục tiêu đào tạo 5,000 nông dân.</p>
    `,
    author: "Phòng Đào tạo",
    role: "LALA-LYCHEEE",
    date: "3 Tháng 8, 2024",
    readTime: "6 phút đọc",
    category: "Đối tác & Cộng đồng",
    categoryColor: "purple",
    tags: ["Đào tạo", "Nông dân", "Kỹ thuật"],
    featured: false
  }
];

export const getArticleById = (id: number): NewsArticle | undefined => {
  return newsArticles.find(article => article.id === id);
};

export const getFeaturedArticle = (): NewsArticle | undefined => {
  return newsArticles.find(article => article.featured);
};

export const getArticlesByCategory = (category: string): NewsArticle[] => {
  return newsArticles.filter(article => article.category === category);
};

export const getLatestArticles = (limit: number = 6): NewsArticle[] => {
  return newsArticles
    .filter(article => !article.featured)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
};
