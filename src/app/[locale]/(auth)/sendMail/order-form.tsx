"use client";
import { envConfig } from "@/config";
import React, { useState, useEffect } from "react";
import { Loader } from "@/components/ui/loader";

// Define product types and their price variants, including bilingual names and images
const productOptions = {
  "165g / 小": [
    {
      id: "165g-160",
      name: "Loại 165g giá 160.000",
      name_jp: "生ライチはちみつ（小）",
      price: 160000,
      imageUrl: "https://d3enplyig2yenj.cloudfront.net/san_pham_nho.jpg",
    },
  ],
  "435g / 大": [
    {
      id: "435g-380",
      name: "Loại 435g giá 380.000",
      name_jp: "生ライチはちみつ（大）",
      price: 380000,
      imageUrl: "https://d3enplyig2yenj.cloudfront.net/san_pham_lon.jpg",
    },
  ],
};

// Bank Account Information for Transfers
const bankAccountInfo = {
  qrCodeUrl:
    "https://img.vietqr.io/image/970415-104877911800-print.png?accountName=PHAM%20VAN%20NHAN",
  accountNumber: "104877911800",
  accountName: "PHAM VAN NHAN",
  bankName: "Viettin Bank",
  branch: "Chi nhánh Đông Hải Dương",
  branch_jp: "DONG HAI DUONG 支店",
};

// Define the email template types
type EmailType =
  | "thankyou"
  | "confirmed"
  | "delivering"
  | "shipped"
  | "payment_received"
  | "";

// Define the type for the order form state
interface OrderFormData {
  customerName: string;
  customerEmail: string;
  products: {
    [key: string]: { quantity: number | "" };
  };
  recipientName: string;
  shippingAddress: string;
  recipientPhone: string;
  paymentMethod: "cod" | "transfer" | "";
  shippingFee: number | "";
}

// Define the type for the data passed to email templates
interface TypeRequestBodyMail {
  customerInfo: { name: string; email: string };
  shippingInfo: { recipientName: string; address: string; phone: string };
  order: {
    products: {
      id: string;
      name: string;
      name_jp: string;
      price: number;
      quantity: number;
      imageUrl: string;
    }[];
    subtotal: number;
    shippingFee: number;
    grandTotal: number;
    paymentMethod: "cod" | "transfer" | "";
  };
}

// Icon Components (SVG)
const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
      clipRule="evenodd"
    />
  </svg>
);
const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
);
const ProductIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7m0 0v10l8 4m0-14L4 7"
    />
  </svg>
);
const QuantityIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
    />
  </svg>
);
const TemplateIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
    <path
      fillRule="evenodd"
      d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
      clipRule="evenodd"
    />
  </svg>
);
const AddressIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
      clipRule="evenodd"
    />
  </svg>
);
const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.518.76a11.034 11.034 0 005.455 5.455l.76-1.518a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
  </svg>
);

// Main Order Form Component
const OrderForm: React.FC = () => {
  // #region EMAIL HTML TEMPLATES
  // =================================================================
  const signatureHtml = `
    <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: left;">
        <p style="font-size: 14px; line-height: 1.6; color: #555555; margin: 0;">
            --------------------------------------------------------------------<br>
            LALA-LYCHEEE Company Limited<br>
            Thon Tu Y, Xa Ha Dong, Thanh Pho Hai Phong<br>
            0962-215-666<br>
            <a href="mailto:lalalycheee1@gmail.com" style="color: #c59a9a; text-decoration: none;">lalalycheee1@gmail.com</a>
        </p>
    </div>
    `;

  // TEMPLATE: CONFIRMED (VIETNAMESE)
  const confirmOrderCustomer_VN = (data: TypeRequestBodyMail) => {
    const productRowsHtml = data.order.products
      .map((product) => {
        const itemTotal = product.price * product.quantity;
        const formatedTotal = new Intl.NumberFormat("vi-VN").format(itemTotal);
        return `
            <tr class="product-item">
                <td>
                <table border="0" cellpadding="0" cellspacing="0">
                    <tr>
                    <td><img src="${product.imageUrl}" alt="${product.name}" class="product-image"></td>
                    <td style="padding-left: 20px;">
                        <span class="product-name">${product.name}</span><br>
                        <span class="product-qty">Số lượng: ${product.quantity}</span>
                    </td>
                    </tr>
                </table>
                </td>
                <td align="right" class="product-name">${formatedTotal}đ</td>
            </tr>`;
      })
      .join("");

    const formattedSubtotal = new Intl.NumberFormat("vi-VN").format(
      data.order.subtotal
    );
    const formattedShippingFee =
      data.order.shippingFee === 0
        ? "Miễn phí"
        : `${new Intl.NumberFormat("vi-VN").format(data.order.shippingFee)}đ`;
    const formattedGrandTotal = new Intl.NumberFormat("vi-VN").format(
      data.order.grandTotal
    );
    const paymentMethodVi =
      data.order.paymentMethod === "cod"
        ? "Thanh toán khi nhận hàng (COD)"
        : "Chuyển khoản";

    const paymentDetailsHtml_VN =
      data.order.paymentMethod === "transfer"
        ? `
        <div class="payment-info" style="padding: 20px 0; margin-top: 20px; border-top: 1px solid #e0e0e0; text-align: left;">
            <h3 style="font-family: 'Playfair Display', serif; font-size: 18px; color: #2b2b2b; margin-top: 0; margin-bottom: 15px; font-weight: 700;">Thông tin chuyển khoản</h3>
            <p style="font-size: 15px; line-height: 1.7; margin: 0; color: #555555; text-align: left;">
                <strong>Ngân hàng:</strong> ${bankAccountInfo.bankName} - ${bankAccountInfo.branch}<br>
                <strong>Chủ tài khoản:</strong> ${bankAccountInfo.accountName}<br>
                <strong>Số tài khoản:</strong> ${bankAccountInfo.accountNumber}<br>
                <strong>Nội dung:</strong> Thanh toan don hang cho ${data.customerInfo.name}
            </p>
            <div style="text-align: center; margin-top: 20px;">
                <img src="${bankAccountInfo.qrCodeUrl}" alt="Mã QR thanh toán" style="width: 150px; height: 150px; display: block; margin: 0 auto;">
                <p style="font-size: 14px; color: #555; margin-top: 10px; text-align: center;">Quét mã QR để thanh toán</p>
            </div>
        </div>
        `
        : "";

    return `<!DOCTYPE html>
        <html lang="vi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Xác Nhận Đơn Hàng - LALA-LYCHEEE</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lato:wght@400;700&display=swap" rel="stylesheet"><style>body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; } table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; } img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; } table { border-collapse: collapse !important; } body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f7f7f7; font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif; } .container { width: 100%; max-width: 620px; margin: 0 auto; background-color: #ffffff; border-radius: 4px; overflow: hidden; } .header { padding: 30px; text-align: center; background-color: #fafafa; } .header img { max-width: 150px; } .content { padding: 40px 40px; } .content h1 { font-family: 'Playfair Display', serif; font-size: 28px; color: #2b2b2b; font-weight: 700; margin-top: 0; margin-bottom: 15px; text-align: center; } .content p { font-size: 16px; line-height: 1.7; color: #555555; text-align: center; margin-bottom: 30px; } .order-summary-table { width: 100%; margin: 30px 0; border-top: 1px solid #e0e0e0; } .order-summary-table td { padding: 18px 0; text-align: left; border-bottom: 1px solid #e0e0e0; } .order-summary-table tr:last-child td { border-bottom: 0; } .product-image { width: 65px; height: 65px; object-fit: cover; border-radius: 4px; } .product-name { color: #2b2b2b; font-weight: 700; font-size: 16px; } .product-qty { color: #555555; } .totals-table { width: 100%; margin-top: 20px; } .totals-table td { padding: 8px 0; color: #555555; font-size: 16px; } .totals-table .total-row td { font-weight: 700; font-size: 18px; color: #2b2b2b; padding-top: 15px; } .address-info { padding: 20px 0; margin-top: 20px; border-top: 1px solid #e0e0e0; } .address-info h3 { font-family: 'Playfair Display', serif; font-size: 18px; color: #2b2b2b; margin-top: 0; margin-bottom: 12px; font-weight: 700; } .address-info p { font-size: 15px; line-height: 1.7; margin: 0; color: #555555; text-align: left; } .footer { text-align: center; padding: 30px; font-size: 13px; color: #888888; background-color: #fafafa; } .footer a { color: #c59a9a; text-decoration: none; font-weight: 700; } @media screen and (max-width: 600px) { .content { padding: 30px 20px; } } </style></head>
        <body><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td align="center" style="background-color: #f7f7f7; padding: 20px;"><table border="0" cellpadding="0" cellspacing="0" class="container">
        <tr><td class="header"><img src="https://d3enplyig2yenj.cloudfront.net/logo" alt="LALA-LYCHEEE Logo" style="display: block; margin: 0 auto;"></td></tr>
        <tr><td class="content"><h1>Cảm ơn quý khách</h1><p>Đơn hàng của bạn đã được xác nhận. LALA-LYCHEEE đang chuẩn bị sản phẩm và sẽ sớm giao đến cho bạn.</p>
        <table class="order-summary-table" border="0" cellpadding="0" cellspacing="0">${productRowsHtml}</table>
        <table class="totals-table" border="0" cellpadding="0" cellspacing="0">
            <tr><td>Tạm tính</td><td align="right">${formattedSubtotal}đ</td></tr>
            <tr><td>Phí giao hàng</td><td align="right">${formattedShippingFee}</td></tr>
            <tr><td>Hình thức thanh toán</td><td align="right">${paymentMethodVi}</td></tr>
            <tr class="total-row"><td><strong>Tổng cộng</strong></td><td align="right"><strong>${formattedGrandTotal}đ</strong></td></tr>
        </table>
        ${paymentDetailsHtml_VN}
        <div class="address-info"><h3>Giao đến</h3><p><strong>${data.shippingInfo?.recipientName}</strong><br>${data.shippingInfo?.address}<br>${data.shippingInfo?.phone}</p></div>
        ${signatureHtml}
        </td></tr>
        <tr><td class="footer"><p>Cần hỗ trợ? <a href="mailto:support@example.com">Liên hệ với chúng tôi</a>.</p><p style="margin-top: 15px;"><strong>LALA-LYCHEEE</strong><br>Thôn Tú Y, Xã Hà Đông, Thành Phố Hải Phòng</p></td></tr>
        </table></td></tr></table></body></html>`;
  };

  // TEMPLATE: CONFIRMED (JAPANESE)
  const confirmOrderCustomer_JP = (data: TypeRequestBodyMail) => {
    const productRowsHtml = data.order.products
      .map((product) => {
        const itemTotal = product.price * product.quantity;
        const formatedTotal = new Intl.NumberFormat("ja-JP").format(itemTotal);
        return `
            <tr class="product-item">
                <td>
                <table border="0" cellpadding="0" cellspacing="0">
                    <tr>
                    <td><img src="${product.imageUrl}" alt="${product.name_jp}" class="product-image"></td>
                    <td style="padding-left: 20px;">
                        <span class="product-name">${product.name_jp}</span><br>
                        <span class="product-qty">数量: ${product.quantity}</span>
                    </td>
                    </tr>
                </table>
                </td>
                <td align="right" class="product-name">${formatedTotal} VNĐ</td>
            </tr>`;
      })
      .join("");

    const formattedSubtotal = new Intl.NumberFormat("ja-JP").format(
      data.order.subtotal
    );
    const formattedShippingFee =
      data.order.shippingFee === 0
        ? "無料"
        : `${new Intl.NumberFormat("ja-JP").format(
            data.order.shippingFee
          )} VNĐ`;
    const formattedGrandTotal = new Intl.NumberFormat("ja-JP").format(
      data.order.grandTotal
    );
    const paymentMethodJp =
      data.order.paymentMethod === "cod" ? "代金引換" : "銀行振込";

    const confirmationText =
      data.order.paymentMethod === "transfer"
        ? "お振込みが確認でき次第、商品を発送致します。お振込みが完了しましたら再度ご連絡差し上げますのでどうぞ宜しくお願い致します。"
        : "準備ができ次第、発送致します。 商品の発送が完了しましたら再度ご連絡差し上げますのでどうぞ宜しくお願い致します。";

    const extraNotesJP = `
            <div style="text-align: left; font-size: 14px; color: #555555; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                <p style="text-align: left; margin:0 0 1em 0;">※万が一、商品が破損していたり液漏れが発生していたり、異なった商品が届いた場合には大変お手数ですがすぐにご連絡頂きますようお願い申し上げます。<br>その際には破損した商品の画像をお撮り頂き、そちらを合わせてお送り頂けますと幸いです。<br>ただし、誠に恐れ入りますがお客様都合での返品・交換はお受けできかねますので予めご了承下さい。</p>
                <p style="text-align: left; margin:0 0 1em 0;">※暑い時期は気温の関係もあり、生はちみつの酵素の発酵が活発化しており液漏れしやすくなっております。<br>対策としては、20℃以下の冷暗所もしくは冷蔵庫での保管がおすすめです。<br>もし、はちみつが白く結晶化してしまった場合は50℃以下のお湯で湯煎していただければ、酵素や栄養素が失われることなく生はちみつとしてお召し上がり頂けますのでお試しください。</p>
                <p style="text-align: left; margin:0;">※飛行機での輸送に関しましても強い衝撃や連続した揺れが加わると気圧の関係もあり液漏れする可能性がございます。飛行機で輸送される際は緩衝材で包み袋に入れ、スーツケースの真ん中に入れるなど十分ご注意下さいますようお願い申し上げます。</p>
            </div>
        `;

    const paymentDetailsHtml_JP =
      data.order.paymentMethod === "transfer"
        ? `
        <div class="payment-info" style="padding: 20px 0; margin-top: 20px; border-top: 1px solid #e0e0e0; text-align: left;">
            <h3 style="font-family: 'Playfair Display', serif; font-size: 18px; color: #2b2b2b; margin-top: 0; margin-bottom: 15px; font-weight: 700;">お振込み情報</h3>
            <p style="font-size: 15px; line-height: 1.7; margin: 0; color: #555555; text-align: left;">
                <strong>銀行名:</strong> ${bankAccountInfo.bankName} - ${bankAccountInfo.branch_jp}<br>
                <strong>口座名義:</strong> ${bankAccountInfo.accountName}<br>
                <strong>口座番号:</strong> ${bankAccountInfo.accountNumber}<br>
                <strong>内容:</strong> ご注文のお支払い ${data.customerInfo.name} 様
            </p>
            <div style="text-align: center; margin-top: 20px;">
                <img src="${bankAccountInfo.qrCodeUrl}" alt="お支払い用QRコード" style="width: 150px; height: 150px; display: block; margin: 0 auto;">
                <p style="font-size: 14px; color: #555; margin-top: 10px; text-align: center;">QRコードをスキャンしてお支払いください</p>
            </div>
        </div>
        `
        : "";

    return `<!DOCTYPE html>
        <html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>ご注文の確認 - LALA-LYCHEEE</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lato:wght@400;700&display=swap" rel="stylesheet"><style>body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; } table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; } img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; } table { border-collapse: collapse !important; } body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f7f7f7; font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif; } .container { width: 100%; max-width: 620px; margin: 0 auto; background-color: #ffffff; border-radius: 4px; overflow: hidden; } .header { padding: 30px; text-align: center; background-color: #fafafa; } .header img { max-width: 150px; } .content { padding: 40px 40px; } .content h1 { font-family: 'Playfair Display', serif; font-size: 28px; color: #2b2b2b; font-weight: 700; margin-top: 0; margin-bottom: 15px; text-align: center; } .content p { font-size: 16px; line-height: 1.7; color: #555555; text-align: center; margin-bottom: 30px; } .order-summary-table { width: 100%; margin: 30px 0; border-top: 1px solid #e0e0e0; } .order-summary-table td { padding: 18px 0; text-align: left; border-bottom: 1px solid #e0e0e0; } .order-summary-table tr:last-child td { border-bottom: 0; } .product-image { width: 65px; height: 65px; object-fit: cover; border-radius: 4px; } .product-name { color: #2b2b2b; font-weight: 700; font-size: 16px; } .product-qty { color: #555555; } .totals-table { width: 100%; margin-top: 20px; } .totals-table td { padding: 8px 0; color: #555555; font-size: 16px; } .totals-table .total-row td { font-weight: 700; font-size: 18px; color: #2b2b2b; padding-top: 15px; } .address-info { padding: 20px 0; margin-top: 20px; border-top: 1px solid #e0e0e0; } .address-info h3 { font-family: 'Playfair Display', serif; font-size: 18px; color: #2b2b2b; margin-top: 0; margin-bottom: 12px; font-weight: 700; } .address-info p { font-size: 15px; line-height: 1.7; margin: 0; color: #555555; text-align: left; } .footer { text-align: center; padding: 30px; font-size: 13px; color: #888888; background-color: #fafafa; } .footer a { color: #c59a9a; text-decoration: none; font-weight: 700; } @media screen and (max-width: 600px) { .content { padding: 30px 20px; } } </style></head>
        <body><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td align="center" style="background-color: #f7f7f7; padding: 20px;"><table border="0" cellpadding="0" cellspacing="0" class="container">
        <tr><td class="header"><img src="https://d3enplyig2yenj.cloudfront.net/logo_compressed_resized.png" alt="LALA-LYCHEEE ロゴ" style="display: block; margin: 0 auto;"></td></tr>
        <tr><td class="content"><h1>ご注文ありがとうございます</h1><p>${confirmationText}</p>
        <table class="order-summary-table" border="0" cellpadding="0" cellspacing="0">${productRowsHtml}</table>
        <table class="totals-table" border="0" cellpadding="0" cellspacing="0">
            <tr><td>小計</td><td align="right">${formattedSubtotal} VNĐ</td></tr>
            <tr><td>送料</td><td align="right">${formattedShippingFee}</td></tr>
            <tr><td>お支払い方法</td><td align="right">${paymentMethodJp}</td></tr>
            <tr class="total-row"><td><strong>合計</strong></td><td align="right"><strong>${formattedGrandTotal} VNĐ</strong></td></tr>
        </table>
        ${paymentDetailsHtml_JP}
        <div class="address-info"><h3>お届け先</h3><p><strong>${data.shippingInfo?.recipientName}</strong><br>${data.shippingInfo?.address}<br>${data.shippingInfo?.phone}</p></div>
        ${extraNotesJP}
        ${signatureHtml}
        </td></tr>
        <tr><td class="footer"><p>ご不明点等ございましたら<a href="mailto:support@example.com">こちらまでお問合せ下さい。</a></p><p style="margin-top: 15px;"><strong>LALA-LYCHEEE</strong><br>Thon Tu Y, Xa Ha Dong, Thanh Pho Hai Phong</p></td></tr>
        </table></td></tr></table></body></html>`;
  };

  // TEMPLATE: SHIPPED (VIETNAMESE)
  const templateShipped_VN = (data: TypeRequestBodyMail) => {
    return `<!DOCTYPE html>
        <html lang="vi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Đơn hàng đã được gửi đi</title><link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;700&display=swap" rel="stylesheet"><style>body { margin: 0; padding: 0; background-color: #fdf6f6; font-family: 'Quicksand', Arial, sans-serif; } .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #dddddd; box-shadow: 0 4px 15px rgba(0,0,0,0.05); } .content { padding: 30px; color: #333333; line-height: 1.7; } .signature { padding: 20px; background-color: #fff8f8; color: #333333; font-size: 14px; } </style></head>
        <body style="margin: 0; padding: 0; background-color: #fdf6f6; font-family: 'Quicksand', Arial, sans-serif;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:rgb(240, 242, 245);"><tr><td align="center" style="padding: 20px 10px;"><table class="container" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #dddddd; box-shadow: 0 4px 15px rgba(0,0,0,0.05);" border="0" cellspacing="0" cellpadding="0">
        <tr><td style="padding: 30px 0; text-align: center; background-color: #ffffff;"><img src="https://d3enplyig2yenj.cloudfront.net/logo_compressed_resized.png" alt="Logo LALA-LYCHEEE" style="display: block; max-width: 200px; height: auto; margin: 0 auto;"></td></tr>
        <tr><td align="center" class="content" style="padding: 10px 40px 30px 40px;"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="background-color: rgba(255, 255, 255, 0.9); padding: 25px; border-radius: 8px; text-align: center;">
        <h2 style="color: #d9534f; margin-top: 0;">📦 Đơn hàng đã được giao cho vận chuyển!</h2>
        <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.7;">Kính gửi <strong>${data.customerInfo.name}</strong>,</p>
        <p style="margin: 0 0 15px 0; color: #333333; font-size: 16px;">Đơn hàng của bạn đã được đóng gói cẩn thận và bàn giao cho đơn vị vận chuyển. Đơn hàng sẽ sớm đến tay bạn!</p>
        ${signatureHtml}
        </td></tr></table></td></tr>
        <tr><td class="signature" style="padding: 30px 40px; background-color: #fff8f8; color: #333333; font-size: 14px; border-top: 1px solid #fceeee; text-align: center;"><p style="margin: 0;">Cảm ơn bạn đã mua sắm tại LALA-LYCHEEE!</p></td></tr>
        </table></td></tr></table></body></html>`;
  };

  // TEMPLATE: SHIPPED (JAPANESE)
  const templateShipped_JP = (data: TypeRequestBodyMail) => {
    return `<!DOCTYPE html>
        <html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>ご注文の商品を発送いたしました</title><link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;700&display=swap" rel="stylesheet"><style>body { margin: 0; padding: 0; background-color: #fdf6f6; font-family: 'Quicksand', Arial, sans-serif; } .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #dddddd; box-shadow: 0 4px 15px rgba(0,0,0,0.05); } .content { padding: 30px; color: #333333; line-height: 1.7; } .signature { padding: 20px; background-color: #fff8f8; color: #333333; font-size: 14px; } </style></head>
        <body style="margin: 0; padding: 0; background-color: #fdf6f6; font-family: 'Quicksand', Arial, sans-serif;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:rgb(240, 242, 245);"><tr><td align="center" style="padding: 20px 10px;"><table class="container" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #dddddd; box-shadow: 0 4px 15px rgba(0,0,0,0.05);" border="0" cellspacing="0" cellpadding="0">
        <tr><td style="padding: 30px 0; text-align: center; background-color: #ffffff;"><img src="https://d3enplyig2yenj.cloudfront.net/logo_compressed_resized.png" alt="LALA-LYCHEEE ロゴ" style="display: block; max-width: 200px; height: auto; margin: 0 auto;"></td></tr>
        <tr><td align="center" class="content" style="padding: 10px 40px 30px 40px;"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="background-color: rgba(255, 255, 255, 0.9); padding: 25px; border-radius: 8px; text-align: center;">
        <h2 style="color: #d9534f; margin-top: 0;">📦 ご注文の商品を発送いたしました！</h2>
        <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.7;"><strong>${data.customerInfo.name}</strong>様</p>
        <p style="margin: 0 0 15px 0; color: #333333; font-size: 16px;">ご注文頂いた商品の発送が完了しました。到着まで今しばらくお待ちください。どうぞ宜しくお願い致します。</p>
        ${signatureHtml}
        </td></tr></table></td></tr>
        <tr><td class="signature" style="padding: 30px 40px; background-color: #fff8f8; color: #333333; font-size: 14px; border-top: 1px solid #fceeee; text-align: center;"><p style="margin: 0;">LALA-LYCHEEEをご利用いただき、誠にありがとうございます。</p></td></tr>
        </table></td></tr></table></body></html>`;
  };

  // TEMPLATE: DELIVERING (VIETNAMESE)
  const templateAlertOrderNow_VN = (data: TypeRequestBodyMail) => {
    return `<!DOCTYPE html>
        <html lang="vi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Thông báo giao hàng</title><link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;700&display=swap" rel="stylesheet"><style>body { margin: 0; padding: 0; background-color: #fdf6f6; font-family: 'Quicksand', Arial, sans-serif; } .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #dddddd; box-shadow: 0 4px 15px rgba(0,0,0,0.05); } .content { padding: 30px; color: #333333; line-height: 1.7; } .signature { padding: 20px; background-color: #fff8f8; color: #333333; font-size: 14px; } </style></head>
        <body style="margin: 0; padding: 0; background-color: #fdf6f6; font-family: 'Quicksand', Arial, sans-serif;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:rgb(240, 242, 245);"><tr><td align="center" style="padding: 20px 10px;"><table class="container" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #dddddd; box-shadow: 0 4px 15px rgba(0,0,0,0.05);" border="0" cellspacing="0" cellpadding="0">
        <tr><td style="padding: 30px 0; text-align: center; background-color: #ffffff;"><img src="https://d3enplyig2yenj.cloudfront.net/logo_compressed_resized.png" alt="Logo LALA-LYCHEEE" style="display: block; max-width: 200px; height: auto; margin: 0 auto;"></td></tr>
        <tr><td align="center" class="content" style="padding: 10px 40px 30px 40px;"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="background-color: rgba(255, 255, 255, 0.9); padding: 25px; border-radius: 8px; text-align: center;">
        <h2 style="color: #d9534f; margin-top: 0;">🚚🚚🚚 Đơn hàng đang trên đường đến!</h2>
        <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.7;">Kính gửi <strong>${data.customerInfo.name}</strong>,</p>
        <p style="margin: 0 0 15px 0; color: #333333; font-size: 16px;"><strong>Đơn hàng của bạn sẽ được giao đến bạn trong ngày hôm nay.</strong></p>
        <p style="margin: 0 0 25px 0; color: #333333; font-size: 16px;">Bạn vui lòng chuẩn bị và để ý điện thoại để nhận hàng từ shipper nhé!</p>
        ${signatureHtml}
        </td></tr></table></td></tr>
        <tr><td class="signature" style="padding: 30px 40px; background-color: #fff8f8; color: #333333; font-size: 14px; border-top: 1px solid #fceeee; text-align: center;"><p style="margin: 0;">Cảm ơn bạn đã mua sắm tại LALA-LYCHEEE!</p></td></tr>
        </table><table width="100%" style="max-width: 600px;" border="0" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding: 20px 0; font-size: 12px; color: #aaaaaa;"><p style="margin: 0;">🐝🐝🐝</p><p style="margin: 10px 0 0 0;">Bạn nhận được email này vì đã đặt hàng tại LALA-LYCHEEE.</p></td></tr></table></td></tr></table></body></html>`;
  };

  // TEMPLATE: DELIVERING (JAPANESE)
  const templateAlertOrderNow_JP = (data: TypeRequestBodyMail) => {
    return `<!DOCTYPE html>
        <html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>発送のお知らせ</title><link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;700&display=swap" rel="stylesheet"><style>body { margin: 0; padding: 0; background-color: #fdf6f6; font-family: 'Quicksand', Arial, sans-serif; } .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #dddddd; box-shadow: 0 4px 15px rgba(0,0,0,0.05); } .content { padding: 30px; color: #333333; line-height: 1.7; } .signature { padding: 20px; background-color: #fff8f8; color: #333333; font-size: 14px; } </style></head>
        <body style="margin: 0; padding: 0; background-color: #fdf6f6; font-family: 'Quicksand', Arial, sans-serif;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:rgb(240, 242, 245);"><tr><td align="center" style="padding: 20px 10px;"><table class="container" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #dddddd; box-shadow: 0 4px 15px rgba(0,0,0,0.05);" border="0" cellspacing="0" cellpadding="0">
        <tr><td style="padding: 30px 0; text-align: center; background-color: #ffffff;"><img src="https://d3enplyig2yenj.cloudfront.net/logo_compressed_resized.png" alt="LALA-LYCHEEE ロゴ" style="display: block; max-width: 200px; height: auto; margin: 0 auto;"></td></tr>
        <tr><td align="center" class="content" style="padding: 10px 40px 30px 40px;"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="background-color: rgba(255, 255, 255, 0.9); padding: 25px; border-radius: 8px; text-align: center;">
        <h2 style="color: #d9534f; margin-top: 0;">🚚🚚🚚 ご注文の商品が発送されました！</h2>
        <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.7;"><strong>${data.customerInfo.name}</strong>様</p>
        <p style="margin: 0 0 15px 0; color: #333333; font-size: 16px;"><strong>ご注文の商品が本日中にお手元に届く予定です。</strong></p>
        <p style="margin: 0 0 25px 0; color: #333333; font-size: 16px;">配送業者からの連絡をお待ちいただき、商品の受け取り準備をお願いいたします。</p>
        ${signatureHtml}
        </td></tr></table></td></tr>
        <tr><td class="signature" style="padding: 30px 40px; background-color: #fff8f8; color: #333333; font-size: 14px; border-top: 1px solid #fceeee; text-align: center;"><p style="margin: 0;">LALA-LYCHEEEをご利用いただき、誠にありがとうございます。</p></td></tr>
        </table><table width="100%" style="max-width: 600px;" border="0" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding: 20px 0; font-size: 12px; color: #aaaaaa;"><p style="margin: 0;">🐝🐝🐝</p><p style="margin: 10px 0 0 0;">このメールはLALA-LYCHEEEでご注文された方にお送りしています。</p></td></tr></table></td></tr></table></body></html>`;
  };

  // TEMPLATE: THANK YOU (VIETNAMESE)
  const templateThankYou_VN = (data: TypeRequestBodyMail) => {
    return `<!DOCTYPE html>
        <html lang="vi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Cảm ơn bạn đã mua Mật Ong Hoa Vải!</title><style>body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; } table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; } img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; } table { border-collapse: collapse !important; } body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }</style></head>
        <body style="margin: 0 !important; padding: 0 !important; background-color: #f1f1f1;"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f1f1f1;"><tr><td align="center" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="background-color: #ffffff; margin: 20px auto; border-radius: 12px; box-shadow: 0 6px 18px rgba(0,0,0,0.08);">
        <tr><td align="center" style="padding: 30px 0; background: linear-gradient(to bottom, #fde4f2, #ffffff); border-radius: 12px 12px 0 0;"><div style="font-size: 22px; margin-bottom: 10px;">🐝 &nbsp; 🌸 &nbsp; 🐝</div><img src="https://d3enplyig2yenj.cloudfront.net/logo_compressed_resized.png" alt="Logo LALA-LYCHEEE" width="160" style="display: block; border-radius: 999px; margin: 0 auto;"><div style="font-size: 22px; margin-top: 10px;">&nbsp; &nbsp; &nbsp; 🌸 &nbsp; &nbsp; &nbsp; 🐝</div></td></tr>
        <tr><td style="padding: 0 40px 30px 40px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333; text-align: center;"><h1 style="font-size: 28px; font-weight: bold; margin: 20px 0; color: #d63384;">🌸 Cảm ơn bạn đã chọn Mật Ong Hoa Vải! 🐝</h1><p style="font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">Xin chào ${data.customerInfo.name},</p><p style="font-size: 16px; line-height: 1.6; margin: 0;">Cảm ơn bạn đã tin tưởng và lựa chọn sản phẩm Mật Ong Hoa Vải thơm ngon từ LALA-LYCHEEE. Chúng tôi hy vọng bạn sẽ yêu thích vị ngọt thanh tự nhiên này.</p>
        ${signatureHtml}
        </td></tr>
        <tr><td style="padding: 30px 40px; background-color: #f8f9fa; text-align: center; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; color: #888888; border-radius: 0 0 12px 12px;"><p style="margin: 0 0 10px 0;">Bạn nhận được email này vì đã đặt hàng tại LALA-LYCHEEE.</p><p style="margin: 0;">© 2024 LALA-LYCHEEE. Đã đăng ký Bản quyền.</p></td></tr>
        </table></td></tr></table></body></html>`;
  };

  // TEMPLATE: THANK YOU (JAPANESE)
  const templateThankYou_JP = (data: TypeRequestBodyMail) => {
    return `<!DOCTYPE html>
        <html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>生ライチはちみつをご購入いただきありがとうございます！</title><style>body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; } table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; } img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; } table { border-collapse: collapse !important; } body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }</style></head>
        <body style="margin: 0 !important; padding: 0 !important; background-color: #f1f1f1;"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f1f1f1;"><tr><td align="center" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="background-color: #ffffff; margin: 20px auto; border-radius: 12px; box-shadow: 0 6px 18px rgba(0,0,0,0.08);">
        <tr><td align="center" style="padding: 30px 0; background: linear-gradient(to bottom, #fde4f2, #ffffff); border-radius: 12px 12px 0 0;"><div style="font-size: 22px; margin-bottom: 10px;">🐝 &nbsp; 🌸 &nbsp; 🐝</div><img src="https://d3enplyig2yenj.cloudfront.net/logo" alt="LALA-LYCHEEE ロゴ" width="160" style="display: block; border-radius: 999px; margin: 0 auto;"><div style="font-size: 22px; margin-top: 10px;">&nbsp; &nbsp; &nbsp; 🌸 &nbsp; &nbsp; &nbsp; 🐝</div></td></tr>
        <tr><td style="padding: 0 40px 30px 40px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333; text-align: center;"><h1 style="font-size: 28px; font-weight: bold; margin: 20px 0; color: #d63384;">生ライチはちみつをご注文下さり誠にありがとうございます🍯</h1><p style="font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">${data.customerInfo.name}様</p><p style="font-size: 16px; line-height: 1.6; margin: 0;">LALA-LYCHEEEの美味しいライチ花はちみつをお選びいただき、誠にありがとうございます。この自然で繊細な甘さをお楽しみいただければ幸いです。</p>
        ${signatureHtml}
        </td></tr>
        <tr><td style="padding: 30px 40px; background-color: #f8f9fa; text-align: center; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; color: #888888; border-radius: 0 0 12px 12px;"><p style="margin: 0 0 10px 0;">このメールはLALA-LYCHEEEにてご注文下さった方のみにお送りしております。</p><p style="margin: 0;">© 2024 LALA-LYCHEEE. All Rights Reserved.</p></td></tr>
        </table></td></tr></table></body></html>`;
  };

  // TEMPLATE: PAYMENT RECEIVED (VIETNAMESE)
  const templatePaymentReceived_VN = (data: TypeRequestBodyMail) => {
    return `<!DOCTYPE html>
        <html lang="vi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Xác nhận đã nhận thanh toán</title><link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;700&display=swap" rel="stylesheet"><style>body { margin: 0; padding: 0; background-color: #fdf6f6; font-family: 'Quicksand', Arial, sans-serif; } .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #dddddd; box-shadow: 0 4px 15px rgba(0,0,0,0.05); } .content { padding: 30px; color: #333333; line-height: 1.7; } .signature { padding: 20px; background-color: #fff8f8; color: #333333; font-size: 14px; } </style></head>
        <body style="margin: 0; padding: 0; background-color: #fdf6f6; font-family: 'Quicksand', Arial, sans-serif;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:rgb(240, 242, 245);"><tr><td align="center" style="padding: 20px 10px;"><table class="container" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #dddddd; box-shadow: 0 4px 15px rgba(0,0,0,0.05);" border="0" cellspacing="0" cellpadding="0">
        <tr><td style="padding: 30px 0; text-align: center; background-color: #ffffff;"><img src="https://d3enplyig2yenj.cloudfront.net/logo_compressed_resized.png" alt="Logo LALA-LYCHEEE" style="display: block; max-width: 200px; height: auto; margin: 0 auto;"></td></tr>
        <tr><td align="center" class="content" style="padding: 10px 40px 30px 40px;"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="background-color: rgba(255, 255, 255, 0.9); padding: 25px; border-radius: 8px; text-align: center;">
        <h2 style="color: #28a745; margin-top: 0;">✅ Đã nhận được thanh toán</h2>
        <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.7;">Kính gửi <strong>${data.customerInfo.name}</strong>,</p>
        <p style="margin: 0 0 15px 0; color: #333333; font-size: 16px;">Chúng tôi xác nhận đã nhận được thanh toán cho đơn hàng của bạn. LALA-LYCHEEE sẽ tiến hành chuẩn bị và giao hàng cho bạn trong thời gian sớm nhất.</p>
        ${signatureHtml}
        </td></tr></table></td></tr>
        </table></td></tr></table></body></html>`;
  };

  // TEMPLATE: PAYMENT RECEIVED (JAPANESE)
  const templatePaymentReceived_JP = (data: TypeRequestBodyMail) => {
    return `<!DOCTYPE html>
        <html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>ご入金確認のお知らせ</title><link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;700&display=swap" rel="stylesheet"><style>body { margin: 0; padding: 0; background-color: #fdf6f6; font-family: 'Quicksand', Arial, sans-serif; } .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #dddddd; box-shadow: 0 4px 15px rgba(0,0,0,0.05); } .content { padding: 30px; color: #333333; line-height: 1.7; } .signature { padding: 20px; background-color: #fff8f8; color: #333333; font-size: 14px; } </style></head>
        <body style="margin: 0; padding: 0; background-color: #fdf6f6; font-family: 'Quicksand', Arial, sans-serif;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:rgb(240, 242, 245);"><tr><td align="center" style="padding: 20px 10px;"><table class="container" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #dddddd; box-shadow: 0 4px 15px rgba(0,0,0,0.05);" border="0" cellspacing="0" cellpadding="0">
        <tr><td style="padding: 30px 0; text-align: center; background-color: #ffffff;"><img src="https://d3enplyig2yenj.cloudfront.net/logo_compressed_resized.png" alt="LALA-LYCHEEE ロゴ" style="display: block; max-width: 200px; height: auto; margin: 0 auto;"></td></tr>
        <tr><td align="center" class="content" style="padding: 10px 40px 30px 40px;"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="background-color: rgba(255, 255, 255, 0.9); padding: 25px; border-radius: 8px; text-align: center;">
        <h2 style="color: #28a745; margin-top: 0;">✅ ご入金を確認いたしました</h2>
        <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.7;"><strong>${data.customerInfo.name}</strong>様</p>
        <p style="margin: 0 0 15px 0; color: #333333; font-size: 16px;">ご注文の代金のご入金が確認できましたことを、ご報告いたします。LALA-LYCHEEEでは、ただちに商品の準備を開始し、最短で発送いたします。</p>
        ${signatureHtml}
        </td></tr></table></td></tr>
        </table></td></tr></table></body></html>`;
  };
  // =================================================================
  // #endregion

  const generateInitialProducts = () => {
    return Object.values(productOptions)
      .flat()
      .reduce((acc, variant) => {
        acc[variant.id] = { quantity: "" };
        return acc;
      }, {} as { [key: string]: { quantity: number | "" } });
  };

  const initialFormData: OrderFormData = {
    customerName: "",
    customerEmail: "",
    products: generateInitialProducts(),
    recipientName: "",
    shippingAddress: "",
    recipientPhone: "",
    paymentMethod: "",
    shippingFee: "",
  };

  const [formData, setFormData] = useState<OrderFormData>(initialFormData);
  const [emailType, setEmailType] = useState<EmailType>("");
  const [emailBody, setEmailBody] = useState("");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserModified, setIsUserModified] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "edit">("preview");

  const subtotal = React.useMemo(() => {
    return Object.values(productOptions)
      .flat()
      .reduce((acc, variant) => {
        const quantity = formData.products[variant.id]?.quantity || 0;
        return acc + Number(quantity) * variant.price;
      }, 0);
  }, [formData.products]);

  const isFreeShipping = subtotal >= 2000000;
  const shippingFee = isFreeShipping ? 0 : Number(formData.shippingFee) || 0;
  const grandTotal = subtotal + shippingFee;

  // Effect to automatically set free shipping
  useEffect(() => {
    if (isFreeShipping) {
      if (formData.shippingFee !== 0) {
        setFormData((prev) => ({ ...prev, shippingFee: 0 }));
      }
    }
  }, [isFreeShipping, formData.shippingFee]);

  // NEW: Effect to automatically copy customer name to recipient name
  useEffect(() => {
    if (!isUserModified) {
      // Only copy if recipient name hasn't been manually edited
      setFormData((prevData) => ({
        ...prevData,
        recipientName: prevData.customerName,
      }));
    }
  }, [formData.customerName, isUserModified]);

  // Effect to automatically generate HTML email content for preview
  useEffect(() => {
    if (isUserModified) return; // Don't regenerate if user is editing

    if (!emailType) {
      setEmailBody("");
      return;
    }

    const orderedProducts = Object.entries(formData.products)
      .filter(([_, { quantity }]) => quantity && Number(quantity) > 0)
      .map(([variantId, { quantity }]) => {
        const productDetails = Object.values(productOptions)
          .flat()
          .find((v) => v.id === variantId)!;
        return {
          id: variantId,
          name: productDetails.name,
          name_jp: productDetails.name_jp,
          price: productDetails.price,
          quantity: Number(quantity),
          imageUrl: productDetails.imageUrl,
        };
      });

    if (orderedProducts.length === 0) {
      setEmailBody(
        "<p style='text-align: center; color: red;'>Vui lòng nhập số lượng sản phẩm để tạo nội dung email. / 商品数量を入力してください。</p>"
      );
      return;
    }

    if (
      emailType === "confirmed" &&
      (!formData.recipientName ||
        !formData.shippingAddress ||
        !formData.recipientPhone ||
        !formData.paymentMethod)
    ) {
      setEmailBody(
        "<p style='text-align: center; color: red;'>Vui lòng điền đầy đủ thông tin giao hàng và thanh toán để xem trước email xác nhận.</p>"
      );
      return;
    }

    const templateData: TypeRequestBodyMail = {
      customerInfo: {
        name: formData.customerName || "[Tên khách hàng]",
        email: formData.customerEmail,
      },
      shippingInfo: {
        recipientName: formData.recipientName || "[Tên người nhận]",
        address: formData.shippingAddress || "[Địa chỉ giao hàng]",
        phone: formData.recipientPhone || "[SĐT người nhận]",
      },
      order: {
        products: orderedProducts,
        subtotal: subtotal,
        shippingFee: shippingFee,
        grandTotal: grandTotal,
        paymentMethod: formData.paymentMethod || "cod",
      },
    };

    let html_jp = "";
    let html_vn = "";

    switch (emailType) {
      case "thankyou":
        html_jp = templateThankYou_JP(templateData);
        html_vn = templateThankYou_VN(templateData);
        break;
      case "confirmed":
        html_jp = confirmOrderCustomer_JP(templateData);
        html_vn = confirmOrderCustomer_VN(templateData);
        break;
      case "delivering":
        html_jp = templateAlertOrderNow_JP(templateData);
        html_vn = templateAlertOrderNow_VN(templateData);
        break;
      case "shipped":
        html_jp = templateShipped_JP(templateData);
        html_vn = templateShipped_VN(templateData);
        break;
      case "payment_received":
        html_jp = templatePaymentReceived_JP(templateData);
        html_vn = templatePaymentReceived_VN(templateData);
        break;
    }

    const combinedHtml = `${html_jp}\n\n<br><hr style="margin: 40px 0; border-color: #ccc;"><br>\n\n${html_vn}`;
    setEmailBody(combinedHtml);
  }, [emailType, formData, isUserModified, subtotal, shippingFee, grandTotal]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setIsUserModified(false);
    if (name === "recipientName") {
      setIsUserModified(true); // User is manually editing recipient name
    }
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleShippingFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericValue = parseInt(rawValue.replace(/[^0-9]/g, ""), 10);
    setIsUserModified(false);
    setFormData((prev) => ({
      ...prev,
      shippingFee: isNaN(numericValue) ? "" : numericValue,
    }));
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setIsUserModified(false); // Allow template regeneration when changing options
    if (name === "paymentMethod") {
      setFormData((prev) => ({
        ...prev,
        paymentMethod: value as "cod" | "transfer",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEmailBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIsUserModified(true); // Flag that user has started editing
    setEmailBody(e.target.value);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setIsUserModified(false); // Allow template regeneration
    setFormData((prevData) => ({
      ...prevData,
      products: {
        ...prevData.products,
        [name]: { quantity: value === "" ? "" : parseInt(value, 10) },
      },
    }));
  };

  const handleEmailTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUserModified(false); // Reset flag to load new template
    setActiveTab("preview"); // Switch to preview tab when template changes
    setEmailType(e.target.value as EmailType);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const hasProducts = Object.values(formData.products).some(
      (p) => (p.quantity || 0) > 0
    );
    if (!hasProducts) {
      setStatusMessage("Vui lòng nhập số lượng cho ít nhất một sản phẩm.");
      setIsSuccess(false);
      setTimeout(() => setStatusMessage(""), 5000);
      return;
    }
    if (!emailType) {
      setStatusMessage("Vui lòng chọn một loại email để gửi.");
      setIsSuccess(false);
      setTimeout(() => setStatusMessage(""), 5000);
      return;
    }
    if (
      emailType === "confirmed" &&
      (!formData.recipientName ||
        !formData.shippingAddress ||
        !formData.recipientPhone ||
        !formData.paymentMethod)
    ) {
      setStatusMessage(
        "Vui lòng điền đầy đủ thông tin giao hàng và hình thức thanh toán."
      );
      setIsSuccess(false);
      setTimeout(() => setStatusMessage(""), 5000);
      return;
    }

    setStatusMessage("Đang gửi...");
    setIsSuccess(null);

    const payload = {
      customerEmail: formData.customerEmail,
      emailHtmlBody: emailBody, // Send the generated HTML
      emailType: emailType,
    };

    // NOTE: This fetch call is a placeholder.
    // You should replace it with your actual backend endpoint.
    try {
      const result = await fetch("http://localhost:4000/v1/api/sendMail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!result.ok) {
        throw new Error(`Lỗi từ server: ${result.statusText}`);
      }

      try {
        const text = await result.text();
        const data = text ? JSON.parse(text) : null;
        console.log(data);
      } catch (error) {
        console.error("JSON parse error:", error);
        console.log("Response không phải JSON hợp lệ");
      }
      setIsSuccess(true);
      setStatusMessage("Thông tin đơn hàng đã được gửi thành công!");
      setFormData(initialFormData);
      setEmailType("");
      setEmailBody("");
      setIsUserModified(false);
      setActiveTab("preview");
      setTimeout(() => setStatusMessage(""), 5000);
    } catch (error) {
      console.error("Gửi thất bại:", error);
      setIsSuccess(false);
      setStatusMessage("Gửi thông tin thất bại. Vui lòng thử lại.");
      setTimeout(() => setStatusMessage(""), 5000);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const formatVNCurrency = (
    value: number | string | null | undefined
  ): string => {
    if (value === null || value === undefined || value === "") {
      return "";
    }
    const num = Number(String(value).replace(/[^0-9]/g, ""));
    if (isNaN(num)) {
      return "";
    }
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4 ">
      <Loader isLoading={isLoading} message="Đang tải trang..." size="md" />
      <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
          Tạo và gửi Email Đơn hàng / お客様へのメール
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
          Điền thông tin, chọn mẫu email và gửi cho khách hàng. /
          下記に情報を入力する
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer & Products Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Customer Info & Products */}
            <div className="space-y-6">
              {/* Customer Information Section */}
              <div className="space-y-4 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Thông tin khách hàng / お客様情報
                </h3>
                <div>
                  <label
                    htmlFor="customerName"
                    className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block"
                  >
                    Tên khách hàng / 氏名
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <UserIcon />
                    </span>
                    <input
                      type="text"
                      id="customerName"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      placeholder="Nhập tên khách hàng"
                      required
                      className="block w-full pl-10 pr-3 py-3 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="customerEmail"
                    className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block"
                  >
                    Email khách hàng / メールアドレス
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <MailIcon />
                    </span>
                    <input
                      type="email"
                      id="customerEmail"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      placeholder="email@example.com"
                      required
                      className="block w-full pl-10 pr-3 py-3 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                    />
                  </div>
                </div>
              </div>

              {/* Products Section */}
              <div className="space-y-4 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <ProductIcon />
                  <span className="ml-2">Sản phẩm / ご注文内容</span>
                </h3>
                <div className="space-y-6">
                  {Object.entries(productOptions).map(([type, variants]) => (
                    <div
                      key={type}
                      className="pt-4 border-t border-gray-200 dark:border-gray-600 first:pt-0 first:border-t-0"
                    >
                      <h4 className="text-md font-semibold text-gray-800 dark:text-gray-100 mb-4">
                        Sản phẩm {type}
                      </h4>
                      <div className="grid grid-cols-1 gap-x-6 gap-y-4">
                        {variants.map((variant) => (
                          <div key={variant.id}>
                            <label
                              htmlFor={variant.id}
                              className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block"
                            >
                              {variant.name}
                            </label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <QuantityIcon />
                              </span>
                              <input
                                type="number"
                                id={variant.id}
                                name={variant.id}
                                value={
                                  formData.products[variant.id]?.quantity || ""
                                }
                                onChange={handleQuantityChange}
                                placeholder="Số lượng"
                                min="0"
                                className="block w-full pl-10 pr-3 py-3 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Shipping & Payment */}
            <div className="space-y-6">
              {/* Email Template Selection */}
              <div className="space-y-4 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <TemplateIcon />
                  <span className="ml-2">
                    Chọn mẫu Email / メールのフォーマット文
                  </span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(
                    [
                      "confirmed",
                      "payment_received",
                      "shipped",
                      "delivering",
                      "thankyou",
                    ] as EmailType[]
                  ).map((type) => (
                    <div key={type}>
                      <input
                        type="radio"
                        id={type}
                        name="emailType"
                        value={type}
                        checked={emailType === type}
                        onChange={handleEmailTypeChange}
                        className="sr-only peer"
                      />
                      <label
                        htmlFor={type}
                        className="block w-full text-center p-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer peer-checked:border-blue-500 peer-checked:text-blue-600 dark:peer-checked:text-blue-400 dark:peer-checked:border-blue-500 transition-all duration-300"
                      >
                        {type === "confirmed" && "Xác nhận　ご注文確認メール"}
                        {type === "thankyou" &&
                          "Cảm ơn ありがとうございますメール"}
                        {type === "shipped" && "Đã giao VC 発送完了メール"}
                        {type === "delivering" &&
                          "Đang giao　本日配達予定お知らせメール"}
                        {type === "payment_received" &&
                          "Đã nhận tiền  お振込み確認済みメール"}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {emailType === "confirmed" && (
                <div className="space-y-4 rounded-lg border border-blue-300 dark:border-blue-700 p-4 bg-blue-50 dark:bg-gray-700/50 transition-all duration-500 ease-in-out">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Thông tin giao hàng & Thanh toán / 配送先情報 & お支払い
                  </h3>
                  <div>
                    <label
                      htmlFor="recipientName"
                      className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block"
                    >
                      Tên người nhận / 受取人の氏名
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <UserIcon />
                      </span>
                      <input
                        type="text"
                        id="recipientName"
                        name="recipientName"
                        value={formData.recipientName}
                        onChange={handleInputChange}
                        placeholder="Nhập tên người nhận"
                        required={emailType === "confirmed"}
                        className="block w-full pl-10 pr-3 py-3 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="shippingAddress"
                      className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block"
                    >
                      Địa chỉ giao hàng / お届け先住所
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <AddressIcon />
                      </span>
                      <input
                        type="text"
                        id="shippingAddress"
                        name="shippingAddress"
                        value={formData.shippingAddress}
                        onChange={handleInputChange}
                        placeholder="Nhập địa chỉ giao hàng"
                        required={emailType === "confirmed"}
                        className="block w-full pl-10 pr-3 py-3 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="recipientPhone"
                      className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block"
                    >
                      Số điện thoại người nhận / 受取人の電話番号
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <PhoneIcon />
                      </span>
                      <input
                        type="tel"
                        id="recipientPhone"
                        name="recipientPhone"
                        value={formData.recipientPhone}
                        onChange={handleInputChange}
                        placeholder="Nhập số điện thoại"
                        required={emailType === "confirmed"}
                        className="block w-full pl-10 pr-3 py-3 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                      />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-300 dark:border-gray-600">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">
                      Hình thức thanh toán / お支払い方法
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <input
                          type="radio"
                          id="payment-cod"
                          name="paymentMethod"
                          value="cod"
                          checked={formData.paymentMethod === "cod"}
                          onChange={handleRadioChange}
                          required={emailType === "confirmed"}
                          className="sr-only peer"
                        />
                        <label
                          htmlFor="payment-cod"
                          className="block w-full text-center p-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer peer-checked:border-blue-500 peer-checked:text-blue-600 dark:peer-checked:text-blue-400 dark:peer-checked:border-blue-500 transition-all duration-300"
                        >
                          COD
                        </label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          id="payment-transfer"
                          name="paymentMethod"
                          value="transfer"
                          checked={formData.paymentMethod === "transfer"}
                          onChange={handleRadioChange}
                          required={emailType === "confirmed"}
                          className="sr-only peer"
                        />
                        <label
                          htmlFor="payment-transfer"
                          className="block w-full text-center p-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer peer-checked:border-blue-500 peer-checked:text-blue-600 dark:peer-checked:text-blue-400 dark:peer-checked:border-blue-500 transition-all duration-300"
                        >
                          Chuyển khoản
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Email Body Preview/Editor */}
          <div>
            <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={`${
                    activeTab === "preview"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Xem trước
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("edit")}
                  className={`${
                    activeTab === "edit"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Sửa HTML
                </button>
              </nav>
            </div>

            {activeTab === "preview" ? (
              <div
                id="emailBodyPreview"
                className="w-full p-1 h-[40rem] overflow-y-auto bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg"
                dangerouslySetInnerHTML={{ __html: emailBody }}
              />
            ) : (
              <textarea
                id="emailBody"
                name="emailBody"
                rows={20}
                value={emailBody}
                onChange={handleEmailBodyChange}
                placeholder="Nội dung email sẽ được tạo tự động tại đây. Bạn có thể chỉnh sửa trực tiếp."
                className="block w-full p-3 text-gray-900 dark:text-white bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 font-mono text-xs"
              />
            )}
          </div>
          {/* Order Summary Section */}
          <div className="space-y-4 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Tổng kết đơn hàng
            </h3>
            {/* Subtotal */}
            <div className="flex justify-between items-center">
              <label
                htmlFor="subtotal"
                className="text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Tạm tính
              </label>
              <input
                type="text"
                id="subtotal"
                value={`${new Intl.NumberFormat("vi-VN").format(subtotal)} VNĐ`}
                readOnly
                className="w-1/2 text-right bg-transparent border-none text-gray-900 dark:text-white focus:ring-0"
              />
            </div>
            {/* Shipping Fee */}
            <div className="flex justify-between items-center">
              <label
                htmlFor="shippingFee"
                className="text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Phí giao hàng
              </label>
              <div className="relative w-1/2">
                <input
                  type="text"
                  id="shippingFee"
                  name="shippingFee"
                  value={
                    isFreeShipping
                      ? "Miễn phí"
                      : formatVNCurrency(formData.shippingFee)
                  }
                  disabled={isFreeShipping}
                  onChange={handleShippingFeeChange}
                  placeholder="Nhập phí"
                  className="w-full text-right text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 disabled:bg-gray-200 disabled:cursor-not-allowed pr-12"
                />
                {!isFreeShipping && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                    VNĐ
                  </span>
                )}
              </div>
            </div>
            {isFreeShipping && (
              <p className="text-right text-green-500 text-sm">
                Miễn phí giao hàng
              </p>
            )}
            {/* Grand Total */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-300 dark:border-gray-600">
              <label
                htmlFor="grandTotal"
                className="text-lg font-bold text-gray-900 dark:text-white"
              >
                Tổng cộng
              </label>
              <input
                type="text"
                id="grandTotal"
                value={`${new Intl.NumberFormat("vi-VN").format(
                  grandTotal
                )} VNĐ`}
                readOnly
                className="w-1/2 text-right bg-transparent border-none text-lg font-bold text-blue-600 dark:text-blue-400 focus:ring-0"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-transform transform hover:scale-105 duration-300"
            >
              Gửi thông tin / 入力情報を送信する
            </button>
          </div>
        </form>

        {statusMessage && (
          <div
            className={`mt-6 p-4 rounded-lg text-center text-sm font-medium ${
              isSuccess
                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
            }`}
          >
            {statusMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderForm;
