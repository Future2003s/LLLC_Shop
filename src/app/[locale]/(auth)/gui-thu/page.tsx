"use client";
import React, { useState, useRef } from "react";
// --- ICONS (SVG Components) ---
const SendIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
  </svg>
);
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
const PaperClipIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400 mx-auto"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M8 4a3 3 0 00-3 3v4a3 3 0 006 0V7a1 1 0 112 0v4a5 5 0 01-10 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
      clipRule="evenodd"
    />
  </svg>
);
const XCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
      clipRule="evenodd"
    />
  </svg>
);

// --- EMAIL TEMPLATES ---
const emailTemplates = {
  none: {
    subject: "",
    body: "",
  },
  maintenance: {
    subject: "Thông báo bảo trì hệ thống định kỳ",
    body: `
      <h1>Thông báo bảo trì hệ thống</h1>
      <p>Kính gửi Quý người dùng,</p>
      <p>Để nâng cao chất lượng dịch vụ, chúng tôi sẽ tiến hành bảo trì hệ thống theo lịch trình sau:</p>
      <ul>
        <li><strong>Thời gian bắt đầu:</strong> 22:00, Ngày 15 tháng 7 năm 2025</li>
        <li><strong>Thời gian kết thúc:</strong> 02:00, Ngày 16 tháng 7 năm 2025</li>
      </ul>
      <p>Trong thời gian bảo trì, một số dịch vụ có thể bị gián đoạn. Chúng tôi thành thật xin lỗi vì sự bất tiện này và mong nhận được sự thông cảm của Quý người dùng.</p>
      <p>Trân trọng,<br>Đội ngũ Kỹ thuật</p>
    `,
  },
  policy_update: {
    subject: "Cập nhật chính sách bảo mật quan trọng",
    body: `
      <h1>Cập nhật Chính sách Bảo mật</h1>
      <p>Kính gửi Quý người dùng,</p>
      <p>Chúng tôi đã cập nhật Chính sách Bảo mật để làm rõ hơn về cách chúng tôi thu thập và sử dụng dữ liệu của bạn. Những thay đổi này sẽ có hiệu lực từ ngày 1 tháng 8 năm 2025.</p>
      <p>Vui lòng dành chút thời gian để xem lại các thay đổi quan trọng <a href="#" style="color: #3b82f6;">tại đây</a>.</p>
      <p>Việc bạn tiếp tục sử dụng dịch vụ của chúng tôi đồng nghĩa với việc bạn đồng ý với các chính sách đã được cập nhật.</p>
      <p>Trân trọng,<br>Ban Quản trị</p>
    `,
  },
  birthday: {
    subject: "Chúc mừng sinh nhật!",
    body: `
      <div style="text-align: center;">
        <img src="https://placehold.co/600x200/ecfccb/84cc16?text=Chúc+Mừng+Sinh+Nhật!" alt="Happy Birthday Banner" style="width: 100%; max-width: 600px; height: auto; border-radius: 8px;" />
        <h1 style="margin-top: 20px;">Chúc mừng sinh nhật!</h1>
        <p>Thay mặt toàn thể công ty, chúc bạn một ngày sinh nhật thật vui vẻ, hạnh phúc và thành công.</p>
        <p>Cảm ơn những đóng góp của bạn trong suốt thời gian qua. Chúc bạn luôn mạnh khỏe và gặt hái nhiều thành tựu mới!</p>
        <p style="margin-top: 20px;"><a href="#" style="background-color: #84cc16; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Nhận quà sinh nhật của bạn!</a></p>
      </div>
    `,
  },
};

// --- MAIN COMPONENT ---
const SystemEmailer: React.FC = () => {
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [status, setStatus] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateKey = e.target.value as keyof typeof emailTemplates;
    const template = emailTemplates[templateKey];
    setSubject(template.subject);
    setBody(template.body);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const result = e.target.files;
      setAttachments((prev) => [...prev, ...Array.from(result)]);
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setAttachments((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!to || !subject || !body) {
      setStatus({
        message: "Vui lòng điền đầy đủ các trường Tới, Chủ đề và Nội dung.",
        type: "error",
      });
      return;
    }
    setStatus({ message: "Đang gửi email...", type: "info" });

    const formData = new FormData();
    formData.append("to", to);
    formData.append("cc", cc);
    formData.append("bcc", bcc);
    formData.append("subject", subject);
    formData.append("html", body);
    attachments.forEach((file) => {
      formData.append("attachments", file);
    });

    // Simulate API call
    console.log("Dữ liệu gửi đến backend:", {
      to,
      cc,
      bcc,
      subject,
      body,
      attachments: attachments.map((f) => f.name),
    });

    try {
      const res = await fetch("http://localhost:4000/v1/api/sendMail", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify("abc"),
      });
    } catch (error) {}

    setTimeout(() => {
      setStatus({ message: "Email đã được gửi thành công!", type: "success" });
      // Reset form
      setTo("");
      setCc("");
      setBcc("");
      setSubject("");
      setBody("");
      setAttachments([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setTimeout(() => setStatus(null), 5000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Soạn và Gửi Email Hệ Thống
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Tạo và gửi thông báo đến người dùng trong hệ thống.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 sm:p-8 border-t border-gray-200 dark:border-gray-700">
            {/* --- Left Column: Fields --- */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <label
                  htmlFor="template"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Chọn mẫu (Tùy chọn)
                </label>
                <select
                  id="template"
                  onChange={handleTemplateChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="none">-- Soạn từ đầu --</option>
                  <option value="maintenance">Thông báo bảo trì</option>
                  <option value="policy_update">Cập nhật chính sách</option>
                  <option value="birthday">Chúc mừng sinh nhật</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="to"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Tới
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon />
                  </div>
                  <input
                    type="email"
                    name="to"
                    id="to"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="nguoinhan@example.com"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="cc"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  CC
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon />
                  </div>
                  <input
                    type="email"
                    name="cc"
                    id="cc"
                    value={cc}
                    onChange={(e) => setCc(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="sao-chep@example.com"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="bcc"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  BCC
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon />
                  </div>
                  <input
                    type="email"
                    name="bcc"
                    id="bcc"
                    value={bcc}
                    onChange={(e) => setBcc(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="sao-chep-an@example.com"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Chủ đề
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    className="block w-full pr-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="attachment"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Tệp đính kèm
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <PaperClipIcon />
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Tải tệp lên</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          multiple
                          className="sr-only"
                          onChange={handleFileChange}
                          ref={fileInputRef}
                        />
                      </label>
                      <p className="pl-1">hoặc kéo và thả</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF, PDF, ...
                    </p>
                  </div>
                </div>
                {attachments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded-md text-sm"
                      >
                        <span className="text-gray-700 dark:text-gray-300 truncate">
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="ml-4 text-red-500 hover:text-red-700"
                          aria-label="Remove file"
                        >
                          <XCircleIcon />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* --- Right Column: Editor/Preview --- */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nội dung Email
              </label>
              <div
                className="w-full p-4 h-48 overflow-y-auto bg-white dark:bg-gray-100 border border-gray-300 rounded-lg"
                dangerouslySetInnerHTML={{ __html: body }}
              />
              <details className="mt-2">
                <summary className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-500">
                  Chỉnh sửa nội dung HTML
                </summary>
                <textarea
                  name="body"
                  id="body"
                  rows={15}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  required
                  className="mt-2 block w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  placeholder="Soạn thảo nội dung email của bạn ở đây..."
                />
              </details>
            </div>
          </div>
          {/* --- Footer & Actions --- */}
          <div className="px-6 sm:px-8 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-end items-center">
            {status && (
              <p
                className={`text-sm mr-4 ${
                  status.type === "success"
                    ? "text-green-600"
                    : status.type === "error"
                    ? "text-red-600"
                    : "text-blue-600"
                }`}
              >
                {status.message}
              </p>
            )}
            <button
              type="submit"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
            >
              <SendIcon />
              Gửi Email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function Page() {
  return <SystemEmailer />;
}
